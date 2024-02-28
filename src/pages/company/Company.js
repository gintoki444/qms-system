import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  Grid,
  Stack,
  Button,
  Box,
  Alert
  // Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
import CompanyTable from './CompanyTable';
import { PlusCircleOutlined } from '@ant-design/icons';

const Company = () => {
  const userRole = useSelector((state) => state.auth?.roles);

  const navigate = useNavigate();

  const addCompany = () => {
    // window.location = '/company/add';
    navigate('/company/add');
  };

  return (
    <Grid alignItems="center" justifyContent="space-between">
      <Grid container rowSpacing={1} columnSpacing={1.75}>
        <Grid item xs={12} md={7} lg={8}>
          {!userRole && (
            <Stack sx={{ width: '100%', mb: '18px' }} spacing={2}>
              <Alert severity="warning">กรุณารอการอนุมัติการใช้งานจากผู้ดูแลระบบ</Alert>
            </Stack>
          )}
          {userRole && (
            <Grid container alignItems="center" justifyContent="flex-end">
              <Stack direction="row" alignItems="center" spacing={0}>
                <Button size="mediam" color="success" variant="outlined" onClick={() => addCompany()} startIcon={<PlusCircleOutlined />}>
                  เพิ่มข้อมูล
                </Button>
              </Stack>
            </Grid>
          )}

          <Grid item>
            <MainCard content={false} sx={{ mt: 1.5 }}>
              <Box sx={{ pt: 1, pr: 2 }}>
                <CompanyTable />
              </Box>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Company;
