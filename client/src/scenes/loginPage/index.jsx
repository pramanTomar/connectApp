import React, { useState } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Form from './Form';

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const [loginPage, setLoginPage] = useState(true);

  return (
    <Box display='flex' flexDirection='column' alignItems='center' maxWidth='2000px' margin='auto'>
      <Box width="100%" backgroundColor={theme.palette.background.alt} p="1rem 6%" textAlign="left" >
        <Typography fontWeight="bold" fontSize="36px" color="primary">
          Connect
        </Typography>
      </Box>

      <Box width={isNonMobileScreens ? "50%" : "85%"}>
        <Typography fontWeight="500" variant='h2' mt='2rem' ml='1rem'>
          {loginPage ? 'Welcome, ' : 'Welcome to Connect, '}
        </Typography>
        <Typography fontWeight="500" variant="h3" ml='1rem'>
          {loginPage ? 'Login to connect' : 'Create a new account'}
        </Typography>

        <Box width='100%' p="2rem" m="1.25rem auto" borderRadius="1.5rem" backgroundColor={theme.palette.background.alt} >
          <Box display='flex' flexDirection='row' alignItems='center' justifyContent='center' p='2rem' pt='0'>
            <AccountCircleIcon sx={{ fontSize: "6rem" }} color="action"/>
          </Box>
          <Form setLoginPage={setLoginPage}/>
        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage;