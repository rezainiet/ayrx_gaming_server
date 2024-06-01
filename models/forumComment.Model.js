import mongoose from 'mongoose';

const forumCommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumPost',
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
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumReply',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const ForumComment = mongoose.model('ForumComment', forumCommentSchema);
export default ForumComment;
