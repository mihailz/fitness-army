export class User {
  uid?: string;
  email: string | null | undefined;
  displayName?: string;
  role?: string;

  constructor(email: string | null | undefined, uid?: string,
              displayName?: string, role?: string) {
    this.email = email;
    this.uid = uid;
    this.displayName = displayName;
    this.role = role;
  }
}
