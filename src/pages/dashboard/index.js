// import React from 'react';
import { useSelector } from 'react-redux';
import AdminDashboard from './admin/index';
import DashboardUser from './user/index';
import { Stack, Alert, Grid } from '@mui/material';

function DashboardDefault() {
  const userRole = useSelector((state) => state.auth?.roles);
  console.log(userRole);
  return (
    <>
      {userRole && userRole === 8 ? (
        <AdminDashboard />
      ) : (
        <Grid>
          {!userRole && (
            <Stack sx={{ width: '100%', mb: '18px' }} spacing={2}>
              <Alert severity="warning">กรุณารอการอนุมัติการใช้งานจากผู้ดูแลระบบ</Alert>
            </Stack>
          )}
          <DashboardUser />
        </Grid>
      )}
    </>
  );
}

export default DashboardDefault;
