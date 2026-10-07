"use client"

import { useEffect, useRef } from "react"
import { ACESFilmicToneMapping, AmbientLight, Box3, DirectionalLight, Mesh, MeshPhysicalMaterial, PerspectiveCamera, PointLight, Scene, SRGBColorSpace, Vector3, WebGLRenderer } from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js"
import { orbitPosition } from "@/lib/orbit"
import { studyMedia } from "@/lib/study-media"

export function ScaleStudy({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(progress)
  const drawRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    progressRef.current = progress
    drawRef.current?.()
  }, [progress])

  useEffect(() => {
    const host = canvasRef.current
    if (!host) return

    const scene = new Scene()
    const camera = new PerspectiveCamera(35, 1, 0.1, 100)
    const renderer = new WebGLRenderer({ alpha: true, antialias: true })
    renderer.outputColorSpace = SRGBColorSpace
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.6
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    host.appendChild(renderer.domElement)

    scene.add(new AmbientLight(0xffffff, 1.1))
    const keyLight = new DirectionalLight(0xffffff, 3.4)
    keyLight.position.set(-2, 3, 4)
    scene.add(keyLight)
    const rimLight = new DirectionalLight(0xdde5ff, 2.6)
    rimLight.position.set(3, 3, -2)
    scene.add(rimLight)
    const frontLight = new PointLight(0xffffff, 14)
    frontLight.position.set(1, 0, 3)
    scene.add(frontLight)

    // 更新镜头轨迹
    const draw = () => {
      const [x, y, z] = orbitPosition(progressRef.current, 5.3)
      camera.position.set(x, y, z)
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
    }
    drawRef.current = draw

    const resize = () => {
      const { width, height } = host.getBoundingClientRect()
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      draw()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)

    // 加载原站雕塑
    let active = true
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(studyMedia.scaleModel, ({ scene: sculpture }) => {
      if (!active) return
      const bounds = new Box3().setFromObject(sculpture)
      const extent = bounds.getSize(new Vector3())
      sculpture.scale.setScalar(3 / Math.max(extent.x, extent.y, extent.z))
      sculpture.position.sub(new Box3().setFromObject(sculpture).getCenter(new Vector3()))
      sculpture.traverse((object) => {
        if (object instanceof Mesh) object.material = new MeshPhysicalMaterial({ color: 0x121318, metalness: 0.52, roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.16 })
      })
      scene.add(sculpture)
      draw()
    }, undefined, (error) => { throw error })

    resize()
    return () => {
      active = false
      resizeObserver.disconnect()
      drawRef.current = null
      scene.traverse((object) => {
        if (!(object instanceof Mesh)) return
        object.geometry.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => material.dispose())
      })
      renderer.dispose()
      host.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="scale-study scale-live">
    <span className="scale-sigil" aria-hidden="true">&amp;</span>
    <nav className="scale-site-nav"><span>SCALE &amp; FORM</span><span>LEISTUNGEN　 STUDIO　 PROZESS　 KONTAKT</span><span>PROJEKT ANFRAGEN</span></nav>
    <div className="scale-site-copy"><small>00　WEBDESIGN · DEVELOPMENT · BRAND EXPERIENCE</small><strong>Scale &amp;<br />Form</strong><p>Webdesign, das Marken<br />größer wirken lässt.</p></div>
    <div className="scale-canvas" ref={canvasRef} role="img" aria-label="随滚动环绕的 Scale & Form 原站黑色骑士雕塑" />
    <div className="scale-side"><span>AUF DIESER SEITE</span><span>—　 Start</span><span>—　 In Zahlen</span><span>—　 Was wir bauen</span><span>—　 Arbeiten</span></div>
    <span className="scale-label">CAMERA ORBIT　 {Math.round(progress * 86 - 40)}°</span>
  </div>
}
