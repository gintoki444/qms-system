import React from 'react';
import { useSelector } from 'react-redux';

import { Grid, Stack, Box, Alert } from '@mui/material';
import MainCard from 'components/MainCard';

import DriverTable from './DriversTable';

function Drivers() {
  const userRole = useSelector((state) => state.auth?.roles);

  return (
    <Grid alignItems="center" justifyContent="space-between">
      <Grid container rowSpacing={1} columnSpacing={1.75}>
        <Grid item xs={12} md={7} lg={8}>
          {userRole === 5 && (
            <Stack sx={{ width: '100%', mb: '18px' }} spacing={2}>
              <Alert severity="warning">กรุณารอการอนุมัติการใช้งานจากผู้ดูแลระบบ</Alert>
            </Stack>
          )}
          <MainCard content={false} sx={{ mt: 1.5 }}>
            <Box sx={{ pt: 1, pr: 2 }}>
              <DriverTable />
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Drivers;
