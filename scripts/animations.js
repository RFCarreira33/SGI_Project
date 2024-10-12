import * as THREE from "three";

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
 * @typedef {Object} AnimationState
 * @property {THREE.AnimationAction} animation - The THREE.js animation action.
 * @property {boolean} state - The state of the animation (true/false).
 */

/**
 * @type {Map<string, AnimationState>}
 */
export let AnimationsMap = new Map();

/**
 * Plays an animation based on the provided state.
 *
 * @param {THREE.AnimationAction} animation - The THREE.js animation action that you want to play.
 * @param {boolean} [state=undefined] - Optional. Determines the playback mode:
 *  - `true`: Plays the animation in reverse and stops when finished (LoopOnce, timeScale -1).
 *  - `false`: Resets and plays the animation in ping-pong mode (LoopPingPong, timeScale 1).
 *  - `undefined`: Defaults to LoopPingPong behavior with repetitions.
 *
 * @returns {boolean|undefined} - The current state of the animation after execution.
 *  - `undefined` if no state is provided.
 */
export function PlayAnimation(animation, state = undefined) {
  if (state === undefined) {
    animation.reset();
    animation.setLoop(THREE.LoopPingPong);
    animation.repetitions = 2;
  } else {
    animation.setLoop(THREE.LoopOnce);
    animation.clampWhenFinished = true;
    animation.timeScale = state ? -1 : 1;
    animation.paused = false;
  }

  animation.play();

  return !state;
}
