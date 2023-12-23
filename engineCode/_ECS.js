class World {
    static {
        World.archetypesTables = {};
    }
    static CreateArchetype() {
        let archetype = [];
        for (const componentType of arguments)
            archetype.push(componentType.ID);
        archetype.sort((a, b) => a - b);
        return archetype;
    }
    static *GetEntities(archetype) {
        let highestcomponentType = archetype[archetype.length - 1];
        let tableStack = [World.archetypesTables];
        while (tableStack.length > 0) {
            let table = tableStack.pop();
            const tableKeys = Object.keys(table);
            for (let index in tableKeys) {
                let tableKey = Number(tableKeys[index]);
                if (isNaN(tableKey) || tableKey < highestcomponentType)
                    continue;
                let value = table[tableKey];
                if (tableKey > highestcomponentType) {
                    tableStack.push(value);
                    continue;
                }
                value = World._DrillDownToCorrectTableFromArchetype(archetype.slice(0,-1),value);
                for (const entity in value.entities)
                    yield value.entities[entity];
            }
        }
    }
    static InsertEntityIntoArchetypeTable(entityArchetype, entityData) {
        let archetypeCopy = [...entityArchetype];
        let currentObject = World.archetypesTables;
        //This is essentially the DrillDown method but we need to insert emptys
        //as we go if they don't exist yet.
        while (archetypeCopy.length > 0) {
            let index = archetypeCopy.pop();
            if (currentObject[index] == null)
                currentObject[index] = { entities: [] };
            currentObject = currentObject[index];
        }
        currentObject.entities.push(entityData);
    }
    static _DrillDownToCorrectTableFromArchetype(archetype, table) {
        while (archetype.length > 0) {
            let index = archetype.pop();
            if (table[index] == null)
                break;
            table = table[index];
        }
        return table;
    }
  
    static RemoveEntityFromArchetypeTable(entity) {
        if (entity.archetype.length < 1)
            return false;
        let table = World._DrillDownToCorrectTableFromArchetype([...entity.archetype],World.archetypesTables);
        for (let i = 0; i < table.entities.length; i++) {
            if (table.entities[i].id == entity.id) {
                table.entities[i] = table.entities[table.entities.length - 1];
                table.entities.pop();
                return true;
            }
        }
        return false;
    }
    static GetEntityFromTable(entity) {
        if (entity.archetype.length < 1)
            return null;
        let object = World._DrillDownToCorrectTableFromArchetype([...entity.archetype], World.archetypesTables);
        //@todo: this is 0(n) performance, but if we kept the tables sorted we could acheive better
        //, at the cost of sorting the tables obviously
        for (const entityData of object.entities)
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
class Entity {
    static {
        this.ids = 0;
    }
    constructor() {
        this.id = Entity.ids++;
        Object.freeze(this.id);
        this.archetype = [];
    }
    AddComponent(component) {
        let componentStaticID = component.constructor.ID;
        if (this.archetype.includes(componentStaticID))
            return false;
        let existingEntityData = World.GetEntityFromTable(this);
        if (existingEntityData == null)
            existingEntityData = { id: this.id, data: [component] };
        else {
            World.RemoveEntityFromArchetypeTable(this);
            existingEntityData.data.push(component);
            existingEntityData.data.sort((a, b) => a.constructor.ID - b.constructor.ID);
        }
        this.archetype.push(componentStaticID);
        this.archetype.sort((a, b) => a - b);
        World.InsertEntityIntoArchetypeTable(this.archetype, existingEntityData);
        return true;
    }
    RemoveComponent(componentType) {
        let staticcomponentType = componentType.ID;
        let removeIndex = -1;
        //find the index, and if you do, sort it to the end of the component array
        for (let i = 0; i < this.archetype.length; i++) {
            if (this.archetype[i] == staticcomponentType) {
                removeIndex = i;
                break;
            }
            return false;
        }
        let existingEntityData = World.GetEntityFromTable(this);
        if (existingEntityData != null)
            World.RemoveEntityFromArchetypeTable(this);
        let data = existingEntityData.data;
        for (let i = 0; i < data.length; i++) {
            if (data[i].constructor.ID === componentType) {
                for (; i < data.length; i++)
                    data[i] = data[i + 1]
                data.pop();
            }
        }
        for (let i = removeIndex; i < this.archetype.length; i++) {
            this.archetype[i] = this.archetype[i + 1];
        }
        this.archetype.pop();
        World.InsertEntityIntoArchetypeTable(this.archetype, existingEntityData);
        return true;
    }
    GetComponent(componentType) {
        let existingEntityData = World.GetEntityFromTable(this);
        for (let i = 0; i < existingEntityData.data.length; i++)
            if (existingEntityData.data[i].constructor === componentType)
                return existingEntityData.data[i];
        return null;
    }
}