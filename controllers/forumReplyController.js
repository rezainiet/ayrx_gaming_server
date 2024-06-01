import ForumReply from "../models/forumReply.Model.js";

export const createForumReply = async (req, res) => {
    try {
        const forumReply = new ForumReply(req.body);
        await forumReply.save();
        res.status(201).json(forumReply);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}