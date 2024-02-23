import React from 'react';
// import { useNavigate } from 'react-router-dom';

import { Grid, Stack, 
  // Button, 
  Box } from '@mui/material';
import MainCard from 'components/MainCard';
// import { PlusCircleOutlined } from '@ant-design/icons';

import QueueTable from './QueueTable';

function Queues() {
  // const navigate = useNavigate();

  // const addReserve = () => {
  //   // window.location = '/car/add';
  //   navigate('/reserve/add');
  // };
  return (
    <Grid rowSpacing={2} columnSpacing={2.75}>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="flex-end">
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <QueueTable />
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default Queues;
