import {User} from "./user.model";

export class Review {

  constructor(public id: string | null,
              public author: User,
              public dateCreated: string,
              public rating: number,
              public content: string,
              public likes: number) {
    this.id = id;
    this.author = author;
    this.dateCreated = dateCreated;
    this.rating = rating;
    this.content = content;
    this.likes = likes;
  }
}
