import React, { useState, useEffect } from 'react';

import * as stepRequest from '_api/StepRequest';
import * as getQueues from '_api/queueReques';

import { Step2Table } from './Step2Table';

import { Grid, Stack, Typography, Box, Badge } from '@mui/material';
import MainCard from 'components/MainCard';

// import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import QueueTab from 'components/@extended/QueueTab';

function Step2() {
  const [commonStatus, setCommonStatus] = useState('');
  const handleStatusChange = (newStatus) => {
    // Change the common status and trigger a data reload in the other instance
    if (newStatus !== commonStatus) {
      setCommonStatus(newStatus);
    } else if (newStatus === commonStatus) {
      setCommonStatus('');
    } else {
      setCommonStatus(commonStatus);
    }
  };

  useEffect(() => {
    getProductCompany();
  }, [commonStatus]);

  const [companyList, setCompanyList] = useState([]);
  const getProductCompany = () => {
    stepRequest.getAllProductCompany().then((response) => {
      waitingGet(response);
    });
  };

  const [items, setItems] = useState({});
  const [countAllQueue, setCountAllQueue] = useState(0);
  const waitingGet = async (company) => {
    try {
      await getQueues.getStep2Waitting().then((response) => {
        if (company.length > 0) {
          company.map((x) => {
            let countCompany = response.filter(
              (i) => i.team_id !== null && i.reserve_station_id !== 1 && i.product_company_id == x.product_company_id
            ).length;
            setItems((prevState) => ({
              ...prevState,
              [x.product_company_id]: countCompany
            }));
          });
        }

        setCompanyList(company);
        setCountAllQueue(response.filter((i) => i.team_id !== null && i.reserve_station_id !== 1).length);
      });
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
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="flex-end">
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}></Stack>
          </Grid>
        </Grid>

        <Grid container alignItems="center" justifyContent="flex-end">
          <Grid item xs={12}>
            <Typography variant="h3"></Typography>
          </Grid>

          <Grid item xs={12}>
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box sx={{ pt: 1, pr: 2 }}>
                <Step2Table onStatusChange={handleStatusChange} status={'processing'} title={'กำลังรับบริการ'} />
              </Box>
            </MainCard>
          </Grid>
        </Grid>

        <Grid container alignItems="center" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box fullWidth>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Grid sx={{ p: 2 }}>
                    <Typography variant="h4">
                      <Typography variant="h4">รอเรียกคิว</Typography>
                    </Typography>
                  </Grid>
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
                <Step2Table status={'waiting'} title={'รอเรียกคิว'} onStatusChange={handleStatusChange} onFilter={valueFilter} />
              </Box>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Step2;
