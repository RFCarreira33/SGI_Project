import * as THREE from "three";
import { TEXTURES_PATH } from "./common.js";

export function SetupScene(scene, textureLoader, mainObj) {
  const wallTexture = textureLoader.load(
    TEXTURES_PATH + "/wall.jpg",
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
    },
  );

  const floorTexture = textureLoader.load(
    TEXTURES_PATH + "/floor.jpg",
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
    },
  );

  scene.background = new THREE.Color("grey");

  let ground = new THREE.PlaneGeometry(45, 35),
    s = new THREE.MeshPhongMaterial({
      map: floorTexture,
      shininess: 100,
      specular: 0x111111,
    }),
    d = new THREE.Mesh(ground, s);

  d.rotation.x = -Math.PI / 2;
  d.position.set(-4, 0, 3);
  scene.add(d);

  let wall = new THREE.PlaneGeometry(45, 40),
    w = new THREE.MeshPhongMaterial({
      map: wallTexture,
      shininess: 100,
      specular: 0x111111,
    }),
    c = new THREE.Mesh(wall, w);

  c.position.set(-2, 10, -10);
  scene.add(c);

  let wall2 = new THREE.PlaneGeometry(35, 40),
    w2 = new THREE.MeshStandardMaterial({ map: wallTexture }),
    c2 = new THREE.Mesh(wall2, w2);

  c2.rotation.y = -Math.PI / 2;
  c2.position.set(10, 10, 4);
  scene.add(c2);

  let wall3 = new THREE.PlaneGeometry(35, 40),
    w3 = new THREE.MeshStandardMaterial({ map: wallTexture }),
    c3 = new THREE.Mesh(wall3, w3);

  c3.rotation.y = Math.PI / 2;
  c3.position.set(-24, 10, 0);
  scene.add(c3);

  mainObj.rotation.z = Math.PI / 4;

  var ambientLight = new THREE.AmbientLight(0x333333);

  var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  cena.add(ambientLight, hemiLight);

  var spotLight1 = new THREE.SpotLight(0x7a7572);
  spotLight1.position.set(100, 200, 500);

  var spotLight2 = new THREE.SpotLight(0x7a7572);
  spotLight2.position.set(-100, -200, -500);

  var dirLight = new THREE.DirectionalLight(0xbeb7b1);
  dirLight.position.set(500, 0, 400);

  scene.add(spotLight1, spotLight2, dirLight);
}
