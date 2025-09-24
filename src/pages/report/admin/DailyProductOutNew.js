import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

import { useDownloadExcel } from 'react-export-table-to-excel';
// import ExportDailyProductout from './export/ExportDailyProductout';

import { Grid, Box, Divider, TextField, Stack, Button, Badge, Tooltip, Alert, Backdrop, CircularProgress } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MainCard from 'components/MainCard';

import moment from 'moment';

import { SearchOutlined, FileExcelOutlined } from '@ant-design/icons';

import * as stepRequest from '_api/StepRequest';

import QueueTab from 'components/@extended/QueueTab';
// import OrderTable from 'pages/dashboard/admin/OrdersTable';
import DailyProductOutTableNew from './DailyProductOutTableNew';

const DailyProductOut = () => {
  const pageId = 25;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  const [loading, setLoading] = useState(false);
  const [pageDetail, setPageDetail] = useState([]);

  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'daily-product-out',
    sheet: moment(new Date()).format('DD-MM-YYYY')
  });

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
    // waitingGet(companyList);
  };

  useEffect(() => {
    getProductCompany();
    setLoading(true);
    if (Object.keys(userPermission).length > 0) {
      setLoading(false);
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission]);

  const [companyList, setCompanyList] = useState([]);
  const getProductCompany = (dataList) => {
    if (dataList) {
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
        setCountAllQueue(dataList.length);
        // waitingGet(response);
      });
    }
  };

  const [items, setItems] = useState([]);
  const [countAllQueue, setCountAllQueue] = useState(0);
  const [itemList, setItemList] = useState([]);
  // const waitingGet = async (company) => {
  //   try {
  //     await reportRequest.getOrdersProduct(selectedDate1, selectedDate2).then((response) => {
  //       if (company.length > 0) {
  //         company.map((x) => {
  //           let countCompany = response.filter((i) => i.product_company_id == x.product_company_id).length;

  //           setItems((prevState) => ({
  //             ...prevState,
  //             [x.product_company_id]: countCompany
  //           }));
  //         });
  //       }

  //       setCountAllQueue(response.length);
  //       setItemList(response);
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const [valueFilter, setValueFilter] = useState('');
  const handleChange = (newValue) => {
    setValueFilter(newValue);
  };

  const handleQueueData = (data) => {
    setItemList(data);
    getProductCompany(data);
  };
  // const handleExport = (data, filter) => {
  //   if (filter !== '') {
  //     data = data.filter((x) => x.product_company_id === filter);
  //   }
  //   ExportDailyProductout(data);
  // };
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
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12} md={12} sx={{ mt: 2 }}>
          <Tabs value={valueFilter} onChange={handleChange} aria-label="company-tabs" variant="scrollable" scrollButtons="auto">
            <Tab
              label={
                <Badge badgeContent={countAllQueue ? countAllQueue : '0'} color="error">
                  {'ทั้งหมด'}
                </Badge>
              }
              onClick={() => handleChange('')}
              value=""
            />
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
        </Grid>
        <Grid item xs={12}>
          {Object.keys(userPermission).length > 0 &&
            (pageDetail.length === 0 || (pageDetail.length !== 0 && pageDetail[0].permission_name === 'no_access_to_view_data')) && (
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
              <MainCard
                title={'ตารางข้อมูลการจ่ายสินค้าประจำวัน'}
                content={false}
                sx={{ mt: 1.5 }}
                secondary={
                  <Tooltip title="Export Excel">
                    <Button
                      color="success"
                      disabled={itemList.length === 0}
                      variant="contained"
                      sx={{ fontSize: '18px', minWidth: '', p: '6px 10px' }}
                      onClick={onDownload}
                      // onClick={() => handleExport(itemList, valueFilter)}
                    >
                      <FileExcelOutlined />
                    </Button>
                  </Tooltip>
                }
              >
                <Divider></Divider>
                <Box sx={{ pt: 1 }}>
                  <DailyProductOutTableNew
                    startDate={selectedDateRange.startDate}
                    endDate={selectedDateRange.endDate}
                    onFilter={valueFilter}
                    clickDownload={tableRef}
                    dataList={handleQueueData}
                  />
                </Box>
              </MainCard>
            )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DailyProductOut;
