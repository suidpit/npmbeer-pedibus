import {LocalDate} from "js-joda";
import {Photo} from "./photo";


export class Child {
    public id: string;
    public name: string;
    public surname: string;


    public birthday: Date;
    public gender: string;
    public present: boolean;
    public disability: boolean;
    public other: string;

    public photo: string;
    public photoFile: boolean;
}
