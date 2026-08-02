import  api  from "./api";
import type { Video } from "@/types/video.type";

interface WatchHistoryResponse {
    data: Video[];
}

export const getWatchHistoryApi = async (): Promise<Video[]> => {
    try {
        const response = await api.get<WatchHistoryResponse>("/users/history");
        // Assuming the API returns videos in descending order of watchedAt
        return response.data.data;
    } catch (error) {
        console.error("Error fetching watch history:", error);
        throw error;
    }
};