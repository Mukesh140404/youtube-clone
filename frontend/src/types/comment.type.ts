export type AddCommentFormData = {
    videoId:string;
    content:string;
}
export type UpdateCommentFormData = {
    commentId:string;
    content:string;
}
export type CommentOwner = {
  _id: string;
  username: string;
  avatar: string;
};
export type Comment = {
  _id: string;
  content: string;
  video: string;
  owner: CommentOwner;
  createdAt: string;
  updatedAt: string;
  __v: number;
  likeCount?: number;
  isLiked?: boolean;
};
export type GetCommentsResponse = {
  comments: Comment[];
  commentCount: number;
};