precision mediump float;
uniform sampler2D sampler;
varying vec2 vUV;

bool empty(vec4 color){
    return color.rgb == vec3(.0);
}

void main(void) {
    vec4 color = texture2D(sampler, vUV);
    vec2 uvBelow = vUV - vec2(0, 1.0/400.0);
    vec2 uvAbove = vUV + vec2(0, 1.0/400.0);
    vec4 colorBelow = texture2D(sampler, uvBelow);
    vec4 colorAbove = texture2D(sampler, uvAbove);
    if(empty(color))
        color = colorAbove;
    else if(empty(colorBelow))
        color.rgb = vec3(.0);
        // color.r = 1.0;
        // color.a = .0;

    // color = colorAbove;
    gl_FragColor = color;
    //gl_FragColor = vec4(vUV, 0., 1.);
}