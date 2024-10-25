import {
    addProduct,
    getProducts,
    deleteProduct
} from "../Controllers/Product.controller.js"

import { verifyJWT } from "../Middlewares/auth.middleware.js"
import { Router } from "express"

const router = Router()

router.route('/add-product').post(verifyJWT, addProduct)
router.route('/get-Products').get(verifyJWT, getProducts)
router.route('/delete-Product/:productId').delete(verifyJWT, deleteProduct)

export default router