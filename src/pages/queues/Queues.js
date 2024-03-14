import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

import { Grid, Stack, Button, TextField, Box } from '@mui/material';
import MainCard from 'components/MainCard';
// import { PlusCircleOutlined } from '@ant-design/icons';

import { SearchOutlined } from '@ant-design/icons';

import moment from 'moment';
const currentDate = moment(new Date()).format('YYYY-MM-DD');
import QueueTable from './QueueTable';

function Queues() {
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
    <Grid rowSpacing={2} columnSpacing={2.75}>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="flex-end" spacing={2}>
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={3}>
            <Stack spacing={1}>
              <TextField
                required
                fullWidth
                type="date"
                id="pickup_date"
                name="pickup_date"
                value={selectedDate2}
                onChange={handleDateChange2}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button size="mediam" color="primary" variant="contained" onClick={() => handleSearch()} startIcon={<SearchOutlined />}>
              ค้นหา
            </Button>
          </Grid>
          <Grid item xs={12} md={3} align="right"></Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <QueueTable startDate={selectedDateRange.startDate} endDate={selectedDateRange.endDate} />
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default Queues;
