"use client";

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

interface AntigravityProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  colorGradient?: readonly string[];
  internalGradientStrength?: number;
  rimStrength?: number;
  glowStrength?: number;
  particleOpacity?: number;
  additiveBlend?: boolean;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: 'capsule' | 'sphere' | 'box' | 'tetrahedron';
  fieldStrength?: number;
}

interface InternalParticle {
  t: number;
  factor: number;
  speed: number;
  xFactor: number;
  yFactor: number;
  zFactor: number;
  mx: number;
  my: number;
  mz: number;
  cx: number;
  cy: number;
  cz: number;
  vx: number;
  vy: number;
  vz: number;
  randomRadiusOffset: number;
  colorStart: THREE.Color;
  colorEnd: THREE.Color;
  seed: number;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const WHITE_COLOR = new THREE.Color('#ffffff');

const getParticleGradientPair = (stops: THREE.Color[]) => {
  if (stops.length === 0) {
    return [new THREE.Color('#4285f4'), new THREE.Color('#34a853')] as const;
  }

  if (stops.length === 1) {
    const start = stops[0].clone().multiplyScalar(0.72 + Math.random() * 0.18);
    const end = stops[0].clone().lerp(WHITE_COLOR, 0.18 + Math.random() * 0.18);
    return [start, end] as const;
  }

  const startIndex = Math.floor(Math.random() * stops.length);
  const maxOffset = Math.min(2, stops.length - 1);
  const offset = 1 + Math.floor(Math.random() * maxOffset);
  const endIndex = (startIndex + offset) % stops.length;

  const start = stops[startIndex].clone();
  const end = stops[endIndex].clone();

  const crossBlend = Math.random() * 0.18;
  const startVividness = 0.78 + Math.random() * 0.22;
  const endHighlight = 0.12 + Math.random() * 0.18;

  start.lerp(end, crossBlend).multiplyScalar(startVividness);
  end.lerp(WHITE_COLOR, endHighlight);

  return [start, end] as const;
};

const interpolateGradientColor = (stops: THREE.Color[], t: number) => {
  if (stops.length === 0) {
    return new THREE.Color('#ffffff');
  }

  if (stops.length === 1) {
    return stops[0].clone();
  }

  const normalizedT = clamp01(t);
  const segmentSize = 1 / (stops.length - 1);
  const segmentIndex = Math.min(stops.length - 2, Math.floor(normalizedT / segmentSize));
  const localT = (normalizedT - segmentIndex * segmentSize) / segmentSize;

  return stops[segmentIndex].clone().lerp(stops[segmentIndex + 1], localT);
};

const PARTICLE_VERTEX_SHADER = `
  attribute vec3 instanceColorStart;
  attribute vec3 instanceColorEnd;
  attribute float instanceSeed;

  varying vec3 vColorStart;
  varying vec3 vColorEnd;
  varying float vSeed;
  varying vec3 vLocalPos;
  varying vec2 vUv;
  varying vec3 vNormalDir;
  varying vec3 vViewDir;

  void main() {
    vColorStart = instanceColorStart;
    vColorEnd = instanceColorEnd;
    vSeed = instanceSeed;
    vLocalPos = position;
    vUv = uv;

    vec4 worldPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
    mat3 worldNormalMatrix = mat3(transpose(inverse(modelMatrix * instanceMatrix)));

    vNormalDir = normalize(worldNormalMatrix * normal);
    vViewDir = normalize(cameraPosition - worldPosition.xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const PARTICLE_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uGradientStrength;
  uniform float uRimStrength;
  uniform float uGlowStrength;
  uniform float uOpacity;

  varying vec3 vColorStart;
  varying vec3 vColorEnd;
  varying float vSeed;
  varying vec3 vLocalPos;
  varying vec2 vUv;
  varying vec3 vNormalDir;
  varying vec3 vViewDir;

  void main() {
    float gradientAxis = clamp(vUv.y + sin(uTime * 1.6 + vSeed * 6.28318 + vUv.x * 9.0) * 0.07, 0.0, 1.0);
    vec3 gradientColor = mix(vColorStart, vColorEnd, gradientAxis);

    vec2 centeredUv = vUv - 0.5;
    float radialFalloff = length(centeredUv * vec2(1.05, 1.35));
    float innerCore = smoothstep(0.72, 0.1, radialFalloff);
    float depthGradient = clamp(1.0 - abs(vLocalPos.z) * 2.1, 0.0, 1.0);
    float innerGlow = pow(clamp(1.0 - radialFalloff, 0.0, 1.0), 1.25);

    float shimmer = 0.9 + 0.1 * sin(uTime * 1.5 + vSeed * 9.0 + vUv.x * 8.0);
    float fresnel = pow(1.0 - max(dot(normalize(vNormalDir), normalize(vViewDir)), 0.0), 2.0);

    vec3 baseColor = gradientColor * mix(0.7, 1.2, depthGradient) * shimmer;
    vec3 highlightColor = mix(baseColor, vec3(1.0), 0.18 + innerCore * 0.22);
    vec3 internalGradient = gradientColor * innerGlow * uGradientStrength;
    vec3 rimGlow = gradientColor * fresnel * uRimStrength;

    vec3 finalColor = highlightColor + (internalGradient + rimGlow) * uGlowStrength;
    float alpha = clamp((0.25 + innerGlow * 0.5 + fresnel * 0.22) * uOpacity, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const AntigravityInner: React.FC<AntigravityProps> = ({
  count = 400,
  magnetRadius = 15,
  ringRadius = 8,
  waveSpeed = 0.4,
  waveAmplitude = 0.8,
  particleSize = 1.8,
  lerpSpeed = 0.06,
  color = '#ffffff',
  colorGradient,
  internalGradientStrength = 0.78,
  rimStrength = 0.5,
  glowStrength = 1,
  particleOpacity = 0.85,
  additiveBlend = true,
  autoAnimate = false,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = 'capsule',
  fieldStrength = 10
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseMoveTime = useRef(0);
  const virtualMouse = useRef({ x: 0, y: 0 });
  const instanceColorStartAttribute = useMemo(
    () => new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3),
    [count]
  );
  const instanceColorEndAttribute = useMemo(
    () => new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3),
    [count]
  );
  const instanceSeedAttribute = useMemo(
    () => new THREE.InstancedBufferAttribute(new Float32Array(count), 1),
    [count]
  );

  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uGradientStrength: { value: internalGradientStrength },
      uRimStrength: { value: rimStrength },
      uGlowStrength: { value: glowStrength },
      uOpacity: { value: particleOpacity }
    }),
    [internalGradientStrength, rimStrength, glowStrength, particleOpacity]
  );

  const gradientKey = useMemo(() => {
    if (!colorGradient || colorGradient.length === 0) {
      return color;
    }
    return colorGradient.join('|');
  }, [color, colorGradient]);

  const gradientStops = useMemo(
    () => gradientKey.split('|').map(stop => new THREE.Color(stop)),
    [gradientKey]
  );

  const particles = useMemo(() => {
    const temp: InternalParticle[] = [];
    const width = viewport.width || 100;
    const height = viewport.height || 100;

    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      const z = (Math.random() - 0.5) * 20;
      const randomRadiusOffset = (Math.random() - 0.5) * 2;

      const indexT = count > 1 ? i / (count - 1) : 0;
      const spreadOffset = (Math.random() - 0.5) * 0.55;
      const gradientT = clamp01(indexT + spreadOffset);
      const mixedColor = interpolateGradientColor(gradientStops, gradientT);
      const [colorStart, colorEnd] = getParticleGradientPair(gradientStops);
      colorStart.lerp(mixedColor, 0.2 + Math.random() * 0.2);
      colorEnd.lerp(mixedColor, Math.random() * 0.12);
      const seed = Math.random();

      temp.push({
        t,
        factor,
        speed,
        xFactor,
        yFactor,
        zFactor,
        mx: x,
        my: y,
        mz: z,
        cx: x,
        cy: y,
        cz: z,
        vx: 0,
        vy: 0,
        vz: 0,
        randomRadiusOffset,
        colorStart,
        colorEnd,
        seed
      });
    }

    return temp;
  }, [count, viewport.width, viewport.height, gradientStops]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.geometry.setAttribute('instanceColorStart', instanceColorStartAttribute);
    mesh.geometry.setAttribute('instanceColorEnd', instanceColorEndAttribute);
    mesh.geometry.setAttribute('instanceSeed', instanceSeedAttribute);

    particles.forEach((particle, index) => {
      instanceColorStartAttribute.setXYZ(
        index,
        particle.colorStart.r,
        particle.colorStart.g,
        particle.colorStart.b
      );
      instanceColorEndAttribute.setXYZ(
        index,
        particle.colorEnd.r,
        particle.colorEnd.g,
        particle.colorEnd.b
      );
      instanceSeedAttribute.setX(index, particle.seed);
    });

    instanceColorStartAttribute.needsUpdate = true;
    instanceColorEndAttribute.needsUpdate = true;
    instanceSeedAttribute.needsUpdate = true;
  }, [
    instanceColorEndAttribute,
    instanceColorStartAttribute,
    instanceSeedAttribute,
    particleShape,
    particles
  ]);

  useFrame(state => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }

    const { viewport: v, pointer: m } = state;
    const mouseDist = Math.sqrt(Math.pow(m.x - lastMousePos.current.x, 2) + Math.pow(m.y - lastMousePos.current.y, 2));

    if (mouseDist > 0.001) {
      lastMouseMoveTime.current = Date.now();
      lastMousePos.current = { x: m.x, y: m.y };
    }

    let destX = (m.x * v.width) / 2;
    let destY = (m.y * v.height) / 2;

    if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
      const time = state.clock.getElapsedTime();
      destX = Math.sin(time * 0.5) * (v.width / 4);
      destY = Math.cos(time * 0.5 * 2) * (v.height / 4);
    }

    const smoothFactor = 0.05;
    virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor;
    virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor;

    const targetX = virtualMouse.current.x;
    const targetY = virtualMouse.current.y;
    const globalRotation = state.clock.getElapsedTime() * rotationSpeed;

    particles.forEach((particle, i) => {
      let { t, speed, mx, my, mz, cz, randomRadiusOffset } = particle;
      t = particle.t += speed / 2;

      const projectionFactor = 1 - cz / 50;
      const projectedTargetX = targetX * projectionFactor;
      const projectedTargetY = targetY * projectionFactor;

      const dx = mx - projectedTargetX;
      const dy = my - projectedTargetY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetPos = { x: mx, y: my, z: mz * depthFactor };

      if (dist < magnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRotation;
        const wave = Math.sin(t * waveSpeed + angle) * (0.5 * waveAmplitude);
        const deviation = randomRadiusOffset * (5 / (fieldStrength + 0.1));
        const currentRingRadius = ringRadius + wave + deviation;

        targetPos.x = projectedTargetX + currentRingRadius * Math.cos(angle);
        targetPos.y = projectedTargetY + currentRingRadius * Math.sin(angle);
        targetPos.z = mz * depthFactor + Math.sin(t) * (1 * waveAmplitude * depthFactor);
      }

      particle.cx += (targetPos.x - particle.cx) * lerpSpeed;
      particle.cy += (targetPos.y - particle.cy) * lerpSpeed;
      particle.cz += (targetPos.z - particle.cz) * lerpSpeed;

      dummy.position.set(particle.cx, particle.cy, particle.cz);
      dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
      dummy.rotateX(Math.PI / 2);

      const currentDistToMouse = Math.sqrt(
        Math.pow(particle.cx - projectedTargetX, 2) + Math.pow(particle.cy - projectedTargetY, 2)
      );

      const distFromRing = Math.abs(currentDistToMouse - ringRadius);
      let scaleFactor = 1 - distFromRing / 10;
      scaleFactor = Math.max(0, Math.min(1, scaleFactor));

      const finalScale = scaleFactor * (0.8 + Math.sin(t * pulseSpeed) * 0.2 * particleVariance) * particleSize;
      dummy.scale.set(finalScale, finalScale, finalScale);

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {particleShape === 'capsule' && <capsuleGeometry args={[0.1, 0.4, 4, 8]} />}
      {particleShape === 'sphere' && <sphereGeometry args={[0.2, 16, 16]} />}
      {particleShape === 'box' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
      {particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.3]} />}
      <shaderMaterial
        ref={materialRef}
        uniforms={shaderUniforms}
        vertexShader={PARTICLE_VERTEX_SHADER}
        fragmentShader={PARTICLE_FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        toneMapped={false}
        blending={additiveBlend ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </instancedMesh>
  );
};

const Antigravity: React.FC<AntigravityProps> = props => {
  return (
    <Canvas
      camera={{ position: [0, 0, 50], fov: 35 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <AntigravityInner {...props} />
      <EffectComposer enableNormalPass={false} multisampling={0}>
        <Bloom
          intensity={0.58}
          luminanceThreshold={0.02}
          luminanceSmoothing={0.72}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
};

export default Antigravity;