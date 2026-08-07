export interface CommentAuthorDto {
  id: number;
  username: string;
}

export interface CommentDto {
  id: number;
  storyId: number;
  chapterId: number | null;
  author: CommentAuthorDto;
  parentCommentId: number | null;
  content: string;
  status: "Active" | "HiddenByAdmin";
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
  replies: CommentDto[];
}
