export class User {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  profileImage?: string;

  constructor(email: string, uid: string,
              displayName: string, role: string, profileImage?: string) {
    this.email = email;
    this.uid = uid;
    this.displayName = displayName;
    this.role = role;
    this.profileImage = profileImage;
  }
}
