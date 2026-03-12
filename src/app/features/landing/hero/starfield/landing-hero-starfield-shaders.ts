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
export const fragmentShader = (fadeBias: number= 0.1, glowStrength: number = 0.2) => /* glsl */ `
varying float vReveal;
void main() {

    float d = max(length(gl_PointCoord - 0.5), 0.0001);
    float alpha = clamp(${fadeBias} / d - ${glowStrength}, 0.0, 1.0);
    alpha *= vReveal;
    csm_DiffuseColor = vec4(vColor, alpha);

}
`;



/**
 * Vertex shader that handles initial appear animation of the starfield.
 *
 * @returns {string}
 */
export const vertexShader = () => /* language:glsl glsl */ `
uniform float time;
varying float vReveal;

void main() {

    float dist = length(position - cameraPosition);

    float radius = time * 20.0;

    float reveal = 1.0 - smoothstep(radius - 50.0, radius, dist);

    vReveal = reveal;

    float baseSize = csm_PointSize;
    csm_PointSize = baseSize * vReveal;
}
`