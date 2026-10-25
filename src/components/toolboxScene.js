import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const BODY_W = 3
const BODY_D = 1.9
const WALL = 0.08
const SLOT_H = 0.56
const FRONT_H = 0.48
const PULL = 1.15

const FRONT_COLOR = new THREE.Color('#eef1f7')
const ACTIVE_COLOR = new THREE.Color('#3b6fe8')

/** Drawer 0 is the top drawer, matching the order of the skills rows. */
export function createToolbox(container, { count, reducedMotion }) {
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

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
  const cameraDir = new THREE.Vector3(4.2, 5.8, 8).normalize()
  const target = new THREE.Vector3(0, -0.05, 0.35)

  scene.add(new THREE.HemisphereLight('#ffffff', '#cfd7e3', 0.55))
  const sun = new THREE.DirectionalLight('#ffffff', 1.5)
  sun.position.set(3, 7, 6)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4 })
  sun.shadow.bias = -0.0005
  scene.add(sun)

  const disposables = []
  const track = (item) => {
    disposables.push(item)
    return item
  }

  const bodyMaterial = track(new THREE.MeshPhysicalMaterial({ color: '#24324f', roughness: 0.42, metalness: 0.2, clearcoat: 0.8, clearcoatRoughness: 0.3 }))
  const chromeMaterial = track(new THREE.MeshStandardMaterial({ color: '#d7dde8', metalness: 1, roughness: 0.22 }))
  const trayMaterial = track(new THREE.MeshStandardMaterial({ color: '#1a2438', roughness: 0.7 }))
  const metalMaterial = track(new THREE.MeshStandardMaterial({ color: '#c9ced8', metalness: 0.9, roughness: 0.32 }))
  const darkMetalMaterial = track(new THREE.MeshStandardMaterial({ color: '#4b5563', metalness: 0.8, roughness: 0.4 }))
  const pcbMaterial = track(new THREE.MeshStandardMaterial({ color: '#0f5132', roughness: 0.6 }))
  const portMaterial = track(new THREE.MeshStandardMaterial({ color: '#0b1220', roughness: 0.8 }))
  const ledMaterial = track(new THREE.MeshStandardMaterial({ color: '#22c55e', emissive: '#22c55e', emissiveIntensity: 1.4 }))
  const plugMaterial = track(new THREE.MeshPhysicalMaterial({ color: '#e6edf5', roughness: 0.15, transparent: true, opacity: 0.85 }))
  const colorMaterials = new Map()
  const colored = (color) => {
    if (!colorMaterials.has(color)) colorMaterials.set(color, track(new THREE.MeshStandardMaterial({ color, roughness: 0.5 })))
    return colorMaterials.get(color)
  }

  const group = new THREE.Group()
  scene.add(group)

  const innerH = count * SLOT_H
  const bodyH = innerH + WALL * 2
  const bodyTop = bodyH / 2

  function addBox(w, h, d, material, x, y, z, parent = group, rounded = false) {
    const geometry = track(rounded ? new RoundedBoxGeometry(w, h, d, 3, Math.min(w, h, d) * 0.3) : new THREE.BoxGeometry(w, h, d))
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }

  // Open-front shell.
  addBox(BODY_W, WALL, BODY_D, bodyMaterial, 0, -bodyTop + WALL / 2, 0, group, true)
  addBox(BODY_W, WALL, BODY_D, bodyMaterial, 0, bodyTop - WALL / 2, 0, group, true)
  addBox(WALL, bodyH, BODY_D, bodyMaterial, -BODY_W / 2 + WALL / 2, 0, 0, group, true)
  addBox(WALL, bodyH, BODY_D, bodyMaterial, BODY_W / 2 - WALL / 2, 0, 0, group, true)
  addBox(BODY_W, bodyH, WALL, bodyMaterial, 0, 0, -BODY_D / 2 + WALL / 2)

  // Lid and carry handle.
  addBox(BODY_W + 0.08, 0.22, BODY_D + 0.08, bodyMaterial, 0, bodyTop + 0.11, 0, group, true)
  const handleGeometry = track(new THREE.TorusGeometry(0.46, 0.045, 12, 40, Math.PI))
  const carry = new THREE.Mesh(handleGeometry, chromeMaterial)
  carry.position.set(0, bodyTop + 0.22, 0)
  carry.castShadow = true
  group.add(carry)

  const drawerW = BODY_W - WALL * 2 - 0.04
  const trayD = BODY_D - 0.25
  const frontZ = BODY_D / 2 - 0.05
  const trayTop = -FRONT_H / 2 + 0.045
  // Gear sits in the part of the tray that clears the shell when a drawer is pulled out.
  const gearZ = frontZ - 0.78

  function lineCard(parent, x, z) {
    const card = new THREE.Group()
    card.position.set(x, trayTop, z)
    addBox(1.2, 0.03, 0.46, pcbMaterial, 0, 0.015, -0.23, card)
    for (const [cx, cz] of [[-0.35, -0.2], [0.05, -0.28], [0.38, -0.18]]) {
      addBox(0.2, 0.06, 0.15, darkMetalMaterial, cx, 0.06, cz, card)
    }
    addBox(1.26, 0.13, 0.03, metalMaterial, 0, 0.065, 0.015, card, true)
    for (let p = 0; p < 8; p += 1) {
      addBox(0.07, 0.05, 0.02, portMaterial, -0.42 + p * 0.1, 0.07, 0.034, card)
    }
    for (let l = 0; l < 3; l += 1) {
      addBox(0.025, 0.025, 0.01, ledMaterial, 0.42 + l * 0.05, 0.08, 0.034, card)
    }
    for (const side of [-1, 1]) {
      const lever = addBox(0.1, 0.035, 0.05, darkMetalMaterial, side * 0.61, 0.06, 0.05, card)
      lever.rotation.y = side * 0.35
    }
    parent.add(card)
  }

  function optic(parent, x, z, tabColor, { width = 0.09, length = 0.32 } = {}) {
    const module = new THREE.Group()
    module.position.set(x, trayTop, z)
    addBox(width, 0.05, length, metalMaterial, 0, 0.025, 0, module, true)
    addBox(width * 0.7, 0.012, 0.03, portMaterial, 0, 0.03, length / 2 + 0.005, module)
    addBox(width * 0.6, 0.008, 0.16, colored(tabColor), 0, 0.055, length / 2 + 0.06, module)
    parent.add(module)
  }

  function connector(parent, point, tangent, bootColor, kind) {
    const plug = new THREE.Group()
    plug.position.copy(point)
    plug.lookAt(point.clone().add(tangent))
    if (kind === 'lc') {
      addBox(0.028, 0.028, 0.06, colored('#38bdf8'), -0.018, 0, 0.03, plug)
      addBox(0.028, 0.028, 0.06, colored('#e7dcc4'), 0.018, 0, 0.03, plug)
      addBox(0.07, 0.03, 0.05, colored(bootColor), 0, 0, -0.01, plug)
    } else {
      addBox(0.055, 0.04, 0.07, colored(bootColor), 0, 0, -0.02, plug)
      addBox(0.05, 0.035, 0.08, plugMaterial, 0, 0, 0.05, plug)
      addBox(0.02, 0.01, 0.05, plugMaterial, 0, 0.022, 0.05, plug)
    }
    parent.add(plug)
  }

  function cable(parent, x, z, { color, radius = 0.28, turns = 2.4, tube = 0.028, plug = 'rj45' }) {
    const points = []
    const steps = 140
    for (let n = 0; n <= steps; n += 1) {
      const t = n / steps
      const angle = t * turns * Math.PI * 2
      const r = radius * (0.5 + 0.5 * t)
      points.push(new THREE.Vector3(x + Math.cos(angle) * r, trayTop + tube + t * tube * 2.4, z + Math.sin(angle) * r))
    }
    const end = points[points.length - 1]
    points.push(new THREE.Vector3(end.x + 0.18, end.y, end.z + 0.12))
    const curve = new THREE.CatmullRomCurve3(points)
    const mesh = new THREE.Mesh(track(new THREE.TubeGeometry(curve, 320, tube, 10)), colored(color))
    mesh.castShadow = true
    parent.add(mesh)
    connector(parent, curve.getPoint(0), curve.getTangent(0).negate(), color, plug)
    connector(parent, curve.getPoint(1), curve.getTangent(1), color, plug)
  }

  const gearSets = [
    (drawer) => {
      lineCard(drawer, -0.55, gearZ + 0.22)
      ;['#2563eb', '#16a34a', '#2563eb'].forEach((tab, k) => optic(drawer, 0.55 + k * 0.17, gearZ + 0.02, tab))
    },
    (drawer) => {
      cable(drawer, -0.72, gearZ, { color: '#2563eb' })
      cable(drawer, 0.02, gearZ, { color: '#facc15', turns: 2 })
      ;['#111827', '#7c3aed'].forEach((tab, k) => optic(drawer, 0.66 + k * 0.16, gearZ + 0.02, tab, { width: 0.07, length: 0.25 }))
    },
    (drawer) => {
      cable(drawer, -0.7, gearZ, { color: '#38bdf8', turns: 2.2, tube: 0.026 })
      cable(drawer, 0.14, gearZ, { color: '#f97316', turns: 3, tube: 0.014, plug: 'lc' })
      optic(drawer, 0.82, gearZ + 0.02, '#0ea5e9', { width: 0.07, length: 0.25 })
    },
  ]
  const pullGeometry = track(new THREE.CylinderGeometry(0.035, 0.035, 0.9, 16))
  const postGeometry = track(new THREE.CylinderGeometry(0.025, 0.025, 0.12, 10))

  const drawers = []
  for (let i = 0; i < count; i += 1) {
    const drawer = new THREE.Group()
    const baseY = bodyTop - WALL - SLOT_H * (i + 0.5)
    drawer.position.y = baseY
    group.add(drawer)

    const frontMaterial = track(new THREE.MeshPhysicalMaterial({ color: FRONT_COLOR.clone(), roughness: 0.35, metalness: 0.05, clearcoat: 0.6 }))
    addBox(drawerW, FRONT_H, 0.1, frontMaterial, 0, 0, frontZ, drawer, true)

    const pull = new THREE.Mesh(pullGeometry, chromeMaterial)
    pull.rotation.z = Math.PI / 2
    pull.position.set(0, 0, frontZ + 0.13)
    drawer.add(pull)
    for (const x of [-0.4, 0.4]) {
      const post = new THREE.Mesh(postGeometry, chromeMaterial)
      post.rotation.x = Math.PI / 2
      post.position.set(x, 0, frontZ + 0.08)
      drawer.add(post)
    }

    const trayZ = frontZ - 0.05 - trayD / 2
    addBox(drawerW - 0.04, 0.03, trayD, trayMaterial, 0, -FRONT_H / 2 + 0.03, trayZ, drawer)
    addBox(0.03, 0.28, trayD, trayMaterial, -drawerW / 2 + 0.03, -FRONT_H / 2 + 0.16, trayZ, drawer)
    addBox(0.03, 0.28, trayD, trayMaterial, drawerW / 2 - 0.03, -FRONT_H / 2 + 0.16, trayZ, drawer)
    addBox(drawerW - 0.04, 0.28, 0.03, trayMaterial, 0, -FRONT_H / 2 + 0.16, frontZ - 0.05 - trayD, drawer)

    gearSets[i % gearSets.length](drawer)

    drawers.push({ group: drawer, frontMaterial, progress: 0 })
  }

  const groundGeometry = track(new THREE.PlaneGeometry(20, 20))
  const groundMaterial = track(new THREE.ShadowMaterial({ opacity: 0.12 }))
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -bodyTop - 0.01
  ground.receiveShadow = true
  scene.add(ground)

  const fitRadius = Math.hypot(BODY_W / 2, bodyTop + 0.5, BODY_D / 2 + PULL / 2)

  function resize() {
    const width = Math.max(container.clientWidth, 1)
    const height = Math.max(container.clientHeight, 1)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    const vfov = THREE.MathUtils.degToRad(camera.fov)
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect)
    const distance = (fitRadius / Math.sin(Math.min(vfov, hfov) / 2)) * 0.86
    camera.position.copy(cameraDir).multiplyScalar(distance).add(target)
    camera.lookAt(target)
    camera.updateProjectionMatrix()
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  resize()

  let active = 0
  let running = false
  let frame = 0
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  const clock = new THREE.Clock()

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

  function tick() {
    frame = 0
    const dt = Math.min(clock.getDelta(), 0.05)
    const t = clock.elapsedTime
    const ease = reducedMotion ? 1 : 1 - Math.exp(-dt * 6)

    pointer.x += (pointer.tx - pointer.x) * ease
    pointer.y += (pointer.ty - pointer.y) * ease
    group.rotation.y = reducedMotion ? 0 : Math.sin(t * 0.3) * 0.1 + pointer.x * 0.2
    group.rotation.x = reducedMotion ? 0 : pointer.y * 0.05

    drawers.forEach((drawer, i) => {
      const goal = i === active ? 1 : 0
      drawer.progress += (goal - drawer.progress) * ease
      drawer.group.position.z = drawer.progress * PULL
      drawer.frontMaterial.color.copy(FRONT_COLOR).lerp(ACTIVE_COLOR, drawer.progress * 0.9)
    })

    renderer.render(scene, camera)
    if (!container.dataset.ready) container.dataset.ready = 'true'
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
