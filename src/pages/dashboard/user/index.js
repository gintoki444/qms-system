import React from 'react';

// material-ui
import {
  // Avatar,
  // AvatarGroup,
  // Button,
  Grid,
  // List,
  // ListItemAvatar,
  // ListItemButton,
  // ListItemSecondaryAction,
  // ListItemText,
  // MenuItem,
  // Stack,
  // TextField,
  Typography
} from '@mui/material';

// import OrdersTable from './OrdersTable';
// import IncomeAreaChart from './IncomeAreaChart';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import moment from 'moment/min/moment-with-locales';

function DashboardUser() {
  const currentDate = moment().locale('th').format('LL');

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">แดชบอร์ด</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="จำนวนออกคิว"
          count={`0/0`}
          // percentage={59.3}
          extra={currentDate}
          subtitle="ประจำวันที่"
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="จำนวนการจอง" count={`0/0`} extra={currentDate} subtitle="ประจำวันที่" color="warning" />
      </Grid>
    </Grid>
  );
}

export default DashboardUser;
