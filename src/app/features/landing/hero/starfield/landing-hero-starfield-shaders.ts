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
  reciprocal,
  hash,
  acos,
  cos,
  sin,
  TWO_PI,
  int,
  floor,
} from 'three/tsl';
import type { UniformNode, Node, IndexNode, UniformArrayNode} from 'three/webgpu';

/**
 * TSL node function for fragment shader.
 * Based on https://www.youtube.com/watch?v=XUtIzRkaQOE and the points material shader from https://github.com/angular-threejs/angular-three/blob/main/libs/soba/shaders/src/lib/point-material.ts.
 *
 * @export
 * @param {UniformNode<number>} fadeBias Controls how quickly the particle fades from the center toward the edge.
 * Higher values slows and reduces the overall fade,
 * while lower values produce a sharper falloff and creating an visual effect of shrinking the particle core.
 * @param {UniformNode<number>} glowStrength Subtracted from the radial fade to control the softness of the glow.
 * Higher values increases the glow radius,
 * lower values makes the glow shorter.
 * @param {UniformNode<number>} offsetFactor Multiplies the intermediary star shader
 * @returns {*}
 */
export function createGlowOpacityNode(
  fadeBias: UniformNode<number>,
  glowStrength: UniformNode<number>,
  offsetFactor: Node,
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
    fadeBias.div(d).sub(reciprocal(glowStrength)),
    0.0,
    1.0
  ).mul(offsetFactor);

 const falloff = exp(r.mul(-4.0))
  return pow(alpha, 2)
    .mul(pow(circleMask, 8)).mul(falloff)
}


/**
 * TSL node function for applying rotation to position based on time and spin velocities.
 *
 *
 * @export
 * @param {UniformNode<number>} spinXUniform Rotation velocity around X axis
 * @param {UniformNode<number>} spinYUniform Rotation velocity around Y axis
 * @param {UniformNode<number>} spinZUniform Rotation velocity around Z axis
 * @param {Node} position Position of the node to rotate around from
 * @returns {*}
 */
export function createRotationNode(
  spinXUniform: UniformNode<number>,
  spinYUniform: UniformNode<number>,
  spinZUniform: UniformNode<number>,
  position: Node
) {

  const rotation = vec3(
    mul(time, spinXUniform),
    mul(time, spinYUniform),
    mul(time, spinZUniform)
  );

  return rotate(position, rotation);
}

/**
 * TSL node function for vertex shader that handles initial appear animation of the starfield.
 * Creates an expanding reveal sphere that grows from the camera position,
 * revealing stars as it passes over them with a smooth transition.
 *
 * @export
 * @param {UniformNode<number>} revealSpeedUniform The rate at which the reveal sphere expands outward from the camera
 * (in units per second).
 * @param {UniformNode<number>} revealWidthUniform The thickness of the reveal transition band (in same units as fieldRadius).
 * Stars within this band smoothly grow from invisible to full size.
 * Controls how long each individual star takes to fully appear.
 * @param {Node} origin The center position of the reveal sphere.
 * @returns {*}
 */
export function createVertexRevealNode(
  revealSpeedUniform: UniformNode<number>,
  revealWidthUniform: UniformNode<number>,
  origin: Node
) {


  const radius = time.mul(revealSpeedUniform);
  const dist = origin.sub(cameraPosition).length();
  const reveal = oneMinus(
    smoothstep(
      radius.sub(revealWidthUniform),
      radius,
      dist
    )
  );

  return reveal;

}


/**
 * Generate random various points that resemble a sphere of radius `radius`.
 *
 * @export
 * @param {UniformNode<number>} radius Radius of the sphere.
 * @param {IndexNode} index The instanceIndex.
 * @returns {*} A Position Node
 */
export function randomInSphereTSL(radius: UniformNode<number>, index: IndexNode)  {

  const r1 = hash(index);
  const r2 = hash(index.add(1.0));
  const r3 = hash(index.add(2.0));

  const theta = r1.mul(TWO_PI); // 2π
  const phi = acos(r2.mul(2.0).sub(1.0));

  const r = pow(r3, float(1.0 / 3.0)).mul(radius);

  const sinPhi = sin(phi);

  return vec3(
    r.mul(sinPhi).mul(cos(theta)),
    r.mul(sinPhi).mul(sin(theta)),
    r.mul(cos(phi))
  );
}


/**
 * Randomly selects a color from `pallete`
 *
 * @export
 * @param {IndexNode} index The instanceIndex.
 * @param {UniformArrayNode} palette An array of colors.
 * @returns {*}
 */
export function randomPaletteColorTSL(index: IndexNode, palette: UniformArrayNode) {
  const r = hash(index.add(1));
  const paletteIndex = int(floor(r.mul(int(palette.array.length))));
  return palette.element(paletteIndex).rgb
}