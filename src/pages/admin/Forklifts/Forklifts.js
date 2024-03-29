// import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Grid, Stack, Button, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { PlusCircleOutlined } from '@ant-design/icons';

import ForkliftsTable from './ForkliftsTable';

function Forklifts() {
  const userRole = useSelector((state) => state.auth?.roles);
  const navigate = useNavigate();
  const addForklift = () => {
    // window.location = '/car/add';
    navigate('add');
  };

  return (
    <Grid alignItems="center" justifyContent="space-between">
      <Grid container rowSpacing={1} columnSpacing={1.75}>
        <Grid item xs={12} md={7} lg={8}>
          <Grid container alignItems="center" justifyContent="flex-end">
            <Grid item align="right">
              {userRole && userRole !== 5 && (
                <Stack direction="row" alignItems="right" spacing={0}>
                  <Button size="mediam" color="success" variant="outlined" onClick={() => addForklift()} startIcon={<PlusCircleOutlined />}>
                    เพิ่มข้อมูล
                  </Button>
                </Stack>
              )}
            </Grid>
          </Grid>

          <Grid item>
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box sx={{ pt: 1, pr: 2 }}>
                <ForkliftsTable />
              </Box>
            </MainCard>
          </Grid>

          {/* } */}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Forklifts;
