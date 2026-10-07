"use client"

import { useEffect, useRef } from "react"
import { ACESFilmicToneMapping, AmbientLight, AnimationMixer, Box3, Color, DirectionalLight, DoubleSide, Group, LoopOnce, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, PerspectiveCamera, PMREMGenerator, Scene, SphereGeometry, SRGBColorSpace, Vector3, WebGLRenderer } from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { HDRLoader } from "three/addons/loaders/HDRLoader.js"
import { studyMedia } from "@/lib/study-media"

export function NoomoStudy({ progress }: { progress: number }) {
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
    const camera = new PerspectiveCamera(43, 1, 0.1, 100)
    camera.position.set(0, 0.1, 4.8)
    camera.lookAt(0, 0, 0)
    const renderer = new WebGLRenderer({ alpha: true, antialias: true })
    renderer.outputColorSpace = SRGBColorSpace
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    host.appendChild(renderer.domElement)
    scene.add(new AmbientLight(0xffffff, 1.8))
    const light = new DirectionalLight(0xffffff, 4)
    light.position.set(2, 3, 5)
    scene.add(light)

    const shell = new Group()
    const panels: { mesh: Mesh; direction: Vector3 }[] = []
    for (let row = 0; row < 6; row++) {
      for (let column = 0; column < 12; column++) {
        const theta = 0.12 + row * (Math.PI - 0.24) / 6
        const phi = column * Math.PI / 6
        const geometry = new SphereGeometry(1.47, 3, 2, phi, Math.PI / 6 * 0.88, theta, (Math.PI - 0.24) / 6 * 0.88)
        const material = new MeshPhysicalMaterial({ color: 0x302b42, metalness: 0.15, roughness: 0.55, transparent: true, opacity: 0.32, side: DoubleSide, clearcoat: 0.2, depthWrite: false })
        const mesh = new Mesh(geometry, material)
        const middleTheta = theta + (Math.PI - 0.24) / 12
        const middlePhi = phi + Math.PI / 12
        const direction = new Vector3(Math.sin(middleTheta) * Math.cos(middlePhi), Math.cos(middleTheta), Math.sin(middleTheta) * Math.sin(middlePhi))
        shell.add(mesh)
        panels.push({ mesh, direction })
      }
    }
    scene.add(shell)

    let mixer: AnimationMixer | null = null
    let duration = 0
    let jellyfish: Group | null = null
    let environment: ReturnType<PMREMGenerator["fromEquirectangular"]>["texture"] | null = null

    // 按进度推进模型
    const draw = () => {
      const position = progressRef.current
      const opening = Math.min(1, Math.max(0, (position - 0.08) / 0.75))
      shell.rotation.y = position * 1.5
      shell.scale.setScalar(1 + position * 0.12)
      panels.forEach(({ mesh, direction }) => mesh.position.copy(direction).multiplyScalar(opening * 0.27))
      if (mixer) mixer.setTime(position * duration)
      if (jellyfish) jellyfish.rotation.y = -position * 0.45
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

    // 加载原站水母
    let active = true
    new GLTFLoader().load(studyMedia.noomoModel, (gltf) => {
      if (!active) return
      const source = gltf.scene.getObjectByName("Jellyfish_Empty")
      if (!source) throw new Error("Noomo jellyfish is missing from the source model")
      gltf.scene.children.forEach((child) => { child.visible = child === source })
      source.traverse((object) => {
        if (!(object instanceof Mesh)) return
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => {
          if (material instanceof MeshStandardMaterial) material.color.set(new Color(0xb98ccf))
        })
      })
      const bounds = new Box3().setFromObject(source)
      const size = bounds.getSize(new Vector3())
      const center = bounds.getCenter(new Vector3())
      gltf.scene.position.sub(center)
      gltf.scene.scale.setScalar(2.4 / Math.max(size.x, size.y, size.z))
      jellyfish = gltf.scene
      scene.add(gltf.scene)
      const clips = gltf.animations.filter((clip) => /jellyfish/i.test(clip.name))
      mixer = new AnimationMixer(gltf.scene)
      clips.forEach((clip) => {
        const action = mixer!.clipAction(clip)
        action.setLoop(LoopOnce, 1)
        action.clampWhenFinished = true
        action.play()
      })
      duration = Math.max(...clips.map((clip) => clip.duration))
      draw()
    }, undefined, (error) => { throw error })

    new HDRLoader().load(studyMedia.noomoHdr, (texture) => {
      if (!active) return
      const generator = new PMREMGenerator(renderer)
      environment = generator.fromEquirectangular(texture).texture
      scene.environment = environment
      generator.dispose()
      texture.dispose()
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
      environment?.dispose()
      renderer.dispose()
      host.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="noomo-study"><nav><strong>noomo <em>labs</em></strong><span>[WORK]　 [NOOMO AGENCY]　 [CONTACT]</span></nav><strong className="noomo-back-title">NOOMO LABS</strong><div className="noomo-canvas" ref={canvasRef} role="img" aria-label="Noomo 原站水母模型与随滚动展开的球体" /><div className="noomo-bottom"><span>AR　＋　3D　＋　AI　＋　XR</span><span>SCROLL TO EXPLORE THE FUTURE</span></div></div>
}
