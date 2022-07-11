import { Injectable } from '@angular/core';
import {Token} from "../../model/token.model";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private token!: Token;

  constructor() { }

  set userToken(token: Token) {
    this.token = token;
  }

  get userToken(): Token {
    return this.token;
  }
}
