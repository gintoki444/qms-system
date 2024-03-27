import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Toolbar, useMediaQuery } from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import navigation from 'menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// Get api Authen loggin
import * as authUser from '_api/loginRequest';
const token = localStorage.getItem('token');

// types
import { openDrawer } from 'store/reducers/menu';
import { setProfile } from 'store/reducers/auth';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const naviage = useNavigate();
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();

  const { drawerOpen } = useSelector((state) => state.menu);

  // drawer toggler
  const [open, setOpen] = useState(drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };

  // set media wise responsive drawer
  useEffect(() => {
    setOpen(!matchDownLG);
    dispatch(openDrawer({ drawerOpen: !matchDownLG }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLG]);

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  const getProfile = () => {
    authUser.authUser(token).then((result) => {
      if (result.status) {
        dispatch(
          setProfile({
            email: result.decoded.email,
            user_id: result.decoded.user_id,
            roles: result.decoded.role_id
          })
        );
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        // if (result.status == 9999) 
        naviage('/login');
      }
    });
  };

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header open={open} handleDrawerToggle={handleDrawerToggle} />
      <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
      <Box component="main" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        <Breadcrumbs navigation={navigation} title />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
