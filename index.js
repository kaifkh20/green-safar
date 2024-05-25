import express from "express";
import cors from "cors"
import bodyParser from "body-parser";
import { destinationRouter } from "./router/destinationRouter.js";

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use(destinationRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`Listening at ${PORT}`);
})