import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Grid, Stack, Button, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { PlusCircleOutlined } from '@ant-design/icons';

import DriverTable from './DriversTable';

function Drivers() {
  const navigate = useNavigate();

  const addDrivers = () => {
    // window.location = '/car/add';
    navigate('/drivers/add');
  };
  return (
    <Grid rowSpacing={2} columnSpacing={2.75}>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="flex-end">
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button size="mediam" color="success" variant="outlined" onClick={() => addDrivers()} startIcon={<PlusCircleOutlined />}>
                เพิ่มข้อมูล
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <DriverTable />
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default Drivers;
