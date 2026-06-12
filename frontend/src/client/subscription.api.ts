import api from "./api";

export const allSubscribedChannelOfUser = async(subscriberId:string|undefined)=>{
    try {
        const res = await api.get(`/subscriptions/subscribeds/${subscriberId}`)
        return res.data.data
    } catch (error) {
        throw error
    }
}
export const toggleSubscribeChannelBtn = async (channelId:string|undefined)=>{
try {
    const res = await api.post(`/subscriptions/subscribe/${channelId}`)
    return res.data
} catch (error) {
    throw error
}
}

export const allSubscribersOfUser = async (channelId:string|undefined) => {
    try {
        const res = await api.get(`/subscriptions/subscribers/${channelId}`)
        return res.data.data
    } catch (error) {
        
    }
} 