import dotenv from "dotenv"
dotenv.config()
import express from "express"
import {authenticationMiddleware} from "./middlewares/auth.middleware.js"
import userRouter from "./routes/user.routes.js"
import urlRouter from "./routes/url.routes.js"
const app = express()

app.use(express.json())
app.use(authenticationMiddleware)
app.use("/user",userRouter)
app.use(urlRouter)
app.listen(process.env.PORT,()=>{
    console.log(`Server started at port: ${process.env.PORT}`);   
})