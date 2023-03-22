import { useMediaQuery, Box } from '@mui/material';
import React, {useState} from 'react'
import { useSelector } from 'react-redux';
import Navbar from '../navbar';
import CreatePostWidget from 'scenes/widgets/CreatePostWidget';
import PostsWidget from 'scenes/widgets/PostsWidget';
import FriendList from 'scenes/widgets/FriendList';
import UserDetailsWidget from 'scenes/widgets/UserDetailsWidget';
import QuickAccess from 'scenes/widgets/QuickAccess';
import Footer from 'scenes/footer/Footer';

const HomePage = () => {
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const [postToEdit, setPostToEdit] = useState(null);

  return (
    <Box display='flex' flexDirection='column' alignItems='center' maxWidth='2000px' margin='auto' height='100%'>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreen ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
        flex='1 0 auto'
      >
        <Box flexBasis={isNonMobileScreen ? "26%" : undefined} gap='1rem'>
          <UserDetailsWidget userId={_id} picturePath={picturePath} />
          <QuickAccess />
        </Box>
        <Box
          flexBasis={isNonMobileScreen ? "42%" : undefined}
          mt={isNonMobileScreen ? undefined : "2rem"}
        >
          <CreatePostWidget picturePath={picturePath} setPostToEdit={setPostToEdit} postToEdit={postToEdit}/>
          <PostsWidget userId={_id} setPostToEdit={setPostToEdit}/>
        </Box>
        {isNonMobileScreen && (
          <Box flexBasis="26%">
            <FriendList userId={_id} isProfile={false}/>
          </Box>
        )}
      </Box>
      <Box 
      sx={{
        width: '100%',
        flexShrink: '0'
      }}
      >
        <Footer />
      </Box>
    </Box>
  )
};

export default HomePage;