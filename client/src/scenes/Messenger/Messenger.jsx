import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery, Box, Typography, Divider, useTheme } from "@mui/material";
import Navbar from "../navbar";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import Conversation from "components/Conversation";
import ChatBox from "components/ChatBox";
import {io} from 'socket.io-client';
import assetPicturePath from '../../assets/select_to_start_conversation.png';
import BASE_URL from "baseUrl";

const Messenger = () => {
  const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");
  const theme = useSelector((state) => state.mode);

  const token = useSelector((state) => state.token);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const socket = useRef();


  const user = useSelector((state) => state.user);
  const {palette} = useTheme();

  const getChats = async () => {
    try {
        const data = await fetch(`${BASE_URL}/chat/${user._id}`, {
            headers: {
              Autherization: `UserToken ${token}`
            },
            method: 'GET'
        });
        const res = await data.json();
        setChats(res);
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    getChats();
  }, [user, user.friends]) // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {
    socket.current = io('http://localhost:3001');
    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);   // eslint-disable-line react-hooks/exhaustive-deps

  // sending msg to socket server
  useEffect(() => {
    if(sendMessage !== null){
      socket.current.emit('send-message', sendMessage);
    }
  }, [sendMessage]);  // eslint-disable-line react-hooks/exhaustive-deps

  // receive msg from socket server
  useEffect(() => {
    socket.current.on('receive-message', (message) => {
      setReceiveMessage(message);
    })
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member!== user._id);  // friend id
    const online = onlineUsers.find((user) => user.userId === chatMember);  // checking that it belongs to onlineUsers or not
    return online ? true : false;
  }

  return (
    <>
      <Box height='100vh' display='flex' flexDirection='column' alignItems='center' maxWidth='1800px' margin='auto'>
        <Navbar />
        <Box
          width="100%"
          padding={isNonMobileScreen ? "1rem" : '0rem'}
          display={isNonMobileScreen ? "flex" : "flex"}
          gap="0.5rem"
          justifyContent="space-between"
          flexGrow='1'
        >
          {
            (!currentChat || isNonMobileScreen) && (
              <WidgetWrapper flexBasis={isNonMobileScreen ? "26%" : '100%'} m={isNonMobileScreen ? '0' : '0.3rem'}>
                <Box display='grid' gridTemplateRows='auto'>
                  <Typography 
                    sx={{ 
                        fontSize: "1.5rem",
                        marginBottom: "1rem",
                        color: palette.neutral.main
                    }}>
                    Chats
                  </Typography>
                  <Divider />
                  <Box className='messages-wrapper'
                    sx={{
                      overflow: 'scroll',
                      minHeight: '340px',
                      height: 'calc(100vh - 200px)'
                    }}
                  >
                    {
                      chats.length === 0 && (
                        <Box textAlign='center' margin='3rem'>
                          <Typography textAlign='center' fontSize='1.4rem' mt='1.5rem' color={palette.neutral.main}>Add Friends To Chat</Typography>
                        </Box>
                      )
                    }
                    {
                      chats.map((chat) => 
                        <div key = {`${chat.members[0]} ${chat.members[1]} ${chat._id}}`} onClick={() => setCurrentChat(chat) }>
                          <Conversation
                            data = {chat}
                            loggedInUserId = {user._id}
                            showOnline = {true}
                            online = {checkOnlineStatus(chat)}
                          />
                        </div>
                      )
                    }
                  </Box>
                </Box>
              </WidgetWrapper>
            )
          }

          {
            isNonMobileScreen ? (
              // Desktop
            <WidgetWrapper flexBasis={isNonMobileScreen ? "73%" : undefined} 
              sx={{
                padding: '0rem'
              }}
            >
              {
                currentChat ? (
                  <ChatBox
                    key = {currentChat._id}
                    chat = {currentChat}
                    loggedInUserId = {user._id}
                    setSendMessage = {setSendMessage}
                    receiveMessage = {receiveMessage}
                  />
                ) : (
                  <Box textAlign='center' margin='3rem'>
                    <img width='250rem' style={theme === 'dark' ? {filter: 'invert(100%)'} : null} src={assetPicturePath} alt="Select a chat first" />
                    <Typography textAlign='center' fontSize='1.4rem' mt='1.5rem' color={palette.neutral.main}>To begin, select one chat from the left</Typography>
                  </Box>
                )
              }
            </WidgetWrapper>
            ) : (
              (currentChat && !isNonMobileScreen) && (
                // Chat Box for mobile screens
                <Box width='100%'>
                  <ChatBox
                    key = {currentChat._id}
                    chat = {currentChat}
                    loggedInUserId = {user._id}
                    setSendMessage = {setSendMessage}
                    receiveMessage = {receiveMessage}
                  />
                </Box>
              )
            )
          }
        </Box>
      </Box>
    </>
  );
};

export default Messenger;