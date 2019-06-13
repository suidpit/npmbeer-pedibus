import {Reservation} from "./reservation";

export class Reservations {
    private _backward: Array<Reservation[]>;
    private _outward: Array<Reservation[]>;

    get backward(){
        return this._backward
    }

    set backward(value){
        this._backward = value;
    }

    get outward(){
        return this._outward;
    }

    set outward(value){
        this._outward = value;
    }}


