attribute vec4 position;
uniform vec2 mouse;

void main(void) {
    gl_Position = position;

    gl_PointSize = 20.;
    vec2 mouseScreen = (mouse - vec2(200.0, 200.0)) / 200.0;
    mouseScreen.y = - mouseScreen.y;
    gl_Position = vec4(mouseScreen, 0.0, 1.0);
}