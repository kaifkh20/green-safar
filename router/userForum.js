import { Router } from "express";
import Forum from "../schema/forum.js";
import { auth } from "../middleware/auth.js";
const userForum = Router();

userForum.get('/forum', async (req, res) => {
    try {
        const forums = await Forum.find().populate('author', 'username'); // Populate only the username
        return res.status(200).json(forums);
    } catch (error) {
        return res.status(400).send("Error occurred, can't read forum...!");
    }
});

userForum.post('/forum', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const author = req.user._id; 
        const newForum = new Forum({ title, content, author });
        await newForum.save();
        
        return res.status(200).send("Forum posted successfully...!");
    } catch (error) {
        return res.status(400).send("Error while posting forum...!");
    }
});

userForum.post('/forum/:id/reply', auth, async (req, res) => {
    try {
        const { text } = req.body; 
        const userId = req.user._id; 
        const userName = req.user.username;
        const { id } = req.params;

        const forum = await Forum.findById(id).populate('replies.user', 'username'); // Populate the user field
        if (!forum) {
            return res.status(400).send("Forum not found...!");
        }

        forum.replies.push({ user: userId, name: userName, text });
        // console.log(userName,userId);
        await forum.save();

        return res.status(201).json(forum);
    } catch (error) {
        console.error("Error while posting reply:", error);
        return res.status(400).send(`Error while posting reply: ${error.message}`);
    }
});


export default userForum;
