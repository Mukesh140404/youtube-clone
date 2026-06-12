import api from "./api"
import type {AddCommentFormData,UpdateCommentFormData} from "@/types/comment.type"

const getAllCommentApi = async(videoId:string)=>{
    try {
        const res = await api.get(`/comments/all-comments/${videoId}`)
        return res.data.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

const addCommentApi = async(commentForm:AddCommentFormData)=>{
    const formData = new FormData();
    formData.append("content",commentForm.content)
    try {
        const res = await api.post(`/comments/add-comment/${commentForm.videoId}`,formData)
        return res.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

const updateCommentApi = async(commentForm:UpdateCommentFormData)=>{
    const formData = new FormData();
    formData.append("content",commentForm.content)
    try {
        const res = await api.patch(`/comments/update-comment/${commentForm.commentId}`,formData)
        return res.data
    } catch (error) {
        console.log(error)
        throw error        
    }
}

const deleteCommentApi = async(commentId:string)=>{
    try {
        const res = await api.delete(`/comments/delete-comment/${commentId}`)
        return res.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

export {
    getAllCommentApi,
    addCommentApi,
    updateCommentApi,
    deleteCommentApi
}