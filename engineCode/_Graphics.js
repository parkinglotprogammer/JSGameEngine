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