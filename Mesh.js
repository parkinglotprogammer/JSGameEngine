class Mesh {
    static{
        Mesh.identifier = 0;
    }
    constructor(verts, indices){
        this.verts = verts;
        this.indices = indices;
        this.indicesModified = [];
        this.identifier = Mesh.identifier++;
        for(let i = 0; i <this.indices.length; i++)
            this.indicesModified.push(this.indices[i]);
    }
    OffsetIndicesByVertBuffer(vertBufferIndex) {
        for(let i =0; i < this.indices.length; i++)
            this.indicesModified[i] = this.indices[i] + vertBufferIndex;
    }
    GetVerts(){
        return this.verts;
    }
}