import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from './router/userRouter.js';
import mongoDB from './db/db.js';

const app = express();

mongoDB();

app.use(cors());
app.use(bodyParser.json());


app.use(userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
