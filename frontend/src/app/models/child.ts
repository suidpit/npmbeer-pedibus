export class Child {
    private _name: string
    private _present: boolean
    private _booked: boolean
    private _resId: string

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

    get booked(){
        return this._booked;
    }

    set booked(value){
        this._booked = value;
    }

    get resId() {
        return this._resId;
    }

    set resId(value) {
        this._resId = value;
    }
}
