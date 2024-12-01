import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  AnimationsMap,
  PlayAnimation,
  TEXTURE_NAMES,
  TexturesMap,
} from "./common.js";
import { TEXTURES_PATH } from "./common.js";
import { SetupScene } from "./scene.js";

// Model parts
let suporte, lampada_cilindrica, lampada_esferica, abajurMesh;

// Environment
let mixer, scene, renderer, camera, controls, canvas, textureLoader;
textureLoader = new THREE.TextureLoader();

// Constants
const cor_default = new THREE.Color(0xffffff);

// Interactions buttons
const animation_select = $("#animation-select");
const play_button = $("#play-btn");
const texture_btns = $(".texture-btn");

play_button.on("click", () => {
  PlayAnimation(animation_select.val());
});

texture_btns.on("click", (e) => {
  const btn = $(e.target);
  const material = btn.attr("name");
  abajurMesh.material.map = TexturesMap.get(material);
  texture_btns.removeClass("border border-secondary");
  btn.addClass("border border-secondary");
});

scene = new THREE.Scene();
window.cena = scene;

canvas = document.getElementById("three-canvas");
renderer = new THREE.WebGLRenderer({ canvas });
renderer.shadowMap.enabled = true;
renderer.setSize(canvas.clientWidth * 1.1, canvas.clientHeight * 1.2, false);

// Criar e preparar camara
camera = new THREE.PerspectiveCamera(
  55,
  canvas.clientWidth / canvas.clientHeight,
  1,
  1000,
);

controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(-5, 8, 11);
controls.target.set(0, 4, 0);

// setting camera limits
controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 2;

// Limit horizontal rotation
controls.minAzimuthAngle = -Math.PI / 2.5;
controls.maxAzimuthAngle = Math.PI / 5;

// Limit zoom/dolly
controls.minDistance = 5;
controls.maxDistance = 16;

// Enable damping for smoother control
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.update();

// Carregar modelo, ajustar luzes, e preparar cena exemplo
new GLTFLoader().load(
  "models/ApliqueArticuladoPecaUnica.gltf",
  function (gltf) {
    scene.add(gltf.scene);

    for (const texture_name of Object.values(TEXTURE_NAMES)) {
      TexturesMap.set(
        texture_name,
        textureLoader.load(
          TEXTURES_PATH + `/${texture_name}.png`,
          (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2);
          },
        ),
      );
    }

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
        x.castShadow = true;
        x.receiveShadow = true;
        x.material = new THREE.MeshPhongMaterial({
          color: 0xede5dd,
          specular: 0x373737,
          shininess: 80,
        });

        switch (x.name) {
          case "AbajurMesh":
            x.material.map = TexturesMap.get("fabric");
            break;
          case "AbajurMesh_1":
            x.material.map = TexturesMap.get("steel_light");
            break;
          default:
            x.material.map = TexturesMap.get("steel_dark");
            break;
        }
      }
      cena.add(gltf.scene);
    });

    // Configurar das fontes luminosas do modelo
    const ponto_luminoso = scene.getObjectByName("Point");
    const cone_luminoso = scene.getObjectByName("Spot");
    ponto_luminoso.intensity = 3;
    ponto_luminoso.distance = 1.25; // 0.125 metros
    cone_luminoso.intensity = 16;
    cone_luminoso.distance = 25; // 1 metro; ajustar consoante o pretendido
    ponto_luminoso.color = cone_luminoso.color = cor_default; // alterar cor da luz

    // Obter os dois tipos de lampada e esconder a redonda
    lampada_cilindrica = scene.getObjectByName("C_LightBulb");
    lampada_esferica = scene.getObjectByName("S_LightBulb");
    lampada_esferica.visible = false;

    // Ajustar a cor da lampada visivel
    lampada_cilindrica.children[0].material.emissive = cor_default; // alterar cor da lampada
    SetupScene(scene, textureLoader, suporte);
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
