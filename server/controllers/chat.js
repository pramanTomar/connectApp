import Chat from "../models/Chat.js";

export const getUserChats = async (req, res) => {
    try {
        const {userId} = req.params;
        const chats = await Chat.find({
            members: {$in : [userId]} // Filter which return all the chats in array format whose members include this current userId :)
        });
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({message: error});
    }
};