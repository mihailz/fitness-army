export interface BlogAdditionalData {
  title: string;
  description: string;
}

export class BlogPostModel {
  imageUrl: string;
  title: string;
  description: string;
  additionalData: Array<BlogAdditionalData>;

  constructor(imageUrl: string, title: string, description: string,
      additionalData: Array<BlogAdditionalData>) {
    this.imageUrl = imageUrl;
    this.title = title;
    this.description = description;
    this.additionalData = additionalData;
  }
}

