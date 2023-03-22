import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import MessageIcon from '@mui/icons-material/Message';
import React from 'react'
import FlexBetween from 'components/FlexBetween';
import SearchDialog from 'components/SearchDialog';
import { useNavigate } from 'react-router-dom';

const QuickAccess = () => {
  const {palette} = useTheme();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const navigate = useNavigate();

  return (
    <>
      <WidgetWrapper mt='2rem'>
        <Box mb='1rem'>
          <Typography
            variant="h4"
            color={dark}
            fontWeight="500"
          >
            Quick Access
          </Typography>
        </Box>

        <Divider />

        <FlexBetween p='1rem 0'>
          <Typography
            variant="h5"
            color={medium}
          >
            Find Friends 
          </Typography>
          <SearchDialog />
        </FlexBetween>
        <Divider />

        <FlexBetween p='1rem 0' onClick={() => navigate('/messenger')} 
          sx={{
            '&:hover': {
              cursor: 'pointer'
            }
          }}
        >
          <Typography
            variant="h5"
            color={medium}
          >
            Open Messenger
          </Typography>
          <IconButton >
            <MessageIcon />
          </IconButton>
        </FlexBetween>
      </WidgetWrapper>
    </>
  )
}

export default QuickAccess;
