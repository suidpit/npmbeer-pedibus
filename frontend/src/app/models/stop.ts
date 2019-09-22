import {LocalTime} from "js-joda";
import { Child } from "../models/child"

export class Stop{
  name: string;
  time: LocalTime;
  position: {};
  _childs: Child[]

  // Temporary mockup
  set childs(value: Child[]) {
    this._childs = value;
  }

  get childs() {
    return this._childs;
  }
}
