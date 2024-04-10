import React, { useEffect, useState, useRef } from 'react';
import { useDownloadExcel } from 'react-export-table-to-excel';

import { Grid, Box, Divider, TextField, Stack, Button, Badge, Tooltip } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MainCard from 'components/MainCard';

import moment from 'moment';

import { SearchOutlined, FileExcelOutlined } from '@ant-design/icons';

import * as stepRequest from '_api/StepRequest';
import * as reportRequest from '_api/reportRequest';

import QueueTab from 'components/@extended/QueueTab';
import OrderTable from 'pages/dashboard/admin/OrdersTable';

const DailyProductOut = () => {
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
    waitingGet(companyList);
  };

  useEffect(() => {
    getProductCompany();
  }, []);

  const [companyList, setCompanyList] = useState([]);
  const getProductCompany = () => {
    stepRequest.getAllProductCompany().then((response) => {
      setCompanyList(response);
      waitingGet(response);
    });
  };

  const [items, setItems] = useState([]);
  const [countAllQueue, setCountAllQueue] = useState(0);
  const waitingGet = async (company) => {
    try {
      await reportRequest.getOrdersProduct(selectedDate1, selectedDate2).then((response) => {
        if (company.length > 0) {
          company.map((x) => {
            let countCompany = response.filter((i) => i.product_company_id == x.product_company_id).length;

            setItems((prevState) => ({
              ...prevState,
              [x.product_company_id]: countCompany
            }));
          });
        }

        setCountAllQueue(response.length);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const [valueFilter, setValueFilter] = useState('');
  const handleChange = (newValue) => {
    setValueFilter(newValue);
  };
  return (
    <Grid alignItems="center" justifyContent="space-between">
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
          <MainCard
            title={'ตารางข้อมูลการจ่ายสินค้าประจำวัน'}
            content={false}
            sx={{ mt: 1.5 }}
            secondary={
              <Tooltip title="Export Excel">
                <Button color="success" variant="contained" sx={{ fontSize: '18px', minWidth: '', p: '6px 10px' }} onClick={onDownload}>
                  <FileExcelOutlined />
                </Button>
              </Tooltip>
            }
          >
            <Divider></Divider>
            <Box sx={{ pt: 1 }}>
              <OrderTable
                startDate={selectedDateRange.startDate}
                endDate={selectedDateRange.endDate}
                clickDownload={tableRef}
                onFilter={valueFilter}
              />
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DailyProductOut;
