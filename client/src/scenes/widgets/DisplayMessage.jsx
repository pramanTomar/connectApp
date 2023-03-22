import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import moment from 'moment'
import React from 'react'

const DisplayMessage = ({data, loggedInUserId}) => {
  const {messageText, senderId, createdAt} = data;
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");

  const theme = useTheme();
  const neutralLight  = theme.palette.neutral.light;
  const primaryLight = theme.palette.primary.light;

  return (
    <>
    {
      senderId === loggedInUserId ? (
      // Logged In User Messages
      <Box display='flex' flexDirection='column' alignItems='flex-end' margin='0.5rem 1.5rem'>
        <Box maxWidth={isNonMobileScreen ? '600px' : '85%'} borderRadius='0.7rem 0rem 0.7rem 0.7rem' backgroundColor={primaryLight} padding='0.5rem 1rem'>
          <Typography sx={{wordWrap: 'break-word'}}>{messageText}</Typography>
          <Typography textAlign='right'>{moment(createdAt).fromNow()}</Typography>
        </Box>
      </Box>
      ) : (
      <Box display='flex' flexDirection='column' alignItems='flex-start' margin='0.5rem 1.5rem'>
        <Box maxWidth={isNonMobileScreen ? '600px' : '85%'} borderRadius='0rem 0.7rem 0.7rem 0.7rem' backgroundColor={neutralLight} padding='0.5rem 1rem'>
          <Typography sx={{wordWrap: 'break-word'}}>{messageText}</Typography>
          <Typography textAlign='left'>{moment(createdAt).fromNow()}</Typography>
        </Box>
      </Box>
      )
    }
    </>
  )
}

export default DisplayMessage;