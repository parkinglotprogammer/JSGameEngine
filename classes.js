class Graphics {
    static elementsPerVertex = 4;
    static {
        //Hide scrollbars, remove margin and padding
        document.body.style.overflow = 'hidden';
        document.body.style.margin = 0;
        document.body.style.padding = 0;

        Graphics.canvas = document.querySelector("#glcanvas");
        let gl = Graphics.canvas.getContext("webgl2");
        Graphics.gl = gl;
        Graphics.vertices = [];
        Graphics.vertexShader = Graphics.CompileShader(gl.VERTEX_SHADER, vertexShader);
        Graphics.fragShader = Graphics.CompileShader(gl.FRAGMENT_SHADER, fragShader);
        let shaderProgram = gl.createProgram();
        Graphics.shaderProgram = shaderProgram;
        gl.attachShader(shaderProgram, Graphics.vertexShader);
        gl.attachShader(shaderProgram, Graphics.fragShader);
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        Graphics.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, Graphics.vertexBuffer);
        const positionAttrib = gl.getAttribLocation(shaderProgram, "position");
        gl.vertexAttribPointer(positionAttrib, Graphics.elementsPerVertex, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionAttrib);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        window.addEventListener("resize", Graphics.Resize);
        Graphics.Resize();
    }

    static CompileShader(shaderType, shaderSource) {
        let shader = Graphics.gl.createShader(shaderType);
        Graphics.gl.shaderSource(shader, shaderSource);
        Graphics.gl.compileShader(shader);
        if (!Graphics.gl.getShaderParameter(shader, Graphics.gl.COMPILE_STATUS)) {
            console.error("Shader compilation error:", Graphics.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
    static Render() {
        if (Graphics.vertices.length < 1)
            return;
        let gl = Graphics.gl;
        //@todo:find way to not be making a new Float32Array here every time
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Graphics.vertices), gl.DYNAMIC_DRAW);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, Graphics.vertices.length / Graphics.elementsPerVertex);
    }
    static DrawTriangle() {
        Graphics.vertices.push();
    }
    static Resize() {
        Graphics.canvas.width = Graphics.width = window.innerWidth;
        Graphics.canvas.height = Graphics.height = window.innerHeight;
        Graphics.gl.viewport(0, 0, Graphics.width, Graphics.height);
        Graphics.gl.clear(Graphics.gl.COLOR_BUFFER_BIT | Graphics.gl.DEPTH_BUFFER_BIT);
    }
}

