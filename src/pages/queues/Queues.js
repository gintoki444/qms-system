import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

import { Grid, Stack, Button, TextField, Box, Alert, Backdrop, CircularProgress, Badge, Tabs, Tab } from '@mui/material';
import MainCard from 'components/MainCard';
// import { PlusCircleOutlined } from '@ant-design/icons';
import QueueTab from 'components/@extended/QueueTab';

import { SearchOutlined } from '@ant-design/icons';

import moment from 'moment';
const currentDate = moment(new Date()).format('YYYY-MM-DD');
import QueueTable from './QueueTable';

import * as stepRequest from '_api/StepRequest';
import { filterProductCom } from 'components/Function/FilterProductCompany';

function Queues() {
  const pageId = 9;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  // let startDate = localStorage.getItem('queue_startDate');
  // let endDate = localStorage.getItem('queue_endDate');
  let startDate = '';
  let endDate = '';
  const [loading, setLoading] = useState(false);
  const [pageDetail, setPageDetail] = useState([]);


  if (!startDate) {
    startDate = currentDate;
  }
  if (!endDate) {
    endDate = currentDate;
  }

  const [selectedDate1, setSelectedDate1] = useState(startDate);
  const [selectedDate2, setSelectedDate2] = useState(endDate);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: currentDate,
    endDate: currentDate
  });
  const handleDateChange1 = (event) => {
    setSelectedDate1(event.target.value);
    localStorage.setItem('queue_startDate', event.target.value);
  };

  const handleDateChange2 = (event) => {
    setSelectedDate2(event.target.value);
    localStorage.setItem('queue_endDate', event.target.value);
  };

  const handleSearch = () => {
    setSelectedDateRange({
      startDate: selectedDate1,
      endDate: selectedDate2
    });
  };

  const [companyList, setCompanyList] = useState([]);
  const [items, setItems] = useState([]);
  const [countAllQueue, setCountAllQueue] = useState(0);
  // const getProductCompany = (dataList) => {
  //   stepRequest.getAllProductCompany().then((response) => {

  //     if (response.length > 0) {
  //       response.map((x) => {
  //         let countCompany = dataList.filter(
  //           (i) => i.product_company_id == x.product_company_id
  //         ).length;

  //         setItems((prevState) => ({
  //           ...prevState,
  //           [x.product_company_id]: countCompany
  //         }));
  //       });
  //     }

  //     setCompanyList(response);
  //     setCountAllQueue(dataList.length);
  //   });
  // };
  const getProductCompany = async (dataList) => {
    try {
      const response = await stepRequest.getAllProductCompany(); // รอการดึงข้อมูลจาก API
      const companyList = await filterProductCom(response); // รอการเรียงลำดับ
      // console.log('companyList :', companyList);

      if (response.length > 0) {
        response.map((x) => {
          let countCompany = dataList.filter((i) => i.product_company_id == x.product_company_id).length;

          setItems((prevState) => ({
            ...prevState,
            [x.product_company_id]: countCompany
          }));
        });
      }
      setCompanyList(companyList);
      // console.log(dataList.length)
      setCountAllQueue(dataList.length);
      return companyList;
    } catch (error) {
      console.error('Error fetching product companies:', error);
      return [];
    }
  };
  useEffect(() => {
    setLoading(true);
    if (Object.keys(userPermission).length > 0) {
      setLoading(false);
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission, startDate, endDate]);


  const [valueFilter, setValueFilter] = useState(0);
  const [dataFilter, setDataFilter] = useState(0);
  const handleChange = (newValue, proId) => {
    setValueFilter(newValue);
    setDataFilter(proId);
  };
  const handleQueueData = (data) => {
    getProductCompany(data);
  }
  return (
    <Grid rowSpacing={2} columnSpacing={2.75}>
      {/* {loading === 9999 && ( */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
        open={loading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
      {/* )} */}
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
                      onSelect={() => handleChange(index + 1, company.product_company_id)}
                    // {...a11yProps(company.product_company_id)}
                    />
                  ))}
              </Tabs>
            </MainCard>
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box>
                <QueueTable
                  startDate={selectedDateRange.startDate}
                  endDate={selectedDateRange.endDate}
                  permission={pageDetail[0].permission_name}
                  onFilter={dataFilter}
                  queusList={handleQueueData}
                />
              </Box>
            </MainCard>
          </>
        )}
      </Grid>
    </Grid>
  );
}

export default Queues;
