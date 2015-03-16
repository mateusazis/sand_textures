function Shader(src, type, gl){
    this.handle = gl.createShader(type);
    
    gl.shaderSource(this.handle, src);
    gl.compileShader(this.handle);
    if (!gl.getShaderParameter(this.handle, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(this.handle));
    }
}

Shader.prototype.attach = function(gl, programId){
    gl.attachShader(programId, this.handle);
};

Shader.prototype.delete = function(gl, programId){
    if(programId)
	gl.detachShader(programId, this.handle);
    gl.deleteShader(this.handle);
};

Shader.vert = function(path, gl){
    return new Shader(path, gl.VERTEX_SHADER, gl);
};

Shader.frag = function(path, gl){
    return new Shader(path, gl.FRAGMENT_SHADER, gl);
};
