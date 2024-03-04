import React, { useState } from 'react';

import { Step2Table } from './Step2Table';

import { Grid, Stack, Typography, Box } from '@mui/material';
import MainCard from 'components/MainCard';

function Step2() {
  const [commonStatus, setCommonStatus] = useState('');
  const handleStatusChange = (newStatus) => {
    // Change the common status and trigger a data reload in the other instance
    if (newStatus !== commonStatus) {
      console.log(newStatus + '+' + commonStatus);
      setCommonStatus(newStatus);
    } else if (newStatus === commonStatus) {
      console.log(commonStatus + '+' + newStatus);
      setCommonStatus('');
    } else {
      setCommonStatus(commonStatus);
    }
  };
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
            <Typography variant="h3"></Typography>
          </Grid>

          <Grid item xs={12}>
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box sx={{ pt: 1, pr: 2 }}>
                <Step2Table
                  onStatusChange={handleStatusChange}
                  status={'processing'}
                  title={'กำลังรับบริการ'}
                />
              </Box>
            </MainCard>
          </Grid>
        </Grid>

        <Grid container alignItems="center" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box sx={{ pt: 1, pr: 2 }}>
                <Step2Table
                  onStatusChange={handleStatusChange}
                  status={'waiting'}
                  title={'รอเรียกคิว'}
                />
              </Box>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Step2;
