import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BASE_URL from "baseUrl";
import ProfileSkeleton from "components/Skeletons/ProfileSkeleton";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = useSelector((store) => store.token);
  const navigate = useNavigate();

  // Colors according to curr theme
  const {palette} = useTheme();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          Autherization: `UserToken ${token}`,
        },
      });
      const userData = await res.json();
      setUser(userData);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUser();
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  const {
    firstName,
    lastName,
    location,
    occupation,
    email,
    friends,
  } = user;

  return (
    <WidgetWrapper>
      {
        loading ? (
          <ProfileSkeleton />
        ) : (
          <>
          <FlexBetween
            gap="0.5rem"
            pb="1.1rem"
            onClick={() => navigate(`/profile/${userId}`)}
          >
            {/* First Row Of User Profile Component  */}
            <FlexBetween gap="1rem">
              <UserImage image={picturePath} />
              <Box>
                <Typography
                  variant="h4"
                  color={dark}
                  fontWeight="500"
                  sx={{
                    "&:hover": {
                      color: palette.primary.light,
                      cursor: "pointer",
                    },
                  }}
                >
                  {firstName} {lastName}
                </Typography>
                <Typography color={medium}>{friends.length} friends</Typography>
              </Box>
            </FlexBetween>
            <ManageAccountsOutlined />

            </FlexBetween>

            <Divider />

            {/* Second Row */}
            <Box p="1rem 0">
              <FlexBetween mb="0.5rem">
                <Typography color={medium} mr='0.25rem'>Email:</Typography>
                <Typography color={main} fontWeight="500">
                  {email}
                </Typography>
              </FlexBetween>
            </Box>

            <Divider />

            {/* Third Row */}
            <Box p="1rem 0rem">
              <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                <LocationOnOutlined fontSize="large" sx={{ color: main }} />
                <Typography color="medium">{location}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
                <Typography color="medium">{occupation}</Typography>
              </Box>
            </Box>

            <Divider />

            {/* Fourth Row (Social Handles) */}
            <Box p="1rem 0">
              <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
                Social Profiles
              </Typography>

              <FlexBetween gap="1rem" mb="0.5rem">
                <FlexBetween gap="1rem">
                  <img src='../../assets/twitter.png' alt="twitter" />
                  <Box>
                    <Typography color={main} fontWeight="500">
                      Twitter
                    </Typography>
                    {/* <Typography color={medium}>Social Network</Typography> */}
                  </Box>
                </FlexBetween>
                <EditOutlined sx={{ color: main }} />
              </FlexBetween>

              <FlexBetween gap="1rem">
                <FlexBetween gap="1rem">
                  <img src="../../assets/linkedin.png" alt="linkedin" />
                  <Box>
                    <Typography color={main} fontWeight="500">
                      Linkedin
                    </Typography>
                    {/* <Typography color={medium}>Network Platform</Typography> */}
                  </Box>
                </FlexBetween>
                <EditOutlined sx={{ color: main }} />
              </FlexBetween>
            </Box>
          </>
        )
      }
    </WidgetWrapper>
  );
};

export default UserWidget;
