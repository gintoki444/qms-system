import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Grid, Stack, Button, Box, TextField, Alert } from '@mui/material';
import MainCard from 'components/MainCard';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';

import moment from 'moment';
const currentDate = moment(new Date()).format('YYYY-MM-DD');

// project import
import ReserveTable from './ReserveTable';

function Reserve() {
  const pageId = 8;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);
  let startDate = localStorage.getItem('reserve_startDate');
  let endDate = localStorage.getItem('reserve_endDate');
  const [pageDetail, setPageDetail] = useState({});
  useEffect(() => {
    if (Object.keys(userPermission).length > 0) {
      setPageDetail(userPermission.permission.find((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission, startDate, endDate]);

  if (!startDate) {
    startDate = currentDate;
  }
  if (!endDate) {
    endDate = currentDate;
  }
  const navigate = useNavigate();

  const [selectedDate1, setSelectedDate1] = useState(startDate);
  const [selectedDate2, setSelectedDate2] = useState(endDate);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: selectedDate1,
    endDate: selectedDate2
  });
  const handleDateChange1 = (event) => {
    setSelectedDate1(event.target.value);

    localStorage.setItem('reserve_startDate', event.target.value);
  };

  const handleDateChange2 = (event) => {
    setSelectedDate2(event.target.value);
    localStorage.setItem('reserve_endDate', event.target.value);
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
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button size="mediam" color="primary" variant="contained" onClick={() => handleSearch()} startIcon={<SearchOutlined />}>
              ค้นหา
            </Button>
          </Grid>
          <Grid item xs={12} md={3} align="right">
            {pageDetail &&
              (pageDetail.permission_name === 'manage_everything' || pageDetail.permission_name === 'add_edit_delete_data') && (
                <Button size="mediam" color="success" variant="outlined" onClick={() => addReserve()} startIcon={<PlusCircleOutlined />}>
                  เพิ่มข้อมูล
                </Button>
              )}
          </Grid>
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
            <Box sx={{ pt: 1, pr: 2 }}>
              <ReserveTable
                startDate={selectedDateRange.startDate}
                endDate={selectedDateRange.endDate}
                permission={pageDetail.permission_name}
              />
            </Box>
          </MainCard>
        )}
      </Grid>
    </Grid>
  );
}

export default Reserve;
