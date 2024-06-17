import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import * as stepRequest from '_api/StepRequest';
import * as getQueues from '_api/queueReques';

import { Step3Table } from './Step3Table';

import { Grid, Stack, Box, Typography, Badge, Alert } from '@mui/material';
import MainCard from 'components/MainCard';

// import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import QueueTab from 'components/@extended/QueueTab';

function Step3() {
  const pageId = 14;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  const [pageDetail, setPageDetail] = useState([]);

  const [commonStatus, setCommonStatus] = useState('');
  const [companyList, setCompanyList] = useState([]);
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

    const intervalId = setInterval(() => {
      waitingGet(companyList);
    }, 5000); // Polling every 5 seconds

    return () => clearInterval(intervalId);
  }, [commonStatus, userRole, userPermission, companyList]);

  const getProductCompany = () => {
    stepRequest.getAllProductCompany().then((response) => {
      waitingGet(response);
    });
  };

  const [items, setItems] = useState({});
  const [countAllQueue, setCountAllQueue] = useState(0);
  const waitingGet = async (company) => {
    try {
      await getQueues.getStep3Waitting().then((response) => {
        if (company.length > 0) {
          company.map((x) => {
            let countCompany = response.filter((i) => i.product_company_id == x.product_company_id).length;
            setItems((prevState) => ({
              ...prevState,
              [x.product_company_id]: countCompany
            }));
          });
        }

        setCompanyList(company);
        setCountAllQueue(response.length);
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
              {/* <Grid item xs={12}>
            <Typography variant="h3">กำลังรับบริการ</Typography>
          </Grid> */}

              <Grid item xs={12}>
                <MainCard content={false} sx={{ mt: 1.5 }}>
                  <Box>
                    <Step3Table
                      onStatusChange={handleStatusChange}
                      status={'processing'}
                      title={'กำลังรับบริการ'}
                      permission={pageDetail[0].permission_name}
                    />
                  </Box>
                </MainCard>
              </Grid>
            </Grid>

            <Grid container alignItems="center" justifyContent="flex-end" sx={{ mt: 3 }}>
              {/* <Grid item xs={12}>
            <Typography variant="h3">รอคิว : ชั่งหนัก</Typography>
          </Grid> */}

              <Grid item xs={12}>
                <MainCard content={false} sx={{ mt: 1.5 }}>
                  <Box fullWidth>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Grid sx={{ p: 2 }}>
                        <Typography variant="h4">รอเรียกคิว</Typography>
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
                    <Step3Table
                      status={'waiting'}
                      title={'รอเรียกคิว'}
                      onStatusChange={handleStatusChange}
                      onFilter={valueFilter}
                      permission={pageDetail[0].permission_name}
                    />
                  </Box>
                  {/* <Box sx={{ pt: 1, pr: 2 }}>
                <Step3Table onStatusChange={handleStatusChange} status={'waiting'} title={'รอเรียกคิว'} />
              </Box> */}
                </MainCard>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
}

export default Step3;
