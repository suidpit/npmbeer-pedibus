import {LocalTime} from "js-joda";
import * as deepEqual from "deep-equal";
import {Child} from "../models/child"
import {Builder} from "builder-pattern";

export class Stop {
    private _name: string;
    private _outward: LocalTime[];
    private _back: LocalTime[];
    private _position: {};
    private _childs: Child[];

    get position(): {} {
        return this._position;
    }

    set position(value: {}) {
        this._position = value;

    }

    set outward(value: LocalTime[]) {
        this._outward = value;
    }

    get outward(): LocalTime[] {
        return this._outward;
    }

    set back(value: LocalTime[]) {
        this._back = value;
    }

    get back(): LocalTime[] {
        return this._back;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    // Temporary mockup
    set childs(value: Child[]) {
        this._childs = value;
    }

    get childs() {
        return this._childs;
    }

    public compareTo(stop: Stop) {
        if (!(this._name === stop.name)) return false;
        if (!(this._outward === stop.outward)) return false;
        if (!(this._back === stop.back)) return false;
        return deepEqual(this._position, stop.position);
    }

    public compareByToString(s: string) {
        return this.toString() === s;
    }

    public toString() {
        return "[ outward: " + (this.outward ? this.outward.toString() : "--:--") + ", back: " + (this.outward ? this.outward.toString() : "--:--") + "] " + (this.name ? this.name : "no-name");
    }

    constructor(values: any = {}) {
        this.outward = [];
        this.back = [];
        if(values.outward!=null){
            for (let time of values.outward) {
                this.outward.push(LocalTime.parse(time))
            }
            for (let time of values.back) {
                this.back.push(LocalTime.parse(time))
            }
            this.name = values.name;
            this.position = values.position;
        }
    }
}
