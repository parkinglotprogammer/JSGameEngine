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