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

    console.log(3);
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

     console.log("texture unit to ", textureUnit);
     this.queue.textures.push({loc : locName, texture : tex, unit : textureUnit});
     if(this.ready)
        this.commitQueue();
    //  this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
    //  this.gl.bindTexture(this.gl.TEXTURE_2D, tex.id);
    //  this.gl.uniform1i(this.gl.getUniformLocation(this.progId, locName), textureUnit);
 },
 commitQueue : function(){
     var progId = this.progId;
     this.use();
     this.queue.textures.forEach(function(entry){
         this.gl.activeTexture(this.gl.TEXTURE0 + entry.unit);
         console.log("entry", entry);//, "trace", new Error().stack);
         this.gl.bindTexture(this.gl.TEXTURE_2D, entry.texture.id);
        //  console.log("loc", this.gl.getUniformLocation(progId, entry.loc));
         this.gl.uniform1i(this.gl.getUniformLocation(progId, entry.loc), entry.unit);
     });
     this.queue.textures = [];
 }
};
