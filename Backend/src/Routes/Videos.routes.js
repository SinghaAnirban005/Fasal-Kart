import { Router } from "express"
import {
    getVideos
} from "../Controllers/Videos.controller.js"

const router = Router()
import { verifyJWT } from "../Middlewares/auth.middleware.js"

router.route('/infotainment').get(verifyJWT, getVideos)

export default router