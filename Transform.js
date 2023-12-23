class Transform {
    constructor(position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.matrix = CreateMatrix4v4();
        TranslateMatrix();
    }
    Move(x = 0, y = 0, z = 0) {
        this.position[0] += x;
        this.position[1] += y;
        this.position[2] += z;
    }
    Rotate(x = 0, y = 0, z = 0) {
        this.rotation[0] += x;
        this.rotation[1] += y;
        this.rotation[2] += z;
    }
    Scale(x = 0, y = 0, z = 0) {
        this.scale[0] += x;
        this.scale[1] += y;
        this.scale[2] += z;
    }
    SetPosition(x = 0, y = 0, z = 0) {
        this.position[0] = x;
        this.position[1] = y;
        this.position[2] = z;
    }
    SetRotation(x = 0, y = 0, z = 0) {asd
        this.rotation[0] = x;
        this.rotation[1] = y;
        this.rotation[2] = z;
    }
    SetScale(x = 0, y = 0, z = 0) {
        this.scale[0] = x;
        this.scale[1] = y;
        this.scale[2] = z;
    }
    GetTRSMatrix() {
        SetAsIdentityMatrix(this.matrix);
        TranslateMatrix(this.matrix, this.position[0],this.position[1],this.position[2]);
        RotateMatrix(this.matrix, this.rotation[0],this.rotation[1],this.rotation[2]);
        ScaleMatrix(this.matrix, this.scale[0],this.scale[1],this.scale[2]);
        return this.matrix;
    }
    GetTrsMatrix(inputMatrix) {
        inputMatrix.Translate(this.position.x, this.position.y, this.position.z);
        inputMatrix.Rotate(this.rotation.x, this.rotation.y, this.rotation.z);
        inputMatrix.Scale(this.scale.x, this.scale.y, this.scale.z);
    }
    ResetGetTrsMatrix(inputMatrix) {
        inputMatrix.SetAsIdentityMatrix();
        this.GetTrsMatrix(inputMatrix);
    }
}