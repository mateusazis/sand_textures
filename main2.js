
var main=function() {
  var CANVAS=$("canvas")[0];

  /*========================= GET WEBGL CONTEXT ========================= */
  var GL = CANVAS.getContext("experimental-webgl", {antialias: true});
  window.gl = GL;


  var shader_vertex_source= $("script[type=vshader]").html();
  var shader_fragment_source= $("script[type=fshader]").html();

  var get_shader=function(source, type, typeString) {
    var shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      alert("ERROR IN "+typeString+ " SHADER : " + GL.getShaderInfoLog(shader));
      return false;
    }
    return shader;
  };

  var shader_vertex=get_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
  var shader_fragment=get_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");
  var shader_fragment2=get_shader($("#f2").html(), GL.FRAGMENT_SHADER, "FRAGMENT");
  var point_vertex = get_shader($("#vpoint").html(), GL.VERTEX_SHADER, "VERTEX");
  var point_fragment=  get_shader($("#fpoint").html(), GL.FRAGMENT_SHADER, "FRAGMENT");

  var SHADER_PROGRAM=GL.createProgram();
  GL.attachShader(SHADER_PROGRAM, shader_vertex);
  GL.attachShader(SHADER_PROGRAM, shader_fragment);
  GL.linkProgram(SHADER_PROGRAM);

  var mat0 = new Material(GL, "move.vert", "move.frag");
  var mat1 = new Material(GL, "move.vert", "invert.frag");
  var quad = new Mesh(GL, GL.TRIANGLES,
      [-1,-1,0,1,
      -1, 1, 0, 1,
      1, 1, 0, 1,
      1, -1, 0, 1],

      [0,1,2,2,3,0],

      [0,0,
      0,1,
      1,1,
      1,0]
  );

  var mat = new Material(GL, "point.vert", "point.frag");
  var m = new Mesh(GL, GL.POINTS, [0, 0, 0, 1]);



  var t = Texture.fromURL(gl, "url.jpg");
  mat0.texture("sampler", t, 0);

  /*========================= DRAWING ========================= */
  GL.enable(GL.DEPTH_TEST);

  GL.enable(GL.BLEND);
  GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);

  GL.depthFunc(GL.LEQUAL);
  GL.clearColor(0.0, 0.0, 0.0, 0.0);
  GL.clearDepth(1.0);

  var fbo1 = new FBO(GL, 400, 400);
  var fbo2 = new FBO(GL, 400, 400);

  var first = true;
  var fboScreen = fbo1, fboTex = fbo2;

  var ready = false;

  t.ready(function(){
      mat1.texture("sampler", t);
      quad.draw(mat1, fboTex);
      GL.flush();
      ready = true;
  });

  var animate=function() {
      if(ready){
        mat0.texture("sampler", fboTex);
        quad.draw(mat0, fboScreen);

        mat1.texture("sampler", fboScreen);
        quad.draw(mat1);

        var temp = fboScreen;
        fboScreen = fboTex;
        fboTex = temp;
      }



    setTimeout(animate, 0);
  };
  animate();

  (function(){
        var onDrag = function(x, y){
            mat.uniform2f("mouse", x, y);

            // quad.draw(mat0, fbo1);
            m.draw(mat, fboTex);

            GL.flush();


            // quad.draw(mat1);
            // GL.flush();
        };
        var down = false;
        $(CANVAS).mousedown(function(data){
            window.mousedown = down = true;

            var offset = $(data.target).offset();
            var x = data.pageX - offset.left, y = data.pageY - offset.top;
            onDrag(x, y);
        });
        $(window).mouseup(function(data){
            window.mousedown = down = false;
        });
        $(CANVAS).mousemove(function(data){
            if(down)
            {
                var offset = $(data.target).offset();
                var x = data.pageX - offset.left, y = data.pageY - offset.top;
                onDrag(x, y);
            }
      });
  })();

};

$(document).ready(main);