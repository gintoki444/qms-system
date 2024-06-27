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
import * as permissionsRequest from '_api/permissionsRequest';
const token = localStorage.getItem('token');

// types
import { openDrawer } from 'store/reducers/menu';
import { setProfile, setPermission } from 'store/reducers/auth';

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
        getPagePermission(result.decoded.role_id);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        // if (result.status == 9999)
        naviage('/login');
      }
    });
  };

  const getPagePermission = (userRole) => {
    try {
      permissionsRequest.getPagesPermissionByRole(userRole).then((response) => {
        if (response.length > 0) {
          response = response.filter((x) => x.permission_name !== 'no_access_to_view_data');
          if (userRole === 11) {
            // const addnew = {
            //   page_id: 4,
            //   role_id: 11,
            //   permission_id: 7,
            //   group_id: 4,
            //   page_name: 'QueueTV',
            //   page_title: 'แสดงรายคิวปัจุบันบน TV',
            //   page_url: '/queues-screen',
            //   page_icon: 'screenDisploy',
            //   page_target: 1,
            //   page_type: 'item',
            //   group_name: 'ผู้ดูแลระบบ',
            //   group_type: 'group',
            //   role_name: 'ICP-Administrator',
            //   role_description: 'ICP-ผู้ดูแลระบบ Administrator',
            //   permission_name: 'manage_everything',
            //   permission_description: 'ICP-สามารถจัดการทั้งหมดได้'
            // };
            const addnew2 = {
              page_id: 34,
              role_id: 11,
              permission_id: 7,
              group_id: 4,
              page_name: 'Permission',
              page_title: 'จัดการสิทธิ์การใช้งาน',
              page_url: '/admin/permission',
              page_icon: 'permission',
              page_target: 0,
              page_type: 'item',
              group_name: 'ผู้ดูแลระบบ',
              group_type: 'group',
              role_name: 'ICP-Administrator',
              role_description: 'ICP-ผู้ดูแลระบบ Administrator',
              permission_name: 'manage_everything',
              permission_description: 'ICP-สามารถจัดการทั้งหมดได้'
            };
            // response.unshift(addnew);
            response.unshift(addnew2);
          }
          dispatch(setPermission({ key: 'permission', value: response }));
        } else {
          alert('คุณไม่ได้รับสิทธิ์ในการใช้งานระบบนี้ กรุณาติดต่อผู้ดูแลระบบ');
          localStorage.removeItem('token');
          localStorage.removeItem('user_id');
          naviage('/login');
        }
      });
    } catch (error) {
      console.log(error);
    }
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
