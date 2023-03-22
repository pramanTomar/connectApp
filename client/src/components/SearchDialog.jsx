import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, InputBase, Typography, useTheme } from '@mui/material';
import FlexBetween from './FlexBetween';
import Friend from './Friend';
import { useSelector } from 'react-redux';
import BASE_URL from 'baseUrl';

export default function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [searchResultCount, setSearchResultCount] = React.useState(1);
  const {palette} = useTheme();
  const token = useSelector((state) => state.token);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getSearchResults = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/search?name=${query.trim() || 'none'}`, {
        method: 'GET',
        headers: {Autherization: `UserToken ${token}`}
      });
      const queryMatch = await res.json();
      setUsers(queryMatch);
      setSearchResultCount(queryMatch.length);
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    getSearchResults();
  }, [query]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <IconButton onClick={handleClickOpen} sx={{ fontSize: "25px"}}>
        <SearchIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <FlexBetween>
          <DialogTitle>Find Friends</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </FlexBetween>
        <DialogContent>
          <DialogContentText variant='h5'>
            Enter the name of user you want to search
          </DialogContentText>
          <FlexBetween margin='1rem 0rem'>
            <InputBase
              placeholder="Search..."
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              sx={{
                width: "100%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                margin: '0 1rem 0 0'
              }}
            />
            <IconButton onClick={getSearchResults}>
              <SearchIcon />
            </IconButton>
          </FlexBetween>
          <Box display='flex' flexDirection='column'>
            {
              (searchResultCount === 0 && query.trim().length !== 0) ? (
                <Typography>No User Found</Typography>
              ) : (
                users.map(({ _id, firstName, lastName, occupation, picturePath }) => {
                  return (
                    <Box key={_id} margin='0.5rem'>
                      <Friend 
                        key={_id}
                        friendId={_id}
                        name={`${firstName} ${lastName}`}
                        subtitle={occupation}
                        userPicturePath={picturePath}
                        isProfile={false}
                      />
                    </Box>  
                  )
                })
              )
            }
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}