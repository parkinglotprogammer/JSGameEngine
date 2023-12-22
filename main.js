Game.Start();
var counter = 0;
var player;
var camera;
var objsToRender;
function Start() {
    let projectionMatrix = CreateMatrix4v4();
    PerspectiveProjectionMatrix(projectionMatrix, 90, Graphics.width/Graphics.height, .001, 1000);
    console.log(projectionMatrix);
    // player = new Player(new Vector3(0, 0, -2));
    // camera = new Camera(player.transform, new Vector3(0, .15, 0));
    // objsToRender = [];
    // for (let i = 0; i < 2500; i++) {
    //     objsToRender.push(Object3D.CreatePlane(position = new Vector3(-.5, 0, 0), new Vector3(40, 0, 0)));
    // }
    // //objsToRender.push(Object3D.CreatePlane(position = new Vector3(-.5, 0, 0), new Vector3(80, 0, 0)));
}
function Update(deltaTime) {
   
    if (Input.GetKeyDown("q"))
        Game.Quit();
     //player.Update(deltaTime);
    // if (Input.GetKey("e")) {
    //     let fov = camera.fieldOfView;
    //     camera.SetFov(fov + deltaTime * 30);
    // }
    // if (Input.GetKey("r")) {
    //     let fov = camera.fieldOfView;
    //     camera.SetFov(fov - deltaTime * 30);
    // }



}
function GraphicsUpdate() {
    // const cameraMatrixLocation = gl.getUniformLocation(Graphics.shaderProgram, 'uCameraMatrix');

    // const cameraMatrix =
    // gl.uniformMatrix4fv(cameraMatrixLocation, false, cameraMatrix);
    // camera.Render(objsToRender);
}

function Quit() {
    console.log("Game Quit");
}