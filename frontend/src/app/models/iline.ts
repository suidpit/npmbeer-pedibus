export interface ILine {
    id: string;
    name : string;
    outward: Array<Array<{}>>;
    back: Array<Array<{}>>;
    admin_email : string;
    _class : string;
}
