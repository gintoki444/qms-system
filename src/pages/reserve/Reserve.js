import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  Grid, Stack, Button, Box, TextField, Alert, Badge, Tabs, Tab, Checkbox, FormControlLabel
} from '@mui/material';
import MainCard from 'components/MainCard';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import QueueTab from 'components/@extended/QueueTab';

import moment from 'moment';
const currentDate = moment(new Date()).format('YYYY-MM-DD');

// project import
import ReserveTable from './ReserveTable';
import * as stepRequest from '_api/StepRequest';

import { filterProductCom } from 'components/Function/FilterProductCompany';

function Reserve() {
  const pageId = 8;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  // let startDate = localStorage.getItem('reserve_startDate');
  // let endDate = localStorage.getItem('reserve_endDate');
  let startDate = '';
  let endDate = '';
  const [pageDetail, setPageDetail] = useState([]);

  useEffect(() => {
    if (Object.keys(userPermission).length > 0) {
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission, startDate, endDate]);

  const [companyList, setCompanyList] = useState([]);
  const [items, setItems] = useState([]);
  const [countAllQueue, setCountAllQueue] = useState(0);
  // const getProductCompany = async (dataList) => {
  //   await stepRequest.getAllProductCompany().then((response) => {

  //     const companyList = filterProductCom(response);
  //     console.log('companyList :', companyList);
  //     if (response.length > 0) {
  //       response.map((x) => {
  //         let countCompany = dataList.filter((i) => i.product_company_id == x.product_company_id).length;

  //         setItems((prevState) => ({
  //           ...prevState,
  //           [x.product_company_id]: countCompany
  //         }));
  //       });
  //     }

  //     setCompanyList(companyList);
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
  const [dataFilter, setDataFilter] = useState(0);
  const handleChange = (newValue, proId) => {
    setValueFilter(newValue);
    setDataFilter(proId);
  };

  const handleReserveData = (data) => {
    getProductCompany(data);
  };

  const [statusFilter, setStatusFilter] = useState({
    completed: false,
    cancle: false,
    waiting: false,
    waiting_order: false
  });
  const handleCheckboxChange = (event) => {
    setStatusFilter({
      ...statusFilter,
      [event.target.name]: event.target.checked
    });
  };

  // const [checkedSuccess, setCheckedSuccess] = useState(false);
  // const handleCheckboxChange = (event) => {
  //   setCheckedSuccess(event.target.checked);
  // };
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
          <Grid item xs={12} md={1}>
            <Button size="mediam" color="primary" variant="contained" onClick={() => handleSearch()} startIcon={<SearchOutlined />}>
              ค้นหา
            </Button>
          </Grid>
          <Grid item xs={12} md={5} align="right">
            {pageDetail.length > 0 &&
              (pageDetail[0].permission_name === 'manage_everything' || pageDetail[0].permission_name === 'add_edit_delete_data') && (
                <>
                  {/* <FormControlLabel
                    control={
                      // <Checkbox
                      //   checked={checkedSuccess}
                      //   onChange={handleCheckboxChange}
                      //   color="primary"
                      //   inputProps={{ 'aria-label': 'Checkbox' }}
                      // />
                      <Checkbox
                        checked={checkedSuccess}
                        onChange={handleCheckboxChange}
                        sx={{
                          fontSize: '2rem',
                          color: '#52c41a', // สีเริ่มต้น
                          '&.Mui-checked': {
                            color: '#52c41a' // สีเมื่อถูกเลือก
                          },
                          '& .MuiSvgIcon-root': { fontSize: '2rem' }
                        }}
                      />
                    }
                    color="success"
                    label={<span style={{ fontSize: '18px', color: '#52c41a' }}>สำเร็จ</span>}
                  /> */}
                  <FormControlLabel
                    control={<Checkbox
                      checked={statusFilter.completed}
                      onChange={handleCheckboxChange}
                      name="completed"
                      sx={{
                        p: 0,
                        mt: -0.4,
                        fontSize: '2rem',
                        color: '#52c41a', // สีเริ่มต้น
                        '&.Mui-checked': {
                          color: '#52c41a' // สีเมื่อถูกเลือก
                        },
                        '& .MuiSvgIcon-root': { fontSize: '2rem' }
                      }}
                    />}
                    label={<span style={{
                      color: '#52c41a',
                      border: 'solid 1px',
                      padding: '2px 5px',
                      borderRadius: '6px',
                      marginRight: '10px'
                    }}>สำเร็จ</span>}
                  // label={(<Button color='success' variant="outlined" size='medium'>สำเร็จ</Button>)}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={statusFilter.cancle} onChange={handleCheckboxChange} name="cancle"
                      sx={{
                        p: 0,
                        mt: -0.4,
                        fontSize: '2rem',
                        color: '#8c8c8c', // สีเริ่มต้น
                        '&.Mui-checked': {
                          color: '#8c8c8c' // สีเมื่อถูกเลือก
                        },
                        '& .MuiSvgIcon-root': { fontSize: '2rem' }
                      }}
                    />}
                    label={<span style={{
                      color: '#8c8c8c',
                      border: 'solid 1px',
                      padding: '2px 5px',
                      borderRadius: '6px',
                      marginRight: '5px'
                    }}>ยกเลิกคิว</span>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={statusFilter.waiting}
                        onChange={handleCheckboxChange}
                        name="waiting"
                        sx={{
                          p: 0,
                          mt: -0.4,
                          fontSize: '2rem',
                          color: '#faad14', // สีเริ่มต้น
                          '&.Mui-checked': {
                            color: '#faad14' // สีเมื่อถูกเลือก
                          },
                          '& .MuiSvgIcon-root': { fontSize: '2rem' }
                        }}
                      />}
                    // label="รอออกคิว"
                    label={<span style={{
                      color: '#faad14',
                      border: 'solid 1px',
                      padding: '2px 5px',
                      borderRadius: '6px',
                      marginRight: '5px'
                    }}>รอออกคิว</span>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={statusFilter.waiting_order}
                        onChange={handleCheckboxChange}
                        name="waiting_order"
                        sx={{
                          p: 0,
                          mt: -0.4,
                          fontSize: '2rem',
                          color: '#ff4d4f', // สีเริ่มต้น
                          '&.Mui-checked': {
                            color: '#ff4d4f' // สีเมื่อถูกเลือก
                          },
                          '& .MuiSvgIcon-root': { fontSize: '2rem' }
                        }}
                      />}
                    label={<span style={{
                      color: '#ff4d4f',
                      border: 'solid 1px',
                      padding: '2px 5px',
                      borderRadius: '6px',
                      marginRight: '5px'
                    }}>รอคำสั่งซื้อ</span>}
                  />

                  <Button size="mediam" color="success" variant="outlined" onClick={() => addReserve()} startIcon={<PlusCircleOutlined />}>
                    เพิ่มข้อมูล
                  </Button>
                </>
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
                      // onSelect={() => handleChange(company.product_company_id)}
                      onSelect={() => handleChange(index + 1, company.product_company_id)}
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
                  onFilter={dataFilter}
                  reserList={handleReserveData}
                  checkFilter={statusFilter}
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
