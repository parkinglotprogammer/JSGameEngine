let transforms = [];
let randomData = [];
let randomdata2 = [];
let randomdata3 = [];
let meshes = [];
let timer = 0;
Game.Start();
var counter = 0;
var player;
var objsToRender;

function Start() {
    for(let i = 0; i < 1000000; i++) {
        var ent = new Entity();
        let transform = ent.AddComponent(Transform);
        //console.log(transform);
        transform.x = i/2;
        transform.y = i/2;
        transform.z = 0;
        let mesh =ent.AddComponent(Mesh);
        mesh.x = i/2;
        mesh.y = i/2;
        mesh.z = 0;
        transforms.push(new Transform());
        randomdata2.push(23123);
        randomdata3.push(44124);
        meshes.push(new Mesh());
        randomData.push(23154124);
    }
    console.log( World.archetypesTables);
}
function Update(deltaTime) {
    if (Input.GetKeyDown("q"))
        Game.Quit();

      
        console.time("manual")
        let combined = [];
        for(let i = 0; i < transforms.length; i++) {
           
            let t = transforms[i];
            let m = meshes[i];
            combined[0]+= t.x + m.x;
            combined[1]+= t.y + m.y;
            combined[2]+= t.z + m.z;
           
        }
        console.timeEnd("manual");

        console.time("ecs");
        RenderSystem.Update();
        console.timeEnd("ecs");
    
}

function GraphicsUpdate() {
   
}

function Quit() {
    console.log("Game Quit");
}