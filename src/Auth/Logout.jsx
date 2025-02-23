import Cookies from 'js-cookie';
import { logout } from '../../store/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('refreshtoken'); // Remove token from Cookies
    dispatch(logout()); // Dispatch logout action to clear Redux state
    navigate('/login'); // Redirect to login page
  };

  return handleLogout;
};