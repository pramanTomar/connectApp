import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import Conversation from './Conversation';
import InputEmoji from "react-input-emoji";
import FlexBetween from './FlexBetween';
import DisplayMessage from 'scenes/widgets/DisplayMessage';
import ForumIcon from '@mui/icons-material/Forum';
import SendIcon from '@mui/icons-material/Send';
import sentAudioPath from '../assets/messageSent.mp3';
import recieveAudioPath from '../assets/messageRecieved.mp3';
import { useSelector } from 'react-redux';
import BASE_URL from 'baseUrl';

const ChatBox = ({chat, loggedInUserId, setSendMessage, receiveMessage}) => {

  const {palette} = useTheme();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [messegesLen, setMessagesLen] = useState(1);
  const token = useSelector((state) => state.token);
  const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');
  const scroll = useRef();
  var sentAudio = new Audio(sentAudioPath);
  var recieveAudio = new Audio(recieveAudioPath);

  const fetchMessages = async () => {
    try {
        const res = await fetch(`${BASE_URL}/messages/${chat._id}`,{
            method: 'GET',
            headers: {
              Autherization: `UserToken ${token}`
            }
        });
        const data = await res.json();
        setMessages(data);
        setMessagesLen(data.length);
    } catch (error) {
        console.log(error);
    }
  }

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  }

  const handleSendMessage = async (e) => {
    const message = {
      senderId: loggedInUserId,
      messageText: newMessage.trim(),
      chatId: chat._id
    };

    try {
      const res = await fetch(`${BASE_URL}/messages`,{
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
          'Content-Type': 'application/json',
          Autherization: `UserToken ${token}`
        }
      });
      const data = await res.json();
      if(data.message === 'Cannot send empty message') return;
      setMessages([...messages, data]);
      setMessagesLen(messages.length);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
    const friendId = chat.members.find((id) => id !== loggedInUserId);
    setSendMessage({...message, friendId: friendId});
    sentAudio.play();
  }

  useEffect(() => {
    if(receiveMessage !== null && receiveMessage.chatId === chat._id){
      setMessages([...messages, receiveMessage]);
      recieveAudio.play();
    }
  }, [receiveMessage])  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchMessages();
  }, [chat, loggedInUserId, messages.length]);  // eslint-disable-line react-hooks/exhaustive-deps

  // scroll to lastMessage
  useEffect(()=> {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  },[messages]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box display='flex' flexDirection='column' height='100%'>
      <Box>
        <Conversation 
          data = {chat}
          loggedInUserId = {loggedInUserId}
          showOnline = {false}
          isChatBox = {true}
          sx={{
              padding: '5rem'
          }}
        />
      </Box>

      {/* Messaged Container */}
      <Box 
        className='messages-wrapper'
        sx={{
          overflow: 'scroll',
          flexGrow: '1',
          flexBasis: '0',
          scrollbarWidth: 'none'
        }}
      >
        {
          messegesLen === 0 ? (
            <Box textAlign='center' mt='3rem'>
              <ForumIcon 
                sx={isNonMobileScreen ? {
                  fontSize: '12rem'
                } : {fontSize: '8rem'}} 
              />
              <Typography color={palette.neutral.main} fontSize={isNonMobileScreen ? '2rem' : '1.3rem'} >This is start of the converstion</Typography>
            </Box>
          ) : (
              messages.map((message, idx) => (
                <div key = {idx} ref = {scroll}>
                  <DisplayMessage 
                    key = {idx}
                    data = {message}
                    loggedInUserId = {loggedInUserId}
                  />
                </div>
              )) 
          )
        }
        
      </Box>

      {/* Send Message Input Box */}
      <FlexBetween width='100%' padding={isNonMobileScreen ? '0px 1rem' : '0'}>
        <InputEmoji
            value={newMessage}
            borderRadius='0.5rem'
            theme='dark'
            borderColor="#bebebe"
            fontFamily="Rubik"
            onChange={handleChange}
            onEnter={handleSendMessage}
        />
        <IconButton
          onClick={handleSendMessage}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "50%"
          }}
        >
          <SendIcon />
        </IconButton>
      </FlexBetween>
    </Box>
  )
}

export default ChatBox;