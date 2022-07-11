export class Token {
  idToken: string;

  constructor(idToken: string) {
    this.idToken = idToken;
  }

  get token(): string {
    return this.idToken;
  }

  set token(token: string) {
    this.idToken = token;
  }
}
