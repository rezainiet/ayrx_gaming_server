import mongoose from 'mongoose';

const forumReplySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumComment',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const ForumReply = mongoose.model('ForumReply', forumReplySchema);
export default ForumReply;
