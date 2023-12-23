class World {
    static {
        World.tables = new Map();
    }
    static InsertEntityIntoArchetypeTable(entity, data) {
        if (!World.tables.has(entity.components))
            World.tables.set(entity.components, []);
        World.tables.get(entity.components).push(data);
    }
    static RemoveEntityFromArchetypeTable(entity) {
        if (!World.tables.has(entity.components)) {
            console.log("this table doesnt exist");
            return;
        }
        let table = World.tables.get(entity.components);
        let indexToRemove = table.findIndex(obj => obj.id === entity.id);
        if (indexToRemove < 0) {
            console.log("index doesnt exist");
            return;
        }
        table[indexToRemove] = table[table.length];
        table.pop();
    }
    static GetEntityFromTable(entity) {
        if (!World.tables.has(entity.components))
            return null;
        return World.tables.get(entity.components).find(obj => obj.id === entity.id);
    }
}
class Component {
    static {
        Component.ID = 0;
    }
}

class PositionComponent {
    static {
        PositionComponent.ID = Component.ID++;
        Object.freeze(PositionComponent.ID);
    }

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
class VelocityComponent {
    static {
        VelocityComponent.ID = Component.ID++;
        Object.freeze(VelocityComponent.ID);
    }
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
class TestComponent {
    static {
        TestComponent.ID = Component.ID++;
        Object.freeze(TestComponent.ID);
    }
    constructor() {
    }
}

class Entity {
    static {
        this.ids = 0;
    }
    constructor() {
        this.id = Entity.ids++;
        Object.freeze(this.id);
        this.components = [];
    }
    AddComponent(componentID, args) {
        let componentStaticID = componentID.ID;
        if (this.components.includes(componentStaticID))
            return false;
        let existingEntityData = World.GetEntityFromTable(this);
        let newComponent = args ?  new componentID(...args) :  new componentID();
        this.components.push(componentStaticID);
        this.components.sort((a, b) => a - b);
        if (existingEntityData == null)
            existingEntityData = { id: this.id, data: [newComponent] };
        else {
            World.RemoveEntityFromArchetypeTable(this);
            existingEntityData.data.push(newComponent);
            existingEntityData.data.sort((a, b) => a.constructor.ID - b.constructor.ID);
        }
        World.InsertEntityIntoArchetypeTable(this, existingEntityData);
        return true;
    }
    RemoveComponent(componentID) {
        let hasComponent = false;
        //find the index, and if you do, sort it to the end of the component array
        for (let i = 0; i < this.components.length; i++) {
            if (hasComponent = this.components[i] === componentID) {
                for (; i < this.components.length; i++)
                    this.components[i] = this.components[i + 1];
            }
        }
        if (!hasComponent)
            return false;
        let existingEntityData = World.GetEntityFromTable(this);
        if (existingEntityData != null)
            World.RemoveEntityFromArchetypeTable(this);
        this.components.pop();
        let data = existingEntityData.data;
        for (let i = 0; i < data.length; i++) {
            if (data[i].constructor.ID === componentID) {
                for(;i<data.length;i++)
                data[i] = data[i+1]
                data.pop();
            }
        }
        World.InsertEntityIntoArchetypeTable(this, existingEntityData);
        return true;
    }
    GetComponent(componentID) {
        let existingEntityData = World.GetEntityFromTable(this);
        for (let i = 0; i < existingEntityData.data.length; i++)
            if (existingEntityData.data[i].constructor === componentID) 
               return existingEntityData.data[i];
        return null;
    }
}