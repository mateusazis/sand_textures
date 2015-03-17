precision mediump float;

void main(void) {
    vec2 coord = gl_PointCoord;
    coord.x = mix(-1.0, 1.0, coord.x);
    coord.y = mix(-1.0, 1.0, coord.y);
    float inside = float(length(coord) <= 1.);
    gl_FragColor = vec4(.0, 0., .0, 1.0);
}