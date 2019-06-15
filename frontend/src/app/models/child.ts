export class Child {
    private _name: String
    private _present: boolean

    get name(){
        return this._name;
    }

    set name(value){
        this._name = value;
    }

    get present(){
        return this._present;
    }

    set present(value){
        this._present = value;
    }
}
