import React, { useState, useEffect } from 'react';

import * as stepRequest from '_api/StepRequest';
import * as getQueues from '_api/queueReques';

import { StepTable } from 'pages/management/step1/Step1Table';

import { Grid, Stack, Box, Typography, Badge } from '@mui/material';
import MainCard from 'components/MainCard';

// import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import QueueTab from 'components/@extended/QueueTab';
// function CustomTabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// CustomTabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired
// };

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`
//   };
// }

function Step1() {
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
    getProductCompany();
  }, [commonStatus]);

  const [companyList, setCompanyList] = useState([]);
  const getProductCompany = () => {
    stepRequest.getAllProductCompany().then((response) => {
      if (response) {
        setCompanyList(response);
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

  const [valueFilter, setValueFilter] = useState(0);
  const handleChange = (newValue) => {
    console.log('newValue :', newValue);
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
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box sx={{ pt: 1, pr: 2 }}>
                <StepTable status={'processing'} title={'กำลังรับบริการ'} onStatusChange={handleStatusChange} />
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
                    <Tab
                      label={
                        <Badge badgeContent={countAllQueue} color="error">
                          ทั้งหมด
                        </Badge>
                      }
                      color="primary"
                      onClick={() => handleChange(0)}
                    />
                    {/* {companyList.length > 0 &&
                      companyList.map((company, index) => (
                        <Tab
                          key={index}
                          label={
                            <Badge badgeContent={items[company.product_company_id]} color="error">
                              {company.product_company_name_th2}
                            </Badge>
                          }
                          {...a11yProps(company.product_company_id)}
                        />
                      ))} */}

                    {companyList.length > 0 &&
                      companyList.map((company, index) => (
                        <QueueTab
                          key={index}
                          id={company.product_company_id}
                          numQueue={items[company.product_company_id]}
                          txtLabel={company.product_company_name_th2}
                          onSelect={() => handleChange(company.product_company_id)}
                          // {...a11yProps(company.product_company_id)}
                        />
                      ))}
                  </Tabs>
                </Box>
                <StepTable status={'waiting'} title={'รอเรียกคิว'} onStatusChange={handleStatusChange} onFilter={valueFilter} />

                {/* <CustomTabPanel value={valueFilter} index={0}>
                  {'ทั้งหมด'}
                </CustomTabPanel> */}
                {/* {companyList.length > 0 &&
                  companyList.map((company, index) => (
                    <CustomTabPanel key={index} value={valueFilter} index={company.product_company_id}>
                      {company.product_company_name_th2}
                    </CustomTabPanel>
                  ))} */}
                {/* <CustomTabPanel value={value} index={1}>
                  Item Two
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                  Item Three
                </CustomTabPanel> */}
              </Box>
              {/* <Box sx={{ pt: 1, pr: 2 }}>
              </Box> */}
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Step1;
