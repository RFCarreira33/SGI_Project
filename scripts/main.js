import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as SGI_Example from "./example_scene.min.js";
import { ANIMATION_NAMES, AnimationsMap, PlayAnimation } from "./animations.js";

// Model parts
let suporte, lampada_cilindrica, lampada_esferica;

// Environment
let mixer, scene, renderer, camera, controls, canvas;

// Constants
const cor_default = new THREE.Color("lightblue");
const animate_btn = document.getElementById("animate-btn");
const halfAnimate_btn = document.getElementById("half-animate-btn");

animate_btn.addEventListener("click", () => {
  if (!mixer) {
    return;
  }

  PlayAnimation(AnimationsMap.get(ANIMATION_NAMES.ABAJUR_L).animation);
});

halfAnimate_btn.addEventListener("click", () => {
  if (!mixer) {
    return;
  }

  let animation = AnimationsMap.get(ANIMATION_NAMES.ABAJUR_R);

  animation.state = PlayAnimation(animation.animation, animation.state);
});

// Criar cena do threeJS e expor na consola
scene = new THREE.Scene();
window.cena = scene;

// Criar Renderer
canvas = document.getElementById("three-canvas");
renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
// renderer.setSize(window.innerWidth, window.innerHeight)
// document.body.appendChild(renderer.domElement)

// Criar e preparar camara
camera = new THREE.PerspectiveCamera(
  60,
  canvas.clientWidth / canvas.clientHeight,
  1,
  1000,
);
controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(-6, 2, 8);
camera.lookAt(0, -1, 2.5);
controls.target.set(0, -1, 2.5);

// Carregar modelo, ajustar luzes, e preparar cena exemplo
new GLTFLoader().load(
  "models/ApliqueArticuladoPecaUnica.gltf",
  function (gltf) {
    // informacao: 1 unidade = 0.1m = 1 dm = 10 cm

    scene.add(gltf.scene);

    mixer = new THREE.AnimationMixer(gltf.scene);
    const clips = gltf.animations;

    // ease of use and state management
    clips.forEach((clip) => {
      AnimationsMap.set(clip.name, {
        animation: mixer.clipAction(clip),
        state: false,
      });
    });

    suporte = scene.getObjectByName("Support");
    console.log(suporte);

    // Configurar das fontes luminosas do modelo
    const ponto_luminoso = scene.getObjectByName("Point");
    const cone_luminoso = scene.getObjectByName("Spot");
    ponto_luminoso.intensity = 3;
    ponto_luminoso.distance = 1.25; // 0.125 metros
    cone_luminoso.intensity = 16;
    cone_luminoso.distance = 10; // 1 metro; ajustar consoante o pretendido
    ponto_luminoso.color = cone_luminoso.color = cor_default; // alterar cor da luz

    // Obter os dois tipos de lampada e esconder a redonda
    lampada_cilindrica = scene.getObjectByName("C_LightBulb");
    lampada_esferica = scene.getObjectByName("S_LightBulb");
    lampada_esferica.visible = false;

    // Ajustar a cor da lampada visivel
    lampada_cilindrica.children[0].material.emissive = cor_default; // alterar cor da lampada

    // Criar cena exemplo. Pode ser removida/substituida
    SGI_Example.setupMockupScene(scene, suporte);
  },
);

// Renderizar/Animar
{
  let delta = 0;
  let relogio = new THREE.Clock();
  let latencia_minima = 1 / 60; // para 60 frames por segundo
  animar();
  function animar() {
    requestAnimationFrame(animar);
    delta += relogio.getDelta();
    if (mixer) mixer.update(delta);

    if (delta < latencia_minima) return;

    renderer.render(scene, camera);

    delta = delta % latencia_minima;
  }
}
