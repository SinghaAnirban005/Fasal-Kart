import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import farmerRouter from "./Routes/Producer.routes.js"
import landRouter from "./Routes/Land.routes.js"

app.use('/api/v1/producer', farmerRouter)
app.use('/api/v1/land', landRouter)

export {app}