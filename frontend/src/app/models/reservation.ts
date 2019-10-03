import {Child} from "./child";
import {IChildReservationInfo} from "./ichild-reservation-info";

export class Reservation {
    private _stopName: string;
    private _childs: IChildReservationInfo[];

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


