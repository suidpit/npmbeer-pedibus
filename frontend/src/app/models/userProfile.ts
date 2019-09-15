import { User } from './user';

export class userProfile {
    private readonly _user;
    private readonly _name ;
    private readonly _surname;
    private readonly _address;
    private readonly _telephone;
    constructor(user:User,name:string,surname:string,address:string,telephone:string){
        this._user = user;
        this._name = name;
        this._surname = surname;
        this._address = address;
        this._telephone = telephone;
    }
}