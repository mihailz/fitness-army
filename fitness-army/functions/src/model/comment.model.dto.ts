import { UserModelDto } from "./user.model.dto";

export interface Comment {
  commentId: string;
  content: string;
  dateCreated: string;
  author: UserModelDto;
}
