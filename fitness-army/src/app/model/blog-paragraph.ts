export class BlogParagraph {
  title: string;
  content: string[];
  editMode: boolean;
  photoURL?: string;

  constructor(title: string, content: string[], photoURL?: string) {
    this.title = title;
    this.content = content;
    this.editMode = false;
    this.photoURL = photoURL;
  }
}
