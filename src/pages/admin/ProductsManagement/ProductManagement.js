import React, { useState, useEffect } from 'react';
import * as stepRequest from '_api/StepRequest';
import { useNavigate } from 'react-router-dom';

import { Grid, Button, Box, FormControl, Select, Stack, MenuItem, InputLabel } from '@mui/material';
import MainCard from 'components/MainCard';
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
            <Grid item xs={12} md={4}>
              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel>บริษัท (สินค้า)</InputLabel>
                  <FormControl>
                    <Select
                      displayEmpty
                      value={valueFilter || ''}
                      onChange={(e) => handleChange(e.target.value)}
                      placeholder="เลือกประเภทรถ"
                      fullWidth
                    >
                      <MenuItem disabled value="">
                        เลือกบริษัท (สินค้า)
                      </MenuItem>
                      {companyList &&
                        companyList.map((company, index) => (
                          <MenuItem key={index} value={company.product_company_id}>
                            {company.product_company_name_th}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4} align="right"></Grid>
            <Grid item xs={12} md={4} align="right">
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
