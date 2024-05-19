import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  Grid,
  Box,
  TextField,
  Button,
  Stack,
  Alert,
  Backdrop,
  CircularProgress
  // Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
// import OrderSumQtyTable from './OrderSumQtyTable';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';

import StepCompletedForm from './step-forms/StepCompletedForm';
// import OrderTable from 'pages/dashboard/admin/OrdersTable';

function Step3Completed() {
  const pageId = 32;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  const [loading, setLoading] = useState(false);
  const [pageDetail, setPageDetail] = useState([]);

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

  useEffect(() => {
    setLoading(true);
    if (Object.keys(userPermission).length > 0) {
      setLoading(false);
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission]);
  return (
    <Grid alignItems="center" justifyContent="space-between">
      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
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
            {Object.keys(userPermission).length > 0 &&
              pageDetail.length === 0 &&
              pageDetail.length !== 0 &&
              (pageDetail[0].permission_name !== 'view_data' ||
                pageDetail[0].permission_name !== 'manage_everything' ||
                pageDetail[0].permission_name !== 'add_edit_delete_data') && (
                <Grid item xs={12}>
                  <MainCard content={false}>
                    <Stack sx={{ width: '100%' }} spacing={2}>
                      <Alert severity="warning">คุณไม่มีสิทธิ์ใช้เข้าถึงข้อมูลนี้</Alert>
                    </Stack>
                  </MainCard>
                </Grid>
              )}
            {pageDetail.length !== 0 &&
              (pageDetail[0].permission_name !== 'view_data' ||
                pageDetail[0].permission_name !== 'manage_everything' ||
                pageDetail[0].permission_name !== 'add_edit_delete_data') && (
                <MainCard content={false} sx={{ mt: 1.5 }}>
                  <Box sx={{ pt: 1, pr: 2 }}>
                    <StepCompletedForm stepId={3} startDate={selectedDateRange.startDate} endDate={selectedDateRange.endDate} />
                  </Box>
                </MainCard>
              )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Step3Completed;
