import {Authority, Role} from "./authority";

export class User {

  private readonly _id;
  private readonly _email;
  private _authorities: Authority[] = [new Authority(Role.USER)];
  private _children: any[];
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

  get children(): any[] {
    return this._children;
  }

  set children(value: any[]) {
    this._children = value;
  }


  addAuthority(authority: Authority){
    this._authorities.push(authority);
  }

  get authorities() {
    return this._authorities;
  }

  set authorities(authorities: Authority[]){
    this._authorities = authorities;
  }

  hasAuthority(authority: Authority): boolean{
    return this._authorities.filter((auth) => authority.compareTo(auth)).length > 0;
  }

  hasAuthorityOnLine(lineName: string): boolean{
    // A user has authority on a line if she is its admin of if she is the system admin
    return this._authorities.filter((auth) => auth.role === Role.SYSTEM_ADMIN || (auth.role === Role.ADMIN && auth.lineName === lineName)).length > 0;
  }

  hasMinAuthority(role: Role){
    return this._authorities.filter((auth) => auth.greaterThanOrEqualToRole(role)).length > 0;
  }
}
