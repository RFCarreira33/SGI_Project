import * as THREE from "three";

export const TEXTURES_PATH = "/assets/textures";
export const PRODUCTS_PATH = "/assets/products";
const SPEED_MULTIPLIER = 0.5;

export const ANIMATION_NAMES = Object.freeze({
  ABAJUR_R: "AbajurJointR",
  ABAJUR_L: "AbajurJointL",
  ARM_TO_ABAJUR_B: "ArmToAbajurB",
  ARM_TO_ABAJUR_F: "ArmToAbajurF",
  LONG_ARM_F: "LongArmF",
  LONG_ARM_B: "LongArmB",
  SHORT_ARM_F: "ShortArmF",
  SHORT_ARM_B: "ShortArmB",
  SUPORT_L: "SuportJointL",
  SUPORT_R: "SuportJointR",
});

/**
 * Map animation name to their respective THREE.js animation action.
 * Both forward and backward animations are stored in an array.
 * @type {Map<string, [THREE.AnimationAction]>}
 */
export const AnimationsMap = new Map();

/**
 * Plays an animation based on the provided state.
 *
 * @param {string} animation_enum - The animation to play.
 */
export function PlayAnimation(animation_enum) {
  const animations_array = AnimationsMap.get(animation_enum);

  if (animations_array === undefined) {
    console.error(`Animation ${animation_enum} not found.`);
    return;
  }

  const f_anim = animations_array[0];
  const s_anim = animations_array[1];

  f_anim.reset();
  f_anim.speed = SPEED_MULTIPLIER;
  f_anim.setLoop(THREE.LoopPingPong);
  f_anim.repetitions = 2;
  f_anim.play();

  setTimeout(() => {
    s_anim.reset();
    s_anim.speed = SPEED_MULTIPLIER;
    s_anim.setLoop(THREE.LoopPingPong);
    s_anim.repetitions = 2;
    s_anim.play();
  }, f_anim.getClip().duration * 2000);
}

/*
 * React aproach to load components
 */

const navbar = $("#navbar-component");
const footer = $("#footer-component");

if (navbar !== null) {
  navbar.load("components/navbar.html");
}

if (footer !== null) {
  footer.load("components/footer.html");
}
