export class UserModelDto {
  uid: string;
  email: string;
  password: string;
  displayName: string;
  role: string;
  profileImage: string;

  constructor(uid: string, email: string, password: string, displayName: string,
      role: string, profileImage: string) {
    this.uid = uid;
    this.email = email;
    this.password = password;
    this.displayName = displayName;
    this.role = role;
    this.profileImage = profileImage;
  }
}
