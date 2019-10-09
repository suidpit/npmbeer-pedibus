import {Child} from "./child";
import {IChildReservationInfo} from "./ichild-reservation-info";
import {LocalDate} from "js-joda";

export class Reservation {
    private _id: string;
    private _stopName: string;
    private _childs: IChildReservationInfo[];
    private _direction: string;
    private _tripIndex: number;
    private _date: LocalDate;
    private _color: string;
    private _lineName: string;
    private _booked: boolean;
    private _childId: string;

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

    get direction(){
        return this._direction;
    }

    set direction(value){
        this._direction = value;
    }

    get tripIndex(){
        return this._tripIndex;
    }

    set tripIndex(value){
        this._tripIndex = value;
    }

    get date(){
        return this._date;
    }

    set date(value){
        this._date = value;
    }

    get color(){
        return this._color;
    }

    set color(value){
        this._color = value;
    }

    get lineName(){
        return this._lineName;
    }

    set lineName(value){
        this._lineName = value;
    }

    get booked(){
        return this._booked;
    }

    set booked(value){
        this._booked = value;
    }

    get id(){
        return this._id
    }

    set id(value){
        this._id = value;
    }

    get childId(){
        return this._childId;
    }

    set childId(value){
        this._childId = value
    }
}


