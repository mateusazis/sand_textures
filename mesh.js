function Mesh(gl, topology, vertices, indices){
    this.gl = gl;
    this.topology = topology;
    this.vertexCount = vertices.length / 4;

    this.positionBufferHandle = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBufferHandle);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    if(indices){
        this.vaoHandle = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vaoHandle);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        this.elementsCount = indices.length;
    }

    this.attributes = {};
}

Mesh.prototype.draw = function(material){
    var posLoc = this.gl.getAttribLocation(material.progId, "position");

    //bind positions
    this.gl.enableVertexAttribArray(posLoc);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBufferHandle);
    this.gl.vertexAttribPointer(posLoc, 4, this.gl.FLOAT, false,0,0);

    var COUNTS = {}
    COUNTS[this.gl.TRIANGLES] = 3;
    COUNTS[this.gl.POINTS] = 1;
    var BASE = {}
    BASE[this.gl.TRIANGLES] = 0;
    BASE[this.gl.POINTS] = 0;
    var count = BASE[this.topology] + this.vertexCount / COUNTS[this.topology];
    if(this.vaoHandle){
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vaoHandle);
        this.gl.drawElements(this.gl.TRIANGLES, count, this.gl.UNSIGNED_SHORT,0);
    }
    else{
        this.gl.drawArrays(this.topology, 0, count);
    }
};