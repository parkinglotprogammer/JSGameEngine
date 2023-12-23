class RenderSystem {
    static {
        this.archetype = World.CreateArchetype(Mesh,Transform);
    }

    static Update() {
        let count = 0;
        for(let entity of World.GetEntities(this.archetype)) {
            count++;
        }
        console.log(`There were  ${count} entities`);
    }
}