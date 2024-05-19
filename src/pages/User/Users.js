import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Grid, Stack, Button, Box, Alert } from '@mui/material';
import MainCard from 'components/MainCard';
import { PlusCircleOutlined } from '@ant-design/icons';

import UsersTable from './UsersTable';

function Users() {
  const pageId = 16;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  const [pageDetail, setPageDetail] = useState([]);

  const navigate = useNavigate();

  const addDrivers = () => {
    // window.location = '/car/add';
    navigate('/admin/users/add');
  };

  useEffect(() => {
    if (Object.keys(userPermission).length > 0) {
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission]);
  return (
    <Grid rowSpacing={2} columnSpacing={2.75}>
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
        <Grid item xs={12} md={7} lg={8}>
          {pageDetail.length > 0 &&
            (pageDetail[0].permission_name === 'manage_everything' || pageDetail[0].permission_name === 'add_edit_delete_data') && (
              <Grid container alignItems="center" justifyContent="flex-end">
                <Grid item>
                  <Stack direction="row" alignItems="center" spacing={0}>
                    <Button
                      size="mediam"
                      color="success"
                      variant="outlined"
                      onClick={() => addDrivers()}
                      startIcon={<PlusCircleOutlined />}
                    >
                      เพิ่มข้อมูล
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            )}
          <MainCard content={false} sx={{ mt: 1.5 }}>
            <Box sx={{ pt: 1, pr: 2 }}>
              <UsersTable permission={pageDetail[0].permission_name} />
            </Box>
          </MainCard>
        </Grid>
      )}
    </Grid>
  );
}

export default Users;
