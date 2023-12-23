class Mesh {
    static {
        Mesh.ID = Component.ID++;
        Object.freeze(Mesh.ID);

        Mesh.plane = new Mesh(
            [
                new Vector3(0, 0, 0),
                new Vector3(1, 0, 0),
                new Vector3(1, 1, 0),
                new Vector3(0, 1, 0)
            ],
            [
                0, 1, 2,
                2, 3, 0
            ]
        );
    }
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        // this.vertices = vertices;
        // this.indices = indices;
    }
}
class Transform {
    static {
        Transform.ID = Component.ID++;
        Object.freeze(Transform.ID);
    }
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}
