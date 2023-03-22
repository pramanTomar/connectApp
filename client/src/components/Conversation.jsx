import React, { useEffect, useState } from 'react';
import { Box, Divider, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import { useNavigate } from 'react-router-dom';
import UserImage from './UserImage';
import FriendSkeleton from './Skeletons/FriendSkeleton';
import BASE_URL from 'baseUrl';


const Conversation = ({data, loggedInUserId, showOnline, online, isChatBox = false}) => {

  const { palette } = useTheme();
  const navigate = useNavigate();

  const friendId = data.members.find((id) => id !== loggedInUserId);

  const [friendData, setFriendData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getFriend = async () => {
    try {
        const res = await fetch(`${BASE_URL}/users/${friendId}`, {
            method: 'GET'
        });
        const response = await res.json();
        setFriendData(response);
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    getFriend();
    setTimeout(()=>{
      setLoading(false);
    }, 2300);
  }, [data]);  // eslint-disable-line react-hooks/exhaustive-deps

  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const background = palette.background.default;

  return (
    <>
    {
      (loading && !isChatBox) ? (
        <FriendSkeleton isChat={true} />
      ) : (
        <>
        <FlexBetween width='100%' padding={showOnline ? '0.5rem 0.5rem' : '1rem 2rem'} borderRadius='0.5rem'
          sx={{
            '&:hover': {
              backgroundColor: background
            },
            cursor: 'pointer'
          }}
        >
          <FlexBetween gap="1rem">
            <UserImage image={friendData?.picturePath} size="55px" />
            <Box>
              <Typography color={main} variant="h5" fontWeight="500"
                onClick={() => {
                  navigate(`/profile/${friendId}`);
                  navigate(0);
                }}
                sx={{
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  }
                }}
              >
                {/* Friend Name  */}
                {`${friendData?.firstName} ${friendData?.lastName}`} 
              </Typography>
              {
                showOnline && (
                  <Typography color={medium} fontSize="0.75rem">
                    {
                      online ? (
                        'Online'
                      ) : (
                        'Offline'
                      )
                    }
                  </Typography>
                )
              }
            </Box>
          </FlexBetween>
        </FlexBetween>
        <Divider />
        </>
      )
    }
    </>
  )
}

export default Conversation