class Game {
    static {
        Game.targetFrameRate = 30;
        Game.targetFrameTime = 1000 / Game.targetFrameRate;
        Game.lastTime = 0;
        Game.quit = false;
        Game.updateInterval;
        Game.deltaTime;
    }
    static SetTargetFrameRate(targetFrameRate) {
        if (Game.quit)
            return;
        Game.targetFrameRate = targetFrameRate;
        Game.targetFrameTime = 1000 / targetFrameRate;
        clearInterval(Game.updateInterval);
        Game.updateInterval = setInterval(Game.GameUpdate, Game.targetFrameTime);
    }
    static Start() {
        Game.updateInterval = setInterval(Game.Update, Game.targetFrameTime);
        requestAnimationFrame(Game.GraphicsUpdate);
        Start();
    }
    static GraphicsUpdate() {
        Graphics.Render();
        if (!Game.quit)
            requestAnimationFrame(Game.GraphicsUpdate);
    }
    static Update() {
        // Calculate elapsed time since the last frame
        const thisTime = performance.now();

        Game.deltaTime = thisTime - Game.lastTime;
        Game.lastTime = thisTime;
        Update(Game.deltaTime);
        Input.LateUpdate();

    }
    static Quit() {
        Game.quit = true;
        Quit();
        clearInterval(Game.updateInterval);
    }
}
class MyMath {
    static {
        MyMath.DegreesToRadians = Math.PI / 180;
        MyMath.RadiansToDegrees = 180 / Math.PI;
    }
}
class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static {
        Vector3.Zero = Object.freeze(new Vector3());
        Vector3.One = Object.freeze(new Vector3(1, 1, 1));
        Vector3.Up = Object.freeze(new Vector3(0, 1, 0));
        Vector3.Down = Object.freeze(new Vector3(0, -1, 0));
        Vector3.Left = Object.freeze(new Vector3(-1, 0, 0));
        Vector3.Right = Object.freeze(new Vector3(1, 0, 0));
        Vector3.Forward = Object.freeze(new Vector3(0, 0, 1));
        Vector3.Backward = Object.freeze(new Vector3(0, 0, -1));
    }
    Add(otherVec) {
        return new Vector3(
            this.x + otherVec.x,
            this.y + otherVec.y,
            this.z + otherVec.z
        );
    }
    MutateAdd(otherVec) {
        this.x += otherVec.x;
        this.y += otherVec.y;
        this.z += otherVec.z;
    }
    Subtract(otherVec) {
        return new Vector3(
            this.x - otherVec.x,
            this.y - otherVec.y,
            this.z - otherVec.z
        );
    }
    MutateSubtract(otherVec) {
        this.x -= otherVec.x;
        this.y -= otherVec.y;
        this.z -= otherVec.z;
    }
    Multiply(number) {
        return new Vector3(
            this.x * number,
            this.y * number,
            this.z * number
        );
    }
    MutateMultiply(number) {
        this.x *= number;
        this.y *= number;
        this.z *= number;
    }
    Divide(number) {
        return new Vector3(
            this.x / number,
            this.y / number,
            this.z / number
        );
    }
    MutateDivide(number) {
        this.x /= number;
        this.y /= number;
        this.z /= number;
    }
    Dot(otherVec) {
        return this.x * otherVec.x + this.y * otherVec.y + this.z * otherVec.z;
    }
    Cross(otherVec) {
        return new Vector3(
            this.y * otherVec.z - this.z * otherVec.y,
            this.z * otherVec.x - this.x * otherVec.z,
            this.x * otherVec.y - this.y * otherVec.x
        );
    }
    SquareMagnitude() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    Magnitude() {
        return Math.sqrt(this.SquareMagnitude());
    }
    SquareDistance(otherVec) {
        return (this.x - otherVec.x) * (this.x - otherVec.x) +
            (this.y - otherVec.y) * (this.y - otherVec.y) +
            (this.z - otherVec.z) * (this.z - otherVec.z);
    }
    Distance(otherVec) {
        return Math.sqrt(this.SquareDistance(otherVec));
    }
    MutateNormalize() {
        let magnitude = this.Magnitude();
        this.x /= magnitude;
        this.y /= magnitude;
        this.z /= magnitude;
    }
    Normalize() {
        let magnitude = this.Magnitude();
        return new Vector3(
            this.x / magnitude,
            this.y / magnitude,
            this.z / magnitude
        );

    }
    static Dot(firstVector, secondVector) {
        return firstVector.x * secondVector.x + firstVector.y * secondVector.y + firstVector.z * secondVector.z;
    }
    static Cross(firstVec, secondVec) {
        return new Vector3(
            firstVec.y * secondVec.z - firstVec.z * secondVec.y,
            firstVec.z * secondVec.x - firstVec.x * secondVec.z,
            firstVec.x * secondVec.y - firstVec.y * secondVec.x
        );
    }
    static SquareDistance(firstVec, secondVec) {
        return firstVec.SquareDistance(secondVec);
    }
    static Distance(firstVec, secondVec) {
        return Math.sqrt(firstVec.SquareDistance(secondVec));
    }
}
class Matrix4x4 {
    constructor() {
        // Initialize as the identity matrix
        this.data = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }
    SetAsIdentityMatrix() {
        inputMatrix[0][1] = inputMatrix[0][2] = inputMatrix[0][2] = inputMatrix[0][3] =
            inputMatrix[1][0] = inputMatrix[1][2] = inputMatrix[1][2] = inputMatrix[1][3] =
            inputMatrix[2][0] = inputMatrix[2][1] = inputMatrix[2][2] = inputMatrix[2][3] =
            inputMatrix[3][0] = inputMatrix[3][1] = inputMatrix[3][2] = inputMatrix[3][2] = 0;
        inputMatrix[0][0] = inputMatrix[1][1] = inputMatrix[2][2] = inputMatrix[3][3] = 1;
    }
    // Method to multiply this matrix by another matrix
    Multiply(matrix) {
        const result = new Matrix4x4();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result.data[i][j] =
                    this.data[i][0] * matrix.data[0][j] +
                    this.data[i][1] * matrix.data[1][j] +
                    this.data[i][2] * matrix.data[2][j] +
                    this.data[i][3] * matrix.data[3][j];
            }
        }
        return result;
    }
    //@todo:this method need optimization to not use so many arrays
    MultiplyVector3(vector) {
        // Convert Vector3 to Vector4 by adding a homogeneous coordinate (w = 1)
        const vector4 = [vector.x, vector.y, vector.z, 1];

        // Perform matrix multiplication
        const result = [0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result[i] += this.data[i][j] * vector4[j];
            }
        }

        // Convert the result back to a Vector3
        const w = result[3];
        if (w !== 0) {
            return new Vector3(result[0] / w, result[1] / w, result[2] / w);
        } else {
            // Handle division by zero or w = 0 case
            console.error('Division by zero or w = 0');
            return null;
        }
    }
    Translate(x, y, z) {
        const translationMatrix = new Matrix4x4();
        translationMatrix.data[0][3] = x;
        translationMatrix.data[1][3] = y;
        translationMatrix.data[2][3] = z;
        return this.Multiply(translationMatrix);
    }
    Scale(x = 1, y = 1, z = 1) {
        const scaleMatrix = new Matrix4x4();
        scaleMatrix.data[0][0] = x;
        scaleMatrix.data[1][1] = y;
        scaleMatrix.data[2][2] = z;

        return this.Multiply(scaleMatrix);
    }

    //@todo: probably lots of optimization to do here to combine all 3 rotations into one operation
    Rotate(angle, axis) {
        const rotationMatrix = new Matrix4x4();
        const cos = Math.cos(angle * MyMath.DegreesToRadians);
        const sin = Math.sin(angle * MyMath.DegreesToRadians);
        const oneMinusCos = 1 - cos;

        const normalized = axis.Normalize(); // Assuming you have a Vector3 class with a normalize method

        rotationMatrix.data[0][0] = cos + normalized.x * normalized.x * oneMinusCos;
        rotationMatrix.data[0][1] = normalized.x * normalized.y * oneMinusCos - normalized.z * sin;
        rotationMatrix.data[0][2] = normalized.x * normalized.z * oneMinusCos + normalized.y * sin;

        rotationMatrix.data[1][0] = normalized.y * normalized.x * oneMinusCos + normalized.z * sin;
        rotationMatrix.data[1][1] = cos + normalized.y * normalized.y * oneMinusCos;
        rotationMatrix.data[1][2] = normalized.y * normalized.z * oneMinusCos - normalized.x * sin;

        rotationMatrix.data[2][0] = normalized.z * normalized.x * oneMinusCos - normalized.y * sin;
        rotationMatrix.data[2][1] = normalized.z * normalized.y * oneMinusCos + normalized.x * sin;
        rotationMatrix.data[2][2] = cos + normalized.z * normalized.z * oneMinusCos;

        return this.Multiply(rotationMatrix);
    }
}

