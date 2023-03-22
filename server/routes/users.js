import express from 'express';
import {getUser, getUserFriends, addRemoveFriend, getUsers} from '../controllers/users.js';
import {verifyToken} from '../middleware/auth.js'; 

const Router = express.Router();

Router.get("/search", getUsers);
Router.get("/:id", getUser);
Router.get("/:id/friends", verifyToken, getUserFriends);

Router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default Router;