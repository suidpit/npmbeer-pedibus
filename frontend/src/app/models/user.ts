export class User {


  private readonly _id;
  private readonly _email;
  private _role : Role = Role.USER;
  // authorities: Array<string>;

  constructor(id: string, email:string){
    this._id = id;
    this._email = email;
  }

  get id() {
    return this._id;
  }

  get email(){
    return this._email;
  }

  set role(role: Role){
    this._role = role;
  }

  get role() {
    return this._role;
  }
}

export enum Role{
  USER = "user",
  COMPANION = "companion",
  ADMIN = "admin"
}
