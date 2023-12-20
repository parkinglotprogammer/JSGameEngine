Game.Start();
var counter = 0;
var player;
function Start() {
    player = new Player(new Vector3());
}
function Update(deltaTime) {
    player.Update(deltaTime);
    if(Input.GetKeyDown("q"))
        Game.Quit();
    if(Input.GetKey("m"))
        console.log("m is held down");
}

function Quit() {
    console.log("Game Quit");
}