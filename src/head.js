// 3D head in the intro of index.html.
// Source file. The page loads the bundled copy in assets/head.js, which includes three.js,
// so nothing is fetched from another site. Rebuild after editing:
//   npx esbuild src/head.js --bundle --minify --format=iife --target=es2018 --outfile=assets/head.js
// If WebGL or the model is unavailable, the figure is removed and the text takes the full width.
import {
  Box3, DirectionalLight, Group, HemisphereLight, MathUtils, PerspectiveCamera, Scene, SRGBColorSpace, Vector3, WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const figure = document.getElementById('head');
const canvas = document.getElementById('head-canvas');

function giveUp(reason) {
  if (window.console) console.warn('3D head not shown:', reason);
  if (figure && figure.parentNode) {
    figure.parentNode.style.gridTemplateAreas = '"name name" "text text"';
    figure.parentNode.removeChild(figure);
  }
}

async function start() {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const camera = new PerspectiveCamera(28, 1, 0.1, 100);

  // Soft front light, with the two line colors of the page as rim lights.
  scene.add(new HemisphereLight(0xffffff, 0x2a2233, 1.6));
  const key = new DirectionalLight(0xfff3e2, 1.6);
  key.position.set(1.5, 2, 4);
  scene.add(key);
  const amber = new DirectionalLight(0xf5b83d, 1.3);
  amber.position.set(-4, 1, -1.5);
  scene.add(amber);
  const mint = new DirectionalLight(0x5eddc1, 1.3);
  mint.position.set(4, 0.5, -1.5);
  scene.add(mint);

  const gltf = await new GLTFLoader().loadAsync('models/head.glb');
  const model = gltf.scene;
  const box = new Box3().setFromObject(model);
  const size = box.getSize(new Vector3());
  model.position.sub(box.getCenter(new Vector3()));
  const pivot = new Group();
  pivot.add(model);
  scene.add(pivot);
  const radius = Math.max(size.x, size.y, size.z) / 2;
  camera.position.set(0, 0, (radius / Math.tan(MathUtils.degToRad(14))) * 1.08);

  const still = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  let yaw = 0, pitch = 0, clock = 0, last = 0, dragging = false, visible = true, frame = 0;

  function render() {
    pivot.rotation.set(pitch, yaw + (still ? 0 : Math.sin(clock * 0.6) * 0.55), 0);
    renderer.render(scene, camera);
  }
  function tick(now) {
    frame = 0;
    if (!dragging) clock += Math.min(0.05, (now - last) / 1000);
    last = now;
    render();
    schedule();
  }
  function schedule() {
    if (!frame && visible && !document.hidden && !still) frame = requestAnimationFrame(tick);
  }
  function resize() {
    const w = figure.clientWidth, h = figure.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    render();
  }

  let px = 0, py = 0;
  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    px = e.clientX;
    py = e.clientY;
    if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    yaw += (e.clientX - px) * 0.01;
    pitch = Math.max(-0.5, Math.min(0.5, pitch + (e.clientY - py) * 0.006));
    px = e.clientX;
    py = e.clientY;
    render();
  });
  const release = () => { dragging = false; };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);

  if (window.ResizeObserver) new ResizeObserver(resize).observe(figure);
  else window.addEventListener('resize', resize);
  if (window.IntersectionObserver) {
    new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; schedule(); }).observe(figure);
  }
  document.addEventListener('visibilitychange', schedule);
  resize();
  last = performance.now();
  schedule();
}

if (figure && canvas) start().catch(giveUp);
