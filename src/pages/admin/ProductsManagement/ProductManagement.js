import React, { useState, useEffect } from 'react';
import * as stepRequest from '_api/StepRequest';
import { useNavigate } from 'react-router-dom';

import { Grid, Button, Box } from '@mui/material';
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
    });
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
                <Tab label={'ทั้งหมด'} onClick={() => handleChange(0)} />
                {companyList.length > 0 &&
                  companyList.map((company, index) => (
                    <QueueTab
                      key={index}
                      id={company.product_company_id}
                      // numQueue={items[company.product_company_id]}
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
