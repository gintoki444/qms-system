import React from 'react';

import { StepTable } from 'components/stepTable/StepTable';

import { Grid, Stack, Typography, Box } from '@mui/material';
import MainCard from 'components/MainCard';

function Step1() {
  
  return (
    <Grid rowSpacing={2} columnSpacing={2.75}>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="flex-end">
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}></Stack>
          </Grid>
        </Grid>

        <Grid container alignItems="center" justifyContent="flex-end">
          <Grid item xs={12}>
            <Typography variant="h3">กำลังชั่งเบา</Typography>
          </Grid>

          <Grid item xs={12}>
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box sx={{ pt: 1, pr: 2 }}>
                <StepTable status={'processing'} />
              </Box>
            </MainCard>
          </Grid>
        </Grid>

        <Grid container alignItems="center" justifyContent="flex-end" sx={{mt:3}}>
          <Grid item xs={12}>
            <Typography variant="h3">รอคิว : ชั่งเบา</Typography>
          </Grid>

          <Grid item xs={12}>
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box sx={{ pt: 1, pr: 2 }}>
                <StepTable status={'waiting'} />
              </Box>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Step1;
