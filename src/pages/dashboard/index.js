// import React from 'react';
import { useSelector } from 'react-redux';
import AdminDashboard from './admin/index';
import DashboardUser from './user/index';
import { Stack, Alert, Grid } from '@mui/material';

function DashboardDefault() {
  const token = localStorage.getItem('token');
  const userRole = useSelector((state) => state.auth?.roles);
  console.log(userRole);
  return (
    <>
      {token &&
        ((userRole && userRole === 9) || userRole === 10 ? (
          <AdminDashboard />
        ) : (
          <Grid>
            {userRole === 5 && (
              <Stack sx={{ width: '100%', mb: '18px' }} spacing={2}>
                <Alert severity="warning">กรุณารอการอนุมัติการใช้งานจากผู้ดูแลระบบ</Alert>
              </Stack>
            )}
            <DashboardUser />
          </Grid>
        ))}
    </>
  );
}

export default DashboardDefault;
