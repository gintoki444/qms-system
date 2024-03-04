// import React from 'react';
import { useSelector } from 'react-redux';
import AdminDashboard from './admin/index';
// import DashboardUser from './user/index';
import Reserve from 'pages/reserve/Reserve';
import { Grid, Typography } from '@mui/material';

function DashboardDefault() {
  const token = localStorage.getItem('token');
  const userRole = useSelector((state) => state.auth?.roles);
  console.log(userRole);
  return (
    <>
      {token &&
        ((userRole && userRole === 9) || userRole === 10 || userRole === 1 ? (
          <AdminDashboard />
        ) : (
          <Grid>
            <Grid sx={{ mt: 2, mb: 3 }}>
              <Typography variant="h5">ข้อมูลการจองคิว</Typography>
            </Grid>
            <Reserve />
          </Grid>
        ))}
    </>
  );
}

export default DashboardDefault;
