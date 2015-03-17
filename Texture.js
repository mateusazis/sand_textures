function Texture(gl) {
    this.gl = gl;
    this.id = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, this.id);
    // gl.texImage2D(gl.TEXTURE_2D, mipmapLevel, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating).

    gl.bindTexture(gl.TEXTURE_2D, null);
}

Texture.fromURL = function(gl, url){
    var tex = new Texture(gl);

    var img = new Image();

    img.onload=function(e) {
        gl.bindTexture(gl.TEXTURE_2D, tex.id);
        var mipmapLevel = 0;
        console.log(img);
        gl.texImage2D(gl.TEXTURE_2D, mipmapLevel, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    };

    img.src = url;
    return tex;
}

Texture.fromImg = function(gl, img){
        var handle = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, handle);
        var mipmapLevel = 0;
        gl.texImage2D(gl.TEXTURE_2D, mipmapLevel, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating).

        gl.bindTexture(gl.TEXTURE_2D, null);

        return {id: handle};
    };
Texture.empty = function(gl, width, height){
    var handle = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, handle);
    var mipmapLevel = 0;
    gl.texImage2D(gl.TEXTURE_2D, mipmapLevel, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
//        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
//        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating).

    gl.bindTexture(gl.TEXTURE_2D, null);

    return {id: handle};
};

// var Texture = {
//     fromImg : function(gl, img){
//         var handle = gl.createTexture();
//
//         gl.bindTexture(gl.TEXTURE_2D, handle);
//         var mipmapLevel = 0;
//         gl.texImage2D(gl.TEXTURE_2D, mipmapLevel, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
//
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating).
//
//         gl.bindTexture(gl.TEXTURE_2D, null);
//
//         return {id: handle};
//     },
//     empty : function(gl, width, height){
//         var handle = gl.createTexture();
//
//         gl.bindTexture(gl.TEXTURE_2D, handle);
//         var mipmapLevel = 0;
//         gl.texImage2D(gl.TEXTURE_2D, mipmapLevel, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
//
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
// //        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
// //        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating).
//
//         gl.bindTexture(gl.TEXTURE_2D, null);
//
//         return {id: handle};
//     }
// };
//
