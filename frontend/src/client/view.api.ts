import api from "./api"

export const addviewApi = async (videoId: string) => {
    try {
        const res = await api.post(`/views/add-view/${videoId}`)
        return res.data
    } catch (error) {
        console.error("Error adding view:", error)
        throw error
    }
}

export const getAllViewsForVideoApi = async (videoId: string) => {
    try {
        const res = await api.get(`/views/${videoId}`)
        return res.data.data
    } catch (error) {
        console.error("Error getting views:", error)
        throw error
    }
}