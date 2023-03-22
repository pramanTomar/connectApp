import { Box, Typography } from "@mui/material";
import PostSkeleton from "components/Skeletons/PostSkeleton";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import { setPosts } from "state";
import FeedNav from "./FeedNav";
import PostWidget from './PostWidget';
import BASE_URL from "baseUrl";

const PostsWidget = ({userId, isProfile = false, setPostToEdit}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const token = useSelector((state) => state.token);
    const posts = useSelector((state) => state.posts);
    const { friends } = useSelector((state) => state.user);
    const [feed, setFeed] = useState("explore");

    const getAllPosts = async () => {
        try{
            const res = await fetch(`${BASE_URL}/posts`, {
                method: 'GET',
                headers: {Autherization : `UserToken ${token}`}
            });
            if(!res) return;
            const posts = await res.json();
            dispatch(setPosts({posts: posts}));
        }catch(e){
            console.log(e);
        }
    };

    const getUserPosts = async () => {
        try {
            const res = await fetch(`${BASE_URL}/posts/${userId}/posts`, {
                method: 'GET',
                headers: { Autherization: `UserToken ${token}` }
            });
            if(!res) return;
            const posts = await res.json();
            dispatch(setPosts({posts: posts}));
        } catch (error) {
            console.log(error);
        }
    };

    const getUsersAndFriendsPosts = async () => {
        try {
            const res = await fetch(`${BASE_URL}/posts/${userId}/relatedPosts`, {
                method: 'GET',
                headers: { Autherization: `UserToken ${token}` }
            });
            if(res.status === 404) return;
            const posts = await res.json();
            dispatch(setPosts({posts: posts}));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(isProfile) getUserPosts();
        else if(feed === 'explore') getAllPosts();
        else getUsersAndFriendsPosts();
        setTimeout(() => {
            setLoading(false);
        }, 2000)
    }, [posts.length, feed, friends]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setLoading(true);
    }, [posts.length, feed]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
        {
            !isProfile && <FeedNav feed={feed} setFeed={setFeed} />
        }
        {
            posts.length === 0 && (
                <Box>
                    <WidgetWrapper isfirstpost='true'>
                        <Typography mb='0.5rem' fontSize='1.5rem'>No Posts To Display</Typography>
                    </WidgetWrapper>
                </Box>
            )
        }
        {posts.map(
            ({_id, userId, firstName, lastName, description, location, picturePath, userPicturePath, likes, comments, createdAt}, i) => (
                loading ? (
                    <PostSkeleton key={_id} isFirstIndex={(i === 0) ? 1 : 0} />
                ) : (
                    <PostWidget
                        key={_id} 
                        postId={_id}
                        postUserId={userId}
                        name={`${firstName} ${lastName}`} 
                        description={description}
                        location={location}
                        picturePath={picturePath}
                        userPicturePath ={userPicturePath}
                        likes={likes}
                        comments={comments}
                        createdAt={createdAt}
                        setPostToEdit={setPostToEdit}
                        isProfile={isProfile}
                        isFirstIndex={(i === 0) ? 1 : 0}
                    />
                )
            )
        )}
        </>
    );
};

export default PostsWidget;