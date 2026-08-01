import mongoose, { Types } from "mongoose";
import { View } from "../models/views.models.js"
import { Video } from "../models/video.models.js"
import {
    ApiError,
    ApiResponse,
    asyncHandler
} from "../utils/index.js"
import { User } from "../models/user.models.js";

// add View
const addViewOnVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) throw new ApiError(400, "video id not valid")

    const existsView = await View.findOne({
        $and: [
            { video: new mongoose.Types.ObjectId(videoId) },
            { user: new mongoose.Types.ObjectId(req.user?._id) }
        ]
    })
    if (
        existsView &&
        existsView.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ) {
        const updatedView = await View.findByIdAndUpdate(existsView._id, { $set: { updatedAt: new Date() } }, { new: true })
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedView,
                    "view already counted within 24 hours"
                )
            );
    }

    const newView = await View.create({
        video: new mongoose.Types.ObjectId(videoId),
        user: new mongoose.Types.ObjectId(req.user?._id)
    })

    if (!newView) throw new ApiError(500, "error in add view on video")
    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } })
    await User.findByIdAndUpdate(req.user?._id, { $push: { watchHistory: newView._id } })

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                newView,
                "add view count by 1"
            )
        )

})

const getAllViewsForVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) throw new ApiError(400, "video id not valid")

    const views = await View.find({
        video: new mongoose.Types.ObjectId(videoId)
    })
    if (!views.length) throw new ApiError(404, "views on this videos not exists")
    const count = views.length
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { count, views },
                "All views are fetched"
            )
        )
})

export {
    addViewOnVideo,
    getAllViewsForVideo
}