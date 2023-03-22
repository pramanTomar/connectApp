import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    chatId: String,
    senderId: String,
    messageText: String
}, { timestamps: true});

const Message = mongoose.model('message', messageSchema);

export default Message;