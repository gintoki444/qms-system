import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Grid, Stack, Button, Box, TextField, Alert, Badge, Tabs, Tab } from '@mui/material';
import MainCard from 'components/MainCard';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import QueueTab from 'components/@extended/QueueTab';

import moment from 'moment';
const currentDate = moment(new Date()).format('YYYY-MM-DD');

// project import
import ReserveTable from './ReserveTable';
import * as stepRequest from '_api/StepRequest';

function Reserve() {
  const pageId = 8;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  let startDate = localStorage.getItem('reserve_startDate');
  let endDate = localStorage.getItem('reserve_endDate');
  const [pageDetail, setPageDetail] = useState([]);

  useEffect(() => {
    if (Object.keys(userPermission).length > 0) {
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission, startDate, endDate]);


  const [companyList, setCompanyList] = useState([]);
  const [items, setItems] = useState([]);
  const [countAllQueue, setCountAllQueue] = useState(0);
  const getProductCompany = (dataList) => {
    stepRequest.getAllProductCompany().then((response) => {

      if (response.length > 0) {
        response.map((x) => {
          let countCompany = dataList.filter(
            (i) => i.product_company_id == x.product_company_id
          ).length;

          setItems((prevState) => ({
            ...prevState,
            [x.product_company_id]: countCompany
          }));
        });
      }

      setCompanyList(response);
      setCountAllQueue(dataList.length);
    });
  };

  // const waitingGet = async (company) => {
  //   try {

  //     let urlGet = '';
  //     if (pageDetail.length > 0 && pageDetail[0].permission_name !== 'no_access_to_view_data') {
  //       urlGet = '/allreservesrange?pickup_date1=' + startDate + '&pickup_date2=' + endDate;
  //     } else {
  //       urlGet = '/allreservespickup2?user_id=' + userId + '&pickup_date1=' + startDate + '&pickup_date2=' + endDate;
  //     }

  //     await reserveRequest.getAllReserveByUrl(urlGet).then((response) => {
  //       if (company.length > 0) {
  //         company.map((x) => {
  //           let countCompany = response.filter(
  //             (i) => i.product_company_id == x.product_company_id
  //           ).length;

  //           setItems((prevState) => ({
  //             ...prevState,
  //             [x.product_company_id]: countCompany
  //           }));
  //         });
  //       }

  //       setCompanyList(company);
  //       setCountAllQueue(response.length);
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

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
    navigate('/reserve/add');
  };

  const [valueFilter, setValueFilter] = useState(0);
  const handleChange = (newValue) => {
    setValueFilter(newValue);
  };

  const handleReserveData = (data) => {
    getProductCompany(data);
  }
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
            {pageDetail.length > 0 &&
              (pageDetail[0].permission_name === 'manage_everything' || pageDetail[0].permission_name === 'add_edit_delete_data') && (
                <Button size="mediam" color="success" variant="outlined" onClick={() => addReserve()} startIcon={<PlusCircleOutlined />}>
                  เพิ่มข้อมูล
                </Button>
              )}
          </Grid>
        </Grid>

        {Object.keys(userPermission).length > 0 && pageDetail.length === 0 && (
          <Grid item xs={12} sx={{ mt: 1.5 }}>
            <MainCard content={false}>
              <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="warning">คุณไม่มีสิทธิ์ใช้เข้าถึงข้อมูลนี้</Alert>
              </Stack>
            </MainCard>
          </Grid>
        )}
        {pageDetail.length !== 0 && (
          <>

            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Tabs value={valueFilter} onChange={handleChange} aria-label="company-tabs" variant="scrollable" scrollButtons="auto">
                {companyList.length > 0 && (
                  <Tab
                    label={
                      <Badge badgeContent={countAllQueue > 0 ? countAllQueue : '0'} color="error">
                        ทั้งหมด
                      </Badge>
                    }
                    color="primary"
                    onClick={() => handleChange(0)}
                  />
                )}

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
            </MainCard>

            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box>
                <ReserveTable
                  startDate={selectedDateRange.startDate}
                  endDate={selectedDateRange.endDate}
                  permission={pageDetail[0].permission_name}
                  onFilter={valueFilter}
                  reserList={handleReserveData}
                />
              </Box>
            </MainCard>
          </>
        )}
      </Grid>
    </Grid>
  );
}

export default Reserve;
