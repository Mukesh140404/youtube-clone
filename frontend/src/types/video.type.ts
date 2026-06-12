export type AddVideoFormData = {
  title: string;
  description: string;
  videoFile: File;
  thumbnail: File;
};

export interface Owner {
  _id: string;
  username: string;
  avatar: string;
}

export interface Video {
  _id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  owner: Owner;
  createdAt: string;
  updatedAt: string;
  isSubscribed?: boolean;
}

export interface VideosData {
  count: number;
  videos: Video[];
}

export type videoFormData = {
  _id:string;
  title: string;
  description: string;
};
