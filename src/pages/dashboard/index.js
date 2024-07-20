import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AdminDashboard from './admin/index';
// import { useNavigate } from 'react-router-dom';

// import DashboardUser from './user/index';
import Reserve from 'pages/reserve/Reserve';
import QueueSearch from 'pages/queues/QueueCheck';
import { Grid, Typography } from '@mui/material';

function DashboardDefault() {
  // const naviage = useNavigate();
  // const token = localStorage.getItem('token');

  const pageId = 3;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  // useEffect(() => {
  //   if (userRole === 19) {
  //     naviage('/queues/search');
  //   }
  // }, [userRole]);
  const [pageDetail, setPageDetail] = useState([]);
  useEffect(() => {
    // setLoading(true);
    if (Object.keys(userPermission).length > 0) {
      // setLoading(false);
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission]);
  return (
    <>

      {Object.keys(userPermission).length > 0 && pageDetail.length === 0 && (pageDetail[0]?.permission_name === 'no_access_to_view_data') && (
        <>
          <Grid>
            {userRole === 19 && (
              <>
                <Grid sx={{ mt: 2, mb: 3 }}>
                  <Typography variant="h5">ตรวจสอบข้อมูลคิว</Typography>
                </Grid>
                <QueueSearch />
              </>
            )}
            {userRole !== 19 && (
              <>
                <Grid sx={{ mt: 2, mb: 3 }}>
                  <Typography variant="h5">ข้อมูลการจองคิว</Typography>
                </Grid>
                <Reserve />
              </>
            )}
          </Grid>
        </>
      )}
      {pageDetail.length > 0 &&
        (pageDetail[0]?.permission_name === 'manage_everything' || pageDetail[0]?.permission_name === 'add_edit_delete_data' || pageDetail[0]?.permission_name === 'view_data') && (
          <AdminDashboard />
        )
      }
      {/* {token &&
        ((userRole && userRole === 9) ||
          userRole === 10 ||
          userRole === 1 ||
          userRole === 11 ||
          userRole === 12 ||
          userRole === 13 ||
          userRole === 14 ||
          userRole === 15 ||
          userRole === 16 ||
          userRole === 17 ||
          userRole === 18 ? (
          <AdminDashboard />
        ) : (
          <Grid>
            {userRole === 19 && (
              <>
                <Grid sx={{ mt: 2, mb: 3 }}>
                  <Typography variant="h5">ตรวจสอบข้อมูลคิว</Typography>
                </Grid>
                <QueueSearch />
              </>
            )}
            {userRole !== 19 && (
              <>
                <Grid sx={{ mt: 2, mb: 3 }}>
                  <Typography variant="h5">ข้อมูลการจองคิว</Typography>
                </Grid>
                <Reserve />
              </>
            )}
          </Grid>
        ))
      } */}
    </>
  );
}

export default DashboardDefault;
