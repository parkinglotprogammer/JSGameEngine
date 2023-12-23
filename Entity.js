class World {
    static {
        World.tables = new Map();
        World.componentConstructors = [];
    }
    static CreateComponent(componentType, args) {
        return new World.componentConstructors[componentType](...args);
    }
    static InsertEntityIntoArchetypeTable(entity, data) {
        if (!World.tables.has(entity.components))
            World.tables.set(entity.components, [0]);
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
        if (!World.tables.has(entity.components)) {
            return null;
        }
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
        World.componentConstructors.push(PositionComponent);
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
        World.componentConstructors.push(VelocityComponent);
    }
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
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
        if (this.components.includes(componentID)) {
            console.log("This entity already has that component");
            return false;
        }
        this.components.push(componentID);
        this.components.sort((a, b) => a - b);
        let existingEntityData = World.GetEntityFromTable(this);
        if (existingEntityData == null) {
            existingEntityData = { id: this.id, data: [] };
            existingEntityData.data.push(World.CreateComponent(componentID, args));
        }
        else {
            existingEntityData.data.push(World.CreateComponent(componentID, args));
            existingEntityData.data.sort((a, b) => a.constructor.ID - b.constructor.ID);
            World.RemoveEntityFromArchetypeTable(this);
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
        let entityData = existingEntityData.data;
        for (let i = 0; i < entityData.length; i++) {
            if (entityData[i].constructor.ID === componentID) {
                for(;i<entityData.length;i++)
                    entityData[i] = entityData[i+1]
                entityData.pop();
            }
        }
        World.InsertEntityIntoArchetypeTable(this, existingEntityData);
        return true;
    }
    GetComponent(componentID) {
        let existingEntityData = World.GetEntityFromTable(this);
        for (let i = 0; i < existingEntityData.data.length; i++)
            if (existingEntityData.data[i].constructor.ID === componentID) 
               return existingEntityData.data[i];
        return null;
    }
}