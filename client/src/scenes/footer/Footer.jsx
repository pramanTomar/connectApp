import { Box, IconButton, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import TelegramIcon from '@mui/icons-material/Telegram';

const Footer = () => {
  const {palette} = useTheme();
  const background = palette.background.alt;
  const medium = palette.neutral.medium;

  return (
    <>
    <Box width='100%' padding='0.5rem 0' backgroundColor={background}>
        <Stack width='100%' alignItems='center'>
            <Stack direction='row' spacing={2} justifyContent='space-between'>
                <a href='https://www.linkedin.com/in/praman-tomar-448a83205/' target='_blank' rel="noreferrer">
                  <IconButton>
                    <LinkedInIcon sx={{fontSize: '26px'}}/>
                  </IconButton>
                </a>
                <a href='https://www.instagram.com/praman_tomar/' target='_blank' rel="noreferrer">
                  <IconButton>
                    <InstagramIcon sx={{fontSize: '26px'}}/>
                  </IconButton>
                </a>
                <a href="mailto:pramantomar@gmail.com?subject=Mail To Connect" target='_blank' rel="noreferrer">
                  <IconButton>
                    <EmailIcon sx={{fontSize: '26px'}}/>
                  </IconButton>
                </a>
                <a href='https://t.me/Praman2003' target='_blank' rel="noreferrer">
                  <IconButton>
                    <TelegramIcon sx={{fontSize: '26px'}}/>
                  </IconButton>
                </a>
            </Stack>
        </Stack>
        <Stack alignItems='center'>
            <Typography fontSize='12px' color={medium}>
                Connect &#169; 2023
            </Typography>
        </Stack>
    </Box>
    </>
  )
}

export default Footer;