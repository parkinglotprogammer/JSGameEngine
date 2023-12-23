class Renderer {
    constructor(){
        this.meshes = [];
        this.vertexBuffer = [];
        this.indicesBuffer = [];
        this.transformMatrices = [];
        this.meshMap = new Map();
        this.objectsToRender = [];
    }
    Render() {

    }
    AddObjectsToRender() {
        this.objectsToRender.push(...arguments);
    }
    AddMeshes() {
        //@todo:untested
        let hasChanged = false;
        for(const mesh of arguments) {
            if(!this.meshMap.has(mesh.identifier)) {
                let meshIndexInMeshArray = this.meshes.length;
                this.meshMap.Set(mesh.identifier,meshIndexInMeshArray);
                this.meshes.push(mesh);
                hasChanged = true;
            }
        }
        if(hasChanged) {
            this.RecreateVertexBuffer();
            //@todo: push this vertex buffer to the gpu
        }
            
    }
    RecreateVertexBuffer() {
        //@todo:untested
        this.vertexBuffer.length = 0;
        for(const mesh of this.meshes) {
            mesh.OffsetIndicesByVertBuffer(this.vertexBuffer.length);
            this.vertexBuffer.push(...mesh.vertices);
        }
    }
    RecreateIndicesBuffer() {
        //@todo: we probably don't have to recreate this every frame if we 
        //don't create or destroy any objects

        //@todo:untested
        this.indicesBuffer.length = 0;
        for(const obj of this.objectsToRender)
            this.indicesBuffer.push(...obj.mesh.indicesModified);
        
    }
    RemoveMesh(mesh) {
        //@todo:untested
        if(!this.meshMap.has(mesh.identifier)) {
            console.log("no mesh to remove");
            return;
        }
        let meshIndexToRemove = this.meshMap.get(mesh.identifier);
        for(let i = meshIndexToRemove; i < this.meshes.length-1; i++) {
            this.meshes[i] = this.meshes[i+1];
            this.meshes[i].OffsetIndicesByVertBuffer(i);
            this.meshMap.set(this.meshes[i].identifier,i);
        }
        this.meshes.pop();
        this.meshMap.delete(mesh.identifier);
    }

}