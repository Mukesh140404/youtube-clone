import api from "./api";

export const getAllPlaylistOfUserApi = async (userId: string) => {
  try {
    const res = await api.get(`/playlists/getAllPlaylist/${userId}`);
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createPlaylistApi = async (data: FormData) => {
  try {
    const res = await api.post("/playlists/add-playlist", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPlaylistByIdApi = async (playlistId: string) => {
  try {
    const res = await api.get(`/playlists/playlist/${playlistId}`);
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addVideosInPlaylistApi = async (playlistId: string, videoIds: string[]) => {
  try {
    console.log("call  to hua")
    console.log(videoIds)
    const res = await api.post(`/playlists/add-videos/${playlistId}`, { videoIds });
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updatePlaylistApi = async (playlistId: string, data: FormData) => {
  try {
    const res = await api.patch(`/playlists/update/${playlistId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const removeVideoFromPlaylistApi = async (playlistId: string, videoId: string) => {
  try {
    const res = await api.patch(`/playlists/remove-video/${playlistId}/${videoId}`);
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deletePlaylistApi = async (playlistId: string) => {
  try {
    const res = await api.delete(`/playlists/delete/${playlistId}`);
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
