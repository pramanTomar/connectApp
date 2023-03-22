import { EditOutlined, DeleteOutlined, ImageOutlined } from "@mui/icons-material";
import { Box, Divider, Typography, InputBase, useTheme,  Button,  IconButton, useMediaQuery } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import { message } from "antd";
import BASE_URL from "baseUrl";

const CreatePostWidget = ({picturePath, setPostToEdit, postToEdit}) => {

  const [isImage, setIsImage] = useState(false); // has someone clicked image button to upload image?
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const posts = useSelector((state) => state.posts);
  const oldPost = useSelector((state) => postToEdit ? state.posts.find((post) => post._id === postToEdit) : null);
  const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  useEffect(() => {
    if(oldPost) {
      setPost(oldPost.description);
    }
    else setPost("");
  }, [oldPost]); // eslint-disable-line react-hooks/exhaustive-deps

  const updatePost = async () => {
    const formData = new FormData();
    if(post.trim().length === 0) return;
    formData.append("userId", _id);
    formData.append("description", post);
    if(image) {
      // if image exist then append it as picture
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    } 
    const updatedPostRes = await fetch(`${BASE_URL}/posts/${postToEdit}/update`, {
      method: 'PATCH',
      body: formData,
      headers: { 
        Autherization: `UserToken ${token}`
     }
    });
    if(updatedPostRes.status === 200){
      message.success("Post Updated");
    }else{
      message.error("Failed To Update Post");
    }
    const updatedPost = await updatedPostRes.json();
    dispatch(setPosts({posts: posts.map((post) => post._id === postToEdit ? updatedPost : post)}));
    setPostToEdit(null);
    setPost("");
    setImage(null);
    setIsImage(false);
  }

  const handlePost = async () => {
    if(postToEdit) updatePost();
    else {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      if (image) {
        // if image exist then append it as picture
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      } 
      const res = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        body: formData,
        headers: {
          Autherization: `UserToken ${token}`,
        },
      });
      if(res.status === 201){
        message.success("Post Added");
      }else if(res.status === 409){
        message.error("Post Message Cannot Be Empty");
        setPost("");
        setImage(null);
        setIsImage(false);
        return;
      }else{
        message.error("Failed To Add Post");
      }
      const posts = await res.json();
      dispatch(setPosts({ posts }));
      setPost("");
      setImage(null);
      setIsImage(false);
    }
  };

  return (
    <WidgetWrapper id='post-component'>
      <FlexBetween gap="1.5rem">   {/* Imput to write a post */}
        {isNonMobileScreen && <UserImage image={picturePath} size='40px'/>}
        <InputBase
          placeholder="Share What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "0.5rem",
            padding: "0.6rem 1rem",
          }}
        />
      </FlexBetween>
      {isImage && (    // If user has selected toggled isImage then he wish to add a image , so show him Dropzone to do so!!! 
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && ( // If user has selected a image in dropzone then give him an option for delete the image 
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Add Image
          </Typography>
        </FlexBetween>

        <Button
          disabled={!post}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "0.5rem"
          }}
        >
          <span style={{color: 'black'}}>{postToEdit ? 'UPDATE' : 'POST'}</span>
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default CreatePostWidget;
