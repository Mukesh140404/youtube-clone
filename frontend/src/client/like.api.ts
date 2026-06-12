import api from "./api"


export const toggleLikeOnVideoApi = async (videoId: string) => {
    try {
        const res = await api.post(`/likes/like/video/${videoId}`)
        return res.data
    } catch (error) {
        throw error
    }
}
export const toggleLikeOnCommentApi = async (commentId: string) => {
    try {
        const res = await api.post(`/likes/like/comment/${commentId}`)
        return res.data
    } catch (error) {
        throw error
    }
}
export const toggleLikeOnTweetApi = async (tweetId: string) => {
    try {
        const res = await api.post(`/likes/like/tweet/${tweetId}`)
        return res.data
    } catch (error) {
        throw error
    }
}

export const getAllLikedVideoOfUserApi = async () => {
    try {
        const res = await api.get("/likes/like/all-videos")
        return res.data
    } catch (error) {
        throw error
    }
}