import { Router } from "express";
import {verifyJwt} from "../middlewares/auth.middleware.js"
import {
    addViewOnVideo,
    getAllViewsForVideo,
    getViewById
} from "../controllers/view.controller.js"

const router = Router()
router.use(verifyJwt)

router.route("/add-view/:videoId").post(addViewOnVideo)
router.route("/views/:videoId").get(getAllViewsForVideo)
router.route("/view/:viewId").get(getViewById)

export default router;