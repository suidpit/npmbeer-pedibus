import { User } from './user';

export class UserProfile {
    public name : String;
    public surname : String;
    public address : String;
    public telephone: String;
    public alt_email: String;
    public readonly email: String;
    public photo: String;
    public photoFile: boolean;
}
