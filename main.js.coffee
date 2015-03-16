canvas = $("canvas")[0]

@gl = gl = canvas.getContext("webgl")
gl.clearColor(0,0,0,1)
gl.clear(gl.COLOR_BUFFER_BIT)

AMORTIZATION=0.95;
drag=false;
old_x, old_y;
dX=0, dY=0;

# mouseDown=function(e) {
#   drag=true;
#   old_x=e.pageX, old_y=e.pageY;
#   e.preventDefault();
#   return false;
# };
#
# mouseUp=function(e){
#   drag=false;
# };
#
# mouseMove=function(e) {
#   if (!drag) return false;
#   dX=(e.pageX-old_x)*Math.PI/CANVAS.width,
#     dY=(e.pageY-old_y)*Math.PI/CANVAS.height;
#   THETA+=dX;
#   PHI+=dY;
#   old_x=e.pageX, old_y=e.pageY;
#   e.preventDefault();
# };
#
# CANVAS.addEventListener("mousedown", mouseDown, false);
# CANVAS.addEventListener("mouseup", mouseUp, false);
# CANVAS.addEventListener("mouseout", mouseUp, false);
# CANVAS.addEventListener("mousemove", mouseMove, false);

# gl;
# try {
#   gl = CANVAS.getContext("experimental-webgl", {antialias: true});
# } catch (e) {
#   alert("You are not webgl compatible :(") ;
#   return false;
# }


shader_vertex_source="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
attribute vec2 uv;\n\
varying vec2 vUV;\n\
void main(void) { //pre-built function\n\
gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
vUV=uv;\n\
}";

shader_fragment_source="\n\
precision mediump float;\n\
uniform sampler2D sampler;\n\
varying vec2 vUV;\n\
\n\
\n\
void main(void) {\n\
gl_FragColor = texture2D(sampler, vUV);\n\
}";

get_shader=(source, type, typeString) ->
  shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)):
    alert("ERROR IN "+typeString+ " SHADER : " + gl.getShaderInfoLog(shader));
    return false;

  return shader;


shader_vertex=get_shader(shader_vertex_source, gl.VERTEX_SHADER, "VERTEX");
shader_fragment=get_shader(shader_fragment_source, gl.FRAGMENT_SHADER, "FRAGMENT");

SHADER_PROGRAM=gl.createProgram();
gl.attachShader(SHADER_PROGRAM, shader_vertex);
gl.attachShader(SHADER_PROGRAM, shader_fragment);

gl.linkProgram(SHADER_PROGRAM);

_Pmatrix = gl.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
_Vmatrix = gl.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
_Mmatrix = gl.getUniformLocation(SHADER_PROGRAM, "Mmatrix");

_sampler = gl.getUniformLocation(SHADER_PROGRAM, "sampler");
_uv = gl.getAttribLocation(SHADER_PROGRAM, "uv");
_position = gl.getAttribLocation(SHADER_PROGRAM, "position");

gl.enableVertexAttribArray(_uv);
gl.enableVertexAttribArray(_position);

gl.useProgram(SHADER_PROGRAM);
gl.uniform1i(_sampler, 0);

cube_vertex=[
  -1,-1,-1,    0,0,
  1,-1,-1,     1,0,
  1, 1,-1,     1,1,
  -1, 1,-1,    0,1,

  -1,-1, 1,    0,0,
  1,-1, 1,     1,0,
  1, 1, 1,     1,1,
  -1, 1, 1,    0,1,

  -1,-1,-1,    0,0,
  -1, 1,-1,    1,0,
  -1, 1, 1,    1,1,
  -1,-1, 1,    0,1,

  1,-1,-1,     0,0,
  1, 1,-1,     1,0,
  1, 1, 1,     1,1,
  1,-1, 1,     0,1,

  -1,-1,-1,    0,0,
  -1,-1, 1,    1,0,
  1,-1, 1,     1,1,
  1,-1,-1,     0,1,

  -1, 1,-1,    0,0,
  -1, 1, 1,    1,0,
  1, 1, 1,     1,1,
  1, 1,-1,     0,1
];

CUBE_VERTEX= gl.createBuffer ();
gl.bindBuffer(gl.ARRAY_BUFFER, CUBE_VERTEX);
gl.bufferData(gl.ARRAY_BUFFER,
              new Float32Array(cube_vertex),
  gl.STATIC_DRAW);

