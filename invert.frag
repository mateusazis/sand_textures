precision mediump float;
uniform sampler2D sampler;
varying vec2 vUV;

void main(void) {
    vec2 uv = vUV;
    //uv.y = 1.0 - uv.y;
    vec4 color = texture2D(sampler, uv);
    gl_FragColor = color;
}