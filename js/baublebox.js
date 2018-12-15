export class Bauble {
    constructor(name, priority) {
        this.name = name;
        this.priority = priority;
    }
}

export default class BaubleBox {
    constructor(pokitOS) {
        this.pokitOS = pokitOS;
        this.__entities = new Set();
        this.__componentMakers = new Map();
        this.__components = new Map();
        this.__systems = new Map();
        this.__renderers = new Map();
        this.initializeComponent('transform', function(initialvalue, entityID) {
            return Object.assign({entityID: entityID, x: 0, y: 0, z: 0, scale: 1, rotation: 0, width: 0, height: 0}, initialvalue);
        })
    }
    prioritySort(thinga, thingb) {
        return thinga.priority - thingb.priority;
    }
    initializeComponent(componentName, componentMaker) {
        this.__componentMakers.set(componentName, componentMaker);
        this.__components.set(componentName, new Map());
        let t = this;
        this.__components['get_' + componentName] = entityID => t.__components.get(componentName).get(entityID);
        return this;
    }
    destroyComponent(componentName) {
        this.__componentMakers.delete(componentName);
        this.__components.delete(componentName);
        this.__components['get_' + componentName] = x => null;
        return this;
    }
    addComponentToEntity(entityID, componentName, initialvalue) {
        let fn = this.__componentMakers.get(componentName);
        let realvalue = fn(initialvalue, entityID, this.__components);
        this.__components.get(componentName).set(entityID, realvalue);
        let t = this;
        return function(otherComponentName, otherInitialValue) {
            return t.addComponentToEntity(entityID, otherComponentName, otherInitialValue);
        }
    }
    makeEntity(transform) {
        let newID = 'ent' + (Math.random() * 1e10)
        this.__entities.add(newID);
        return this.addComponentToEntity(newID, 'transform', transform);
    }
    destroyEntity(entityID) {
        this.__entities.delete(entityID);
        for (let component of this.__components) {
            let componentMap = component[1]
            componentMap.delete(entityID);
        }
        return this;
    }
    initializeSystem(systemname, newSystem) {
        if (newSystem.update){
            this.__systems.set(systemname, newSystem);
        }
        if (newSystem.render) {
            this.__renderers.set(systemname, newSystem);
        }
        newSystem.baublebox = this;
    }
    destroySystem(systemName) {
        this.__systems.delete(systemName);
        this.__renderers.delete(systemName);
    }


    update() {
        for (let system of [...this.__systems.values()].sort(this.prioritySort)) {
            system.update(this.__components);
        }
    }

    render() {
        for (let system of [...this.__renderers.values()].sort(this.prioritySort)) {
            system.render(this.__components);
        }

    }



}