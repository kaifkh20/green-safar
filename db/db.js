import mongoose from 'mongoose'
import dotenv from "dotenv"
dotenv.config()

const mongoURI=`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.c4ue0z8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const mongoDB = async ()=>{
    try {
        console.log("connecting to database");
        await mongoose.connect(mongoURI)
        console.log("database connected");
    } catch (error) {
        console.log("some errors",error);
    }
}

export default mongoDB