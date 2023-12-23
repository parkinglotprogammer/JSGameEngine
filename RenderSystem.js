class RenderSystem {
    static {
        this.archetype = World.CreateArchetype(Mesh, Transform);
    }

    static Update() {
        let combined = [0, 0, 0];
        for (const entityList of World.GetEntities(this.archetype)) {
            for (let i = 0; i < entityList.length; i++) {
                let entData = entityList[i][1];
                let mesh = entData[Mesh.ID - 1];
                let transform = entData[Transform.ID - 1];
                combined[0] += mesh.x + transform.x;
                combined[1] += mesh.y + transform.y;
                combined[2] += mesh.z + transform.z;
            }
        }
    }
}