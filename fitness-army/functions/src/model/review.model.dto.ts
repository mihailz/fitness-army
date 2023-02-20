import {UserModelDto} from "./user.model.dto";

export class ReviewModelDto {
  constructor(public id: string | null,
              public author: UserModelDto,
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
