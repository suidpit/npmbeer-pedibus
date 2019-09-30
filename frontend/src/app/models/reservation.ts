import {Child} from "./child";

export class Reservation {
    private _stopName: string;
    private _childs: Array<Child>;

    get stopName(){
        return this._stopName;
    }

    set stopName(value) {
        this._stopName = value;
    }

    get childs(){
        return this._childs;
    }

    set childs(value) {
        this._childs= value;
    }
}


