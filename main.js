Game.Start();
var counter = 0;
var player;
var objsToRender;
function Start() {
    var ent = new Entity();
    var ent2 = new Entity();
    var ent3 = new Entity();
    var ent4 = new Entity();
    var ent5 = new Entity();

    ent4.AddComponent(PositionComponent,[1,2,3]);
    ent4.AddComponent(VelocityComponent,[1,2,3]);

    ent5.AddComponent(PositionComponent,[1,2,3]);
  
    ent5.AddComponent(VelocityComponent,[12,12,12]);
  
   
    ent.AddComponent(PositionComponent, [6,6,6]);
    ent.AddComponent(VelocityComponent, [8,8,8]);
    ent.AddComponent(TestComponent);

    ent2.AddComponent(PositionComponent, [3,3,3]);
    ent2.AddComponent(VelocityComponent, [1,2,3]);

  
    ent3.AddComponent(PositionComponent, [5,4,5]);

    ent2.RemoveComponent(PositionComponent);
    //console.log(World.archetypesTables);
    let velocPosarch = World.CreateArchetype(VelocityComponent,PositionComponent);
    for(const entity of World.GetEntities(velocPosarch)) {
        //console.log(entity);
    }
    //ent.RemoveComponent(1);
    // let posComponenet = ent.GetComponent(PositionComponent);
    // console.log(posComponenet);
    // posComponenet.x = -5;
    //console.log(World.GetEntityFromTable(ent));
    //console.log(World.archetypesTables);
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