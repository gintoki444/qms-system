import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  Grid,
  Stack,
  Button,
  Box,
  TextField,
  Alert,
  Typography
  // , Badge
} from '@mui/material';
import MainCard from 'components/MainCard';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

import moment from 'moment';

const currentDate = moment(new Date()).format('YYYY-MM-DD');

// project import
import Step0Table from './Step0Table';
import AllStations from './step0-forms/AllStations';
import AllContractor from './step0-forms/AllContractor';
import { Divider } from '../../../../node_modules/@mui/material/index';

// import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
import QueueTab from 'components/@extended/QueueTab';

import * as stepRequest from '_api/StepRequest';

function Step0() {
  const pageId = 11;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  // let startDate = localStorage.getItem('step0_startDate');
  // let endDate = localStorage.getItem('step0_endDate');
  let startDate = '';
  let endDate = '';

  // const navigate = useNavigate();
  const [pageDetail, setPageDetail] = useState([]);
  // const navigate = useNavigate();

  if (!startDate) {
    startDate = currentDate;
  }
  if (!endDate) {
    endDate = currentDate;
  }

  const [selectedDate1, setSelectedDate1] = useState(startDate);
  const [selectedDate2, setSelectedDate2] = useState(endDate);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: selectedDate1,
    endDate: selectedDate2
  });
  const [companyList, setCompanyList] = useState([]);
  const handleDateChange1 = (event) => {
    setSelectedDate1(event.target.value);
    localStorage.setItem('step0_startDate', event.target.value);
  };

  const handleDateChange2 = (event) => {
    setSelectedDate2(event.target.value);
    localStorage.setItem('step0_endDate', event.target.value);
  };

  const handleSearch = () => {
    // waitingGet(companyList, selectedDate1, selectedDate2);

    setSelectedDateRange({
      startDate: selectedDate1,
      endDate: selectedDate2
    });
  };

  useEffect(() => {
    if (Object.keys(userPermission).length > 0) {
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }

    // const intervalId = setInterval(() => {
    //   waitingGet(companyList, selectedDate1, selectedDate2);
    // }, 60000); // Polling every 5 seconds

    // return () => clearInterval(intervalId);
  }, [userRole, userPermission, startDate, endDate]);

  const [items, setItems] = useState([]);
  const getProductCompany = (dataList) => {
    stepRequest.getAllProductCompany().then((response) => {
      if (response.length > 0) {
        response.map((x) => {
          let countCompany = dataList.filter((i) => i.product_company_id == x.product_company_id).length;

          setItems((prevState) => ({
            ...prevState,
            [x.product_company_id]: countCompany
          }));
        });
      }
      setCompanyList(response);
    });
  };
  const [valueFilter, setValueFilter] = useState(0);
  const handleChange = (newValue) => {
    setValueFilter(newValue - 1);
  };

  const [sumWaiting, setSumWaiting] = useState(0);
  const [sumProcessing, setSumProcessing] = useState(0);
  const handleReserveData = (data) => {
    getProductCompany(data);
    setSumWaiting(data.filter((x) => x.step2_status !== 'processing')?.length);
    setSumProcessing(data.filter((x) => x.step2_status === 'processing')?.length);
  };

  const handleRefresh = () => {
    window.location = '/admin/step0/';
  };
  return (
    <Grid rowSpacing={2} columnSpacing={2.75}>
      {userRole === 5 && (
        <Stack sx={{ width: '100%', mb: '18px' }} spacing={2}>
          <Alert severity="warning">กรุณารอการอนุมัติการใช้งานจากผู้ดูแลระบบ</Alert>
        </Stack>
      )}

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
            <Grid item xs={12} md={2}>
              <Button size="mediam" color="primary" variant="contained" onClick={() => handleSearch()} startIcon={<SearchOutlined />}>
                ค้นหา
              </Button>
              <Button size="mediam" color="info" variant="contained" onClick={() => handleRefresh()} startIcon={<ReloadOutlined />}>
                รีเฟรช
              </Button>
            </Grid>
            <Grid item xs={12} md={4} align="right">
              <Stack justifyContent="row" flexDirection="row">
                <Typography variant="h5" sx={{ p: '0 20px' }}>
                  กำลังขึ้นสินค้า :<span style={{ padding: '0 20px', borderBottom: 'solid 2px', color: 'green' }}>{sumProcessing}</span> คัน
                </Typography>
                <Typography variant="h5">
                  รอเลือกหัวจ่าย :<span style={{ padding: '0 20px', borderBottom: 'solid 2px', color: 'red' }}>{sumWaiting}</span> คัน
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{ mt: 1.5 }}>
            <MainCard content={true} title="สถานีทั้งหมด">
              <Divider sx={{ mt: -2, mb: 1 }} />
              <AllStations permission={pageDetail[0].permission_name} />
            </MainCard>
          </Grid>

          {/* สายแรงงานทั้งหมด */}
          <AllContractor permission={pageDetail[0].permission_name} />
          <MainCard content={false} sx={{ mt: 1.5 }}>
            <Box sx={{ pt: 1, pr: 2 }}>
              <Tabs value={valueFilter} onChange={handleChange} aria-label="company-tabs" variant="scrollable" scrollButtons="auto">
                {/* {companyList.length > 0 && (
                  <Tab
                    label={
                      <Badge badgeContent={countAllQueue > 0 ? countAllQueue : '0'} color="error">
                        ทั้งหมด
                      </Badge>
                    }
                    color="primary"
                    onClick={() => handleChange(0)}
                  />
                )} */}

                {companyList.length > 0 &&
                  companyList.map((company, index) => (
                    <QueueTab
                      key={index}
                      id={company.product_company_id}
                      numQueue={items[company.product_company_id] !== 0 ? items[company.product_company_id] : '0'}
                      txtLabel={company.product_company_name_th2}
                      onSelect={() => handleChange(company.product_company_id)}
                      // {...a11yProps(company.product_company_id)}
                    />
                  ))}
              </Tabs>
            </Box>
          </MainCard>

          <MainCard content={false} sx={{ mt: 1.5 }}>
            <Box>
              <Step0Table
                startDate={selectedDateRange.startDate}
                endDate={selectedDateRange.endDate}
                onFilter={valueFilter}
                permission={pageDetail[0].permission_name}
                step0List={handleReserveData}
              />
            </Box>
          </MainCard>
        </Grid>
      )}
    </Grid>
  );
}

export default Step0;
