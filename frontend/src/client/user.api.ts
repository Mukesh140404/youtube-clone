import api from "./api";
import type {
  loginFormData,
  SignupFormData,
  ChangePasswordData,
  AvatarFormData,
  CoverImageFormData,
} from "../types/user.type";
import { useUserStore } from "../store/useUserStore";

const { setUser, clearUser } = useUserStore.getState();

const loginApi = async (loginForm: loginFormData) => {
  const formData = new FormData();
  formData.append("email", loginForm.email);
  formData.append("password", loginForm.password);
  try {
    const res = await api.post("/users/login", formData);
    return res.data;
  } catch (e) {
    console.log(e);
  }

  const res = await api.post("/users/login", formData);
  return res.data;
};
const SignupApi = async (SignupForm: SignupFormData) => {
  const formData = new FormData();
  formData.append("fullName", SignupForm.fullName);
  formData.append("username", SignupForm.username);
  formData.append("email", SignupForm.email);
  formData.append("password", SignupForm.password);
  formData.append("avatar", SignupForm.avatar);
  formData.append("coverImage", SignupForm.coverImage);
  try {
    const res = await api.post("/users/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

const LogoutApi = async () => {
  try {
    const res = await api.post("/users/logout");
    clearUser();
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

const TokenRefreshApi = async () => {
  try {
    const res = await api.post("/users/refresh-token");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const ChangePasswordApi = async (ChangePasswordForm: ChangePasswordData) => {
  const formData = new FormData();
  formData.append("oldPassword", ChangePasswordForm.oldPassword);
  formData.append("newPassword", ChangePasswordForm.newPassword);
  try {
    const res = await api.post("/users/change-password", ChangePasswordForm);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const GetCurrentUserApi = async () => {
  try {
    const res = await api.get("/users/current-user");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
const GetUserProfileApi = async (userId: string) => {
  try {
    const res = await api.get(`/users/c/${userId}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const CheckAuthApi = async () => {
  try {
    const res = await api.get("/users/getSession");
    if (res.data.statusCode !== 200) {
      return false;
    }
    // console.log("user datta",res.data);
    setUser(res.data.data);
    return true;
  } catch (error) {
    console.log(error);
  }
};

// const ChangeAvatarApi = async (avatarForm: AvatarFormData) => {
//   const formData = new FormData();
//   formData.append("avatar", avatarForm.avatar);
//   try {
//     const res = await api.patch("/users/avatar", formData);
//     return res.data.data;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

const ChangeAvatarApi = async (avatarForm: AvatarFormData) => {
  const formData = new FormData(); // () lagana mat bhoolna

  formData.append("avatar", avatarForm.avatar);

  try {
    const res = await api.patch("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data; // user object
  } catch (error) {
    console.log("API ERROR:", error);
    throw error; // 🔥 VERY IMPORTANT
  }
};

const ChangeCoverImageApi = async (coverImageForm: CoverImageFormData) => {
  const formData = new FormData();
  formData.append("coverImage", coverImageForm.coverImage);
  try {
    const res = await api.patch("/users/cover-image", formData,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

const getWatchlistApi = async () => {
  try {
    const res = await api.get("/users/watch-history");
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export {
  loginApi,
  SignupApi,
  LogoutApi,
  TokenRefreshApi,
  ChangePasswordApi,
  GetCurrentUserApi,
  CheckAuthApi,
  GetUserProfileApi,
  ChangeAvatarApi,
  ChangeCoverImageApi,
  getWatchlistApi,
};
