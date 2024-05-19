import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AdminDashboard from './admin/index';
import { useNavigate } from 'react-router-dom';

// import DashboardUser from './user/index';
import Reserve from 'pages/reserve/Reserve';
import QueueSearch from 'pages/queues/QueueCheck';
import { Grid, Typography } from '@mui/material';

function DashboardDefault() {
  const naviage = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = useSelector((state) => state.auth?.roles);

  useEffect(() => {
    if (userRole === 19) {
      naviage('/queues/search');
    }
  }, [userRole]);
  return (
    <>
      {token &&
        ((userRole && userRole === 9) ||
        userRole === 10 ||
        userRole === 1 ||
        userRole === 11 ||
        userRole === 12 ||
        userRole === 13 ||
        userRole === 14 ||
        userRole === 15 ||
        userRole === 16 ||
        userRole === 17 ||
        userRole === 18 ? (
          <AdminDashboard />
        ) : (
          <Grid>
            {userRole === 19 && (
              <>
                <Grid sx={{ mt: 2, mb: 3 }}>
                  <Typography variant="h5">ตรวจสอบข้อมูลคิว</Typography>
                </Grid>
                <QueueSearch />
              </>
            )}
            {userRole !== 19 && (
              <>
                <Grid sx={{ mt: 2, mb: 3 }}>
                  <Typography variant="h5">ข้อมูลการจองคิว</Typography>
                </Grid>
                <Reserve />
              </>
            )}
          </Grid>
        ))}
    </>
  );
}

export default DashboardDefault;
