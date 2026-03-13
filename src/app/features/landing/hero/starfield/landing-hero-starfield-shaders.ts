import {
  cameraPosition,
  smoothstep,
  oneMinus,
  time,
  vec3,
  mul,
  rotate,
  uv,
  clamp,
  float,
  max,
  dot,
  fwidth,
  pow,
  exp,
} from 'three/tsl';

/**
 * TSL node function for fragment shader.
 * Equivalent of https://www.youtube.com/watch?v=XUtIzRkaQOE.
 *
 * @param {number} [fadeBias=0.1]
 * Controls how quickly the particle fades from the center toward the edge.
 * Higher values make the particle brighter and extend the fade radius,
 * while lower values produce a sharper falloff.
 *
 * @param {number} [glowStrength=0.2]
 * Subtracted from the radial fade to control the softness of the glow.
 * Higher values reduce the visible glow and shrink the particle, while
 * lower values produce a softer and larger glow.
 */
export function createFragmentNode(
  fadeBias: any,
  glowStrength: any,
  vReveal: any,
) {


  const centered = uv().mul(2.0).sub(1.0);

  const r = dot(centered, centered);
  const delta = fwidth(r);

  const d = max(r.sqrt(), float(0.0001));


  const circleMask = float(1.0).sub(
    smoothstep(
      float(1.0).sub(delta),
      float(1.0).add(delta),
      d
    )
  );

  const alpha = clamp(
    fadeBias.div(d).sub(glowStrength),
    0.0,
    1.0
  ).mul(vReveal);

 const falloff = exp(r.mul(-4.0))
  return pow(alpha, 2)
    .mul(pow(circleMask, 8)).mul(falloff)
}

/**
 * TSL node function for applying rotation to position based on time and spin velocities.
 * Uses the rotate() TSL function with time instead of manual rotation updates.
 *
 * @param spinXUniform Rotation velocity around X axis
 * @param spinYUniform Rotation velocity around Y axis
 * @param spinZUniform Rotation velocity around Z axis
 * @returns Rotated position node
 */
export function createRotationNode(
  spinXUniform: any,
  spinYUniform: any,
  spinZUniform: any,
  position: any
) {
  // Create rotation vector: spin velocities * time
  const rotation = vec3(
    mul(time, spinXUniform),
    mul(time, spinYUniform),
    mul(time, spinZUniform)
  );

  // Apply rotation to positionLocal using the rotate() TSL function
  return rotate(position, rotation);
}

/**
 * TSL node function for vertex shader that handles initial appear animation of the starfield.
 * Creates an expanding reveal sphere that grows from the camera position,
 * revealing stars as it passes over them with a smooth transition.
 *
 * @param {number} time
 * Accumulated elapsed time in seconds. Used to calculate the current
 * radius of the reveal sphere.
 *
 * @param {number} revealSpeed
 * The rate at which the reveal sphere expands outward from the camera
 * (in units per second).
 *
 * @param {number} revealWidth
 * The thickness of the reveal transition band (in same units as fieldRadius).
 * Stars within this band smoothly grow from invisible to full size.
 * Controls how long each individual star takes to fully appear.
 */
export function createVertexRevealNode(
  revealSpeedUniform: any,
  revealWidthUniform: any,
  position: any
) {

  // expanding sphere radius
  const radius = time.mul(revealSpeedUniform);

  // distance from camera using rotated position
  const dist = position.sub(cameraPosition).length();

  // reveal factor
  const reveal = oneMinus(
    smoothstep(
      radius.sub(revealWidthUniform),
      radius,
      dist
    )
  );

  return reveal;

}


/**  const centered = uv().mul(2.0).sub(1.0);   // same as 2*gl_PointCoord - 1

  const r = dot(centered, centered);         // radius squared
  const delta = fwidth(r);                   // derivative for AA

  const circleMask = float(1.0).sub(
    smoothstep(
      float(1.0).sub(delta),
      float(1.0).add(delta),
      r
    )
  );

  const d = max(centered.length(), float(0.0001));

  const alpha = clamp(
    fadeBias.div(d).sub(glowStrength),
    0.0,
    1.0
  ).mul(vReveal);

  const flicker = sin(
    time.mul(6.0).add(d.mul(20.0))
  ).mul(0.05).add(1.0);

  return pow(alpha, 2)
    .mul(circleMask)
    .mul(flicker);
 */