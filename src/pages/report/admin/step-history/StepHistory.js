import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import {
  Grid,
  Box,
  TextField,
  Button,
  Stack,
  Divider,
  Alert,
  Backdrop,
  CircularProgress,
  Badge,
  Tabs,
  Tab,
  Tooltip
  // Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
// import OrderSumQtyTable from './OrderSumQtyTable';
import QueueTab from 'components/@extended/QueueTab';

import moment from 'moment';
import { SearchOutlined, FileExcelOutlined } from '@ant-design/icons';

import { useDownloadExcel } from 'react-export-table-to-excel';

import StepHistoryTable from './StepHistoryTable';
import * as stepRequest from '_api/StepRequest';
import ExportStepHistory from '../export/ExportStepHistory';
// import TestCashInOut from 'pages/admin/TestDemo/TestCashInOut';
// import ExportCarsTimeInOut from './export/ExportCarsTimeInOut';
function StepHistory() {
  const pageId = 36;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  const [loading, setLoading] = useState(false);
  const [pageDetail, setPageDetail] = useState([]);

  // ======= Export file excel =======;
  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'carstime-in-out',
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
  };

  const [companyList, setCompanyList] = useState([]);
  const [items, setItems] = useState([]);
  const [countAllQueue, setCountAllQueue] = useState(0);
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
      setCountAllQueue(dataList.length);
    });
  };
  useEffect(() => {
    setLoading(true);
    if (Object.keys(userPermission).length > 0) {
      setLoading(false);
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission]);

  const [valueFilter, setValueFilter] = useState(0);
  const handleChange = (newValue) => {
    setValueFilter(newValue);
  };

  // const [dataList, setDataList] = useState([]);
  const handleQueueData = (data) => {
    // setDataList(data);
    getProductCompany(data);
  };
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
              (pageDetail.length === 0 || (pageDetail.length !== 0 && pageDetail[0].permission_name === 'no_access_to_view_data')) && (
                <Grid item xs={12} sx={{ mt: 1.5 }}>
                  <MainCard content={false}>
                    <Stack sx={{ width: '100%' }} spacing={2}>
                      <Alert severity="warning">คุณไม่มีสิทธิ์ใช้เข้าถึงข้อมูลนี้</Alert>
                    </Stack>
                  </MainCard>
                </Grid>
              )}
            {/* {pageDetail.length !== 0 && pageDetail[0].permission_name !== 'no_access_to_view_data' && ( */}
            {pageDetail.length !== 0 &&
              (pageDetail[0].permission_name !== 'view_data' ||
                pageDetail[0].permission_name !== 'manage_everything' ||
                pageDetail[0].permission_name !== 'add_edit_delete_data') && (
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
                  <MainCard
                    title={'ตารางข้อมูลขั้นตอนการทำงาน'}
                    content={false}
                    sx={{ mt: 1.5 }}
                    secondary={
                      <>
                        <Tooltip title="Export Excel">
                          <ExportStepHistory startDate={selectedDateRange.startDate} endDate={selectedDateRange.endDate} />
                        </Tooltip>
                        {valueFilter === 999 && (
                          <Tooltip title="Export Excel">
                            <Button
                              color="success"
                              variant="contained"
                              sx={{ fontSize: '18px', minWidth: '', p: '6px 10px' }}
                              onClick={onDownload}
                            >
                              <FileExcelOutlined />
                            </Button>
                          </Tooltip>
                        )}
                      </>
                    }
                  >
                    <Divider></Divider>
                    <Box sx={{ pt: 1, pr: 2 }}>
                      <StepHistoryTable
                        startDate={selectedDateRange.startDate}
                        endDate={selectedDateRange.endDate}
                        clickDownload={tableRef}
                        onFilter={valueFilter}
                        dataList={handleQueueData}
                      />
                    </Box>
                  </MainCard>
                </>
              )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default StepHistory;
