import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Grid, Stack, Button, Box, TextField, Alert, Badge } from '@mui/material';
import MainCard from 'components/MainCard';
import { SearchOutlined } from '@ant-design/icons';

import moment from 'moment';

const currentDate = moment(new Date()).format('YYYY-MM-DD');

// project import
import Step0Table from './Step0Table';
import AllStations from './step0-forms/AllStations';
import { Divider } from '../../../../node_modules/@mui/material/index';

// import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import QueueTab from 'components/@extended/QueueTab';

import * as stepRequest from '_api/StepRequest';

function Step0() {
  const userRole = useSelector((state) => state.auth?.roles);
  // const navigate = useNavigate();

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
    waitingGet(companyList, selectedDate1, selectedDate2);

    setSelectedDateRange({
      startDate: selectedDate1,
      endDate: selectedDate2
    });
  };

  useEffect(() => {
    getProductCompany();
  }, []);

  const [companyList, setCompanyList] = useState([]);
  const getProductCompany = () => {
    stepRequest.getAllProductCompany().then((response) => {
      if (response) {
        waitingGet(response, selectedDate1, selectedDate2);
      }
    });
  };

  const [items, setItems] = useState([]);
  const [countAllQueue, setCountAllQueue] = useState(0);
  const waitingGet = async (company, startDate, endDate) => {
    try {
      try {
        stepRequest.getAllStep0ByDate(startDate, endDate).then((response) => {
          if (company.length > 0) {
            company.map((x) => {
              let countCompany = response.filter(
                (i) => i.token !== null && i.product_company_id == x.product_company_id && parseFloat(i.total_quantity) > 0
              ).length;

              setItems((prevState) => ({
                ...prevState,
                [x.product_company_id]: countCompany
              }));
            });
          }

          setCompanyList(company);
          setCountAllQueue(response.filter((x) => x.token !== null && parseFloat(x.total_quantity) > 0).length);
        });
      } catch (e) {
        console.log(e);
      }
      // await getQueues.getStep1Waitting().then((response) => {
      //   if (company.length > 0) {
      //     company.map((x) => {
      //       let countCompany = response.filter(
      //         (i) => i.product_company_id == x.product_company_id && parseFloat(i.total_quantity) > 0
      //       ).length;

      //       setItems((prevState) => ({
      //         ...prevState,
      //         [x.product_company_id]: countCompany
      //       }));
      //     });
      //   }

      //   setCompanyList(company);
      //   setCountAllQueue(response.filter((x) => parseFloat(x.total_quantity) > 0).length);
      // });
    } catch (e) {
      console.log(e);
    }
  };

  const [valueFilter, setValueFilter] = useState(0);
  const handleChange = (newValue) => {
    setValueFilter(newValue);
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
                // inputProps={{
                //   min: currentDate
                // }}
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

        <Grid item xs={12} sx={{ mt: 1.5 }}>
          <MainCard content={true} title="สถานีทั้งหมด">
            <Divider sx={{ mt: -2, mb: 1 }} />
            <AllStations />
          </MainCard>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
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
          </Box>
        </MainCard>

        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <Step0Table startDate={selectedDateRange.startDate} endDate={selectedDateRange.endDate} onFilter={valueFilter} />
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default Step0;
