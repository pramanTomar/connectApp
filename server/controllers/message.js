import Message from "../models/Messages.js";

export const addMessage = async (req, res) => {
    try {
        const {chatId, senderId, messageText} = req.body;
        if(messageText.length == 0) return res.json({message: 'Cannot send empty message'});
        const message = new Message({
            chatId, senderId, messageText
        });
        const result = await message.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send({'error': error});
    }
}

export const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const result = await Message.find({chatId});
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send({'error': error});
    }
}