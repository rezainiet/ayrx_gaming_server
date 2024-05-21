import { Post } from "../models/post.Model.js";
import { User } from "../models/user.Model.js";

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { title, postContent, privacy, imageUrl, tags } = req.body;
        const userId = req.id; // Assuming you have middleware that adds the user ID to req

        const newPost = new Post({
            title,
            postContent,
            privacy,
            imageUrl,
            author: userId,
            tags
        });

        await newPost.save();
        return res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getPosts = async () => {
    try {
        const posts = await Post.find().populate("author", "userName fullName profilePhoto");
        console.log("Posts with author details:", posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
};
