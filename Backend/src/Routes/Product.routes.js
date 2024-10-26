import {
    addProduct,
    getProducts,
    deleteProduct,
    addStock,
    updatePrice
} from "../Controllers/Product.controller.js"

import { verifyJWT } from "../Middlewares/auth.middleware.js"
import { upload } from "../Middlewares/multer.middleware.js"
import { Router } from "express"

const router = Router()

router.route('/add-product').post(verifyJWT, upload.single('image'), addProduct)
router.route('/get-Products').get(verifyJWT, getProducts)
router.route('/delete-Product/:productId').delete(verifyJWT, deleteProduct)
router.route('/add-Stock/:productId').patch(verifyJWT, addStock)
router.route('/update-Price/:productId').patch(verifyJWT, updatePrice)

export default router