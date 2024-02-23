// import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Grid, Stack, Button, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { PlusCircleOutlined } from '@ant-design/icons';

import CarTable from './CarTable';
// import axios from '../../../node_modules/axios/index';

// Link api url
// const apiUrl = process.env.REACT_APP_API_URL;

function Car() {
  const navigate = useNavigate();
  const addCar = () => {
    // window.location = '/car/add';
    navigate('/car/add');
  };

  return (
    <Grid rowSpacing={2} columnSpacing={2.75}>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>{/* <Typography variant="h5">ข้อมูลร้านค้า/บริษัท</Typography> */}</Grid>
          {/* {permission.length > 0 && permission.add_data &&  */}
            <Grid item>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Button size="mediam" color="success" variant="outlined" onClick={() => addCar()} startIcon={<PlusCircleOutlined />}>
                  เพิ่มข้อมูล
                </Button>
              </Stack>
            </Grid>
          {/* } */}
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <CarTable />
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default Car;
