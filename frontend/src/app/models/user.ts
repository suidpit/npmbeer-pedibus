export class User {

  _id;
  private _email;
  roles :Array<string>;
  authorities:Array<string>;

  constructor(id: string, email:string){
    this._id = id;
    this._email = email;
  }

  get email(){
    return this._email;
  }
}
