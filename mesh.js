function Mesh(gl, topology, vertices, indices, uv){
    this.gl = gl;
    this.topology = topology;
    this.vertexCount = vertices.length / 4;
    this.indices = indices;

    this.positionBufferHandle = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBufferHandle);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    if(indices){
        this.vaoHandle = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vaoHandle);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        this.elementsCount = indices.length;
    }

    if(uv){
        this.uvHandle = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvHandle);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
    }

    this.attributes = {};

    if(!Mesh.COUNTS){
        Mesh.COUNTS = {};
        Mesh.COUNTS[gl.TRIANGLES] = 3;
        Mesh.COUNTS[gl.POINTS] = 1;
        Mesh.BASE = {}
        Mesh.BASE[gl.TRIANGLES] = 0;
        Mesh.BASE[gl.POINTS] = 0;
    };
}

Mesh.prototype.draw = function(material){
    if(!material.ready)
        return;
    material.use();

    var posLoc = this.gl.getAttribLocation(material.progId, "position");

    //bind positions
    this.gl.enableVertexAttribArray(posLoc);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBufferHandle);
    this.gl.vertexAttribPointer(posLoc, 4, this.gl.FLOAT, false,0,0);

    var count = Mesh.BASE[this.topology] + Math.floor(this.vertexCount / Mesh.COUNTS[this.topology]);

    if(this.uvHandle){
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvHandle);

        var _uv = material.getAttribLocation("uv");
        this.gl.enableVertexAttribArray(_uv);
        this.gl.vertexAttribPointer(_uv, 2, this.gl.FLOAT, false, 0, 0) ;
    }

    if(this.vaoHandle){
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vaoHandle);
        this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT,0);
    // console.log("drawing", count);
    }
    else{
        this.gl.drawArrays(this.topology, 0, count);
    }
};