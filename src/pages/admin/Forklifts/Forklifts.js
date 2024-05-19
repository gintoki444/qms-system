import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Grid, Stack, Button, Box, Alert } from '@mui/material';
import MainCard from 'components/MainCard';
import { PlusCircleOutlined } from '@ant-design/icons';

import ForkliftsTable from './ForkliftsTable';

function Forklifts() {
  const pageId = 19;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  const [pageDetail, setPageDetail] = useState([]);

  const navigate = useNavigate();
  const addForklift = () => {
    // window.location = '/car/add';
    navigate('add');
  };

  useEffect(() => {
    if (Object.keys(userPermission).length > 0) {
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission]);
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
          <Grid item xs={12} md={7} lg={8}>
            <Grid container alignItems="center" justifyContent="flex-end">
              <Grid item align="right">
                {pageDetail.length > 0 &&
                  (pageDetail[0].permission_name === 'manage_everything' || pageDetail[0].permission_name === 'add_edit_delete_data') && (
                    <Stack direction="row" alignItems="right" spacing={0}>
                      <Button
                        size="mediam"
                        color="success"
                        variant="outlined"
                        onClick={() => addForklift()}
                        startIcon={<PlusCircleOutlined />}
                      >
                        เพิ่มข้อมูล
                      </Button>
                    </Stack>
                  )}
              </Grid>
            </Grid>

            <Grid item>
              <MainCard content={false} sx={{ mt: 1.5 }}>
                <Box sx={{ pt: 1, pr: 2 }}>
                  <ForkliftsTable permission={pageDetail[0].permission_name} />
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

export default Forklifts;
