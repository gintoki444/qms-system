import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Link api url
import * as stepRequest from '_api/StepRequest';
import * as adminRequest from '_api/adminRequest';

import { Grid, Button, Box, Badge, Stack, Alert } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import MainCard from 'components/MainCard';
import QueueTab from 'components/@extended/QueueTab';

import { PlusCircleOutlined } from '@ant-design/icons';

import ProductManagementTable from './ProductManagementTable';
// import ProductManage from './ProductManage';

function Product() {
  const pageId = 23;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  const [pageDetail, setPageDetail] = useState([]);

  useEffect(() => {
    if (Object.keys(userPermission).length > 0) {
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission]);

  const navigate = useNavigate();
  const addWareHouse = () => {
    // window.location = '/car/add';
    navigate('add');
  };

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
      await adminRequest.getAllProductRegister().then((response) => {
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

  useEffect(() => {
    getProductCompany();
  }, []);
  const [valueFilter, setValueFilter] = useState('');
  const handleChange = (newValue) => {
    setValueFilter(newValue);
  };
  return (
    <Grid alignItems="center" justifyContent="space-between">
      <Grid container rowSpacing={1} columnSpacing={1.75}>
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
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} md={10}>
                <Tabs value={valueFilter} onChange={handleChange} aria-label="company-tabs" variant="scrollable" scrollButtons="auto">
                  <Tab
                    label={
                      <Badge badgeContent={countAllQueue} color="error" max={999}>
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
              {pageDetail.length > 0 &&
                (pageDetail[0].permission_name === 'manage_everything' || pageDetail[0].permission_name === 'add_edit_delete_data') && (
                  <Grid item xs={12} md={2} align="right">
                    <Button
                      size="mediam"
                      color="success"
                      variant="outlined"
                      onClick={() => addWareHouse()}
                      startIcon={<PlusCircleOutlined />}
                    >
                      เพิ่มข้อมูล
                    </Button>
                  </Grid>
                )}
            </Grid>

            <Grid item>
              <MainCard content={false} sx={{ mt: 1.5 }}>
                <Box sx={{ pt: 1 }}>
                  {/* <ProductManage onFilter={valueFilter} /> */}
                  <ProductManagementTable onFilter={valueFilter} permission={pageDetail[0].permission_name} />
                </Box>
              </MainCard>
            </Grid>

            {/* } */}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default Product;
