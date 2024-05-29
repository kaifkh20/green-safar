import express from "express";
import cors from "cors"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser"

import userRouter from "./router/userRouter.js";
import destinationRouter from "./router/destinationRouter.js";
import userForum from "./router/userForum.js";
import {mongoDB} from "./db/db.js";

// {createClient}
const app = express();



app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

app.use(userRouter)
app.use(destinationRouter)
app.use(userForum)

const PORT = process.env.PORT || 3000;


await mongoDB();



app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
