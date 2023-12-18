Game.Start();
var counter = 0;
function Start() {
}
function Update(deltaTime) {
    if(counter++ >= 50)
        Game.Quit();
}

function Quit() {
}