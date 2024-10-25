import { Router } from "express"
import { verifyJWT } from "../Middlewares/Cauth.middleware.js"

import {
    registerConsumer,
    loginConsumer,
    logoutConsumer,
    refreshAccessToken,
    getCurrentConsumer
} from "../Controllers/Consumer.controller.js"
import { upload } from "../Middlewares/multer.middleware.js"

const router = Router()

router.route('/regConsumer').post(upload.single('profilePic'), registerConsumer)
router.route('/signInConsumer').post(loginConsumer)

router.route('/logoutConsumer').post(verifyJWT, logoutConsumer)
router.route('/c-refresh-token').post(verifyJWT, refreshAccessToken)
router.route('/get-CInfo').get(verifyJWT, getCurrentConsumer)


export default router 