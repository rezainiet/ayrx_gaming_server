import { Conversation } from "../models/conversation.Model.js";
import { Message } from "../models/message.Model.js";
import { User } from "../models/user.Model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        // Find or create conversation
        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        };

        // Create new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        // Update last message time for sender and receiver
        const currentTime = new Date();
        await Promise.all([
            User.findByIdAndUpdate(senderId, { lastMessageTime: currentTime }),
            User.findByIdAndUpdate(receiverId, { lastMessageTime: currentTime })
        ]);

        // Add message to conversation
        gotConversation.messages.push(newMessage._id);
        await gotConversation.save();

        // Emit new message event to receiver
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        // Update online users list (assuming you have a function for this)
        // Example: io.emit("updateUserList");

        return res.status(201).json({
            newMessage
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


// get messages

export const getMessage = async (req, res) => {
    try {
        const { id: senderId } = req;
        const { id: receiverId } = req.params;

        if (receiverId !== 'undefined' && senderId) {
            const conversation = await Conversation.findOne({
                participants: { $all: [senderId, receiverId] }
            }).populate("messages");
            if (!conversation) {
                return res.status(404).json({ message: 'Conversation not found!' })
            }
            if (conversation) {
                return res.status(200).json(conversation?.messages)
                console.log(conversation);
            };
        }
    } catch (error) {
        console.error('Error fetching message:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};