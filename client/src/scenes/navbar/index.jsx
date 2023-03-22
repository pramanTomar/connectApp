import React from 'react';
import { useState } from "react";
import { Link } from 'react-router-dom';
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  Message,
  DarkMode,
  LightMode,
  Menu,
  Close
} from "@mui/icons-material";
import Home from "@mui/icons-material/Home";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from '../../state';
import { useNavigate } from "react-router-dom";
import FlexBetween from '../../components/FlexBetween';
import SearchDialog from '../../components/SearchDialog';
import ForumIcon from '@mui/icons-material/Forum';
import { message } from 'antd';

const Navbar = () => {

  const [isMobileMenuToggeled, setIsMobileMenuToggeled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  
  // Using colors for our theme
  const theme = useTheme();
  const neutralLight  = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  let fullName = `${user.firstName} ${user.lastName}`;

  return (
    // we can pass css props if we are using Box components in material ui (in FlexBetween Component)
    <FlexBetween padding="1rem 6%" backgroundColor={alt} width='100%'>
      <FlexBetween gap="1.75rem">
        {/* clamp (minFontSize, PrefferedSize, maxSize) */}
        <Typography fontWeight="bold" fontSize="clamp(1rem, 2rem, 2.25rem)" color="primary" onClick={() => navigate('/home')} 
        sx={
          {
            "&:hover": {
              color: primaryLight,
              cursor: "pointer"
            }
          }
        }>
          Connect
        </Typography>
      </FlexBetween>

      {/* Wide Screens Navbar */}

      { isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between' 
            onClick={() => navigate('/home')}
            sx={{
              '&:hover': {
                backgroundColor: neutralLight,
                cursor: 'pointer'
              },
              width: "110px",
              borderRadius: "0.25rem",
              p: "0.4rem 1rem",
              "& .MuiSelect-select-focus": {
                backgroundColor: neutralLight
              }
            }}
          >
            <Typography>Home</Typography>
            <Home sx={{ fontSize: "25px"}} />
          </Box>

          <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'
            sx={{
              '&:hover': {
                backgroundColor: neutralLight,
                cursor: 'pointer'
              },
              width: "110px",
              borderRadius: "0.25rem",
              p: "0.4rem 1rem",
              "& .MuiSelect-select-focus": {
                backgroundColor: neutralLight
              }
            }}
            onClick={() => dispatch(setMode())}
          >
            <Typography>Mode</Typography> {/* switch between modes (dark/light) */}
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px"}} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px"}} />
              )}
          </Box>

          {/* ICONS */}
          <Link to='/messenger'>
            <ForumIcon sx={{ fontSize: "25px"}} />
          </Link>

          <SearchDialog />

          <FormControl variant="standard">
            <Select defaultValue = "" value={fullName} 
              styles={{
                indicatorSeparator: () => {}, // removes the "stick"
                dropdownIndicator: defaultStyles => ({
                  ...defaultStyles,
                  color: 'purple' // your changes to the arrow
                })
              }}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                }
              }}
              input={<InputBase />}>
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => {
                message.info("User Logged Out");
                dispatch(setLogout());
              }}>
                Log Out
              </MenuItem>
            </Select >
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton onClick={() => setIsMobileMenuToggeled(!isMobileMenuToggeled)}>
          <Menu />
        </IconButton>
      )}

      {/* Mobile Screens Navbar */}

      { !isNonMobileScreens && isMobileMenuToggeled && (
        <Box position="fixed" right="0" bottom="0" height="100%" zIndex="10" maxWidth="200px" minWidth="200px" backgroundColor={background}>
          {/* Close Icon */}
          <Box display="flex" justifyContent='flex-end' p="1rem">
            <IconButton onClick={() => setIsMobileMenuToggeled(!isMobileMenuToggeled)}>
              <Close />
            </IconButton>
          </Box>

          {/* Menu Item On Mobile Screens */}

          <FlexBetween gap="1.5rem" display="flex" flexDirection="column" justifyContent="center" alignItems="center" overflow-y='scroll'>
            <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'
            sx={{
              backgroundColor: neutralLight,
              width: "150px",
              borderRadius: "0.25rem",
              p: "0rem 1rem",
              "& .MuiSelect-select-focus": {
                backgroundColor: neutralLight
              },
              "&:hover": {
                cursor: 'pointer'
              }
            }}
            onClick={() => navigate('/home')}
            >
              <Typography>Home</Typography>
              <IconButton>
                <Home sx={{ fontSize: "25px"}} />
              </IconButton>
            </Box>

            <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'
            sx={{
              backgroundColor: neutralLight,
              width: "150px",
              borderRadius: "0.25rem",
              p: "0rem 1rem",
              "& .MuiSelect-select-focus": {
                backgroundColor: neutralLight
              },
              "&:hover": {
                cursor: 'pointer'
              }
            }}
            onClick={() => dispatch(setMode())}
            >
              <Typography>Mode</Typography>
              <IconButton sx={{ fontSize: "25px"}}> {/* switch between modes (dark/light) */}
                {theme.palette.mode === "dark" ? (
                  <DarkMode sx={{ fontSize: "25px"}} />
                ) : (
                  <LightMode sx={{ color: dark, fontSize: "25px"}} />
                )}
              </IconButton>
            </Box>

            <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'
            sx={{
              backgroundColor: neutralLight,
              width: "150px",
              borderRadius: "0.25rem",
              p: "0.25rem 1rem",
              "& .MuiSelect-select-focus": {
                backgroundColor: neutralLight
              }
            }}
            >
              <Typography>Find Friends</Typography>
              <SearchDialog />
            </Box>
            
            <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'
            sx={{
              backgroundColor: neutralLight,
              width: "150px",
              borderRadius: "0.25rem",
              p: "0rem 1rem",
              "& .MuiSelect-select-focus": {
                backgroundColor: neutralLight
              },
              "&:hover": {
                cursor: 'pointer'
              }
            }}
            onClick={() => navigate('/messenger')}
            >
              <Typography>Messenger</Typography>
              <IconButton>
                <Message sx={{ fontSize: "25px"}} />
              </IconButton>
            </Box>
            
            <FormControl variant="standard" value={fullName}>
              <Select value={fullName} 
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem"
                  } ,
                  "& .MuiSelect-select-focus": {
                    backgroundColor: neutralLight
                  }
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                  message.info("User Logged Out");
                  dispatch(setLogout());
                }}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )
      }

    </FlexBetween>
  )
}

export default Navbar;