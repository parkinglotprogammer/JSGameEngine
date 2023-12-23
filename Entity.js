class World {
    static {
        World.archetypesTables = {};
    }
    static InsertEntityIntoArchetypeTable(entityArchetype, entityData) {
        let cache = [];
        for (let i = 0; i < entityArchetype.length; i++)
            cache.push(entityArchetype[i]);

        let currentObject = World.archetypesTables;
        while (cache.length > 0) {
            let index = cache.pop();
            if (currentObject[index] == null)
                currentObject[index] = { entities: [] };
            currentObject = currentObject[index];
        }
        currentObject.entities.push(entityData);
    }
    static oldInsert(entity, data) {
        if (!World.tables.has(entity.components))
            World.tables.set(entity.components, []);
        World.tables.get(entity.components).push(data);
    }
    static RemoveEntityFromArchetypeTable(entity) {
        if (entity.components.length < 1)
            return false;
        let cache = [];
        for (let i = 0; i < entity.components.length; i++)
            cache.push(entity.components[i]);
        let currentObject = World.archetypesTables;
        while (cache.length > 0) {
            let index = cache.pop();
            currentObject = currentObject[index];
        }
        for (let i = 0; i < currentObject.entities.length; i++) {
            if (currentObject.entities[i].id == entity.id) {
                currentObject.entities[i] = currentObject.entities[currentObject.entities.length - 1];
                currentObject.entities.pop();
                return true;
            }
        }
        return false;
    }
    static oldGet(entity) {
        if (!World.tables.has(entity.components))
            return null;
        return World.tables.get(entity.components).find(obj => obj.id === entity.id);
    }
    static GetEntityFromTable(entity) {
        if (entity.components.length < 1)
            return null;
        let cache = [];
        for (let i = 0; i < entity.components.length; i++)
            cache.push(entity.components[i]);
        let currentObject = World.archetypesTables;
        while (cache.length > 0) {
            let index = cache.pop();
            currentObject = currentObject[index];
        }
        for (const entityData of currentObject.entities)
            if (entityData.id == entity.id)
                return entityData;

        return null;
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
        let newComponent = args ? new componentID(...args) : new componentID();

        if (existingEntityData == null)
            existingEntityData = { id: this.id, data: [newComponent] };
        else {
            World.RemoveEntityFromArchetypeTable(this);
            existingEntityData.data.push(newComponent);
            existingEntityData.data.sort((a, b) => a.constructor.ID - b.constructor.ID);
        }
        this.components.push(componentStaticID);
        this.components.sort((a, b) => a - b);
        World.InsertEntityIntoArchetypeTable(this.components, existingEntityData);
        return true;
    }
    RemoveComponent(componentID) {
        let staticComponentID = componentID.ID;
        let removeIndex = -1;
        //find the index, and if you do, sort it to the end of the component array
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i] == staticComponentID) {
                removeIndex = i;
                break;
            }
            return false;
        }
        let existingEntityData = World.GetEntityFromTable(this);
        if (existingEntityData != null)
            World.RemoveEntityFromArchetypeTable(this);
        this.components.pop();
        let data = existingEntityData.data;
        for (let i = 0; i < data.length; i++) {
            if (data[i].constructor.ID === componentID) {
                for (; i < data.length; i++)
                    data[i] = data[i + 1]
                data.pop();
            }
        }
        for (let i = removeIndex; i < this.components.length; i++) {
            this.components[i] = this.components[i + 1];
        }
        this.components.pop();

        World.InsertEntityIntoArchetypeTable(this.components, existingEntityData);
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