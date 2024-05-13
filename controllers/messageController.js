import { Conversation } from "../models/conversation.Model.js";
import { Message } from "../models/message.Model.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;
        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        };
        console.log(gotConversation, "Line no 21")
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
        };


        await Promise.all([gotConversation.save(), newMessage.save()]);

        res.status(201).json({ message: "Message sent successfully" })
        // SOCKET IO

    } catch (error) {
        console.log(error);
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
                return res.status(200).json(conversation)
                console.log(conversation);
            };
        }
        // if (senderId) {
        //     console.log(senderId)
        // }

        // if (!receiverId) {
        //     console.log('Not found receiver id')
        //     return res.status(400).json({ message: 'Receiver ID are required!' });
        // }



        // if (!conversation) {
        //     return res.status(404).json({ message: 'Conversation not found!' });
        // }

        // return res.status(200).json({ conversation });
    } catch (error) {
        console.error('Error fetching message:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};