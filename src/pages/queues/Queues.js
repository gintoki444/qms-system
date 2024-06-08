import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

import { Grid, Stack, Button, TextField, Box, Alert, Backdrop, CircularProgress } from '@mui/material';
import MainCard from 'components/MainCard';
// import { PlusCircleOutlined } from '@ant-design/icons';

import { SearchOutlined } from '@ant-design/icons';

import moment from 'moment';
const currentDate = moment(new Date()).format('YYYY-MM-DD');
import QueueTable from './QueueTable';

function Queues() {
  const pageId = 9;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);
  const [loading, setLoading] = useState(false);
  const [pageDetail, setPageDetail] = useState([]);

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
  useEffect(() => {
    setLoading(true);
    if (Object.keys(userPermission).length > 0) {
      setLoading(false);
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission]);
  return (
    <Grid rowSpacing={2} columnSpacing={2.75}>
      {loading === 9999 && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
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
        {Object.keys(userPermission).length > 0 && pageDetail.length === 0 && (
          <Grid item xs={12}>
            <MainCard content={false}>
              <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="warning">คุณไม่มีสิทธิ์ใช้เข้าถึงข้อมูลนี้</Alert>
              </Stack>
            </MainCard>
          </Grid>
        )}
        {pageDetail.length !== 0 && (
          <MainCard content={false} sx={{ mt: 1.5 }}>
            <Box>
              <QueueTable startDate={selectedDateRange.startDate} endDate={selectedDateRange.endDate} permission={pageDetail[0].permission_name} />
            </Box>
          </MainCard>
        )}
      </Grid>
    </Grid>
  );
}

export default Queues;
