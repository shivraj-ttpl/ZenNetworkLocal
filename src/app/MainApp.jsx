import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { appNavigate } from '@/utils/navigationService';

import { authActions } from '../pages/Auth/authSaga';
import {
  setCurrentUserRole,
  setIsAuthenticated,
  setLoggedInUser,
} from '../pages/Auth/authSlice';
import AppRouter from '../routes/AppRouter';

const MainApp = () => {
  const dispatch = useDispatch();
  const loggedInUserData = JSON.parse(localStorage.getItem('user'));
  const { postLogout } = authActions;
  useEffect(() => {
    if (
      localStorage.getItem('token') &&
      loggedInUserData?.id &&
      loggedInUserData?.userType
    ) {
      dispatch(setLoggedInUser(loggedInUserData));
      dispatch(setIsAuthenticated(true));
      dispatch(setCurrentUserRole(loggedInUserData?.userType));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  window.__handleLogout = () => {
    dispatch(postLogout());
    dispatch(setLoggedInUser(null));
    dispatch(setIsAuthenticated(false));
    dispatch(setCurrentUserRole(null));
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    appNavigate('/login');
  };

  return <AppRouter />;
};

export default MainApp;
