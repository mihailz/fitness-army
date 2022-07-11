export class User {
  uid?: string;
  email: string | null | undefined;
  password?: string;
  displayName?: string;
  role?: string;

  constructor(email: string | null | undefined, uid?: string, password?: string,
              displayName?: string, role?: string) {
    this.email = email;
    this.uid = uid;
    this.password = password;
    this.displayName = displayName;
    this.role = role;
  }
}
