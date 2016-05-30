# three-ensemble-average-pass
EnsembleAveragePass for three.js and three-effectcomposer.

# Usage

```javascript
const THREE = require('three')
const EffectComposer = require('three-effectcomposer')(THREE)
const EnsembleAveragePass = require('three-ensemble-average-pass')

const camera = initCamera()
const scenes = [
  createScene1(),
  createScene2(),
  createScene3()
]

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
scenes.forEach((scene, i) => {
  const repeat = scenes.length
  const effect = new EnsembleAveragePass(scene, camera, repeat)
  if (i === repeat - 1) {
    effect.renderToScreen = true
  }
  composer.addPass(effect)
})

const render = () => {
  window.requestAnimationFrame(render)
  composer.render()
}

render()
```

For more detail, see demo.js.
