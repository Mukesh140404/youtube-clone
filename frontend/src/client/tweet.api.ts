import type { tweetData } from "@/types/tweet.type";
import api from "@/client/api";

const AddTweetApi = async (tweetForm: tweetData) => {
  const formData = new FormData();
  formData.append("content", tweetForm.content);
  try {
    const res = await api.post("/tweets/add-tweet", formData);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllTweetsApi = async () => {
  try {
    const res = await api.get("/tweets/all-tweets");
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserAllTweetsApi = async (userId: string) => {
  try {
    const res = await api.get(`/tweets/user-tweets/${userId}`);
    // console.log("data is :", res.data.data);
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getTweetApi = async (tweetId: string) => {
  try {
    const res = await api.get(`/tweets/tweet/${tweetId}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateTweetApi = async (tweetFrom: tweetData) => {
    const formData = new FormData();
    formData.append("content",tweetFrom.content)
  try {
    const res = await api.patch(`/tweets/update/${tweetFrom._id}`,formData);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteTweetApi = async (tweetId: string) => {
  try {
    const res = await api.delete(`/tweets/delete/${tweetId}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {
  getAllTweetsApi,
  getTweetApi,
  getUserAllTweetsApi,
  deleteTweetApi,
  updateTweetApi,
  AddTweetApi,
};
