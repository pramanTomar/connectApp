import React from 'react'
import { Skeleton, Stack } from '@mui/material';

const ProfileSkeleton = () => {
  return (
    <>
    <Stack direction='column'>
        <Stack direction='column' justifyContent="center" alignItems="center" spacing={0.5}>
            <Skeleton variant="circular" width={70} height={70} />
            <Skeleton variant="text" width='50%' sx={{ fontSize: '2rem' }}/>
        </Stack>
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '5rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
    </Stack>
    </>
  )
}

export default ProfileSkeleton;