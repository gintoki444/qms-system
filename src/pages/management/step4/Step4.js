import React from 'react';

import { Step4Table } from './Step4Table';

import { Grid, Stack, Typography, Box } from '@mui/material';
import MainCard from 'components/MainCard';

function Step4() {
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
            <Typography variant="h3">กำลังออกประตู</Typography>
          </Grid>

          <Grid item xs={12}>
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box sx={{ pt: 1, pr: 2 }}>
                <Step4Table status={'processing'} />
              </Box>
            </MainCard>
          </Grid>
        </Grid>

        <Grid container alignItems="center" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <Typography variant="h3">รอคิว</Typography>
          </Grid>

          <Grid item xs={12}>
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box sx={{ pt: 1, pr: 2 }}>
                <Step4Table status={'waiting'} />
              </Box>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Step4;
