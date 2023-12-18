const targetFrameRate = 60;
const targetFrameTime = 1000 / targetFrameRate;
let lastTimestamp = 0;
let quit = false;
let interval;
var counter = 0;
Start();


function Start() {
    interval = setInterval(GameUpdate,targetFrameTime);
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

    counter++;
    // Request the next frame
    console.log(counter);
        
}
function Quit() {
    console.log("Game Quit");
}