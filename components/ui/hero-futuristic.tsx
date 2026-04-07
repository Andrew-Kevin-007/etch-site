'use client'

import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useAspect, useTexture } from '@react-three/drei'
import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three/webgpu'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js'
import { ArrowDown } from 'lucide-react'
import type { Mesh } from 'three'

import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
  mix,
  add,
} from 'three/tsl'

import { cn } from '@/lib/utils'

const TEXTUREMAP = {
  src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
}

const DEPTHMAP = {
  src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
}

extend(THREE as any)

interface PostProcessingProps {
  strength?: number
  threshold?: number
  fullScreenEffect?: boolean
}

const PostProcessing = ({
  strength = 1,
  threshold = 1,
  fullScreenEffect = true,
}: PostProcessingProps) => {
  const { gl, scene, camera } = useThree()
  const progressRef = useRef<{ value: number }>({ value: 0 })

  const render = useMemo(() => {
    const postProcessing = new THREE.PostProcessing(gl as any)
    const scenePass = pass(scene, camera)
    const scenePassColor = scenePass.getTextureNode('output')
    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold)

    const uScanProgress = uniform(0)
    progressRef.current = uScanProgress as unknown as { value: number }

    const scanPos = float(uScanProgress.value)
    const uvY = uv().y
    const scanWidth = float(0.05)
    const scanLine = smoothstep(0, scanWidth, abs(uvY.sub(scanPos)))
    const redOverlay = vec3(1, 0, 0).mul(oneMinus(scanLine)).mul(0.4)

    const withScanEffect = mix(
      scenePassColor,
      add(scenePassColor, redOverlay),
      fullScreenEffect ? smoothstep(0.9, 1.0, oneMinus(scanLine)) : 1.0,
    )

    postProcessing.outputNode = withScanEffect.add(bloomPass)
    return postProcessing
  }, [camera, gl, scene, strength, threshold, fullScreenEffect])

  useFrame(({ clock }) => {
    progressRef.current.value = Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5
    render.renderAsync()
  }, 1)

  return null
}

const WIDTH = 300
const HEIGHT = 300

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src])

  const meshRef = useRef<Mesh | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (rawMap && depthMap) {
      setVisible(true)
    }
  }, [rawMap, depthMap])

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0))
    const uProgress = uniform(0)

    const strength = 0.01
    const tDepthMap = texture(depthMap)
    const tMap = texture(rawMap, uv().add(tDepthMap.r.mul(uPointer).mul(strength)))

    const aspect = float(WIDTH).div(HEIGHT)
    const tUv = vec2(uv().x.mul(aspect), uv().y)

    const tiling = vec2(120.0)
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0)

    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2))
    const dist = float(tiledUv.length())
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness)

    const depth = tDepthMap.r
    const flow = oneMinus(smoothstep(0, 0.02, abs(depth.sub(uProgress))))
    const mask = dot.mul(flow).mul(vec3(10, 0, 0))
    const final = blendScreen(tMap, mask)

    const material = new THREE.MeshBasicNodeMaterial({
      colorNode: final,
      transparent: true,
      opacity: 0,
    })

    return {
      material,
      uniforms: {
        uPointer,
        uProgress,
      },
    }
  }, [rawMap, depthMap])

  const [w, h] = useAspect(WIDTH, HEIGHT)

  useFrame(({ clock }) => {
    uniforms.uProgress.value = Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5

    if (meshRef.current?.material && 'opacity' in meshRef.current.material) {
      const mat = meshRef.current.material as { opacity?: number }
      mat.opacity = THREE.MathUtils.lerp(mat.opacity ?? 0, visible ? 1 : 0, 0.07)
    }
  })

  useFrame(({ pointer }) => {
    uniforms.uPointer.value = pointer
  })

  const scaleFactor = 0.4

  return (
    <mesh ref={meshRef} scale={[w * scaleFactor, h * scaleFactor, 1]} material={material}>
      <planeGeometry />
    </mesh>
  )
}

interface HeroFuturisticProps {
  className?: string
  showOverlay?: boolean
}

export function HeroFuturistic({ className, showOverlay = true }: HeroFuturisticProps) {
  const titleWords = 'Build Your Dreams'.split(' ')
  const subtitle = 'AI-powered creativity for the next generation.'

  const [visibleWords, setVisibleWords] = useState(0)
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const [delays, setDelays] = useState<number[]>([])
  const [subtitleDelay, setSubtitleDelay] = useState(0)

  useEffect(() => {
    setDelays(titleWords.map(() => Math.random() * 0.07))
    setSubtitleDelay(Math.random() * 0.1)
  }, [titleWords.length])

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 600)
      return () => clearTimeout(timeout)
    }

    const timeout = setTimeout(() => setSubtitleVisible(true), 800)
    return () => clearTimeout(timeout)
  }, [visibleWords, titleWords.length])

  return (
    <div className={cn('relative h-svh w-full overflow-hidden', className)}>
      {showOverlay ? (
        <>
          <div className="absolute z-[60] flex h-svh w-full pointer-events-none items-center justify-center px-10 uppercase">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-extrabold md:text-5xl xl:text-6xl 2xl:text-7xl">
                <div className="flex space-x-2 overflow-hidden text-white lg:space-x-6">
                  {titleWords.map((word, index) => (
                    <div
                      key={word + index}
                      className={index < visibleWords ? 'fade-in' : ''}
                      style={{
                        animationDelay: `${index * 0.13 + (delays[index] || 0)}s`,
                        opacity: index < visibleWords ? undefined : 0,
                      }}
                    >
                      {word}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-2 overflow-hidden text-xs font-bold text-white md:text-xl xl:text-2xl 2xl:text-3xl">
                <div
                  className={subtitleVisible ? 'fade-in-subtitle' : ''}
                  style={{
                    animationDelay: `${titleWords.length * 0.13 + 0.2 + subtitleDelay}s`,
                    opacity: subtitleVisible ? undefined : 0,
                  }}
                >
                  {subtitle}
                </div>
              </div>
            </div>
          </div>

          <button className="explore-btn" style={{ animationDelay: '2.2s' }}>
            Scroll to explore
            <span className="explore-arrow">
              <ArrowDown className="h-5 w-5" strokeWidth={2} />
            </span>
          </button>
        </>
      ) : null}

      <Canvas
        className="absolute inset-0 h-full w-full"
        flat
        gl={async (props) => {
          const renderer = new THREE.WebGPURenderer(props as any)
          await renderer.init()
          return renderer
        }}
      >
        <PostProcessing fullScreenEffect />
        <Scene />
      </Canvas>
    </div>
  )
}

export default HeroFuturistic