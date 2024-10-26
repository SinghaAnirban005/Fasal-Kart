import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import farmerRouter from "./Routes/Producer.routes.js"
import consumerRouter from "./Routes/Consumer.routes.js"
import productRouter from "./Routes/Product.routes.js"
import reelsRouter from "./Routes/Videos.routes.js"

app.use('/api/v1/producer', farmerRouter)
app.use('/api/v1/consumer', consumerRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/reels', reelsRouter)

export {app}