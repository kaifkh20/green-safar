import mongoose from "mongoose";

const forumSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    replies: [{
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        },
        name:{
            type:String,
            require:true
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
})

const Forum = mongoose.model('forum',forumSchema)
export default Forum