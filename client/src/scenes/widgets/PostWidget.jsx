import { ChatBubbleOutlineOutlined,  FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Divider, IconButton, Typography, useTheme, InputBase } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { setPost, setPosts } from "state"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import moment from "moment";
import { message } from "antd";
import BASE_URL from "baseUrl";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  createdAt,
  setPostToEdit,
  isProfile,
  isFirstIndex
}) => {

  const [isComments, setIsComments] = useState(false);   // if we open the comment list or not
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);  // User id of user which is logged in
  const isLiked = Boolean(likes[loggedInUserId]);   // is current post liked by current user (the one who is logged in)? (Likes is a map of type boolean)
  const likeCount = Object.keys(likes).length;  

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const medium = palette.neutral.medium;

  const patchLikes = async () => {
    const res = await fetch(`${BASE_URL}/posts/${postId}/like`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Autherization: `UserToken ${token}`
        },
        body: JSON.stringify({
            userId: loggedInUserId
        })
    });
    const updatedPost = await res.json();
    dispatch(setPost({post: updatedPost}));
  } 

  const addComment = async () => {
    const res = await fetch(`${BASE_URL}/posts/${postId}/comment`, {
      method: 'PATCH',
      headers: {
        Autherization: `UserToken ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comment: comment
      })
    });
    if(res.status === 200){
      message.info("Comment Added");
    }else{
      message.error("Cannot Add Comment")
    }
    const updatedPost = await res.json();
    dispatch(setPost({post: updatedPost}));
    setComment("");
  }

  const deletePost = async () => {
    const res = await fetch(`${BASE_URL}/posts/${postId}/delete`, {
      method: 'DELETE',
      headers: {
        Autherization: `UserToken ${token}`
      }
    });
    if(res.status === 200){
      message.info("Post Deleted");
    }else{
      message.error("Cannot Delete Post At The Moment");
    }
    const updatedPosts = await res.json();
    dispatch(setPosts({posts: updatedPosts}));
  }

  const handleEdit = () => {
    setPostToEdit(postId);
    const postWidget = document.getElementById('post-component');
    postWidget.scrollIntoView({ behavior: 'smooth' });
  }
  
  return (
    <>
      <WidgetWrapper isfirstpost={isFirstIndex ? "true" : "false"} m={isFirstIndex ? '0 0 2rem 0' : '2rem 0'}> 
        <FlexBetween>
          <Friend friendId={postUserId} name={name} subtitle={location} userPicturePath={userPicturePath} isProfile={isProfile} /> 
          {
            postUserId === loggedInUserId && (
              <IconButton onClick={handleEdit}>
                <EditIcon />
              </IconButton>
            )
          }
        </FlexBetween>
        <Typography color={medium} sx={{ m: '0.5rem 0rem', fontSize: '0.75rem'}}>Created {moment(createdAt).fromNow()}</Typography> 
        <Divider />
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
        {/* If picture exist in the post then display it */}
        {picturePath && (
          <img width="100%" height="auto" alt="post" src={`${BASE_URL}/assets/${picturePath}`}
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem"}}
          />
        )}
        {/* All functionalities of Post Component (Likes, Comments,) */}
        <FlexBetween mt="0.25rem">
          <FlexBetween gap="2rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLikes}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>

            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                { isComments ? <ChatBubbleIcon /> : <ChatBubbleOutlineOutlined /> }
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>

          {
            loggedInUserId === postUserId && (
              <IconButton onClick={deletePost}>
                <DeleteIcon />
              </IconButton>
            )
          }
        </FlexBetween>

        {/* If the user has pressed comments button then display this comments section */}
        {isComments && (
          <Box mt="0.5rem">
            <FlexBetween gap='0.25rem' mb='1rem'>
              <InputBase
                value={comment}
                placeholder="Add New Comment"
                onChange={(e) => setComment(e.target.value)}
                sx={{
                  width: "100%",
                  backgroundColor: palette.neutral.light,
                  borderRadius: "0.5rem",
                  padding: "0.28rem 1rem",
                }}
              />
              <IconButton
                onClick={addComment}
                sx={{
                  borderRadius: "0.5rem",
                  color: palette.background.alt,
                  backgroundColor: palette.primary.main
                }}
              >
                <SendIcon />
              </IconButton>
            </FlexBetween>
            {comments.map((comment, i) => (
              <Box key={`${name}-${i}`}>
                <Divider />
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {comment}
                </Typography>
              </Box>
            ))}
            <Divider />
          </Box>
        )}
      </WidgetWrapper>
    </>
  )
};

export default PostWidget;