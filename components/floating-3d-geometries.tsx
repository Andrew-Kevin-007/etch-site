"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Float, Environment, Sphere, Torus, Icosahedron } from "@react-three/drei"

export default function Floating3DGeometries() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 3, ease: [0.2, 0, 0, 1] }}
      className="absolute inset-0 pointer-events-none z-0"
    >
      <Canvas 
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 10], fov: 45 }} 
        performance={{ min: 0.5 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          
          {/* Blue Sphere */}
          <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <Sphere args={[0.8, 64, 64]} position={[-4, 2, -1]}>
              <meshStandardMaterial 
                color="#4285F4" 
                roughness={0.1} 
                metalness={0.4} 
                emissive="#4285F4"
                emissiveIntensity={0.2}
              />
            </Sphere>
          </Float>

          {/* Red Torus */}
          <Float speed={2.5} rotationIntensity={2} floatIntensity={2}>
            <Torus args={[0.6, 0.2, 32, 64]} position={[4, 1.5, -3]} rotation={[1, 1, 0]}>
              <meshStandardMaterial 
                color="#EA4335" 
                roughness={0.2} 
                metalness={0.3} 
                emissive="#EA4335"
                emissiveIntensity={0.2}
              />
            </Torus>
          </Float>

          {/* Yellow Icosahedron */}
          <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
            <Icosahedron args={[0.7, 0]} position={[3, -2, -2]}>
              <meshStandardMaterial 
                color="#FBBC05" 
                roughness={0.1} 
                metalness={0.5} 
                emissive="#FBBC05"
                emissiveIntensity={0.2}
              />
            </Icosahedron>
          </Float>

          {/* Green Sphere */}
          <Float speed={3} rotationIntensity={1} floatIntensity={2}>
            <Sphere args={[0.5, 64, 64]} position={[-3, -1.5, -3]}>
              <meshStandardMaterial 
                color="#34A853" 
                roughness={0.1} 
                metalness={0.4} 
                emissive="#34A853"
                emissiveIntensity={0.2}
              />
            </Sphere>
          </Float>
        </Suspense>
      </Canvas>
    </motion.div>
  )
}


