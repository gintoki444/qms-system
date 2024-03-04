import { useEffect } from 'react';
// material-ui
import { Box, Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// types
import { useSelector } from 'react-redux';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  // let newMenuItem = menuItem;
  const userRole = useSelector((state) => state.auth?.roles);

  // let roles = userRole;
  // if (roles) newMenuItem.items = menuItem.items.filter((x) => x.roles === roles);

  // if (!roles) {
  //   roles = 5;
  // }
  useEffect(() => {}, [userRole]);

  // if (roles) {
  //   newMenuItem.items = menuItem.items.filter((x) => x.roles === roles);
  //   console.log(newMenuItem);
  // }
  // console.log('newMenuItem.items :', newMenuItem.items);

  if (userRole !== null) {
    let filteredMenuItems = menuItem.items.filter((item) => {
      return userRole == item.roles.filter((x) => x == userRole);
    });
    const navGroups = filteredMenuItems.map((item) => {
      // if (userRole && item.roles === userRole) {
      switch (item.type) {
        case 'group':
          return <NavGroup key={item.id} item={item} />;
        default:
          return (
            <Typography key={item.id} variant="h6" color="error" align="center">
              Fix - Navigation Group
            </Typography>
          );
      }
      // }
    });

    return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
  } else {
    // Render a loading state or handle the case where userRoles or menuItems are not available yet
    return <p style={{ textAlign: 'center' }}>Loading...</p>;
  }
};

export default Navigation;
