import { Router } from "express";
import Forum from "../schema/forum.js";
const userForum = Router();

userForum.get('/forum',async (req,res)=>{
    try {
        const forums=await Forum.find()
        return res.status(200).json(forums)
    } catch (error) {
        return res.status(400).send("error occure cant read forum...!")

    }
})

userForum.post('/forum', async (req,res)=>{
    try {
        const {title,content}=req.body
        const newForum= new Forum({title,content})
        await newForum.save()
        return res.status(200).send("forum posted successfully...!")
    } catch (error) {
        return res.status(400).send("error while posting forum...!")
    }
})

export default userForum