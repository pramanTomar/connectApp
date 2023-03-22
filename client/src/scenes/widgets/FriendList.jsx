import { Box, useTheme } from "@mui/system";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setFriends } from "state";
import { Divider, Typography } from "@mui/material";
import FriendSkeleton from "components/Skeletons/FriendSkeleton";
import BASE_URL from "baseUrl";

const FriendList = ({userId, isProfile}) => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const {palette} = useTheme();
    const friends = useSelector((state) => state.user.friends);
    const [loader, setLoader] = useState(true);

    const getFriends = async () => {
        const res = await fetch(`${BASE_URL}/users/${userId}/friends`, {
            method: 'GET',
            headers: {
                Autherization: `UserToken ${token}`
            }
        });
        const data = await res.json();
        dispatch(setFriends({ friends: data }));
    };

    useEffect(() => {
        getFriends();
        setTimeout(() => {
            setLoader(false);
        }, 2000);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    return (
        <WidgetWrapper>
            <Typography color={palette.neutral.dark} variant='h5' fontWeight='500' sx={{mb: '1.5rem'}}>
                {isProfile ? `Friends (${friends.length})` : `My Friends (${friends.length})`}
            </Typography>
            <Box display='flex' flexDirection='column' gap='0.7rem'> 
                {friends.map((friend, idx) => {
                    return (
                        <Box key={`unique div key = ${idx}`} >
                            <Divider />
                            <Box mt='1rem'>
                                {
                                    loader ? (
                                        <FriendSkeleton />
                                    ) : (
                                        <Friend 
                                            key={`unique key = ${idx}`}
                                            friendId={friend._id}
                                            name={`${friend.firstName} ${friend.lastName}`}
                                            subtitle={friend.occupation}
                                            userPicturePath={friend.picturePath}
                                            isProfile={isProfile}
                                        />
                                    )
                                }
                            </Box>
                        </Box>
                    )
                })}
            </Box>
        </WidgetWrapper>
    );
} 

export default FriendList;