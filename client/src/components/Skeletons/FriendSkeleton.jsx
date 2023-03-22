import React from 'react';
import { Skeleton, Stack } from '@mui/material';

const FriendSkeleton = ({isChat = false}) => {
  return (
    <Stack direction='row' spacing={2} margin={isChat ? '1rem 0' : '0'}>
        <Skeleton variant="circular" width={75} height={60} />
        <Stack direction='column' width='100%'>
            <Skeleton variant="text" width='100%' height={30}/>
            <Skeleton variant="text" width='50%' height={30}/>
        </Stack>
    </Stack>
  )
}

export default FriendSkeleton;