class Input {
    static {
        Input.keyMap = [];
        Input.priorKeyMap = [];
        Input.mousePosition = new Vector3();
        Input.priorMousePosition = new Vector3();
        Input.mouseDelta = new Vector3();
        //Initialize all keys as not being held down previously.
        for (let i = 0; i < 256; i++)
            Input.priorKeyMap[String.fromCharCode(i)] = false;
        document.addEventListener('keydown', (event) => {
            Input.keyMap[event.key] = true;
        }, false);
        document.addEventListener('keyup', (event) => {
            Input.keyMap[event.key] = false;
        }, false);
        document.addEventListener('mousemove', (event) => {
            // Input.priorMousePosition.x = Input.mousePosition.x;
            // Input.priorMousePosition.y = Input.mousePosition.y;
            Input.mousePosition.x = event.x;
            Input.mousePosition.y = event.y;
        }, false);
    }
    static LateUpdate() {
        for (var key in Input.keyMap)
            Input.priorKeyMap[key] = Input.keyMap[key];
        //@todo: I dunno if the mouse delta functions should be in lateupdate,
        //or if I should make an early Update for them. We'll see when I start using it for mouselook!
        Input.mouseDelta.x = Input.mousePosition.x - Input.priorMousePosition.x;
        Input.mouseDelta.y = Input.mousePosition.y - Input.priorMousePosition.y;
        Input.priorMousePosition.x = Input.mousePosition.x;
        Input.priorMousePosition.y = Input.mousePosition.y;

    }
    static GetKeyDown(key) {
        return Input.keyMap[key] && Input.priorKeyMap[key] == false;
    }
    static GetKey(key) {
        return Input.keyMap[key];
    }
}

class Transform {
    constructor(position = new Vector3(), rotation = new Vector3(), scale = new Vector3(1, 1, 1)) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.matrix = new Matrix4x4();
    }
    GetTrsMatrix(inputMatrix) {
        inputMatrix.SetAsIdentityMatrix();
        inputMatrix.Translate(this.position.x, this.position.y, this.position.z);
        inputMatrix.Rotate(this.rotation.x, Vector3.Left);
        inputMatrix.Rotate(this.rotation.y, Vector3.Up);
        inputMatrix.Rotate(this.rotation.z, Vector3.Forward);
        inputMatrix.Scale(this.scale.x, this.scale.y, this.scale.z);
    }
}
class Mesh {
    constructor(vertices, indices) {
        this.vertices = vertices;
        this.indices = indices;
    }
    static {
        Mesh.plane = new Mesh(
            [
                new Vector3(0, 0, 0),
                new Vector3(1, 0, 0),
                new Vector3(1, 0, 1),
                new Vector3(0, 0, 1)
            ],
            [
                0, 1, 2,
                2, 3, 0
            ]
        );
    }
}
class Object3D {
    constructor(mesh, position = new Vector3(), rotation = new Vector3(), scale = new Vector3(1, 1, 1)) {
        this.transform = new Transform(position, rotation, scale);
        this.mesh = mesh;
    }
    static {
        Object3D.plane = new Object3D(Mesh.plane);
    }
}
class Player {
    constructor(position) {

    }
}