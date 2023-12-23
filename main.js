Game.Start();
var counter = 0;
var player;
var objsToRender;
function Start() {
    var ent = new Entity();
    var ent2 = new Entity();
    var ent3 = new Entity();
   
    ent.AddComponent(VelocityComponent, [1,2,3]);
    ent.AddComponent(PositionComponent, [3,3,3]);
    ent.AddComponent(TestComponent);

    ent2.AddComponent(VelocityComponent, [1,2,3]);
    ent2.AddComponent(PositionComponent, [3,3,3]);

    ent3.AddComponent(TestComponent);

    ent.RemoveComponent(VelocityComponent);
    ent.RemoveComponent(PositionComponent);
    ent.RemoveComponent(TestComponent);
    //ent.RemoveComponent(1);
    // let posComponenet = ent.GetComponent(PositionComponent);
    // console.log(posComponenet);
    // posComponenet.x = -5;
    //console.log(World.GetEntityFromTable(ent));
    console.log(World.archetypesTables);
}
function Update(deltaTime) {
    if (Input.GetKeyDown("q"))
        Game.Quit();
  
}

function GraphicsUpdate() {

}

function Quit() {
    console.log("Game Quit");
}