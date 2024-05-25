import mongoose from 'mongoose'

const mongoURI='mongodb+srv://<username>:<password>@cluster0.c4ue0z8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const mongoDB = async ()=>{
    try {
        await mongoose.connect(mongoURI)
        console.log("database connected");
    } catch (error) {
        console.log("some errors",error);
    }
}

export default mongoDB