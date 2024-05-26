import mongoose from "mongoose";

const forumSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    content:{
        type:String,
        required:true
    }
})

const Forum = mongoose.model('forum',forumSchema)
export default Forum