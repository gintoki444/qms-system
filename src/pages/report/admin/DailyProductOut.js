import React from 'react';

import {
  Grid,
  Box
  // Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
import OrderTable from 'pages/dashboard/admin/OrdersTable';

const DailyProductOut = () => {
  return (
    <Grid alignItems="center" justifyContent="space-between">
      <Grid container rowSpacing={1} columnSpacing={1.75}>
        <Grid item xs={12} md={12} lg={12}>
          <Grid item>
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box sx={{ pt: 1, pr: 2 }}>
                <OrderTable />
              </Box>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DailyProductOut;