cube_faces = [
  0,1,2,
  0,2,3,

  4,5,6,
  4,6,7,

  8,9,10,
  8,10,11,

  12,13,14,
  12,14,15,

  16,17,18,
  16,18,19,

  20,21,22,
  20,22,23

];
CUBE_FACES= gl.createBuffer ();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
              new Uint16Array(cube_faces),
  gl.STATIC_DRAW);

#/*========================= MATRIX ========================= */

PROJMATRIX=LIBS.get_projection(40, CANVAS.width/CANVAS.height, 1, 100);
MOVEMATRIX=LIBS.get_I4();
VIEWMATRIX=LIBS.get_I4();

LIBS.translateZ(VIEWMATRIX, -6);
THETA=0,
    PHI=0;

#/*========================= TEXTURES ========================= */
get_texture=(image_URL) -> {


  # image=new Image();
  #
  # image.src=image_URL;
  image = $("img")[0];
  image.webglTexture=false;


  # image.onload=function(e) {



  texture=gl.createTexture();

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBgl, true);


  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);

  gl.generateMipmap(gl.TEXTURE_2D);

  gl.bindTexture(gl.TEXTURE_2D, null);

  image.webglTexture=texture;
  # };

  return image;
};

cube_texture=get_texture("p.png");


#/*========================= DRAWING ========================= */
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL);
gl.clearColor(0.0, 0.0, 0.0, 0.0);
gl.clearDepth(1.0);

time_old=0;
animate=(time) ->
  dt=time-time_old;
  if (!drag):
    dX*=AMORTIZATION, dY*=AMORTIZATION;
    THETA+=dX, PHI+=dY;

  LIBS.set_I4(MOVEMATRIX);
  LIBS.rotateY(MOVEMATRIX, THETA);
  LIBS.rotateX(MOVEMATRIX, PHI);
  time_old=time;

  gl.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
  gl.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);
  gl.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);
  if (cube_texture.webglTexture)->

    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, cube_texture.webglTexture);

  gl.bindBuffer(gl.ARRAY_BUFFER, CUBE_VERTEX);
  gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,4*(3+2),0) ;
  gl.vertexAttribPointer(_uv, 2, gl.FLOAT, false,4*(3+2),3*4) ;

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
  gl.drawElements(gl.TRIANglES, 6*2*3, gl.UNSIGNED_SHORT, 0);

  gl.flush();
  window.requestAnimationFrame(animate);

animate(0);

# vertices = new Float32Array [-1,-1,0,1, -1,1,0,1, 1,1,0,1, 1,-1,0,1]
# indices = new Uint16Array [0,1,2,1,2,3]
#
# vBuffer = gl.createBuffer()
# gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
# gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
#
# fBuffer = gl.createBuffer()
# gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, fBuffer)
# gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
#
# # vShader = gl.createShader(gl.VERTEX_SHADER)
# @vSource = $("script[type=vshader]").text()
# # gl.shaderSource(vShader, vSource)
# # gl.compileShader(vShader)
# vShader = new Shader(@vSource, gl.VERTEX_SHADER, gl)
#
# # console.log gl.getShaderInfoLog(vShader)
#
# # fShader = gl.createShader(gl.FRAGMENT_SHADER)
# @fSource = $("script[type=fshader]").text()
# fShader = new Shader(@fSource, gl.FRAGMENT_SHADER, gl)
# prog = new Material(gl, vShader, fShader)
# # gl.shaderSource(fShader, fSource)
# # gl.compileShader(fShader)
#
# # console.log gl.getShaderInfoLog(fShader)
#
# # prog = gl.createProgram()
# # gl.attachShader(prog, vShader)
# # gl.attachShader(prog, fShader)
# # gl.validateProgram(prog)
# # gl.linkProgram(prog)
# # gl.useProgram(prog)
#
# prog.use(gl)
# @prog = prog
# vLoc = prog.getAttribLocation(gl, "pos")
# gl.enableVertexAttribArray(vLoc);
# gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
# gl.vertexAttribPointer(vLoc, 4, gl.FLOAT, false, 0, 0);
#
# gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, fBuffer);
# gl.drawElements(gl.POINTS, indices.length, gl.UNSIGNED_SHORT,0);
#
# console.log "Errors: ", gl.getError()
