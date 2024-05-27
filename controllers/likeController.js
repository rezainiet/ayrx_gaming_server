import { GameGroupPost } from "../models/gameGroupPost.Model.js";

export const likePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.id; // Assuming you have the user ID stored in req.user

        const post = await GameGroupPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();

        res.status(200).json({ likes: post.likes });
    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};
