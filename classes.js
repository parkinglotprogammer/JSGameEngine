class Graphics {
    static gl;
    static vertexShader;
    static fragShader;
    static shaderProgram;
    static vertexBuffer;
    static vertices = [];
    static elementsPerVertex = 4;
    static {
        let canvas = document.querySelector("#glcanvas");
        let gl = canvas.getContext("webgl2");
        Graphics.gl = gl;
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
    }
 
    static CompileShader(shaderType, shaderSource) {
        let shader = Graphics.gl.createShader(shaderType);
        Graphics.gl.shaderSource(shader, shaderSource);
        Graphics.gl.compileShader(shader);
        if (!Graphics.gl.getShaderParameter(shader,  Graphics.gl.COMPILE_STATUS)) {
            console.error("Shader compilation error:",  Graphics.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
    static Render() {
        if(Graphics.vertices.length < 1)
            return;
        let gl = Graphics.gl;
        //gl.bindBuffer(gl.ARRAY_BUFFER, Graphics.vertexBuffer);
        //@todo:find way to not be making a new Float32Array here
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Graphics.vertices), gl.DYNAMIC_DRAW);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, Graphics.vertices.length / Graphics.elementsPerVertex);
    }
    static DrawTriangle() {
        Graphics.vertices.push();
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
        if(Game.quit)
            return;
        Game.targetFrameRate = targetFrameRate;
        Game.targetFrameTime = 1000 / targetFrameRate;
        clearInterval(Game.updateInterval);
        Game.updateInterval = setInterval(Game.GameUpdate,Game.targetFrameTime);
    }
    static Start(){
        Game.updateInterval = setInterval(Game.Update,Game.targetFrameTime);
        requestAnimationFrame(Game.GraphicsUpdate);
        Start();
    }
    static GraphicsUpdate(){
        Graphics.Render();
        if(!Game.quit)
            requestAnimationFrame(Game.GraphicsUpdate);
    }
    static Update() {
        // Calculate elapsed time since the last frame
        const thisTime = performance.now();
        Game.deltaTime = thisTime - Game.lastTime;
        Game.lastTime = thisTime;
        Update(Game.deltaTime);
    }
    static Quit() {
        Game.quit = true;
        Quit();
        clearInterval(Game.updateInterval);
    }
}

class Input {

}