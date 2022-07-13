export class User {
  uid: string;
  email: string;
  displayName: string;
  role: string;

  constructor(email: string, uid: string,
              displayName: string, role: string) {
    this.email = email;
    this.uid = uid;
    this.displayName = displayName;
    this.role = role;
  }
}
