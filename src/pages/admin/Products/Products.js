// import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Grid, Stack, Button, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { PlusCircleOutlined } from '@ant-design/icons';

import ProductsTable from './ProductsTable';

// Link api url
// const apiUrl = process.env.REACT_APP_API_URL;

function Products() {
  const navigate = useNavigate();
  const addProduct = () => {
    // window.location = '/car/add';
    navigate('/admin/products/add');
  };

  return (
    <Grid alignItems="center" justifyContent="space-between">
      <Grid container rowSpacing={1} columnSpacing={1.75}>
        <Grid item xs={12} md={7} lg={8}>
          <Grid container alignItems="center" justifyContent="flex-end">
            <Grid item align="right">
              <Stack direction="row" alignItems="right" spacing={0}>
                <Button size="mediam" color="success" variant="outlined" onClick={() => addProduct()} startIcon={<PlusCircleOutlined />}>
                  เพิ่มข้อมูล
                </Button>
              </Stack>
            </Grid>
          </Grid>

          <Grid item>
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box sx={{ pt: 1, pr: 2 }}>
                <ProductsTable />
              </Box>
            </MainCard>
          </Grid>

          {/* } */}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Products;
