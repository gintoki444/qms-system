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
  TableRow
  //   CircularProgress
} from '@mui/material';
import TextSliders from './../TextSliders';
import IconLogo from 'assets/images/logo.png';

import moment from 'moment/min/moment-with-locales';
import MainCard from 'components/MainCard';
import ClockTime from 'components/@extended/ClockTime';
import AuthFooter from 'components/cards/AuthFooter';

import * as adminRequest from '_api/adminRequest';
import * as stepRequest from '_api/StepRequest';

function ContractorTV() {
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

  useEffect(async () => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 15000); // Polling every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    try {
      await getQueue();
      await getAllContractor();
      await getAllContractorOther();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [items, setItems] = useState([]);
  const getQueue = async () => {
    const nowDate = moment(new Date()).format('YYYY-MM-DD');
    try {
      await stepRequest.getAllStep0ByDate(nowDate, nowDate).then((response) => {
        console.log('response :', response);
        console.log('nowDate :', nowDate);
        setItems(
          response.filter(
            (x) =>
              x.token !== null &&
              parseFloat(x.total_quantity) > 0 &&
              x.contractor_id !== null &&
              x.step2_status !== 'completed' &&
              x.step2_status !== 'cancle'
          ) || []
        );
      });
    } catch (e) {
      console.log(e);
    }
  };

  // =============== Get Contractor ===============//
  const [contractorList, setContractorList] = useState([]);
  const [contractorList2, setContractorList2] = useState([]);
  const getAllContractor = async () => {
    try {
      await adminRequest.getAllContractors().then((result) => {
        result = result.filter((x) => x.status !== 'I' && x.contract_company_id !== 11);
        const sortedData = sortContracts(result);
        const chunk1 = sortedData.slice(0, 15); // ลำดับที่ 0-13
        const chunk2 = sortedData.slice(15, 30); // ลำดับที่ 14-27

        console.log('result', result);
        console.log('chunk1', chunk1);
        console.log('chunk2', chunk2);
        setContractorList(chunk1);
        setContractorList2(chunk2);
      });
    } catch (error) {
      console.log(error);
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
  const [contracOtherList, setContracOtherList] = useState([]);
  const getAllContractorOther = async () => {
    try {
      await adminRequest.getContractorOtherAll().then((result) => {
        result = result.filter((x) => x.contract_other_status !== 'completed');
        setContracOtherList(result);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const currentDate = moment().locale('th').format('LL');
  const nameDate = moment().locale('th').format('dddd');

  // ==============================|| ORDER TABLE - HEADER ||============================== //
  const headCells = [
    {
      id: 'queueNo',
      align: 'center',
      disablePadding: false,
      width: '5%',
      label: 'ลำดับ'
    },
    {
      id: 'contractName',
      align: 'center',
      disablePadding: false,
      width: '15%',
      label: 'สายแรงงาน'
    },
    {
      id: 'status',
      align: 'center',
      disablePadding: false,
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
          <Grid item xs={12} sx={{ p: '1%', mt: '1%' }}>
            <Grid container rowSpacing={3} colSpacing={2}>
              <Grid item xs={8} align="center">
                <Typography variant="h1">สายแรงงานขึ้นสินค้า</Typography>
              </Grid>
              <Grid item xs={4} align="center">
                <Typography variant="h1">Pre-Sling/Other</Typography>
              </Grid>

              <Grid item md={4} sx={{ p: 1 }}>
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
                    {/* {loading ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={status == 'processing' ? 13 : 12} align="center">
                        <CircularProgress />
                        <Typography variant="body1">Loading....</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : ( */}
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
                            <TableCell align="center" sx={{ fontSize: 20, fontWeight: 'bold' }}>
                              {index + 1}
                            </TableCell>
                            <TableCell align="center" sx={{ fontSize: 20, fontWeight: 'bold' }}>
                              {row.contractor_name}
                            </TableCell>
                            <TableCell align="center" sx={{ fontSize: 20, fontWeight: 'bold' }}>
                              {items &&
                              items.find((x) => x.contractor_id === row.contractor_id) &&
                              moment(row.contract_update?.slice(0, 10)).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY')
                                ? items.find((x) => x.contractor_id === row.contractor_id)?.station_name
                                : '-'}
                            </TableCell>
                            <TableCell align="center" sx={{ fontSize: 20, fontWeight: 'bold' }}>
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

              <Grid item md={4} sx={{ p: 1 }}>
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
                            key={index + 16}
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
                            <TableCell align="center" sx={{ fontSize: 20, fontWeight: 'bold' }}>
                              {index + 16}
                            </TableCell>
                            <TableCell align="center" sx={{ fontSize: 20, fontWeight: 'bold' }}>
                              {row.contractor_name}
                            </TableCell>
                            <TableCell align="center" sx={{ fontSize: 20, fontWeight: 'bold' }}>
                              {items &&
                              items.find((x) => x.contractor_id === row.contractor_id) &&
                              moment(row.contract_update?.slice(0, 10)).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY')
                                ? items.find((x) => x.contractor_id === row.contractor_id)?.station_name
                                : '-'}
                            </TableCell>
                            <TableCell align="center" sx={{ fontSize: 20, fontWeight: 'bold' }}>
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

              <Grid item md={4} sx={{ p: 1 }}>
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
                      {contracOtherList.map((row, index) => {
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
                            <TableCell align="center" sx={{ fontSize: 20, fontWeight: 'bold' }}>
                              {index + 1}
                            </TableCell>
                            <TableCell align="center" sx={{ fontSize: 20, fontWeight: 'bold' }}>
                              {row.contractor_name}
                            </TableCell>
                            <TableCell align="center" sx={{ fontSize: 20, fontWeight: 'bold' }}>
                              {items &&
                              items.find((x) => x.reserve_id === row.reserve_id) &&
                              moment(row.contract_update?.slice(0, 10)).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY')
                                ? items.find((x) => x.reserve_id === row.reserve_id)?.station_name
                                : '-'}
                              {/* {row.contract_other_status &&
                              moment(row.contract_other_update?.slice(0, 10)).format('DD/MM/YYYY') ===
                                moment(new Date()).format('DD/MM/YYYY')
                                ? 'กำลังขึ้นสินค้า'
                                : '-'} */}
                            </TableCell>
                            <TableCell align="center" sx={{ fontSize: 20, fontWeight: 'bold' }}>
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
          {/* <Grid xs={12} md={6} sx={{ background: '#F9D8C7', minHeight: '89vh' }}>
            <AllStations queues={stations} groupStation={1} />
          </Grid>
          <Grid xs={12} md={3} sx={{ background: '#C1E5F5', minHeight: '89vh' }}>
            <AllStations queues={stations2} groupStation={2} />
          </Grid>
          <Grid xs={12} md={3} sx={{ background: '#D9F3D0', minHeight: '89vh' }}>
            <AllStations queues={stations3} groupStation={3} />
          </Grid> */}
          <Grid
            xs={12}
            sx={{
              textAlign: 'left'
            }}
          >
            {/* <WeighQueue queues={step1Data} /> */}
            {/* <Step1Queue queues={step1Data} /> */}
          </Grid>
          <Grid
            xs={12}
            sx={{
              textAlign: 'left'
            }}
          >
            {/* <Step2Queue queues={step2Data} /> */}
            {/* <ReceiveQueue queues={step2Data} /> */}
          </Grid>
          {/* <Grid
        xs={12}
        sx={{
          textAlign: 'left'
        }}
      >
        <Step3Queue queues={step3Data} />
      </Grid> */}
        </Grid>
        <Grid sx={{ pt: 1, pb: 1, borderTop: '1px solid #fff', background: '#fff', width: '100%' }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ContractorTV;
