Game.Start();
var counter = 0;
function Start() {
}
function Update(deltaTime) {
    if(Input.GetKeyDown("q"))
        Game.Quit();
    if(Input.GetKey("m"))
        console.log("m is held down");
}

function Quit() {
    console.log("Game Quit");
}