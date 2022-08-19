import {UserModelDto} from "./user.model.dto";

export class BlogPostModelDto {
  id: string;
  author: UserModelDto;
  title: string;
  content: string;
  category: string;
  dateCreated: Date;
  imageUrl: string;

  constructor(id: string, author: UserModelDto, title: string,
      content: string, category: string, dateCreated: Date, imageUrl: string) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.content = content;
    this.category = category;
    this.dateCreated = dateCreated;
    this.imageUrl = imageUrl;
  }
}

