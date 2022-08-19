import {User} from "./user.model";
import {BlogParagraph} from "./blog-paragraph";

export class Blog {
  id: string | null;
  author: User;
  title: string;
  content: Array<BlogParagraph>;
  category: string;
  dateCreated: Date;
  imageUrl?: string;

  constructor(id: string | null, author: User, title: string, content: Array<BlogParagraph>,
              category: string, dateCreated: Date, imageUrl?: string) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.content = content;
    this.category = category;
    this.dateCreated = dateCreated;
    this.imageUrl = imageUrl;
  }
}
