import { useEffect, useRef } from 'react'
import { createNoise3D } from 'simplex-noise'
import fragmentShader from './metaballs.frag'
import vertexShader from './metaballs.vert'
import * as THREE from 'three'

export default function InteractiveMetaballs() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const noise3D = createNoise3D()
    const width = container.clientWidth
    const height = container.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10)
    camera.position.z = 5

    const geometry = new THREE.PlaneGeometry(2, 2)

    const NUM_METABALLS = 6
    const MOUSE_FORCE = 0.007

    const metaballPositions = Array.from({ length: NUM_METABALLS }, (_, i) =>
      new THREE.Vector3(
        Math.cos((i / NUM_METABALLS) * Math.PI * 2) * 0.5,
        Math.sin((i / NUM_METABALLS) * Math.PI * 2) * 0.5,
        0
      )
    )

    const metaballVelocities = Array.from({ length: NUM_METABALLS }, () => new THREE.Vector3())
    const metaballRadii = new Array(NUM_METABALLS).fill(0.3)

    const uniforms = {
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uMetaballPositions: { value: new Array(NUM_METABALLS * 3).fill(0) },
      uMetaballRadii: { value: metaballRadii },
      uResolution: { value: new THREE.Vector2(width, height) }
    }

    const activePointerForces: THREE.Vector2[] = []

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let x = 0.5
      let y = 0.5
      if ('touches' in e && e.touches.length) {
        x = e.touches[0].clientX / window.innerWidth
        y = 1 - e.touches[0].clientY / window.innerHeight
      } else if ('clientX' in e) {
        x = e.clientX / window.innerWidth
        y = 1 - e.clientY / window.innerHeight
      }
      uniforms.uMouse.value.set(x, y)
    }

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let x = 0
      let y = 0
      if ('touches' in e && e.touches.length) {
        x = e.touches[0].clientX / window.innerWidth
        y = 1 - e.touches[0].clientY / window.innerHeight
      } else if ('clientX' in e) {
        x = e.clientX / window.innerWidth
        y = 1 - e.clientY / window.innerHeight
      }
      activePointerForces.length = 0
      activePointerForces.push(new THREE.Vector2(x, y))
    }

    const handlePointerUp = () => {
      activePointerForces.length = 0
    }

    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      uniforms.uResolution.value.set(w, h)
    }

    window.addEventListener('mousemove', handlePointerMove)
    window.addEventListener('touchmove', handlePointerMove)
    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('touchstart', handlePointerDown)
    window.addEventListener('mouseup', handlePointerUp)
    window.addEventListener('touchend', handlePointerUp)
    window.addEventListener('resize', handleResize)

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false
    })

    const mesh = new THREE.Mesh(geometry, material)
    const scene = new THREE.Scene()
    scene.add(mesh)

    const clock = new THREE.Clock()
    let raf = 0

    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime()

      for (let i = 0; i < NUM_METABALLS; i++) {
        const time = uniforms.uTime.value * 0.1

        const noiseForce = new THREE.Vector3(
          noise3D(i * 10, time, 0),
          noise3D(i * 20, time, 100),
          noise3D(i * 30, time, 200) * 0.3
        ).multiplyScalar(0.06)

        const mousePos = new THREE.Vector3(
          uniforms.uMouse.value.x * 2 - 1,
          uniforms.uMouse.value.y * 2 - 1,
          0
        )

        const mouseDir = metaballPositions[i].clone().sub(mousePos)
        const mouseDistSq = mouseDir.lengthSq() + 0.05
        mouseDir.normalize()
        const mouseRepulsion = mouseDir.multiplyScalar(MOUSE_FORCE / mouseDistSq)

        const clickForce = new THREE.Vector3()
        for (const pf of activePointerForces) {
          const fp = new THREE.Vector3(pf.x * 2 - 1, pf.y * 2 - 1, 0)
          const dir = metaballPositions[i].clone().sub(fp)
          const d = dir.lengthSq() + 0.001
          dir.normalize()
          dir.add(new THREE.Vector3((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, 0)).normalize()
          clickForce.add(dir.multiplyScalar(0.01 / d))
        }

        metaballVelocities[i]
          .add(noiseForce)
          .add(mouseRepulsion)
          .add(clickForce)
          .multiplyScalar(0.4)
          .add(metaballPositions[i].clone().negate().multiplyScalar(0.02))

        metaballPositions[i].add(metaballVelocities[i])

        const o = i * 3
        uniforms.uMetaballPositions.value[o] = metaballPositions[i].x
        uniforms.uMetaballPositions.value[o + 1] = metaballPositions[i].y
        uniforms.uMetaballPositions.value[o + 2] = metaballPositions[i].z
      }

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }

    animate()
    handleResize()

    return () => {
      cancelAnimationFrame(raf)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('touchmove', handlePointerMove)
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('touchstart', handlePointerDown)
      window.removeEventListener('mouseup', handlePointerUp)
      window.removeEventListener('touchend', handlePointerUp)
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
}
