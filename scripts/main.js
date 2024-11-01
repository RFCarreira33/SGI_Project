import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as SGI_Example from "./example_scene.min.js";
import { ANIMATION_NAMES, AnimationsMap, PlayAnimation } from "./helpers.js";
import { TEXTURES_PATH } from "./helpers.js";

// Model parts
let suporte, lampada_cilindrica, lampada_esferica, abajurMesh;

// Environment
let mixer, scene, renderer, camera, controls, canvas, textureLoader;
textureLoader = new THREE.TextureLoader();

// Constants
const cor_default = new THREE.Color(0xffffff);
const steel_texture = textureLoader.load(TEXTURES_PATH + "/steel.png");

// Interactions buttons
const abajur_btn = document.getElementById("abajur-btn");
const longArm_btn = document.getElementById("longArm-btn");
const shortArm_btn = document.getElementById("shortArm-btn");
const support_btn = document.getElementById("support-btn");
const armToAbajur_btn = document.getElementById("armToAbajur-btn");
const color_picker = document.getElementById("color-picker");

const test_btn = document.getElementById("test");
const details_component = document.getElementById("details-component");
const index_component = document.getElementById("index-component");

if (test_btn !== null) {
  test_btn.addEventListener("click", (_) => {
    index_component.classList.toggle("d-none");
    details_component.classList.toggle("d-none");
  });
}

abajur_btn.addEventListener("change", (e) => {
  if (!mixer) {
    return;
  }

  const name =
    e.target.value > 0
      ? ANIMATION_NAMES.ARM_TO_ABAJUR_F
      : ANIMATION_NAMES.ARM_TO_ABAJUR_B;
  let animation = AnimationsMap.get(name);
  animation.state = PlayAnimation(animation.animation, animation.state);
});

longArm_btn.addEventListener("change", (e) => {
  if (!mixer) {
    return;
  }

  const name =
    e.target.value > 0
      ? ANIMATION_NAMES.LONG_ARM_F
      : ANIMATION_NAMES.LONG_ARM_B;
  let animation = AnimationsMap.get(name);
  animation.state = PlayAnimation(animation.animation, animation.state);
});

shortArm_btn.addEventListener("change", (e) => {
  if (!mixer) {
    return;
  }

  const name =
    e.target.value > 0
      ? ANIMATION_NAMES.SHORT_ARM_F
      : ANIMATION_NAMES.SHORT_ARM_B;
  let animation = AnimationsMap.get(name);
  animation.state = PlayAnimation(animation.animation, animation.state);
});

support_btn.addEventListener("change", (e) => {
  if (!mixer) {
    return;
  }

  const name =
    e.target.value > 0 ? ANIMATION_NAMES.SUPORT_L : ANIMATION_NAMES.SUPORT_R;
  let animation = AnimationsMap.get(name);
  animation.state = PlayAnimation(animation.animation, animation.state);
});

armToAbajur_btn.addEventListener("change", (e) => {
  if (!mixer) {
    return;
  }

  const name =
    e.target.value > 0 ? ANIMATION_NAMES.SUPORT_L : ANIMATION_NAMES.SUPORT_R;
  let animation = AnimationsMap.get(name);
  animation.state = PlayAnimation(animation.animation, animation.state);
});

color_picker.addEventListener("change", (event) => {
  // create material from color
  const color = new THREE.Color(event.target.value);
  abajurMesh.material.color = color;
});

// Criar cena do threeJS e expor na consola
scene = new THREE.Scene();
window.cena = scene;

// Criar Renderer
canvas = document.getElementById("three-canvas");
renderer = new THREE.WebGLRenderer({ canvas });
renderer.shadowMap.enabled = true;
renderer.setSize(canvas.clientWidth * 2, canvas.clientHeight * 2);
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
// var minPan = new THREE.Vector3( - 2, - 2, - 2 );
// var maxPan = new THREE.Vector3( 2, 2, 2 );
// controls.target.clamp(minPan, maxPan);
camera.position.x = -5;
camera.position.y = 8;
camera.position.z = 13;
camera.lookAt(0, 0, 0);

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
    abajurMesh = scene.getObjectByName("AbajurMesh");

    gltf.scene.traverse(function (x) {
      if (x.isMesh) {
        x.material = new THREE.MeshPhongMaterial({
          color: 0xede5dd,
          specular: 0x373737,
          shininess: 80,
          map: steel_texture,
          side: THREE.DoubleSide,
        });

        abajurMesh.material.map = steel_texture;
        x.castShadow = true;
        x.receiveShadow = true;
      }
      cena.add(gltf.scene);
    });

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
