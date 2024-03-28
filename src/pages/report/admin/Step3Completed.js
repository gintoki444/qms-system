import React, { useState } from 'react';

import {
  Grid,
  Box,
  TextField,
  Button,
  Stack
  // Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
// import OrderSumQtyTable from './OrderSumQtyTable';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';

import StepCompletedForm from './step-forms/StepCompletedForm';
// import OrderTable from 'pages/dashboard/admin/OrdersTable';


function Step3Completed() {
    const currentDate = moment(new Date()).format('YYYY-MM-DD');
  
    const [selectedDate1, setSelectedDate1] = useState(currentDate);
    const [selectedDate2, setSelectedDate2] = useState(currentDate);
    const [selectedDateRange, setSelectedDateRange] = useState({
      startDate: currentDate,
      endDate: currentDate
    });
    const handleDateChange1 = (event) => {
      setSelectedDate1(event.target.value);
    };
  
    const handleDateChange2 = (event) => {
      setSelectedDate2(event.target.value);
    };
  
    const handleSearch = () => {
      setSelectedDateRange({
        startDate: selectedDate1,
        endDate: selectedDate2
      });
    };
    
    return (
      <Grid alignItems="center" justifyContent="space-between">
        <Grid container rowSpacing={1} columnSpacing={1.75}>
          <Grid item xs={12} md={12} lg={12}>
            <Grid container rowSpacing={1} columnSpacing={1.75}>
              <Grid item xs={3}>
                <Stack spacing={1}>
                  <TextField
                    required
                    fullWidth
                    type="date"
                    id="pickup_date"
                    name="pickup_date"
                    value={selectedDate1}
                    onChange={handleDateChange1}
                    // inputProps={{
                    //   min: currentDate
                    // }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Stack spacing={1}>
                  <TextField
                    required
                    fullWidth
                    type="date"
                    id="pickup_date"
                    name="pickup_date"
                    value={selectedDate2}
                    onChange={handleDateChange2}
                    // inputProps={{
                    //   min: currentDate
                    // }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Button size="mediam" color="primary" variant="contained" onClick={() => handleSearch()} startIcon={<SearchOutlined />}>
                  ค้นหา
                </Button>
              </Grid>
            </Grid>
            <Grid item>
              <MainCard content={false} sx={{ mt: 1.5 }}>
                <Box sx={{ pt: 1, pr: 2 }}>
                  <StepCompletedForm stepId={3} startDate={selectedDateRange.startDate} endDate={selectedDateRange.endDate} />
                </Box>
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
}

export default Step3Completed