// import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Grid, Stack, Button, Box, Alert } from '@mui/material';
import MainCard from 'components/MainCard';
import { PlusCircleOutlined } from '@ant-design/icons';

import CarTable from './CarTable';
// import axios from '../../../node_modules/axios/index';

// Link api url
// const apiUrl = process.env.REACT_APP_API_URL;

function Car() {
  const userRole = useSelector((state) => state.auth?.roles);
  const navigate = useNavigate();
  const addCar = () => {
    // window.location = '/car/add';
    navigate('/car/add');
  };

  return (
    <Grid alignItems="center" justifyContent="space-between">
      <Grid container rowSpacing={1} columnSpacing={1.75}>
        <Grid item xs={12} md={7} lg={8}>
          {userRole === 5 && (
            <Stack sx={{ width: '100%', mb: '18px' }} spacing={2}>
              <Alert severity="warning">กรุณารอการอนุมัติการใช้งานจากผู้ดูแลระบบ</Alert>
            </Stack>
          )}
          
          <Grid container alignItems="center" justifyContent="flex-end">
            <Grid item align="right">
              {userRole && (
                <Stack direction="row" alignItems="right" spacing={0}>
                  <Button size="mediam" color="success" variant="outlined" onClick={() => addCar()} startIcon={<PlusCircleOutlined />}>
                    เพิ่มข้อมูล
                  </Button>
                </Stack>
              )}
            </Grid>
          </Grid>

          <Grid item>
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box sx={{ pt: 1, pr: 2 }}>
                <CarTable />
              </Box>
            </MainCard>
          </Grid>

          {/* } */}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Car;
