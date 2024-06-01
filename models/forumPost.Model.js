import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '',
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    shares: {
        type: Number,
        default: 0,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumComment',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

forumPostSchema.index({ title: 'text', content: 'text' });

const ForumPost = mongoose.model('ForumPost', forumPostSchema);
export default ForumPost;
