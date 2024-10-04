import { Router } from "express"
import { verifyJWT } from "../Middlewares/auth.middleware.js"
import {upload} from "../Middlewares/multer.middleware.js"

import {
    submitLandDetails
} from "../Controllers/Land.controller.js"

const router = Router()

router.route('/verifyLand').post(verifyJWT, upload.single('landDcouments'), submitLandDetails)

export default router