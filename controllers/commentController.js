import { Comment } from "../models/comment.Model.js";
import { GameGroupPost } from "../models/gameGroupPost.Model.js";
import { User } from "../models/user.Model.js";

export const createCommentInGameGroup = async (req, res) => {
    try {
        const { content, authorId, postId } = req.body;

        // Validate the input
        if (!content || !authorId || !postId) {
            return res.status(400).json({ message: "Content, author ID, and post ID are required" });
        }

        // Check if the post exists
        const post = await GameGroupPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the author exists
        const author = await User.findById(authorId);
        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }

        // Create the comment
        const comment = new Comment({
            content,
            author: authorId,
            post: postId
        });

        // Save the comment to the database
        const savedComment = await comment.save();

        // Add the comment to the post's comments array
        post.comments.push(savedComment._id);
        await post.save();

        // Return the created comment
        res.status(201).json(savedComment);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};
