import {Router} from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import {
    toggleLikeOnVideo,
    toggleLikeOnComment,
    toggleLikeOnTweet,
    getAllLikedVideosOfUser
} from "../controllers/like.controller.js"

const router = Router()
router.use(verifyJwt)

router.route("/like/video/:videoId").post(toggleLikeOnVideo)
router.route("/like/comment/:commentId").post(toggleLikeOnComment)
router.route("/like/tweet/:tweetId").post(toggleLikeOnTweet)
router.route("/like/all-videos").get(getAllLikedVideosOfUser)

export default router;