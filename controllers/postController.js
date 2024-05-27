import { GameGroupPost } from "../models/gameGroupPost.Model.js";
import { Group } from "../models/group.Model.js";
import { Post } from "../models/post.Model.js";
import { User } from "../models/user.Model.js";

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { title, postContent, privacy, imageUrl } = req.body;
        const userId = req.id; // Assuming you have middleware that adds the user ID to req.user

        // Create new post
        const newPost = new Post({
            title,
            postContent,
            privacy,
            imageUrl,
            author: userId
        });

        // Save the new post
        await newPost.save();

        // Update user's post array
        await User.findByIdAndUpdate(userId, {
            $push: { posts: newPost._id }
        });

        return res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


export const getPosts = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId).populate({
            path: 'posts',
            populate: {
                path: 'author',
                select: 'userName fullName profilePhoto'
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const posts = user.posts;
        return res.status(200).json({ posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: 'Server error' });
    }
};



export const createComment = async (req, res) => {
    const postId = req.params.postId;
    const { userId, text } = req.body;

    try {
        // Validate input
        if (!userId || !text) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { fullName, profilePhoto, _id } = user;

        // Create the comment object
        const comment = {
            user: _id,
            fullName,
            profilePhoto,
            comment: text,
            createdAt: new Date()
        };

        console.log(comment);

        // Add the comment to the post
        post.comments.push(comment);
        await post.save();

        // Respond with the updated post (including the new comment)
        return res.status(201).json(post);
    } catch (error) {
        console.error("Error while posting comment:", error);
        return res.status(500).json({ message: 'Server error' });
    }
};


export const createPostInGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { content, authorId } = req.body;

        // Create a new post
        const post = new GameGroupPost({
            content,
            author: authorId
        });

        // Save the post to the database
        const savedPost = await post.save();

        // Add the post to the group's posts array
        const group = await Group.findByIdAndUpdate(groupId, {
            $push: { posts: savedPost._id }
        }, { new: true });

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Return the created post
        res.status(201).json(savedPost);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};
