import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Link api url
import * as stepRequest from '_api/StepRequest';
import * as adminRequest from '_api/adminRequest';

import { Grid, Button, Box, Badge } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import MainCard from 'components/MainCard';
import QueueTab from 'components/@extended/QueueTab';

import { PlusCircleOutlined } from '@ant-design/icons';

import ProductManagementTable from './ProductManagementTable';

function Product() {
  const navigate = useNavigate();
  const addWareHouse = () => {
    // window.location = '/car/add';
    navigate('add');
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

  const [valueFilter, setValueFilter] = useState('');
  const handleChange = (newValue) => {
    setValueFilter(newValue);
  };
  return (
    <Grid alignItems="center" justifyContent="space-between">
      <Grid container rowSpacing={1} columnSpacing={1.75}>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12} md={10}>
              <Tabs value={valueFilter} onChange={handleChange} aria-label="company-tabs" variant="scrollable" scrollButtons="auto">
                <Tab
                  label={
                    <Badge badgeContent={countAllQueue} color="error">
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
            <Grid item xs={12} md={2} align="right">
              <Button size="mediam" color="success" variant="outlined" onClick={() => addWareHouse()} startIcon={<PlusCircleOutlined />}>
                เพิ่มข้อมูล
              </Button>
            </Grid>
          </Grid>

          <Grid item>
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box sx={{ pt: 1, pr: 2 }}>
                <ProductManagementTable onFilter={valueFilter} />
              </Box>
            </MainCard>
          </Grid>

          {/* } */}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Product;
