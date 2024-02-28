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
  let newMenuItem = menuItem;
  const userRole = useSelector((state) => state.auth?.roles);
  let roles = userRole;
  if (roles) newMenuItem.items = menuItem.items.filter((x) => x.roles === roles);

  if (!roles) {
    roles = 5;
  }
  useEffect(() => {
    if (!roles) {
      roles = 5;
    }
  }, [roles]);

  // if (roles) {
  //   newMenuItem.items = menuItem.items.filter((x) => x.roles === roles);
  //   console.log(newMenuItem);
  // }
  // console.log('newMenuItem.items :', newMenuItem.items);

  const navGroups = newMenuItem.items.map((item) => {
    if (roles && item.roles === roles) {
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
    }
  });

  return <>{roles === null ? <p style={{ textAlign: 'center' }}>Loading...</p> : <Box sx={{ pt: 2 }}>{navGroups}</Box>}</>;
};

export default Navigation;
