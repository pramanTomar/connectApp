// This componenet is used in FriendList as well as PostWidget components
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import BASE_URL from "baseUrl";

const Friend = ({ friendId, name, subtitle, userPicturePath, isProfile }) => {

  const { palette } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { _id } = useSelector((state) => state.user); 
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    const res = await fetch(`${BASE_URL}/users/${_id}/${friendId}`, {
        method: "PATCH",
        headers: {
          Autherization: `UserToken ${token}`,
          "Content-Type": "application/json"
        }
    });
    message.success("Friend List Updated");
    const data = await res.json();
    dispatch(setFriends({ friends: data }));
  }

  return (
    <>
      <FlexBetween width='100%'>
        <FlexBetween gap="1rem">
          <UserImage image={userPicturePath} size="55px" />
          <Box
            onClick={() => {
              navigate(`/profile/${friendId}`);
              navigate(0);
            }}
          >
            <Typography color={main} variant="h5" fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                }
              }}
            >
              {/* Friend Name  */}
              {name}
            </Typography>
            <Typography color={medium} fontSize="0.75rem">
              {subtitle}
            </Typography>
          </Box>
        </FlexBetween>
        {
          friendId !== _id && !isProfile && (
            <IconButton onClick={patchFriend} sx={{ backgroundColor: primaryLight, p: "0.6rem" }} >
              {
                isFriend ? (
                  // {/*  if is already a friend then show remove friend Icon */}
                  <PersonRemoveOutlined sx={{ color: primaryDark }} />
                ) : (
                  <PersonAddOutlined sx={{ color: primaryDark }} />
                )
              }
            </IconButton>
          )
        }
      </FlexBetween>
    </>
  );
};

export default Friend;
