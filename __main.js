Game.Start();
var counter = 0;
var player;
var objsToRender;
function Start() {
    var ent = new Entity();
    ent.AddComponent(new Transform());
    ent.AddComponent(new Mesh());
    var ent2 = new Entity();
    ent2.AddComponent(new Transform());
    ent2.AddComponent(new Mesh());

}
function Update(deltaTime) {
    if (Input.GetKeyDown("q"))
        Game.Quit();
    RenderSystem.Update();
    //console.log("sanity");
  
}

function GraphicsUpdate() {

}

function Quit() {
    console.log("Game Quit");
}