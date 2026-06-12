export type loginFormData = {
  email: string;
  password: string;
};
export type SignupFormData = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  avatar: File;
  coverImage: File;
};
export type ChangePasswordData = {
  oldPassword: string;
  newPassword: string;
};
export type AvatarFormData = {
  avatar: File;
};
export type CoverImageFormData = {
  coverImage: File;
};

export type IUser = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  watchHistory: any[]; // agar structure pata ho to refine kar dena
  createdAt: string;
  updatedAt: string;
};
