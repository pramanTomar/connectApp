import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from './scenes/homePage';
import LoginPage from './scenes/loginPage';
import ProfilePage from './scenes/profilePage';
import {useMemo} from 'react';
import { useSelector } from 'react-redux';
import {CssBaseline, ThemeProvider} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';
import Messenger from 'scenes/Messenger/Messenger';

function App() {

  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuthenticateUser = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path='/' element={isAuthenticateUser ? <HomePage/> : <LoginPage /> } />
            <Route path='/home' element={isAuthenticateUser ? <HomePage/> : <Navigate to='/' />} />
            <Route path='/profile/:userId' element={isAuthenticateUser ? <ProfilePage /> : <Navigate to='/' />} />
            <Route path='/messenger' element={isAuthenticateUser ? <Messenger /> : <Navigate to='/' />} />
            <Route />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App;
