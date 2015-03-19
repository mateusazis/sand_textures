
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

  // var SHADER_PROGRAM3=GL.createProgram();
  // GL.attachShader(SHADER_PROGRAM3, point_vertex);
  // GL.attachShader(SHADER_PROGRAM3, point_fragment);
  // GL.linkProgram(SHADER_PROGRAM3);
  var mat0 = new Material(GL, "move.vert", "move.frag");
  var quad = new Mesh(GL, GL.TRIANGLES, [-1,-1,0,1,
      -1, 1, 0, 1,
      1, 1, 0, 1,
      1, -1, 0, 1], [0,1,2,2,3,0],[0,1,0,0,1,0,1,1]
  );

  var mat = new Material(GL, "point.vert", "point.frag");
  var m = new Mesh(GL, GL.POINTS, [0, 0, 0, 1]);

  var SHADER_PROGRAM2=GL.createProgram();
  GL.attachShader(SHADER_PROGRAM2, shader_vertex);
  GL.attachShader(SHADER_PROGRAM2, shader_fragment2);
  GL.linkProgram(SHADER_PROGRAM2);





  /*========================= THE CUBE ========================= */
  //POINTS :
  var cube_vertex=[
    -1,-1,0,    0,0,
    1,-1,0,     1,0,
    1, 1,0,     1,1,
    -1, 1,0,    0,1
  ];

  var CUBE_VERTEX= GL.createBuffer ();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cube_vertex), GL.STATIC_DRAW);

  var POINT_VERTEX = GL.createBuffer ();
  GL.bindBuffer(GL.ARRAY_BUFFER, POINT_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1]), GL.STATIC_DRAW);

  //FACES :
  var cube_faces = [0,1,2,0,2,3];
  var CUBE_FACES= GL.createBuffer ();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube_faces), GL.STATIC_DRAW);

  var setupProgram = function(prog){
      GL.useProgram(prog);
      var _sampler = GL.getUniformLocation(prog, "sampler");
      var _uv = GL.getAttribLocation(prog, "uv");
      var _position = GL.getAttribLocation(prog, "position");

      GL.enableVertexAttribArray(_uv);
      GL.enableVertexAttribArray(_position);

      GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false,4*(3+2),0) ;
      GL.vertexAttribPointer(_uv, 2, GL.FLOAT, false,4*(3+2),3*4) ;

      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);

      GL.uniform1i(_sampler, 0);
  };

  var setupProgramPoint = function(prog){
      GL.useProgram(prog);
      var _position = GL.getAttribLocation(prog, "position");

      GL.enableVertexAttribArray(_position);

      GL.bindBuffer(GL.ARRAY_BUFFER, POINT_VERTEX);
      GL.vertexAttribPointer(_position, 4, GL.FLOAT, false,4,0) ;
  };

  /*========================= TEXTURES ========================= */
    var t;
  var get_texture=function(image_URL){


    var image=new Image();

    image.src=image_URL;
    image.webglTexture=false;

    image.onload=function(e) {
    //   var texture=GL.createTexture();
      //
    //   GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
      //
      //
    //   GL.bindTexture(GL.TEXTURE_2D, texture);
      //
    //   GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
      //
    //   GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    //   GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
      //
    //   GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    //   GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
      //
    //   GL.generateMipmap(GL.TEXTURE_2D);
      //
    //   GL.bindTexture(GL.TEXTURE_2D, null);
      //
    //   image.webglTexture=texture;
    };

    return image;
  };

  // var cube_texture=get_texture("p.png");
  // var cube_texture=get_texture("url.jpg");
  var t = Texture.fromURL(gl, "url.jpg");
  mat0.texture("sampler", t, 0);
  console.log("t", t);

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
  var animate=function() {
    // GL.useProgram(SHADER_PROGRAM);
    //
    // GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
    // GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    //
    // if (cube_texture.webglTexture) {
    //   GL.activeTexture(GL.TEXTURE0);
    //   if(first){
    //     setupProgram(SHADER_PROGRAM2);
    //     GL.bindTexture(GL.TEXTURE_2D, cube_texture.webglTexture);
    //
    //     fboTex.bind(GL);
    //     GL.drawElements(GL.TRIANGLES, 6, GL.UNSIGNED_SHORT, 0);
    //     GL.flush();
    //     fboTex.unbind(GL);
    //   }
    //   first = false;
    // }
    //
    // // setupProgram(SHADER_PROGRAM);
    // mat0.use();
    // GL.bindTexture(GL.TEXTURE_2D, fboTex.colorTex.id);
    //
    // fboScreen.bind(GL);
    // GL.clearColor(0,0,0,1);
    // GL.clear(GL.COLOR_BUFFER_BIT);
    // quad.draw(mat0);
    // // GL.drawElements(GL.TRIANGLES, 6, GL.UNSIGNED_SHORT, 0);
    // GL.flush();
    // fboScreen.unbind(GL);
    //
    // setupProgram(SHADER_PROGRAM2);
    // GL.bindTexture(GL.TEXTURE_2D, fboScreen.colorTex.id);
    // GL.clearColor(0,0,0,1);
    // GL.clear(GL.COLOR_BUFFER_BIT);
    // GL.drawElements(GL.TRIANGLES, 6, GL.UNSIGNED_SHORT, 0);
    // GL.flush();
    //
    // var temp = fboTex;
    // fboTex = fboScreen;
    // fboScreen = temp;

    // if(t)


    quad.draw(mat0);

    // setTimeout(animate, 0);
  };
  animate();

  (function(){
        var onDrag = function(x, y){
            // setupProgram(SHADER_PROGRAM2);
            // GL.bindTexture(GL.TEXTURE_2D, fboTex.colorTex.id);
            // fboTex.bind(GL);

            // mat.use();
            mat.uniform2f("mouse", x, y);
            // setupProgramPoint(SHADER_PROGRAM3);
            // GL.uniform2f(GL.getUniformLocation(SHADER_PROGRAM3, "mouse"), x, y);
            // GL.drawArrays(GL.POINTS, 0, 1);
            quad.draw(mat0);
            m.draw(mat);
            // GL.flush();
            // fboTex.unbind(GL);


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