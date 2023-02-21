export class ParagraphModelDto {
  title: string;
  content: string[];
  editMode: boolean;

  constructor(title: string, content: string[]) {
    this.title = title;
    this.content = content;
    this.editMode = false;
  }
}
