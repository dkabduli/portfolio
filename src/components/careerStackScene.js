import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const UNIT_W = 2.6
const UNIT_H = 0.3
const UNIT_D = 1.9
const GAP = 1.15
const SLIDE = 0.5
const LIFT = 0.06
const PORTS = 6

const BASE_COLOR = new THREE.Color('#f4f6fa')
const ACTIVE_COLOR = new THREE.Color('#3b6fe8')
const LED_IDLE = new THREE.Color('#9aa7bd')
const LED_ON = new THREE.Color('#22c55e')

/**
 * Index 0 is the top unit, matching the timeline's newest-first order.
 * Labels are positioned imperatively each frame so React never re-renders per frame.
 */
export function createCareerStack(container, { count, reducedMotion, getLabels }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTexture

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
  const cameraDir = new THREE.Vector3(7.5, 6.2, 9).normalize()

  scene.add(new THREE.HemisphereLight('#ffffff', '#cfd7e3', 0.5))
  const sun = new THREE.DirectionalLight('#ffffff', 1.6)
  sun.position.set(4, 8, 5)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  sun.shadow.camera.left = -5
  sun.shadow.camera.right = 5
  sun.shadow.camera.top = 5
  sun.shadow.camera.bottom = -5
  sun.shadow.bias = -0.0005
  scene.add(sun)

  const group = new THREE.Group()
  scene.add(group)

  const unitGeometry = new RoundedBoxGeometry(UNIT_W, UNIT_H, UNIT_D, 4, 0.12)
  const portGeometry = new THREE.BoxGeometry(0.11, 0.08, 0.02)
  const ledGeometry = new THREE.BoxGeometry(0.07, 0.045, 0.02)
  const portMaterial = new THREE.MeshStandardMaterial({ color: '#1a2744', roughness: 0.6 })
  const disposables = [unitGeometry, portGeometry, ledGeometry, portMaterial]

  const units = []
  const centerOffset = ((count - 1) * GAP) / 2
  for (let i = 0; i < count; i += 1) {
    const level = count - 1 - i
    const material = new THREE.MeshPhysicalMaterial({
      color: BASE_COLOR.clone(),
      roughness: 0.38,
      metalness: 0.05,
      clearcoat: 0.6,
      clearcoatRoughness: 0.28,
    })
    const mesh = new THREE.Mesh(unitGeometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    const baseY = level * GAP - centerOffset
    mesh.position.y = baseY

    const front = UNIT_D / 2 + 0.006
    for (let p = 0; p < PORTS; p += 1) {
      const port = new THREE.Mesh(portGeometry, portMaterial)
      port.position.set(-UNIT_W / 2 + 0.3 + p * 0.15, 0, front)
      mesh.add(port)
    }
    const leds = []
    for (let k = 0; k < 3; k += 1) {
      const ledMaterial = new THREE.MeshStandardMaterial({ color: LED_IDLE.clone(), emissive: LED_IDLE.clone(), emissiveIntensity: 0.15 })
      const led = new THREE.Mesh(ledGeometry, ledMaterial)
      led.position.set(UNIT_W / 2 - 0.26 - k * 0.13, 0, front)
      mesh.add(led)
      leds.push(led)
      disposables.push(ledMaterial)
    }
    disposables.push(material)
    group.add(mesh)
    units.push({ mesh, material, leds, baseY, progress: 0 })
  }

  const railMaterial = new THREE.LineDashedMaterial({ color: '#8a9bb5', dashSize: 0.07, gapSize: 0.07, transparent: true, opacity: 0.7 })
  disposables.push(railMaterial)
  const railBottom = -centerOffset - UNIT_H / 2
  const railTop = centerOffset + UNIT_H / 2 + 0.25
  for (const [x, z] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x * (UNIT_W / 2 + 0.14), railBottom, z * (UNIT_D / 2 + 0.14)),
      new THREE.Vector3(x * (UNIT_W / 2 + 0.14), railTop, z * (UNIT_D / 2 + 0.14)),
    ])
    const rail = new THREE.Line(geometry, railMaterial)
    rail.computeLineDistances()
    group.add(rail)
    disposables.push(geometry)
  }

  const groundGeometry = new THREE.PlaneGeometry(20, 20)
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.12 })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = railBottom - 0.01
  ground.receiveShadow = true
  scene.add(ground)
  disposables.push(groundGeometry, groundMaterial)

  let width = 1
  let height = 1
  const fitRadius = Math.hypot(Math.hypot(UNIT_W / 2, UNIT_D / 2 + SLIDE / 2), centerOffset + UNIT_H)

  function resize() {
    width = Math.max(container.clientWidth, 1)
    height = Math.max(container.clientHeight, 1)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    // Keep the right third of the stage free for the HTML labels.
    const stackAspect = camera.aspect * 0.66
    const vfov = THREE.MathUtils.degToRad(camera.fov)
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * stackAspect)
    const distance = (fitRadius / Math.sin(Math.min(vfov, hfov) / 2)) * 0.8
    camera.position.copy(cameraDir).multiplyScalar(distance)
    camera.lookAt(0, 0, 0)
    camera.setViewOffset(width, height, width * 0.17, 0, width, height)
    camera.updateProjectionMatrix()
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  resize()

  let active = 0
  let running = false
  let frame = 0
  let ready = false
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  const clock = new THREE.Clock()
  const projected = new THREE.Vector3()

  function onPointerMove(event) {
    const rect = container.getBoundingClientRect()
    pointer.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    pointer.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2
  }
  function onPointerLeave() {
    pointer.tx = 0
    pointer.ty = 0
  }
  if (!reducedMotion) {
    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerleave', onPointerLeave)
  }

  function positionLabels() {
    const labels = getLabels()
    units.forEach((unit, i) => {
      const el = labels[i]
      if (!el) return
      projected.set(0, unit.baseY, 0)
      group.localToWorld(projected)
      projected.project(camera)
      const y = (1 - projected.y) * 0.5 * height
      el.style.transform = `translateY(${y.toFixed(1)}px) translateY(-50%)`
    })
  }

  function tick() {
    frame = 0
    const dt = Math.min(clock.getDelta(), 0.05)
    const t = clock.elapsedTime
    const ease = reducedMotion ? 1 : 1 - Math.exp(-dt * 7)

    pointer.x += (pointer.tx - pointer.x) * ease
    pointer.y += (pointer.ty - pointer.y) * ease
    group.rotation.y = reducedMotion ? 0 : Math.sin(t * 0.35) * 0.1 + pointer.x * 0.18
    group.rotation.x = reducedMotion ? 0 : pointer.y * 0.05

    units.forEach((unit, i) => {
      const target = i === active ? 1 : 0
      unit.progress += (target - unit.progress) * ease
      unit.mesh.position.z = unit.progress * SLIDE
      unit.mesh.position.y = unit.baseY + unit.progress * LIFT
      unit.material.color.copy(BASE_COLOR).lerp(ACTIVE_COLOR, unit.progress * 0.88)
      unit.leds.forEach((led, k) => {
        const blink = reducedMotion ? 1 : 0.55 + 0.45 * Math.sin(t * 5 + k * 1.7)
        led.material.color.copy(LED_IDLE).lerp(LED_ON, unit.progress)
        led.material.emissive.copy(LED_IDLE).lerp(LED_ON, unit.progress)
        led.material.emissiveIntensity = 0.15 + unit.progress * 1.4 * blink
      })
    })

    renderer.render(scene, camera)
    positionLabels()
    if (!ready) {
      ready = true
      container.dataset.ready = 'true'
    }
    if (running) frame = requestAnimationFrame(tick)
  }

  return {
    setActive(index) {
      active = index
      if (!running && !frame) frame = requestAnimationFrame(tick)
    },
    setRunning(next) {
      if (next === running) return
      running = next
      if (running && !frame) {
        clock.getDelta()
        frame = requestAnimationFrame(tick)
      }
    },
    dispose() {
      running = false
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerleave', onPointerLeave)
      disposables.forEach((item) => item.dispose())
      envTexture.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      delete container.dataset.ready
    },
  }
}
