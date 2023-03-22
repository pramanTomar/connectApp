import React from 'react';
import { Skeleton, Stack } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';

const PostSkeleton = ({isFirstIndex}) => {
  return (
    <WidgetWrapper isfirstpost={isFirstIndex ? "true" : "false"} m={isFirstIndex ? '0 0 2rem 0' : '2rem 0'}>
      <Stack direction='column' spacing={2}>
        <Stack direction='row' spacing={2}>
            <Skeleton variant="circular" width={75} height={60} />
            <Stack direction='column' width='100%'>
                <Skeleton variant="text" width='100%' height={30}/>
                <Skeleton variant="text" width='50%' height={30}/>
            </Stack>
        </Stack>
        <Skeleton variant="rectangular" width='100%' height={160} />
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      </Stack>
    </WidgetWrapper>
  )
}

export default PostSkeleton;