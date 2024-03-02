import React, { useState } from 'react';

import { Step3Table } from './Step3Table';

import { Grid, Stack, Box } from '@mui/material';
import MainCard from 'components/MainCard';

function Step3() {
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
      setCommonStatus('commonStatus');
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
          {/* <Grid item xs={12}>
            <Typography variant="h3">กำลังรับบริการ</Typography>
          </Grid> */}

          <Grid item xs={12}>
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box sx={{ pt: 1, pr: 2 }}>
                <Step3Table onStatusChange={handleStatusChange} status={'processing'} title={'กำลังรับบริการ'} />
              </Box>
            </MainCard>
          </Grid>
        </Grid>

        <Grid container alignItems="center" justifyContent="flex-end" sx={{ mt: 3 }}>
          {/* <Grid item xs={12}>
            <Typography variant="h3">รอคิว : ชั่งหนัก</Typography>
          </Grid> */}

          <Grid item xs={12}>
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box sx={{ pt: 1, pr: 2 }}>
                <Step3Table onStatusChange={handleStatusChange} status={'waiting'} title={'รอเรียกคิว'} />
              </Box>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Step3;
