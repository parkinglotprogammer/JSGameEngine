class World {
    static {
        World.archetypesTables = [[]];
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
            for(let index = highestcomponentType+1; index < table.length; index++){
                tableStack.push(table[index]);
            }
            if(table[highestcomponentType] != null) {
                let currentTable = table[highestcomponentType];
                currentTable = World._DrillDownToCorrectTableFromArchetype(archetype.slice(0,-1),currentTable);
                yield currentTable[0];
                // let entities = currentTable[0];
                // for(let i = 0; i < entities.length; i++)
                //     yield entities[i];
            }
        }
    }
    static InsertEntityIntoArchetypeTable(entityArchetype, entityData) {
        let archetypeCopy = [...entityArchetype];
        let currentObject = World.archetypesTables;
        while (archetypeCopy.length > 0) {
            let index = archetypeCopy.pop();
            if(currentObject[index] == null)
                currentObject[index] = [[]];
            currentObject = currentObject[index];
        }
        currentObject[0].push(entityData);
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
        let entities = table[0];
        for(let i =0; i < entities.length; i++) {
            let ent = entities[i];
            if(ent[0] == entity.id) {
                entities[i] = entities[entities.length -1];
                entities.pop();
                return true;
            }
        }
        // for (let i = 0; i < table[0].length; i++) {
        //     if (table[0][i][0] == entity.id) {
        //         table[0][i] = table[0][table[0].length - 1];
        //         table[0].pop();
        //         return true;
        //     }
        // }
        return false;
    }
    static GetEntityFromTable(entity) {
        if (entity.archetype.length < 1)
            return null;
        let table = World._DrillDownToCorrectTableFromArchetype([...entity.archetype], World.archetypesTables);
        //@todo: this is 0(n) performance, but if we kept the tables sorted we could acheive better
        //, at the cost of sorting the tables obviously
        let entities = table[0];
        for(let ent of entities){
            if(ent[0] == entity.id)
                return ent;
        }
        return null;
    }
}
class Component {
    static {
        Component.ID = 1;
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
    AddComponent(componentConstructor) {
        let componentStaticID = componentConstructor.ID;
        if (this.archetype.includes(componentStaticID))
            return null;
        let existingEntityData = World.GetEntityFromTable(this);
        if (existingEntityData == null) {
            existingEntityData = [this.id, [new componentConstructor()]];
        }
        else {
            World.RemoveEntityFromArchetypeTable(this);
            existingEntityData[1].push(new componentConstructor());
            existingEntityData[1].sort((a, b) => a.constructor.ID - b.constructor.ID);
        }
        this.archetype.push(componentStaticID);
        this.archetype.sort((a, b) => a - b);
        let indexOfAddedComponenet = this.archetype.findIndex((x) => x == componentStaticID);
        World.InsertEntityIntoArchetypeTable(this.archetype, existingEntityData);
        return existingEntityData[1][indexOfAddedComponenet];
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
        let data = existingEntityData[1];
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
        for (let i = 0; i < existingEntityData[1].length; i++)
            if (existingEntityData[1][i].constructor === componentType)
                return existingEntityData[1][i];
        return null;
    }
}