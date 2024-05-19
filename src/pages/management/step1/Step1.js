import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import * as stepRequest from '_api/StepRequest';
import * as getQueues from '_api/queueReques';

import { StepTable } from 'pages/management/step1/Step1Table';

import { Grid, Stack, Box, Typography, Badge, Alert } from '@mui/material';
import MainCard from 'components/MainCard';

// import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import QueueTab from 'components/@extended/QueueTab';

function Step1() {
  const pageId = 12;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  const [pageDetail, setPageDetail] = useState([]);

  const [commonStatus, setCommonStatus] = useState('');
  const handleStatusChange = (newStatus) => {
    // Change the common status and trigger a data reload in the other instance
    if (newStatus !== commonStatus) {
      setCommonStatus(newStatus);
    } else if (newStatus === commonStatus) {
      setCommonStatus('');
    } else {
      setCommonStatus('commonStatus');
    }
  };

  useEffect(() => {
    if (Object.keys(userPermission).length > 0) {
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
      getProductCompany();
    }
  }, [commonStatus, userRole, userPermission]);

  const [companyList, setCompanyList] = useState([]);
  const getProductCompany = () => {
    stepRequest.getAllProductCompany().then((response) => {
      if (response) {
        waitingGet(response);
      }
    });
  };

  const [items, setItems] = useState([]);
  const [countAllQueue, setCountAllQueue] = useState(0);
  const waitingGet = async (company) => {
    try {
      await getQueues.getStep1Waitting().then((response) => {
        if (company.length > 0) {
          company.map((x) => {
            let countCompany = response.filter(
              (i) => i.product_company_id == x.product_company_id && parseFloat(i.total_quantity) > 0
            ).length;

            setItems((prevState) => ({
              ...prevState,
              [x.product_company_id]: countCompany
            }));
          });
        }

        setCompanyList(company);
        setCountAllQueue(response.filter((x) => parseFloat(x.total_quantity) > 0).length);
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
            <Grid container alignItems="center" justifyContent="flex-end">
              <Grid item xs={12}>
                <MainCard content={false} sx={{ mt: 1.5 }}>
                  <Box sx={{ pt: 1, pr: 2 }}>
                    <StepTable
                      status={'processing'}
                      title={'กำลังรับบริการ'}
                      onStatusChange={handleStatusChange}
                      permission={pageDetail[0].permission_name}
                    />
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
                    <StepTable
                      status={'waiting'}
                      title={'รอเรียกคิว'}
                      onStatusChange={handleStatusChange}
                      onFilter={valueFilter}
                      permission={pageDetail[0].permission_name}
                    />
                  </Box>
                </MainCard>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
}

export default Step1;
