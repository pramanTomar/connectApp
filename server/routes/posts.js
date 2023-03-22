import express from 'express';
import {getFeedPosts, getUserPosts, likePost, addComment, deletePost, getRelatedPosts } from '../controllers/posts.js';
import { verifyToken } from '../middleware/auth.js';

const Router = express.Router();

Router.get("/", verifyToken, getFeedPosts);
Router.get("/:userId/posts", verifyToken, getUserPosts);
Router.get("/:userId/relatedPosts", verifyToken, getRelatedPosts);

Router.patch("/:id/like", verifyToken, likePost);
Router.patch("/:id/comment", verifyToken, addComment);

Router.delete("/:id/delete", verifyToken, deletePost);

export default Router;