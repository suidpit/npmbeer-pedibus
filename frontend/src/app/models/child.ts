import {LocalDate} from "js-joda";
import {Photo} from "./photo";


export class Child {
    public id: String;
    public name: String;
    public surname: String;


    public birthday: Date;
    public gender: String;
    public present: boolean;
    public disability: boolean;
    public other: String;

    public photo: String;
    public photoFile: boolean;
}
