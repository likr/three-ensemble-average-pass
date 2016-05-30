const THREE = require('three')
const EffectComposer = require('three-effectcomposer')(THREE)
const EnsembleAveragePass = require('./index.js')

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const r = 400
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.z = r

const composer = new EffectComposer(renderer)
composer.addPass(new EffectComposer.ShaderPass({
  vertexShader: `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    void main() {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
  `
}))

const repeat = 10
for (let j = 0; j < repeat; ++j) {
  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x000000, 1, 1000)

  const object = new THREE.Object3D()
  scene.add(object)

  const geometry = new THREE.SphereGeometry(1, 4, 4)
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  })

  for (let i = 0; i < 100; i++) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()
    mesh.position.multiplyScalar(Math.random() * 400)
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2)
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50
    object.add(mesh)
  }

  scene.add(new THREE.AmbientLight(0x222222))

  const light = new THREE.DirectionalLight(0xffffff)
  light.position.set(1, 1, 1)
  scene.add(light)

  const effect = new EnsembleAveragePass(scene, camera, repeat)
  if (j === repeat - 1) {
    effect.renderToScreen = true
  }
  composer.addPass(effect)
}

const start = new Date()
const render = () => {
  window.requestAnimationFrame(render)
  const seconds = new Date() - start
  const theta = Math.PI * seconds / 2500
  camera.position.z = r * Math.cos(theta)
  camera.position.x = r * Math.sin(theta)
  camera.lookAt({x: 0, y: 0, z: 0})
  composer.render()
}

render()
