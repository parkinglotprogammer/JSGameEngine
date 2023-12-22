class Graphics {
    static {
        //Hide scrollbars, remove margin and padding
        document.body.style.overflow = 'hidden';
        document.body.style.margin = 0;
        document.body.style.padding = 0;

        Graphics.canvas = document.querySelector("#glcanvas");
        let gl = Graphics.canvas.getContext("webgl2");
        Graphics.gl = gl;
        Graphics.vertices = [];
        Graphics.elementsPerVertex = 4;
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
        console.log(Graphics.vertices.length);
        let gl = Graphics.gl;
        //@todo:find way to not be making a new Float32Array here every time
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Graphics.vertices), gl.DYNAMIC_DRAW);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, Graphics.vertices.length / Graphics.elementsPerVertex);
        Graphics.vertices.length = 0;
    }
    static DrawTrianglePoints(aX,aY,aZ,bX,bY,bZ,cX,cY,cZ,color) {
        Graphics.vertices.push(
            aX, aY, aZ, color,
            bX, bY, bZ, color,
            cX, cY, cZ, color,
        );
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
        Game.targetFrameRate = 60;
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
        GraphicsUpdate();
        Graphics.Render();
        if (!Game.quit)
            requestAnimationFrame(Game.GraphicsUpdate);
    }
    static Update() {
        // Calculate elapsed time since the last frame
        const thisTime = performance.now();

        Game.deltaTime = (thisTime - Game.lastTime) / 1000;
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
    static Clamp(value,min,max){
        if(value < min)
            value = min;
        if(value > max)
            value = max;
        return value;
    } 
}
class Vector3 {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.array = [x,y,z,w];
    }
    get x() {
        return this.array[0];
    }
    set x(val) {
        this.array[0] = val;
    }
    get y() {
        return this.array[1];
    }
    set y(val) {
        this.array[1] = val;
    }
    get z() {
        return this.array[2];
    }
    set z(val) {
        this.array[2] = val;
    }
    get w() {
        return this.array[2];
    }
    set w(val) {
        this.array[3] = val;
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
            this.array[0] + otherVec.array[0],
            this.array[1] + otherVec.array[1],
            this.array[2] + otherVec.array[2]
        );
    }
    MutateAdd(otherVec) {
        this.array[0] += otherVec.array[0];
        this.array[0] += otherVec.array[1];
        this.array[2] += otherVec.array[2];
    }
    Subtract(otherVec) {
        return new Vector3(
            this.array[0] - otherVec.array[0],
            this.array[1] - otherVec.array[1],
            this.array[2] - otherVec.array[2]
        );
    }
    MutateSubtract(otherVec) {
        this.array[0] -= otherVec.array[0];
        this.array[1] -= otherVec.array[1];
        this.array[2] -= otherVec.array[2];
    }
    Multiply(number) {
        return new Vector3(
            this.array[0] * number,
            this.array[1] * number,
            this.array[2] * number
        );
    }
    MutateMultiply(number) {
        this.array[0] *= number;
        this.array[1] *= number;
        this.array[2] *= number;
    }
    Divide(number) {
        return new Vector3(
            this.array[0] / number,
            this.array[1] / number,
            this.array[2] / number
        );
    }
    MutateDivide(number) {
        this.array[0] /= number;
        this.array[1] /= number;
        this.array[2] /= number;
    }
    Dot(otherVec) {
        return this.array[0] * otherVec.array[0] + this.array[1] * otherVec.array[1] + this.array[2] * otherVec.array[2];
    }
    Cross(otherVec) {
        return new Vector3(
            this.array[1] * otherVec.array[2] - this.array[2] * otherVec.array[1],
            this.array[2] * otherVec.array[0] - this.array[0] * otherVec.array[2],
            this.array[0] * otherVec.array[1] - this.array[1] * otherVec.array[0]
        );
    }
    SquareMagnitude() {
        return this.array[0] * this.array[0] + this.array[1] * this.array[1] + this.array[2] * this.array[2];
    }
    Magnitude() {
        return Math.sqrt(this.SquareMagnitude());
    }
    SquareDistance(otherVec) {
        return (this.array[0] - otherVec.array[0]) * (this.array[0] - otherVec.array[0]) +
            (this.array[1] - otherVec.array[1]) * (this.array[1] - otherVec.array[1]) +
            (this.array[2] - otherVec.array[2]) * (this.array[2] - otherVec.array[2]);
    }
    Distance(otherVec) {
        return Math.sqrt(this.SquareDistance(otherVec));
    }
    MutateNormalize() {
        let magnitude = this.Magnitude();
        this.array[0] /= magnitude;
        this.array[1] /= magnitude;
        this.array[2] /= magnitude;
    }
    Normalize() {
        let magnitude = this.Magnitude();
        return new Vector3(
            this.array[0] / magnitude,
            this.array[1] / magnitude,
            this.array[2] / magnitude
        );

    }
    SetFromVector(otherVector) {
        this.array[0] = otherVector.x;
        this.array[1] = otherVector.y;
        this.array[2] = otherVector.z;
    }
    GetCopy(){
        return new Vector3(this.array[0],this.array[1],this.array[2],this.array[3]);
    }
    Invert() {
        this.array[0] = -this.array[0];
        this.array[1] = -this.array[1];
        this.array[2] = -this.array[2];
        this.array[3] = -this.array[3];
        return this;
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
    static CalculateNormal(A, B, C) {
        const AB = B.Subtract(A).Normalize();
        const AC = C.Subtract(A).Normalize();
        return Vector3.Cross(AB,AC);//
    }
}
class Matrix4x4 {
    static {
        Matrix4x4.tempMatrix = new Matrix4x4();
        Matrix4x4.tempVector4 = [0,0,0,0];
    }
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
        this.data[0][1] = this.data[0][2] = this.data[0][2] = this.data[0][3] =
            this.data[1][0] = this.data[1][2] = this.data[1][2] = this.data[1][3] =
            this.data[2][0] = this.data[2][1] = this.data[2][2] = this.data[2][3] =
            this.data[3][0] = this.data[3][1] = this.data[3][2] = this.data[3][2] = 0;
        this.data[0][0] = this.data[1][1] = this.data[2][2] = this.data[3][3] = 1;
    }
    // Method to multiply this matrix by another matrix
    Multiply(matrixToMultiply) {
        Matrix4x4.tempMatrix.SetAsIdentityMatrix();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                Matrix4x4.tempMatrix.data[i][j] =
                    this.data[i][0] * matrixToMultiply.data[0][j] +
                    this.data[i][1] * matrixToMultiply.data[1][j] +
                    this.data[i][2] * matrixToMultiply.data[2][j] +
                    this.data[i][3] * matrixToMultiply.data[3][j];
            }
        }
        return Matrix4x4.tempMatrix;
    }
    //@todo:this method need optimization to not use so many arrays
    MutateMultiplyVector3(vector) {
        // Convert Vector3 to Vector4 by adding a homogeneous coordinate (w = 1)
        vector.array[3] = 1;
        Matrix4x4.tempVector4[0] = Matrix4x4.tempVector4[1] = Matrix4x4.tempVector4[2] = Matrix4x4.tempVector4[3] = 0;
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++) 
                Matrix4x4.tempVector4[i] += this.data[i][j] * vector.array[j];
        //@todo:potential divide by 0 if result[3] == 0, not sure if it's possible
        vector.array[0] = Matrix4x4.tempVector4[0] / Matrix4x4.tempVector4[3];
        vector.array[1] = Matrix4x4.tempVector4[1] / Matrix4x4.tempVector4[3];
        vector.array[2] = Matrix4x4.tempVector4[2] / Matrix4x4.tempVector4[3];     
    }
    Translate(x = 0, y = 0, z = 0) {
        this.data[0][3] += x;
        this.data[1][3] += y;
        this.data[2][3] += z;
    }
    Scale(x = 1, y = 1, z = 1) {
        this.data[0][0] *= x;
        this.data[1][1] *= y;
        this.data[2][2] *= z;
    }

    RotateX(angle) {
        angle *= MyMath.DegreesToRadians;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const tempX = this.data[1][1];
        this.data[1][1] = this.data[1][1] * cos - this.data[2][1] * sin;
        this.data[2][1] = tempX * sin + this.data[2][1] * cos;
    }
    RotateY(angle) {
        angle *= MyMath.DegreesToRadians;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const temp = this.data[0][0]; 
        this.data[0][0] = this.data[0][0] * cos + this.data[2][0] * sin;
        this.data[2][0] = -temp * sin + this.data[2][0] * cos;
    }
    RotateZ(angle) {
        angle *= MyMath.DegreesToRadians;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const temp = this.data[0][0];
        this.data[0][0] = this.data[0][0] * cos - this.data[1][0] * sin;;
        this.data[1][0] = temp * sin + this.data[1][0] * cos;
    }
    Rotate(angleX, angleY, angleZ) {
        this.RotateX(angleX);
        this.RotateY(angleY);
        this.RotateZ(angleZ);
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

class Plane {
    constructor(normal, pointOnPlane) {
        this.normal = normal.GetCopy();
        this.originDist = Vector3.Dot(normal,pointOnPlane);
    }
    LineIntersection(line_start, line_end, pointToSet) {
        let d0 = Vector3.Dot(this.normal, line_start) - this.originDist;
        let d1 = Vector3.Dot(this.normal, line_end) - this.originDist;
        if ((d0 >= 0) == (d1 >= 0))
            return false;
        let t = d0 / (d0 - d1);
        pointToSet.x =(line_end.x - line_start.x) * t + line_start.x;
        pointToSet.y =(line_end.y - line_start.y) * t + line_start.y;
        pointToSet.z =(line_end.z - line_start.z) * t + line_start.z;
        return true;
    }
    DistanceToPoint(point) {
        return Vector3.Dot(this.normal, point) - this.originDist;
    }
    ToString(){
        return `${this.normal.ToString()},d=${this.originDist}`;
    }
}

class Transform {
    constructor(position = new Vector3(), rotation = new Vector3(), scale = new Vector3(1, 1, 1)) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }
    Move(x, y, z) {
        this.position.x += x;
        this.position.y += y;
        this.position.z += z;
    }
    Rotate(x, y, z) {
        this.rotation.x += x;
        this.rotation.y += y;
        this.rotation.z += z;
    }
    Scale(x, y, z) {
        this.scale.x += x;
        this.scale.y += y;
        this.scale.z += z;
    }
    SetPosition(x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }
    SetRotation(x, y, z) {
        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;
    }
    SetScale(x, y, z) {
        this.scale.x = x;
        this.scale.y = y;
        this.scale.z = z;
    }
    GetTrsMatrix(inputMatrix) {
        inputMatrix.Translate(this.position.x, this.position.y, this.position.z);
        inputMatrix.Rotate(this.rotation.x,this.rotation.y,this.rotation.z);
        inputMatrix.Scale(this.scale.x, this.scale.y, this.scale.z);
    }
    ResetGetTrsMatrix(inputMatrix) {
        inputMatrix.SetAsIdentityMatrix();
        this.GetTrsMatrix(inputMatrix);
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
                new Vector3(1, 1, 0),
                new Vector3(0, 1, 0)
            ],
            [
                0, 1, 2,
                2, 3, 0
            ]
        );
    }
}
class Object3D {
    constructor(mesh, position = new Vector3(0, 0, 0), rotation = new Vector3(), scale = new Vector3(1, 1, 1), color = 1) {
        this.transform = new Transform(position, rotation, scale);
        this.mesh = mesh;
        this.color = color;
    }
    //Give an array of 3 points to use to reduce garbage generation
    *IterateTriangles(threeVectorArray) {
        for (let i = 0; i < this.mesh.indices.length; i += 3) {
            threeVectorArray[0].SetFromVector(this.mesh.vertices[this.mesh.indices[i]]);
            threeVectorArray[1].SetFromVector(this.mesh.vertices[this.mesh.indices[i+1]]);
            threeVectorArray[2].SetFromVector(this.mesh.vertices[this.mesh.indices[i+2]]);
            yield threeVectorArray;
        }
    }
    ToObjectSpace(point, index) {
        point.SetFromVector(this.mesh.vertices[this.mesh.indices[index]]);
        this.transform.SetTransformPoint(point);
    }
    static CreatePlane(position = new Vector3(0, 0, 0), rotation = new Vector3(), scale = new Vector3(1, 1, 1), color = 1){
        let plane = new Object3D(Mesh.plane, position, rotation, scale);
        return plane;
    }

}
class Player {
    constructor(position) {
        this.transform = new Transform(position);
        this.movementSpeed = 3;
        //@todo: maybe put forward in transform class..
        //but does every object really need a forward direction?
        //perhaps we make an entity class, which is basically
        //an object that has a looking rotation used for players and mobs
        //and stuff
        this.forward = new Vector3(0, 0, 1);
    }
    Update(deltaTime) {
        let movementAmount = this.movementSpeed * deltaTime;
        if (Input.GetKey("w")) {
            this.transform.position.x += this.forward.x * movementAmount;
            this.transform.position.y += this.forward.y * movementAmount;
            this.transform.position.z += this.forward.z * movementAmount;
        }
        if (Input.GetKey("s")) {
            this.transform.position.x -= this.forward.x * movementAmount;
            this.transform.position.y -= this.forward.y * movementAmount;
            this.transform.position.z -= this.forward.z * movementAmount;
        }
    }
}
class SceneTree {
    /*
    This class should be used to subdivide the world by the objects it contains,
    to reduce the number of operations the camera has to do. Should be responsible for frustum
    culling, occlusion culling, etc
    */
}
class Camera {
    constructor(transform = new Transform(), offset = new Vector3()) {
        this.nearClipPlane = .0001;
        this.farClipPlane = 1000;
        this.transform = transform;
        this.offset = offset;
        this.SetFov(90);
    }
    Render(objsToRender) {
        let viewMatrix = new Matrix4x4();
        viewMatrix.Translate(this.offset.x, this.offset.y, this.offset.z);
        this.transform.GetTrsMatrix(viewMatrix);

        let objectMatrix = new Matrix4x4();
        let threeVectorArray = [new Vector3(), new Vector3(), new Vector3()];
        for (let objectToRender of objsToRender) {
            objectToRender.transform.ResetGetTrsMatrix(objectMatrix)
            objectMatrix = objectMatrix.Multiply(viewMatrix);
            for (let worldSpaceTriangle of objectToRender.IterateTriangles(threeVectorArray)) {
                for(let vec of worldSpaceTriangle)
                    objectMatrix.MutateMultiplyVector3(vec);
                for (const point of worldSpaceTriangle)
                    this.SetPerspectiveProjection(point);

                Graphics.DrawTrianglePoints(worldSpaceTriangle[0].x,worldSpaceTriangle[0].y,worldSpaceTriangle[0].z,
                    worldSpaceTriangle[1].x,worldSpaceTriangle[1].y,worldSpaceTriangle[1].z,
                    worldSpaceTriangle[2].x,worldSpaceTriangle[2].y,worldSpaceTriangle[2].z,
                    objectToRender.color
                    );
            }
            //iterate it's triangles
            //transform them to view space
            //clip them
            //draw them
        }
    }
    SetFov(angle) {
        angle = MyMath.Clamp(angle, 10, 120);
        this.aspectRatio = Graphics.width / Graphics.height;
        this.fieldOfView = angle;
        let halfProjectionWidth = 1 / Math.tan(this.fieldOfView / 2 * MyMath.DegreesToRadians);
        this.perspectiveProjectConstantX = halfProjectionWidth;// / this.aspectRatio;
        this.perspectiveProjectConstantY = halfProjectionWidth / this.aspectRatio;
        this.CreateClippingPlanes();
    }
    SetPerspectiveProjection(point) {
        let depth = point.z / this.farClipPlane;
        point.x = point.x / point.z / this.perspectiveProjectConstantX;
        point.y = point.y / point.z / this.perspectiveProjectConstantY;
        point.z = depth;
    }
    SetPerspectiveUnprojection(point) {
        let depth = this.farClipPlane * point.z;
        point.x = depth / this.perspectiveProjectConstantX * point.x;
        point.y = depth / this.perspectiveProjectConstantY * point.y;
        point.z = depth;
    }
    CreateClippingPlanes() {
        let farDist = Graphics.width / 2 / Math.tan(this.fieldOfView / 2 * MyMath.DegreesToRadians);
        let halfWidth = Graphics.width/2;
        let halfHeight = Graphics.height/2;
        var topLeft = new Vector3(-halfWidth, halfHeight, farDist);
        var botLeft = new Vector3(-halfWidth, -halfHeight, farDist);
        var topRight = new Vector3(halfWidth, halfHeight, farDist);
        var botRight = new Vector3(halfWidth, -halfHeight, farDist);
        var nearPlane = new Plane(Vector3.Forward, new Vector3(0, 0, this.nearClipPlane));
        var topNormal = Vector3.CalculateNormal(Vector3.Zero, topLeft, topRight).Normalize().Invert();
        var topPlane = new Plane(topNormal, Vector3.Zero);
        var botNormal = Vector3.CalculateNormal(Vector3.Zero, botLeft, botRight).Normalize();
        var botPlane = new Plane(botNormal, Vector3.Zero);
        var leftNormal = Vector3.CalculateNormal(Vector3.Zero, botLeft, topLeft).Normalize().Invert();
        var leftPlane = new Plane(leftNormal, Vector3.Zero);
        var rightNormal = Vector3.CalculateNormal(Vector3.Zero, botRight, topRight).Normalize();
        var rightPlane = new Plane(rightNormal, Vector3.Zero);
        this.clippingPlanes = [nearPlane, leftPlane, rightPlane, topPlane, botPlane];
    }
}
