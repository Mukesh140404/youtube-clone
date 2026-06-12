export type tweetData = {
    _id?:string;
    content:string;
}
interface TweetOwner {
  _id: string;
  username: string;
  avatar: string;
}
export type TweetProps = {
    _id: string;
    content: string;
    owner: TweetOwner;
    createdAt: string;
    updatedAt: string;
    likeCount?: number;
    isLiked?: boolean;
  };
