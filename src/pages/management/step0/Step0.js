import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Grid, Stack, Button, Box, TextField, Alert } from '@mui/material';
import MainCard from 'components/MainCard';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';

import moment from 'moment';
const currentDate = moment(new Date()).format('YYYY-MM-DD');

// project import
import Step0Table from './Step0Table';

function Step0() {
  const userRole = useSelector((state) => state.auth?.roles);
  const navigate = useNavigate();

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

  const addReserve = () => {
    // window.location = '/car/add';
    navigate('/reserve/add');
  };
  return (
    <Grid rowSpacing={2} columnSpacing={2.75}>
      {userRole === 5 && (
        <Stack sx={{ width: '100%', mb: '18px' }} spacing={2}>
          <Alert severity="warning">กรุณารอการอนุมัติการใช้งานจากผู้ดูแลระบบ</Alert>
        </Stack>
      )}

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
                // inputProps={{
                //   min: currentDate
                // }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button size="mediam" color="primary" variant="contained" onClick={() => handleSearch()} startIcon={<SearchOutlined />}>
              ค้นหา
            </Button>
          </Grid>
          <Grid item xs={12} md={3} align="right">
            {userRole && userRole !== 5 && (
              <Button size="mediam" color="success" variant="outlined" onClick={() => addReserve()} startIcon={<PlusCircleOutlined />}>
                เพิ่มข้อมูล
              </Button>
            )}
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <Step0Table startDate={selectedDateRange.startDate} endDate={selectedDateRange.endDate} />
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default Step0;
