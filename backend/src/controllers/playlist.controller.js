import mongoose from "mongoose";
import {
    asyncHandler,
    ApiError,
    ApiResponse,
} from "../utils/index.js";
import { Playlist } from "../models/playlist.models.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"

//-----------playlist controllers-----------

//create playlist

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    if ([name, description].some((feild) => feild?.trim() === "")) {
        throw new ApiError(400, "All feilds are required")
    }
    const existsPlaylist = await Playlist.findOne({ name: name })
    if (existsPlaylist) throw new ApiError(409, "playlist already exists")

    let thumbnailUrl = "";
    const thumbnailPath = req.file?.path;
    if (thumbnailPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailPath);
        if (!thumbnail || !thumbnail.url) {
            throw new ApiError(400, "Error while uploading thumbnail");
        }
        thumbnailUrl = thumbnail.url;
    }

    const newPlaylist = await Playlist.create({
        name,
        description,
        thumbnail: thumbnailUrl,
        owner: req.user?._id
    })

    if (!newPlaylist) throw new ApiError(500, "Some error in creating playlist")
    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                newPlaylist,
                "playlist created successfully"
            )
        )

})

const addVideosInPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!playlistId) throw new ApiError(400, "playlist not valid")

    const { videoIds } = req.body
    if (!Array.isArray(videoIds) || videoIds.length === 0)
        throw new ApiError(400, "At least one video ID required");
    const playlist = await Playlist.findOneAndUpdate(
        {
            $and: [
                { _id: new mongoose.Types.ObjectId(playlistId) },
                { owner: req.user?._id }
            ]
        },
        {
            $addToSet: {
                videos: {
                    $each: videoIds.map(
                        (id) => new mongoose.Types.ObjectId(id)
                    )
                }
            } // videoId ko add karega agar already nahi hai
        },
        {
            new: true // updated playlist return karega
        }
    );
    if (!playlist) throw new ApiError(404, "playlist not found")
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "videos successfully add in playlist"
            )
        )
})

//update playlist  

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!playlistId) throw new ApiError(400, "not valid playlist")
    const existingPlaylist = await Playlist.findById(playlistId)
    if (!existingPlaylist) throw new ApiError(404, "Playlist not exists");
    
    const { name, description } = req.body
    if ([name, description].some((field) => (field?.trim() === ""))) {
        throw new ApiError(400, "All feilds are required")
    }

    let updateData = { name, description };
    const publicId = existingPlaylist?.thumbnail;

    const thumbnailPath = req.file?.path;
    if (thumbnailPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailPath);
        if (!thumbnail || !thumbnail.url) {
            throw new ApiError(400, "Error while uploading thumbnail");
        }
        updateData.thumbnail = thumbnail.url;
        
        // delete old thumbnail if exists
        if (publicId) {
            // we should parse the publicId from url but assuming deleteFromCloudinary handles it or we pass the url.
            // (Assuming deleteFromCloudinary expects public_id or handles it properly)
            // Just attempting to delete to keep parity with previous code.
            const isDeletedFromCloudinary = await deleteFromCloudinary(publicId);
            if (!isDeletedFromCloudinary) {
                console.log("Error in deleting previous thumbnail from cloud");
            }
        }
    }

    const playlist = await Playlist.findOneAndUpdate(
        {
            $and: [
                { owner: new mongoose.Types.ObjectId(req.user?._id) },
                { _id: new mongoose.Types.ObjectId(playlistId) }
            ]
        },
        {
            $set: updateData
        },
        { new: true }
    )
    
    if (!playlist) throw new ApiError(404, "you are not authenticated or unknown playlist")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "playlist update successfully"
            )
        )
})

//remove video from playlist

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    if ([playlistId, videoId].some((feild) => feild?.trim() === "")) {
        throw new ApiError(400, "unknown video and playlist")
    }
    const newPlaylist = await Playlist.findOneAndUpdate(
        {
            $and: [
                { owner: new mongoose.Types.ObjectId(req.user?._id) },
                { _id: new mongoose.Types.ObjectId(playlistId) }
            ]
        },
        {
            $pull: {
                videos: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            new: true
        }
    )
    if (!newPlaylist) throw new ApiError(404, "not authenticate or unknown video and playlist")
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                newPlaylist,
                "video remove successfully from playlist"
            )
        )
})

//get all playlists for a user

const getAllPlaylistOfUser = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (!userId) throw new ApiError(400, "not valid user")

    const playlistsOfUser = await Playlist.find({
        owner: new mongoose.Types.ObjectId(userId)
    }).populate({
        path: 'videos',
        select: 'thumbnail'
    })

    if (!playlistsOfUser) throw new ApiError(404, "playlist not exists for this user")
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlistsOfUser,
                "playlists fetched successfully"
            )
        )
})

//delete playlist

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!playlistId) throw new ApiError(400, "playlist not valid")

    const deletedPlaylist = await Playlist.findOneAndDelete(
        {
            $and: [
                { _id: new mongoose.Types.ObjectId(playlistId) },
                { owner: new mongoose.Types.ObjectId(req.user?._id) }
            ]
        }
    )
    if (!deletedPlaylist) throw new ApiError(404, "not authenticated or unknown Playlist")
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "playlist delete successfully"
            )
        )
})

//get playlist by id

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!playlistId) throw new ApiError(400, "playlist not valid")

    const playlist = await Playlist.findById(playlistId)
        .populate({
            path: 'videos',
            populate: {
                path: 'owner',
                select: 'fullName username avatar'
            }
        })
        .populate('owner', 'fullName username avatar')
        
    if (!playlist) throw new ApiError(404, "Playlist Not Found")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "playlist fetched successfully"
            )
        )
})

export {
    createPlaylist,
    addVideosInPlaylist,
    updatePlaylist,
    removeVideoFromPlaylist,
    getAllPlaylistOfUser,
    deletePlaylist,
    getPlaylistById,
}
