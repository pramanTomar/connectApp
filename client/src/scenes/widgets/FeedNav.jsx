import { Typography, useTheme } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

const FeedNav = ({feed, setFeed}) => {

  const {palette} = useTheme();
  const hoverColor = palette.background.alt;

  return (
    <Box display='flex' m='1rem 0 0 0'>
      <Box onClick={() => setFeed('explore')}
        sx={{
          '&:hover': {
            cursor: 'pointer',
            backgroundColor: hoverColor
          },
          padding: '0.5rem',
          borderRadius: '0.5rem 0.5rem 0 0'
        }}
        backgroundColor={feed === 'explore' ? hoverColor : 'default'}
      >
        <Typography color='primary' className={feed === 'explore' ? 'active-link' : 'inactive-link'} p='0 0.5rem'>
          Explore
        </Typography>
      </Box>
      
      <Box onClick={() => setFeed('feed')}
        sx={{
          '&:hover': {
            cursor: 'pointer',
            backgroundColor: hoverColor
          },
          padding: '0.5rem',
          borderRadius: '0.5rem 0.5rem 0 0',
          ml: '1.5rem',
        }}
        backgroundColor={feed === 'feed' ? hoverColor : 'default'}
      >
        <Typography color='primary' className={feed === 'feed' ? 'active-link' : 'inactive-link'} p='0 0.5rem'>
          My Feed
        </Typography>
      </Box>
    </Box>
  )
}

export default FeedNav
