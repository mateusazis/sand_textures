function FBO(gl, width, height){
//    width /= 10; height /= 10;
    this.width = width;
    this.height = height;
    this.colorTex = Texture.empty(gl, width, height);
   //-------------------------
   this.fbo = gl.createFramebuffer();
   gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
   //Attach 2D texture to this FBO
   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorTex.id, 0);
   //-------------------------
   this.rbo = gl.createRenderbuffer();
   gl.bindRenderbuffer(gl.RENDERBUFFER, this.rbo);
   gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
   //-------------------------
   //Attach depth buffer to FBO
   gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.rbo);
   //-------------------------
   //Does the GPU support current FBO configuration?
//   var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    this.unbind(gl);
    this.viewportParams = undefined;
}

FBO.prototype = {
   bind : function(gl) {
       this.viewportParams = gl.getParameter(gl.VIEWPORT);
       gl.viewport(0, 0, this.width, this.height);
       gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
   }, 
   unbind : function(gl) {
       gl.bindFramebuffer(gl.FRAMEBUFFER, null);
       var v = this.viewportParams;
       if(v)
        gl.viewport(v[0], v[1], v[2], v[3]);
   }
};