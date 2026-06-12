import api from "./api";
import type { AddVideoFormData, videoFormData } from "@/types/video.type";
//done
const getAllVideoApi = async () => {
  try {
    const res = await api.get("/videos/all-videos");
    return res.data.data;
  } catch (e) {
    console.log(e);
  }
};
//done
const getUserAllVideoApi = async (userId: string) => {
  try {
    const res = await api.get(`/videos/v/${userId}`);
    return res.data.data;
  } catch (e) {
    console.log(e);
  }
};

const addNewVideoApi = async (AddVideoForm: AddVideoFormData) => {
  const formData = new FormData();
  formData.append("title", AddVideoForm.title);
  formData.append("description", AddVideoForm.description);
  formData.append("videoFile", AddVideoForm.videoFile);
  formData.append("thumbnail", AddVideoForm.thumbnail);
  try {
    const res = await api.post("/videos/add-video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
const getVideoApi = async (videoId: string) => {
  try {
    const res = await api.get(`/videos/video/${videoId}`);
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateVideoApi = async (videoForm: videoFormData) => {
  const formData = new FormData();
  formData.append("title", videoForm.title);
  formData.append("description", videoForm.description);
  try {
    const res = await api.patch(`/videos/update/${videoForm._id}`, formData);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteVideoApi = async (videoId: string) => {
  try {
    const res = await api.delete(`/videos/delete-video/${videoId}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {
  addNewVideoApi,
  getAllVideoApi,
  getUserAllVideoApi,
  getVideoApi,
  updateVideoApi,
  deleteVideoApi,
};
