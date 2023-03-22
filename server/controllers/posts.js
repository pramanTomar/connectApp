import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;

        if(description.trim().length === 0) return res.status(409).json({message: "Empty Field"});

        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        });

        await newPost.save();

        const posts = await Post.find();

        res.status(201).json(posts);

    } catch (error) {
        res.status(409).json({error: error});
    }
}


export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1});
        res.status(201).json(posts);
    } catch (error) {
        res.status(404).json({error: error});
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ userId }).sort({createdAt: -1});
        res.status(201).json(posts);
    } catch (error) {
        res.status(404).json({error: error});
    }
}

export const getRelatedPosts = async (req, res) => {
    try {
        const { userId } = req.params;

        const currentUser = await User.findOne({ _id : userId});

        let userFriends = currentUser.friends;
        userFriends.push(userId);

        let feedPosts = await Post.find({userId: userFriends}).sort({createdAt: -1});

        feedPosts = feedPosts.flat(1);

        res.status(201).json(feedPosts);

    } catch (error) {
        res.status(404).json({error: error});
    }
}

export const likePost = async (req, res) => {
    try {
        const {id} = req.params; // Post Id
        const {userId} = req.body; // User Who perform like or dislike
        const post = await Post.findById(id); // Post on which like option is performed
        const isLiked = post.likes.get(userId); 

        if(isLiked){
            // Dislike
            post.likes.delete(userId);
        }else{
            // Like
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate( id, {likes: post.likes}, {new: true});
        
        res.status(200).json(updatedPost);

    } catch (error) {
        res.status(404).json({error: error});
    }
}

export const addComment = async (req, res) => {

    try {
        const { comment } = req.body;

        const {id} = req.params;

        if(comment.trim().length == 0) return res.status(400).json({message: 'No text found in comment'});

        const post = await Post.findById(id);

        const comments = post.comments;

        comments.unshift(comment);

        const updatedPost = await Post.findByIdAndUpdate( id, {comments: comments}, {new: true});

        res.status(200).json(updatedPost);

    } catch (error) {
        res.status(404).json({error: error});
    }
}

export const deletePost = async (req, res) => {
    try {
        const {id} = req.params;

        await Post.findByIdAndDelete(id);

        const updatedPosts = await Post.find().sort({createdAt: -1});

        res.status(200).json(updatedPosts);

    } catch (error) {
        res.status(404).json({error: error});
    }
}

export const updatePost = async (req, res) => {
    try {
        const {id} = req.params; // Post id to update

        const {  description, picturePath } = req.body;
        
        const updatedPost = await Post.findByIdAndUpdate(id, {description: description, picturePath: picturePath}, {new:true});
        // console.log(updatePost);
        res.status(200).json(updatedPost);

    } catch (error) {
        res.status(404).json({error: error});
    }
}