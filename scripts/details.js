import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as SGI_Example from "./example_scene.min.js";
import { AnimationsMap, PlayAnimation } from "./common.js";
import { TEXTURES_PATH } from "./common.js";

// Model parts
let suporte, lampada_cilindrica, lampada_esferica, abajurMesh;

// Environment
let mixer, scene, renderer, camera, controls, canvas, textureLoader;
textureLoader = new THREE.TextureLoader();

// Constants
const cor_default = new THREE.Color(0xffffff);

// Load textures
const texture_map = new Map();
texture_map.set("fabric", textureLoader.load(TEXTURES_PATH + "/fabric.png"));
texture_map.set("ugly-fabric", textureLoader.load(TEXTURES_PATH + "/ugly-fabric.png"));
texture_map.set("couch-fabric", textureLoader.load(TEXTURES_PATH + "/couch-fabric.png"));
texture_map.set("picnic-fabric", textureLoader.load(TEXTURES_PATH + "/picnic-fabric.png"));
texture_map.set("is-this-even-fabric", textureLoader.load(TEXTURES_PATH + "/is-this-even-fabric.png"));
texture_map.set("steel", textureLoader.load(TEXTURES_PATH + "/steel.png"));


// Interactions buttons
const animation_select = $("#animation-select");
const play_button = $("#play-btn");
const texture_btns = $(".texture-btn");

play_button.on("click", () => {
  PlayAnimation(animation_select.val());
});

texture_btns.on("click", (e) => {
  const material = $(e.target).attr("name");
  abajurMesh.material.map = texture_map.get(material);
});

// color_picker.on("change", (event) => {
//   // create material from color
//   const color = new THREE.Color(event.target.value);
//   abajurMesh.material.color = color;
// });

// Criar cena do threeJS e expor na consola
scene = new THREE.Scene();
window.cena = scene;

// Criar Renderer
canvas = document.getElementById("three-canvas");
renderer = new THREE.WebGLRenderer({ canvas });
renderer.shadowMap.enabled = true;
renderer.setSize(canvas.clientWidth * 1.2, canvas.clientHeight * 1.2, false);
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
    const steel_texture = texture_map.get("steel");

    mixer = new THREE.AnimationMixer(gltf.scene);

    gltf.animations.forEach((clip) => {
      const name = clip.name.slice(0, -1);

      if (!AnimationsMap.has(name)) AnimationsMap.set(name, []);
      AnimationsMap.get(name).push(mixer.clipAction(clip));
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
