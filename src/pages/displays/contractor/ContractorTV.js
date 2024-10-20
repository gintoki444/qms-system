import React, { useRef, useEffect, useState } from 'react';

import {
  Grid,
  Stack,
  Typography,
  Divider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert

  //   CircularProgress
} from '@mui/material';
import TextSliders from './../TextSliders';
import IconLogo from 'assets/images/logo.png';

import moment from 'moment/min/moment-with-locales';
import MainCard from 'components/MainCard';
import ClockTime from 'components/@extended/ClockTime';
import AuthFooter from 'components/cards/AuthFooter';

// import * as adminRequest from '_api/adminRequest';
import * as permissionsRequest from '_api/permissionsRequest';
import * as authUser from '_api/loginRequest';
import * as displayRequest from '_api/displayRequest';
const token = localStorage.getItem('token');
// import * as stepRequest from '_api/StepRequest';

function ContractorTV() {
  const pageId = 35;
  // const userRole = useSelector((state) => state.auth?.roles);
  // const userPermission = useSelector((state) => state.auth?.user_permissions);
  const [pageDetail, setPageDetail] = useState([]);
  const [userPermission, setUserPermission] = useState([]);
  const [userRole, setUserRole] = useState([]);

  useEffect(() => {
    getProfile();
  }, []);
  const getProfile = () => {
    authUser.authUser(token).then((result) => {
      if (result.status === 'ok') {
        getPagePermission(result.decoded.role_id);
        setUserRole(result.decoded.role_id);
      }
    });
  };

  const getPagePermission = (userRole) => {
    try {
      permissionsRequest.getPagesPermissionByRole(userRole).then((response) => {
        if (response.length > 0) {
          response = response.filter((x) => x.permission_name !== 'no_access_to_view_data');
          setUserPermission(response);
          setPageDetail(response.filter((x) => x.page_id === pageId));
          // dispatch(setPermission({ key: 'permission', value: response }));
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // console.log(userRole);
    // console.log(userPermission);
    // if (Object.keys(userPermission).length > 0) {
    //   console.log(userPermission.permission.filter((x) => x.page_id === pageId));
    //   setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    // }
  }, [userRole, userPermission]);

  const fullscreenRef = useRef(null);
  const [statusDisplay, setStatusDisplay] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      setStatusDisplay(true);
      fullscreenRef.current.requestFullscreen().catch((err) => {
        console.error('Failed to enable fullscreen:', err);
      });
    } else {
      setStatusDisplay(false);
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    async function fetchDataWrapper() {
      await fetchData();
    }

    fetchDataWrapper();

    const intervalId = setInterval(() => {
      fetchDataWrapper();
    }, 360000); // Polling every 5 minutes

    return () => clearInterval(intervalId);
  }, []); // คุณสามารถเพิ่ม dependencies ได้ตามต้องการถ้ามีค่าที่ใช้ภายใน

  const fetchData = async () => {
    try {
      console.log('Fetching contractors:');
      await getAllContractor();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // =============== Get Contractor ===============//
  const [contractorList, setContractorList] = useState([]);
  const [contractorList2, setContractorList2] = useState([]);
  const [contracOtherList, setContracOtherList] = useState([]);

  const getAllContractor = async () => {
    const nowDate = moment(new Date()).format('YYYY-MM-DD');
    try {
      const result = await displayRequest.getContractorTV(nowDate, nowDate);

      const filterContractors = result.contractors.filter((x) => x.status !== 'I' && x.contract_company_id !== 11);

      const sortedData = sortContracts(filterContractors);
      const chunk1 = sortedData.slice(0, 14); // ลำดับที่ 0-13
      const chunk2 = sortedData.slice(14, 18); // ลำดับที่ 14-27

      const filterContractorsOther =
        result.contractors_other.length > 0 && result.contractors_other.filter((x) => x.contract_other_status !== 'completed');

      setContractorList(chunk1);
      setContractorList2(chunk2);
      setContracOtherList(filterContractorsOther);
    } catch (error) {
      console.error('Error in getAllContractor:', error);
    }
  };

  function sortContracts(data) {
    // const today = new Date().toISOString().split('T')[0]; // วันที่ปัจจุบันในรูปแบบ YYYY-MM-DD

    return data.sort((a, b) => {
      // เงื่อนไข 1: contract_status เป็น "working" จะอยู่ด้านบน
      if (a.contract_status === 'working' && b.contract_status !== 'working') {
        return -1;
      } else if (a.contract_status !== 'working' && b.contract_status === 'working') {
        return 1;
      }

      // เงื่อนไข 2: ถ้า contract_status เป็น "working" ทั้งคู่ ให้เรียงตามวันที่และเวลาของ contract_update จากน้อยไปมาก
      if (a.contract_status === 'working' && b.contract_status === 'working') {
        return new Date(a.contract_update) - new Date(b.contract_update);
      }

      // เงื่อนไข 3: ถ้า contract_status เป็น "waiting" ให้เรียงตามวันที่และเวลาของ contract_update จากน้อยไปมาก
      if (a.contract_status === 'waiting' && b.contract_status === 'waiting') {
        return new Date(a.contract_update) - new Date(b.contract_update);
      }

      // เงื่อนไขสุดท้าย: เรียงตาม contractor_id ถ้าไม่เข้าเงื่อนไขอื่นๆ
      return a.contractor_id - b.contractor_id;
    });
  }

  // =============== Get Contractor other===============//
  // const getAllContractorOther = async () => {
  //   try {
  //     await adminRequest.getContractorOtherAll().then((result) => {
  //       result = result.filter((x) => x.contract_other_status !== 'completed');
  //       setContracOtherList(result);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const currentDate = moment().locale('th').format('LL');
  const nameDate = moment().locale('th').format('dddd');

  // ==============================|| ORDER TABLE - HEADER ||============================== //
  const headCells = [
    {
      id: 'queueNo',
      align: 'center',
      disablePadding: false,
      width: '10%',
      label: 'ลำดับ'
    },
    {
      id: 'contractName',
      align: 'center',
      disablePadding: false,
      width: '25%',
      label: 'สายแรงงาน'
    },
    {
      id: 'status',
      align: 'center',
      disablePadding: false,
      width: '20%',
      label: 'หัวจ่าย'
    },
    {
      id: 'timeWorking',
      align: 'center',
      disablePadding: false,
      width: '25%',
      label: 'เวลา'
    }
  ];
  function QueueTableHead() {
    return (
      <TableHead sx={{ background: '#0095FA' }}>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              width={headCell.width}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sx={{ fontSize: '1.2vw', color: '#fff' }}
            >
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  return (
    <Grid sx={{ background: '#bdbdbd' }}>
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
        <Grid
          alignItems="center"
          justifyContent="space-between"
          ref={fullscreenRef}
          sx={{
            background: '#bdbdbd',
            height: statusDisplay == false ? 'auto' : '100vh',
            minHeight: '100vh',
            flexDirection: 'column',
            display: 'flex'
          }}
        >
          <Grid container rowSpacing={3} onClick={toggleFullScreen}>
            <Grid item xs={12} sx={{ background: '#fff', pl: '2%', pr: '2%' }}>
              <Grid container alignItems="center">
                <Grid item xs={1}>
                  <Stack sx={{ pb: 2, pt: 2, justifyContent: 'center', alignItems: 'left', width: '100%' }}>
                    <img src={IconLogo} width={'50%'} alt="logo" />
                    {/* <img src={IconLogo} width={'30%'} alt="logo" /> */}
                    {/* <Typography variant="h5">บริษัท ไอ ซี พี เฟอทิไลเซอร์ จำกัด</Typography> */}
                  </Stack>
                </Grid>
                <Grid item xs={4} sx={{ position: 'relative' }}>
                  <Divider
                    absolute
                    orientation="vertical"
                    textAlign="center"
                    sx={{
                      left: '-8%',
                      width: 0
                    }}
                  />
                  <Stack justifyContent="row" flexDirection="row">
                    <Typography variant="h3">วัน{nameDate + ' ที่ ' + currentDate}</Typography>
                    <ClockTime />
                  </Stack>
                </Grid>
                <Grid item xs={7} sx={{ position: 'relative' }}>
                  <Divider
                    absolute
                    orientation="vertical"
                    textAlign="center"
                    sx={{
                      left: '-2%',
                      width: 0
                    }}
                  />
                  <Box sx={{ minHeight: '5vh' }}>
                    <MainCard contentSX={{ p: '1%!important' }} sx={{ background: '#f4f4f4' }}>
                      <TextSliders />
                      {/* <InfiniteLooper speed="4" direction="right">
                  <div className="contentBlock contentBlock--one">Place the stuff you want to loop</div>
                  <div className="contentBlock contentBlock--one">right here</div>
                </InfiniteLooper> */}
                    </MainCard>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* 9999 */}
            <Grid item xs={12} sx={{ p: '1%', pt: 20, mt: '0%' }}>
              <Grid container rowSpacing={1} colSpacing={2}>
                <Grid item md={6} sx={{ p: 1 }}>
                  <Grid item xs={12} sx={{ p: 1 }}>
                    <Typography variant="h2" sx={{ fontSize: { xs: 24, md: '1.8vw!important' }, fontWeight: 'bold' }}>
                      สายแรงงานขึ้นสินค้า
                    </Typography>
                  </Grid>
                  <TableContainer
                    sx={{
                      width: '100%',
                      overflowX: 'auto',
                      position: 'relative',
                      display: 'block',
                      maxWidth: '100%',
                      '& td, & th': { whiteSpace: 'nowrap' }
                    }}
                  >
                    <Table
                      aria-labelledby="tableTitle"
                      sx={{
                        '& .MuiTableCell-root:first-of-type': {
                          pl: 2
                        },
                        '& .MuiTableCell-root:last-of-type': {
                          pr: 3
                        }
                      }}
                    >
                      <QueueTableHead />
                      <TableBody>
                        {contractorList.map((row, index) => {
                          return (
                            <TableRow
                              key={index}
                              sx={{
                                background:
                                  row.contract_status === 'working'
                                    ? '#FFCC33'
                                    : moment(row.contract_update?.slice(0, 10)).format('DD/MM/YYYY') ===
                                        moment(new Date()).format('DD/MM/YYYY') && row.contract_status === 'waiting'
                                    ? '#D9D9D9'
                                    : '#33C072',
                                border: 'solid 3px #fff'
                              }}
                            >
                              <TableCell align="center" sx={{ fontSize: { xs: 20, md: '1.3vw!important' }, fontWeight: 'bold' }}>
                                {index + 1}
                              </TableCell>
                              <TableCell align="center" sx={{ fontSize: { xs: 20, md: '1.3vw!important' }, fontWeight: 'bold' }}>
                                {row.contractor_name}
                              </TableCell>
                              <TableCell align="center" sx={{ fontSize: { xs: 20, md: '1.3vw!important' }, fontWeight: 'bold' }}>
                                {row.reserves.length > 0 &&
                                row.reserves.find((x) => x.contractor_id === row.contractor_id) &&
                                moment(row.contract_update?.slice(0, 10)).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY')
                                  ? row.reserves.find((x) => x.contractor_id === row.contractor_id)?.station_name
                                  : '-'}
                                {/* {items &&
                              items.find((x) => x.contractor_id === row.contractor_id) &&
                              moment(row.contract_update?.slice(0, 10)).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY')
                                ? items.find((x) => x.contractor_id === row.contractor_id)?.station_name
                                : '-'} */}
                              </TableCell>
                              <TableCell align="center" sx={{ fontSize: { xs: 20, md: '1.3vw!important' }, fontWeight: 'bold' }}>
                                {row.contract_update &&
                                moment(row.contract_update?.slice(0, 10)).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY')
                                  ? row.contract_update.slice(11, 19) + ' น.'
                                  : '-'}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item md={6} sx={{ p: 1 }}>
                  {contractorList2.length > 0 && (
                    <>
                      <Grid item xs={12} sx={{ p: 1 }}>
                        <Typography variant="h2" sx={{ fontSize: { xs: 24, md: '1.8vw!important' }, fontWeight: 'bold' }}>
                          สายแรงงานขึ้นสินค้า
                        </Typography>
                      </Grid>
                      <TableContainer
                        sx={{
                          width: '100%',
                          overflowX: 'auto',
                          position: 'relative',
                          display: 'block',
                          maxWidth: '100%',
                          '& td, & th': { whiteSpace: 'nowrap' }
                        }}
                      >
                        <Table
                          aria-labelledby="tableTitle"
                          sx={{
                            '& .MuiTableCell-root:first-of-type': {
                              pl: 2
                            },
                            '& .MuiTableCell-root:last-of-type': {
                              pr: 3
                            }
                          }}
                        >
                          <QueueTableHead />
                          <TableBody>
                            {contractorList2.map((row, index) => {
                              return (
                                <TableRow
                                  key={index + 15}
                                  sx={{
                                    background:
                                      row.contract_status === 'working'
                                        ? '#FFCC33'
                                        : moment(row.contract_update?.slice(0, 10)).format('DD/MM/YYYY') ===
                                            moment(new Date()).format('DD/MM/YYYY') && row.contract_status === 'waiting'
                                        ? '#D9D9D9'
                                        : '#33C072',
                                    border: 'solid 3px #fff'
                                  }}
                                >
                                  <TableCell align="center" sx={{ fontSize: { xs: 20, md: '1.3vw!important' }, fontWeight: 'bold' }}>
                                    {index + 15}
                                  </TableCell>
                                  <TableCell align="center" sx={{ fontSize: { xs: 20, md: '1.3vw!important' }, fontWeight: 'bold' }}>
                                    {row.contractor_name}
                                  </TableCell>
                                  <TableCell align="center" sx={{ fontSize: { xs: 20, md: '1.3vw!important' }, fontWeight: 'bold' }}>
                                    {row.reserves.length > 0 &&
                                    row.reserves.find((x) => x.contractor_id === row.contractor_id) &&
                                    moment(row.contract_update?.slice(0, 10)).format('DD/MM/YYYY') ===
                                      moment(new Date()).format('DD/MM/YYYY')
                                      ? row.reserves.find((x) => x.contractor_id === row.contractor_id)?.station_name
                                      : '-'}
                                  </TableCell>
                                  <TableCell align="center" sx={{ fontSize: { xs: 20, md: '1.3vw!important' }, fontWeight: 'bold' }}>
                                    {row.contract_update &&
                                    moment(row.contract_update?.slice(0, 10)).format('DD/MM/YYYY') ===
                                      moment(new Date()).format('DD/MM/YYYY')
                                      ? row.contract_update.slice(11, 19) + ' น.'
                                      : '-'}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  )}
                  <Grid item xs={12}>
                    <Grid item xs={12} sx={{ p: 1 }}>
                      <Typography variant="h2" sx={{ fontSize: { xs: 24, md: '1.8vw!important' }, fontWeight: 'bold' }}>
                        Pre-Sling/Other
                      </Typography>
                    </Grid>
                    <TableContainer
                      sx={{
                        width: '100%',
                        overflowX: 'auto',
                        position: 'relative',
                        display: 'block',
                        maxWidth: '100%',
                        '& td, & th': { whiteSpace: 'nowrap' }
                      }}
                    >
                      <Table
                        aria-labelledby="tableTitle"
                        sx={{
                          '& .MuiTableCell-root:first-of-type': {
                            pl: 2
                          },
                          '& .MuiTableCell-root:last-of-type': {
                            pr: 3
                          }
                        }}
                      >
                        <QueueTableHead />
                        <TableBody>
                          {contracOtherList.length > 0 &&
                            contracOtherList.map((row, index) => {
                              return (
                                <TableRow
                                  key={index + 1}
                                  sx={{
                                    background:
                                      row.contract_other_status === 'working'
                                        ? '#FFCC33'
                                        : moment(row.contract_other_update?.slice(0, 10)).format('DD/MM/YYYY') ===
                                            moment(new Date()).format('DD/MM/YYYY') && row.contract_other_status === 'waiting'
                                        ? '#D9D9D9'
                                        : '#33C072',
                                    border: 'solid 3px #fff'
                                  }}
                                >
                                  <TableCell align="center" sx={{ fontSize: { xs: 20, md: '1.3vw!important' }, fontWeight: 'bold' }}>
                                    {index + 1}
                                  </TableCell>
                                  <TableCell align="center" sx={{ fontSize: { xs: 20, md: '1.3vw!important' }, fontWeight: 'bold' }}>
                                    {row.contractor_name}
                                  </TableCell>
                                  <TableCell align="center" sx={{ fontSize: { xs: 20, md: '1.3vw!important' }, fontWeight: 'bold' }}>
                                    {row.reserves &&
                                    row.reserves.find((x) => x.contractor_id === row.contractor_id) &&
                                    moment(row.contract_update?.slice(0, 10)).format('DD/MM/YYYY') ===
                                      moment(new Date()).format('DD/MM/YYYY')
                                      ? row.reserves.find((x) => x.contractor_id === row.contractor_id)?.station_name
                                      : '-'}
                                  </TableCell>
                                  <TableCell align="center" sx={{ fontSize: { xs: 20, md: '1.3vw!important' }, fontWeight: 'bold' }}>
                                    {row.contract_other_update &&
                                    moment(row.contract_other_update?.slice(0, 10)).format('DD/MM/YYYY') ===
                                      moment(new Date()).format('DD/MM/YYYY')
                                      ? row.contract_other_update.slice(11, 19) + ' น.'
                                      : '-'}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              xs={12}
              sx={{
                textAlign: 'left'
              }}
            ></Grid>
            <Grid
              xs={12}
              sx={{
                textAlign: 'left'
              }}
            ></Grid>
          </Grid>
          <Grid sx={{ pt: 1, pb: 1, borderTop: '1px solid #fff', background: '#fff', width: '100%' }}>
            <AuthFooter />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ContractorTV;
