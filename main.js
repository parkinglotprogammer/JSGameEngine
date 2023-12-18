const targetFrameRate = 60;
const targetFrameTime = 1000 / targetFrameRate;
let lastTimestamp = 0;
let quit = false;
let gameUpdateInterval;
var counter = 0;
Start();


function Start() {
    gameUpdateInterval = setInterval(GameUpdate,targetFrameTime);
    requestAnimationFrame(GraphicsUpdate);
}
function GraphicsUpdate(){
    Graphics.Render();
    if(!quit)
        requestAnimationFrame(GraphicsUpdate);
}
function GameUpdate() {
    // Calculate elapsed time since the last frame
    //const deltaTime = timestamp - lastTimestamp;
    quit = counter++ >= 50;
    // Request the next frame
    console.log(counter);
    if(quit)
        Quit();
}
function Quit() {
    clearInterval(gameUpdateInterval);
    console.log("Game Quit");
}