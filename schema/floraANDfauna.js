import mongoose, { Types } from "mongoose";

const FFSchema = new mongoose.Schema({
    site_id:{
        type : Types.ObjectId,
        required : true,
        unique : true,
        ref : 'Site'
    },
    flora:{
        type: Object
    },
    fauna:{
        type : Object
    }
})

const FFModel = mongoose.model('ffs',FFSchema)
export default FFModel;