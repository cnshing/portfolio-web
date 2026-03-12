/**
 * GLSL shader equivalent of https://www.youtube.com/watch?v=XUtIzRkaQOE. Coupled with `vertexShader()`.
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
 *
 * @returns {string} GLSL fragment shader source.
 */
export const fragmentShader =  /* glsl */ `
varying float vReveal;
uniform float fadeBias;
uniform float glowStrength;

void main() {

    float d = max(length(gl_PointCoord - 0.5), 0.0001);
    float alpha = clamp(fadeBias / d - glowStrength, 0.0, 1.0);
    alpha *= vReveal;
    csm_DiffuseColor = vec4(vColor, alpha);

}
`;



/**
 * Vertex shader that handles initial appear animation of the starfield.
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
 *
 * @returns {string} GLSL vertex shader source.
 */
export const vertexShader =  /* language:glsl glsl */ `
uniform float time;
uniform float revealSpeed;
uniform float revealWidth;

varying float vReveal;

void main() {

    float dist = length(position - cameraPosition);

    float radius = time * revealSpeed;

    float reveal = 1.0 - smoothstep(radius - revealWidth, radius, dist);

    vReveal = reveal;

    float baseSize = csm_PointSize;
    csm_PointSize = baseSize * vReveal;

}
`