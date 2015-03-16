function Material(gl, vert, frag){
    this.gl = gl;

    this.progId = gl.createProgram();

    vert.attach(gl, this.progId);
    frag.attach(gl, this.progId);

    gl.linkProgram(this.progId);

    gl.validateProgram(this.progId);
    gl.useProgram(this.progId);

    this.attributes = {};
}

Material.prototype = {
  bind : function(gl){
    gl.useProgram(this.progId);
  },
  use : function(gl){
    this.bind(gl);
  },
  getAttribLocation : function(gl, name){
    return gl.getAttribLocation(this.progId, name);
  },
  uniform1f : function(value, locName){
     this.use(this.gl);
     this.gl.uniform1f(this.gl.getUniformLocation(this.progId, locName), value);
  },
  uniform2f : function(x, y, locName){
     this.use(this.gl);
     this.gl.uniform2f(this.gl.getUniformLocation(this.progId, locName), x, y);
  },
  uniform3f : function(x, y, z, locName){
     this.use(this.gl);
     this.gl.uniform3f(this.gl.getUniformLocation(this.progId, locName), x, y, z);
  },
  uniform4f : function(x, y, z, w, locName){
     this.use(this.gl);
     this.gl.uniform4f(this.gl.getUniformLocation(this.progId, locName), x, y, z, w);
  },
  texture : function(tex, textureUnit, locName){
     this.use(this.gl);
     this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
     this.gl.bindTexture(this.gl.TEXTURE_2D, tex.id);
     this.gl.uniform1i(this.gl.getUniformLocation(this.progId, locName), textureUnit);
  }
};
