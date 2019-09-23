export class Authority{
  private _role: Role;
  private _lineName: string;

  constructor(role: Role, lineName = ""){
    this._role = role;
    this._lineName = lineName
  }

  get role(): Role {
    return this._role;
  }

  set role(value: Role) {
    this._role = value;
  }

  get lineName(): string {
    return this._lineName;
  }

  set lineName(value: string) {
    this._lineName = value;
  }

  compareTo(other: Authority){
    return this._role === other.role && this._lineName === other.lineName;
  }

  greaterThanOrEqualToAuthority(other: Authority){
    return this._role >= other.role;
  }

  greaterThanOrEqualToRole(otherRole: Role){
    return this._role >= otherRole;
  }
}

export class Role {
  static USER = 0;
  static COMPANION = 1;
  static ADMIN = 2;
  static SYSTEM_ADMIN = 3;

  static fromString(roleName: string){
    switch (roleName.toLowerCase()){
      case "user":
            return Role.USER;
      case "companion":
            return Role.COMPANION;
      case "admin":
            return Role.ADMIN;
      case "system_admin":
            return Role.SYSTEM_ADMIN;
    }
  }
}

