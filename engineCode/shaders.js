
var vertexShader = 
`
uniform mat4 uCameraMatrix;
attribute vec4 position;
varying vec3 color;

void main() {
    gl_Position = uCameraMatrix * vec4(position.xyz, 1.0);
    color = vec3(position.w, position.w, position.w);
}
`;

var fragShader = 
`
precision mediump float;
varying vec3 color;

void main() {
    gl_FragColor = vec4(color,1.0);
}
`;