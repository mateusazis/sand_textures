
var main=function() {
  var CANVAS=$("canvas")[0];
  $(CANVAS).bind('contextmenu', function(e){
        return false;
    });

  /*========================= GET WEBGL CONTEXT ========================= */
  var GL = CANVAS.getContext("experimental-webgl", {antialias: true});
  window.gl = GL;

  /* OPENGL Setup */
  GL.enable(GL.DEPTH_TEST);

  GL.enable(GL.BLEND);
  GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);

  GL.depthFunc(GL.LEQUAL);
  GL.clearColor(0.0, 0.0, 0.0, 1.0);
  GL.clearDepth(1.0);

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



  var t = Texture.fromURL(gl, "p2.png");
  // var t = Texture.fromURL(gl, "url.jpg");
  mat0.texture("sampler", t, 0);

  /*========================= DRAWING ========================= */


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

  var down = false;
  var mousePos = null;

  var clearPoint = function(x, y){
      mat.uniform2f("mouse", x, y);
      m.draw(mat, fboTex);
      GL.flush();
  };

  var animate=function() {
      if(ready){
        if(down)
            clearPoint(mousePos.x, mousePos.y);

        GL.clear(GL.COLOR_BUFFER_BIT);
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
        $(CANVAS).mousedown(function(data){
            window.mousedown = down = true;

            var offset = $(data.target).offset();
            var x = data.pageX - offset.left, y = data.pageY - offset.top;
            mousePos = {x : x, y : y};
            clearPoint(x, y);
        });
        $(window).mouseup(function(data){
            window.mousedown = down = false;
        });
        $(CANVAS).mousemove(function(data){
            if(down)
            {
                var offset = $(data.target).offset();
                var x = data.pageX - offset.left, y = data.pageY - offset.top;
                mousePos = {x : x, y : y};
                clearPoint(x, y);
            }
      });
  })();

};

$(document).ready(main);