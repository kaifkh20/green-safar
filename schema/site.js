import {Schema,model} from "mongoose"

const siteSchema = new Schema({
    category:{
        type : String
    },
    danger:{
        type : String
    },
    date_inscribed:{
        type: Number
    },
    http_url:{
        type : String
    },
    id_number:{
        type : Number
    },
    image_url : {
        type : String
    },
    latitude : {
        type : Number
    },
    longtitude : {
        type : Number
    },
    region : {
        type : String
    },
    short_desc : {
        type : String
    },
    site : {
        type : String
    },
    states : {
        type : String
    }
})

export const Site = model('Site', siteSchema,'sites');

