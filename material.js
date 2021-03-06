function Material(gl, vertURL, fragURL){
    this.gl = gl;
    this.ready = false;

    this.progId = gl.createProgram();

    this.shaders = [];
    var obj = this;

    this.queue = {textures: []};
    this.textureUnits = [];

    var onShaderLoaded = function(src, type){
        var handle = gl.createShader(type);

        gl.shaderSource(handle, src);
        gl.compileShader(handle);
        if (!obj.gl.getShaderParameter(handle, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(handle));
        } else {
            obj.shaders.push(handle);
        }

        if(obj.shaders.length == 2){
            gl.attachShader(obj.progId, obj.shaders[0]);
            gl.attachShader(obj.progId, obj.shaders[1]);

            gl.linkProgram(obj.progId);
            if (!gl.getProgramParameter(obj.progId, gl.LINK_STATUS)) {
                console.error(gl.getProgramInfoLog(obj.progId));
                return;
            }
            gl.validateProgram(obj.progId);

        	gl.detachShader(obj.progId, obj.shaders[0]);
        	gl.detachShader(obj.progId, obj.shaders[1]);
            gl.deleteShader(obj.shaders[0]);
            gl.deleteShader(obj.shaders[1]);

            obj.ready = true;
            obj.commitQueue();
        }
    };

    $.get(vertURL, function(src){
        onShaderLoaded(src, gl.VERTEX_SHADER);
    });

    $.get(fragURL, function(src){
        onShaderLoaded(src, gl.FRAGMENT_SHADER);
    });

    this.attributes = {};
}

Material.prototype = {
  use : function(){
      if(this.ready)
        this.gl.useProgram(this.progId);
  },
  getAttribLocation : function(name){
    return this.gl.getAttribLocation(this.progId, name);
  },
  uniform1f : function(locName, value){
     this.gl.uniform1f(this.gl.getUniformLocation(this.progId, locName), value);
  },
  uniform2f : function(locName, x, y){
      this.use();
     this.gl.uniform2f(this.gl.getUniformLocation(this.progId, locName), x, y);
  },
  uniform3f : function(locName, x, y, z){
     this.gl.uniform3f(this.gl.getUniformLocation(this.progId, locName), x, y, z);
  },
  uniform4f : function(locName, x, y, z, w){
     this.gl.uniform4f(this.gl.getUniformLocation(this.progId, locName), x, y, z, w);
  },
  texture : function(locName, tex){
     this.use();
     var textureUnit = this.textureUnits.indexOf(tex.id);
     if(textureUnit == -1){
         this.textureUnits.push(tex.id);
         textureUnit = this.textureUnits.length - 1;
     }

     this.queue.textures[locName] = { texture : tex, unit : textureUnit};
 },
 commitQueue : function(){
     var progId = this.progId;
     this.use();
     for(var loc in this.queue.textures){
         var entry = this.queue.textures[loc];
         this.gl.activeTexture(this.gl.TEXTURE0 + entry.unit);
         this.gl.bindTexture(this.gl.TEXTURE_2D, entry.texture.getId());
         this.gl.uniform1i(this.gl.getUniformLocation(progId, loc), entry.unit);
     }
 }
};
