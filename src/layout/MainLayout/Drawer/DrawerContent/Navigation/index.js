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

  const userRole = useSelector((state) => state.auth.roles);

  // Set menu follows Roles user
  if (userRole && userRole !== 8) {
    newMenuItem.items = menuItem.items.filter((x) => x.roles != '8');
  }

  const navGroups = newMenuItem.items.map((item) => {
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
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;
