import {Router} from "express"
import {checkThumbnailSize, uploadVideo} from "../middlewares/multer.middleware.js"
import {verifyJwt} from '../middlewares/auth.middleware.js';
import {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideoById,
    getUserAllVideos
} from "../controllers/video.controller.js"


const router = Router()

router.use(verifyJwt)
router.get("/all-videos",getAllVideos)
router.route("/v/:userId").get(getUserAllVideos)
router.route("/add-video").post(
    uploadVideo.fields([
        { name : "videoFile", maxCount : 1},
        { name : "thumbnail", maxCount : 1}])
    ,checkThumbnailSize
    ,publishVideo)

router.route("/update/:videoId").patch(updateVideo)

router.route("/delete-video/:videoId").delete(deleteVideoById);
router.route("/video/:videoId").get(getVideoById);

export default router;