export class User {
  constructor(public uid: string,
              public email: string,
              public displayName: string,
              public photoURL: string,
              public role?: string) {
    this.uid = uid;
    this.email = email;
    this.displayName = displayName;
    this.photoURL = photoURL;
    this.role = role;
  }
}
