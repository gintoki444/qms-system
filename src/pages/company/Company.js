import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  Grid,
  Stack,
  // Button,
  Box,
  Alert,
  Backdrop,
  CircularProgress
} from '@mui/material';
import MainCard from 'components/MainCard';
import CompanyTable from './CompanyTable';
// import { PlusCircleOutlined } from '@ant-design/icons';

const Company = () => {
  const pageId = 5;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  const [loading, setLoading] = useState(false);
  const [pageDetail, setPageDetail] = useState([]);
  useEffect(() => {
    setLoading(true);
    if (Object.keys(userPermission).length > 0) {
      setLoading(false);
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission]);

  return (
    <Grid alignItems="center" justifyContent="space-between">
      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      <Grid container rowSpacing={1} columnSpacing={1.75}>
        <Grid item xs={12} md={12}>
          {userRole === 5 && (
            <Stack sx={{ width: '100%', mb: '18px' }} spacing={2}>
              <Alert severity="warning">กรุณารอการอนุมัติการใช้งานจากผู้ดูแลระบบ</Alert>
            </Stack>
          )}

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
            <Grid item>
              <MainCard content={false} sx={{ mt: 1.5 }}>
                <Box>
                  <CompanyTable  permission={pageDetail[0].permission_name}/>
                </Box>
              </MainCard>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Company;
