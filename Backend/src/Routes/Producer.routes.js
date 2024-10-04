import { Router } from "express"
import { verifyJWT } from "../Middlewares/auth.middleware.js"

import {
    registerFarmer,
    loginFarmer,
    logoutFarmer,
    refreshAccessToken,
    getCurrentFarmer
} from "../Controllers/Producer.controller.js"

const router = Router()

router.route('/regFarmer').post(registerFarmer)
router.route('/signInFarmer').post(loginFarmer)

router.route('/logoutFarmer').post(verifyJWT, logoutFarmer)
router.route('/f-refresh-token').post(verifyJWT, refreshAccessToken)
router.route('/get-FInfo').get(verifyJWT, getCurrentFarmer)


export default router 