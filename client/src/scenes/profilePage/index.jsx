import { Box, Typography, useMediaQuery } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendList from "scenes/widgets/FriendList";
import CreatePostWidget from "scenes/widgets/CreatePostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import BASE_URL from "baseUrl";

const ProfilePage = () => {

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [user, setUser] = useState(null);
  const loggedInUserId = useSelector((state) => state.user._id);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const [postToEdit, setPostToEdit] = useState(null);

  const getUser = async () => {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: { Autherization: `UserToken ${token}` },
    });
    const data = await res.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box display='flex' flexDirection='column' alignItems='center' maxWidth='2000px' margin='auto'>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <FriendList userId={userId} isProfile={true} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {
            loggedInUserId === userId ? (
              <CreatePostWidget picturePath={user.picturePath} setPostToEdit={setPostToEdit} postToEdit={postToEdit}/>
            ) : (
              <WidgetWrapper>
                <Typography variant="h4" pb='0.6rem'>User Posts</Typography>
              </WidgetWrapper>
            )
          }
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile={true} setPostToEdit={setPostToEdit}/>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;