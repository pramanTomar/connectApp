import Chat from '../models/Chat.js';
import User from '../models/User.js';

// Get User Details
export const getUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({message: error});
    }
}

// Get user Friends
export const getUserFriends = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);

        // Promise.all basically handles all the promises inside the function which are in array format
        const friends = await Promise.all( user.friends.map((id) => User.findById(id)) );

        const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return {_id, firstName, lastName, occupation, location, picturePath};
        });

        res.status(200).send(formattedFriends);

    } catch (error) {
        res.status(404).send('Error:' + error);
    }
}

// Patch friend List
export const addRemoveFriend = async (req,res) => {
    try {
        const {id, friendId} = req.params;
        const user = await User.findById(id);  // get user
        const friend = await User.findById(friendId);  // get friend user

        if(user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);  // Remove Friend
            friend.friends = friend.friends.filter((userId) => userId !== id);  
            // delete chat
            await Chat.findOneAndDelete({
                members: {$all: [id, friendId]}
            });
        }else{
            user.friends.push(friendId);  // Add Friend
            friend.friends.push(id);
            // create chat id
            try {
                const newChat = new Chat({
                    members: [id, friendId]
                });
                await newChat.save();
            } catch (error) {
                res.status(500).json({message: 'error in creating chatId', error});
            }
        }

        await friend.save();
        await user.save();

        const friends = await Promise.all( user.friends.map((id) => User.findById(id)) );

        const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return {_id, firstName, lastName, occupation, location, picturePath};
        });

        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(404).json({message: error});
    }
}

export const getUsers = async (req, res) => {
    try {
        let {name} = req.query;

        let array = name.split(" ");
        let firstName = array[0];
        let lastName = array[1];
        firstName = new RegExp(firstName, 'i');
        lastName = new RegExp(lastName, 'i');

        const users = await User.find({$and: [{firstName}, {lastName}]});
        res.status(200).json(users);
        
    } catch (error) {
        res.status(404).json({message: error});
    }
};