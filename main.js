Game.Start();
var counter = 0;
function Start() {
    console.log(Vector3.Zero.z);
    Vector3.Zero.z = -1;
    console.log(Vector3.Zero.z);
}
function Update(deltaTime) {
    // if(counter++ >= 50)
    //     Game.Quit();
    if(Input.GetKeyDown("q")) {
        console.log("q is down");
        //Game.Quit();
    }
    if(Input.GetKey("m")) {
        console.log("m is held down");
        //Game.Quit();
    }
}

function Quit() {
    console.log("Game Quit");
}