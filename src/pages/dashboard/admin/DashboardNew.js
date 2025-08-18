import React, {
  useState
  // , useEffect
} from 'react';
import { Grid, Typography, Stack, TextField, Button, Box } from '@mui/material';
import { SearchOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
// import AnalyticQueues from 'components/cards/statistics/AnlyticQueue';
import ProgressTruckLoading from './components/ProgressTruckLoading';
import LoadingVolumeByHour from './components/LoadingVolumeByHour';
import TopItems from './components/TopItems';
// import AvgLoadingTime from './components/AvgLoadingTime';
import OperationSummary from './components/OperationSummary';
import LoadingVolumeCompany from './components/LoadingVolumeCompany';
import AvgLoadingTimePerTruck from './components/AvgLoadingTimePerTruck';
import DeliveryLoadingByHour from './components/DeliveryLoadingByHour';
import moment from 'moment/min/moment-with-locales';

const DashboardNew = () => {
  const currentDate = moment(new Date()).format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSearch = () => {
    // Handle search logic here
    console.log('Searching for date:', selectedDate);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <MainCard sx={{ mt: 2 }} content={true}>
          <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* Header */}
            <Grid item xs={12} sx={{ mb: -2.25 }}>
              <Typography variant="h5">แดชบอร์ดใหม่ : วันที่ {moment(selectedDate).locale('th').format('LL')}</Typography>
            </Grid>

            {/* Date Filter */}
            <Grid item xs={12}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={3}>
                  <Stack spacing={1}>
                    <TextField
                      required
                      fullWidth
                      type="date"
                      id="pickup_date"
                      name="pickup_date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      inputProps={{
                        max: currentDate
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button size="medium" color="primary" variant="contained" onClick={handleSearch} startIcon={<SearchOutlined />}>
                    ค้นหา
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* Operation Summary */}
            <Grid item xs={12}>
              <OperationSummary date={selectedDate} />
            </Grid>

            {/* Top Row - Main Charts */}
            <Grid item xs={12} md={12} lg={3} sx={{ height: '100%' }}>
              <Box sx={{ height: '100%' }}>
                <ProgressTruckLoading date={selectedDate} />
              </Box>
            </Grid>

            <Grid item xs={12} md={12} lg={4.5} sx={{ height: '100%' }}>
              <Box sx={{ height: '100%' }}>
                <LoadingVolumeByHour date={selectedDate} />
              </Box>
            </Grid>

            <Grid item xs={12} md={12} lg={4.5} sx={{ height: '100%' }}>
              <Box sx={{ height: '100%' }}>
                <DeliveryLoadingByHour date={selectedDate} />
              </Box>
            </Grid>

            {/* Second Row - Statistics */}
            {/* <Grid item xs={12} md={12} lg={4.5} sx={{ height: '100%' }}>
              <Box sx={{ height: '100%' }}>
                <AvgLoadingTime date={selectedDate} />
              </Box>
            </Grid> */}

            <Grid item xs={12} md={4} lg={4} sx={{ height: '100%' }}>
              <Box sx={{ height: '100%' }}>
                <TopItems date={selectedDate} />
              </Box>
            </Grid>

            <Grid item xs={12} md={4} lg={4} sx={{ height: '100%' }}>
              <Box sx={{ height: '100%' }}>
                <LoadingVolumeCompany date={selectedDate} />
              </Box>
            </Grid>

            <Grid item xs={12} md={4} lg={4} sx={{ height: '100%' }}>
              <Box sx={{ height: '100%' }}>
                <AvgLoadingTimePerTruck date={selectedDate} />
              </Box>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardNew;
