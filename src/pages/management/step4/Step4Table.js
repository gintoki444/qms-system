import React, { useState, useEffect } from 'react';

import {
  useMediaQuery,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
  // ButtonGroup
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import Dot from 'components/@extended/Dot';

// Link api queues
import * as getQueues from '_api/queueReques';
const apiUrl = process.env.REACT_APP_API_URL;

// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import DoneIcon from '@mui/icons-material/Done';
import CircularProgress from '@mui/material/CircularProgress';
import { RightSquareOutlined } from '@ant-design/icons';
import moment from 'moment';

// import { useDispatch, useSelector } from 'react-redux';
// import { setStation } from 'store/reducers/station';

export const Step4Table = ({ status }) => {
  // const station_count = useSelector((state) => state.station.station_count);
  // const dispatch = useDispatch();
  // console.log(station_count);

  // ==============================|| ORDER TABLE - HEADER ||============================== //
  const headCells = [
    {
      id: 'queueNo',
      align: 'center',
      disablePadding: false,
      width: '5%',
      label: 'ลำดับคิว.'
    },
    {
      id: 'queueID',
      align: 'left',
      disablePadding: false,
      width: '5%',
      label: 'รหัสคิว.'
    },
    {
      id: 'registration_no',
      align: 'left',
      disablePadding: true,
      width: '10%',
      label: 'ทะเบียนรถ'
    },
    {
      id: 'driver',
      align: 'left',
      disablePadding: true,
      width: '10%',
      label: 'ชื่อผู้ขับ'
    },
    {
      id: 'tel',
      align: 'left',
      disablePadding: true,
      width: '10%',
      label: 'เบอร์โทรศัพท์'
    },
    {
      id: 'branName',
      align: 'left',
      disablePadding: false,
      width: '15%',
      label: 'ร้านค้า/บริษัท'
    },
    {
      id: 'times',
      align: 'left',
      disablePadding: false,
      width: '15%',
      label: 'เวลาเริ่ม'
    },
    {
      id: 'status',
      align: 'center',
      disablePadding: false,
      width: '5%',
      label: 'สถานะ'
    },
    {
      id: 'action',
      align: 'center',
      disablePadding: false,
      width: '15%',
      label: 'Actions'
    }
  ];
  function QueueTableHead() {
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              width={headCell.width}
              padding={headCell.disablePadding ? 'none' : 'normal'}
            >
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  const [items, setItems] = useState([]);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [id_update, setUpdate] = useState(0);
  // const [id_update_next, setUpdateNext] = useState(0);
  const [fr, setFrom] = useState('');
  const [textnotify, setText] = useState('');
  const [station_count, setStationCount] = useState(0);
  const [loading, setLoading] = useState(true); // สร้าง state เพื่อติดตามสถานะการโหลด
  const [team_id, setTeamId] = useState(0);
  //เพิ่ม function get จำนวนสถานีของ step 1
  const station_num = 1;

  useEffect(() => {
    fetchData();
  }, [status]);

  const fetchData = async () => {
    if (status === 'waiting') {
      waitingGet();
    } else if (status === 'processing') {
      processingGet();
    }

    await getStepCount(4, 'processing');
    setLoading(false);
  };

  const waitingGet = () => {
    try {
      getQueues.getStep4Waitting().then((response) => {
        setItems(response);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const processingGet = () => {
    try {
      getQueues.getStep4Processing().then((response) => {
        setItems(response);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const step1Update = (step_id, statusupdate, station_id) => {
    setLoading(true);

    var currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      status: statusupdate,
      station_id: station_id,
      updated_at: currentDate
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(apiUrl + '/updatestepstatus/' + step_id, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result['status'] === 'ok') {
          setItems([]);
          waitingGet();
          processingGet();
          //3=Step ชั่งหนัก
          await getStepCount(4, 'processing');
          setLoading(false);
        }
      })
      .catch((error) => console.log('error', error));
  };

  // const step2Update = (id, statusupdate, station_id) => {
  //   setLoading(true);

  //   var currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  //   var myHeaders = new Headers();
  //   myHeaders.append('Content-Type', 'application/json');

  //   var raw = JSON.stringify({
  //     status: statusupdate,
  //     station_id: station_id,
  //     updated_at: currentDate
  //   });

  //   var requestOptions = {
  //     method: 'PUT',
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: 'follow'
  //   };

  //   fetch(apiUrl + '/updatestepstatus/' + id, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       if (result['status'] === 'ok') {
  //         //alert("Upadte next step was completed")
  //         setLoading(false);
  //       }
  //     })
  //     .catch((error) => console.log('error', error));
  // };

  const getStepCount = (steps_order, steps_status) => {
    return new Promise((resolve, reject) => {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      fetch(apiUrl + '/stepcount/' + steps_order + '/' + steps_status, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.length > 0) {
            setStationCount(result[0]['step_count']);
          } else {
            setStationCount(0);
          }
          resolve(); // ส่งคืนเมื่อการเรียก API เสร็จสมบูรณ์
        })
        .catch((error) => {
          console.error('error', error);
          reject(error); // ส่งคืนเมื่อเกิดข้อผิดพลาดในการเรียก API
        });
    });
  };

  // const getStepId = (steps_order, queues_id) => {
  //   var requestOptions = {
  //     method: 'GET',
  //     redirect: 'follow'
  //   };

  //   fetch(apiUrl + '/stepbyqueueid/' + steps_order + '/' + queues_id, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       setUpdateNext(result[0]['step_id']);
  //     })
  //     .catch((error) => console.log('error', error));
  // };

  //Update ทีมขึ้นสินค้าสำหรับ Step4
  const updateLoadingTeam = (step_id) => {
    /*
  if (loadingteam === "") {
    alert("กรุณาเลือกทีมขึ้นสินค้า")
    return;
 }
  */
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      team_id: team_id
    });

    console.log(raw);

    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(apiUrl + '/updateloadigteam/' + step_id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result['status'] === 'ok') {
          console.log('updateLoadingTeam is ok');
        } else {
          console.log('not update LoadingTeam');
        }
      })
      .catch((error) => console.error(error));
  };
  const handleClickOpen = (step_id, fr, queue_id, team_id) => {
    setLoading(true);

    if (fr === 'call') {
      setText('เรียกคิว');
    } else {
      if (fr === 'close') {
        setText('ปิดคิว');
      } else {
        setText('ยกเลิก');
      }
    }
    setFrom(fr);
    setUpdate(step_id);
    setTeamId(team_id);
    //get steps_id of step 4 from queues_id for next queues
    // getStepId(4, queue_id);
    setOpen(true);
  };

  //Update start_time of step
  const updateStartTime = (step_id) => {
    //alert("updateStartTime")

    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        start_time: currentDate
      });

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(apiUrl + '/updatestarttime/' + step_id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          //console.log(result)
          if (result['status'] === 'ok') {
            console.log('updateStartTime is ok');
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            console.log('not update updateStartTime');
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }
        })
        .catch((error) => console.error(error));
    });
  };

  //Update start_time of step
  const updateEndTime = (step_id) => {
    //alert("updateEndTime")
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        start_time: currentDate
      });

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(apiUrl + '/updateendtime/' + step_id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          //console.log(result)
          if (result['status'] === 'ok') {
            console.log('updateEndTime is ok');
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            console.log('not update updateEndTime');
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }
        })
        .catch((error) => console.error(error));
    });
  };

  const handleClose = (flag) => {
    // flag = 1 = ยืนยัน
    if (flag === 1) {
      //call = เรียกคิว, close = ปิดคิว, cancel = ยกเลิกคิว
      if (fr === 'call') {
        // station_count = จำนวนคิวที่กำลังเข้ารับบรการ, station_num = จำนวนหัวจ่ายในสถานีทั้งหมด
        if (station_count < station_num) {
          //เพิ่ม function get station id 3 = station id
          step1Update(id_update, 'processing', 24);
          updateStartTime(id_update);
        } else {
          alert('สถานีบริการเต็ม');
          setLoading(false);
        }
      } else {
        if (fr === 'close') {
          //ปิดคิว: Update waiting Step2 ตามหมายเลขคิว
          //step2Update(id_update_next,"waiting", 27)
          updateLoadingTeam(id_update, team_id);
          step1Update(id_update, 'completed', 24);
          updateEndTime(id_update);
          //updateStartTime(id_update_next);
        } else {
          //ยกเลิก
          step1Update(id_update, 'waiting', 27);
          updateStartTime(id_update);
        }
      }
    } else {
      setLoading(false);
    }
    setOpen(false);
  };

  // const handleClose = (flag) => {
  //   // flag = 1 = ยืนยัน
  //   if (flag === 1) {
  //     //call = เรียกคิว, close = ปิดคิว, cancel = ยกเลิกคิว
  //     if (fr === 'call') {
  //       // station_count = จำนวนคิวที่กำลังเข้ารับบรการ, station_num = จำนวนหัวจ่ายในสถานีทั้งหมด
  //       if (station_count < station_num) {
  //         //เพิ่ม function get station id 3 = station id
  //         step1Update(id_update, 'processing', 23);
  //       } else {
  //         alert('สถานีบริการเต็ม');
  //         setLoading(false);
  //       }
  //     } else {
  //       if (fr === 'close') {
  //         //ปิดคิว: Update waiting Step2 ตามหมายเลขคิว
  //         updateLoadingTeam(id_update_next, team_id);
  //         updateLoadingTeam(id_update, team_id);
  //         step2Update(id_update_next, 'waiting', 27);
  //         step1Update(id_update, 'completed', 23);
  //       } else {
  //         //ยกเลิก
  //         step1Update(id_update, 'waiting', 27);
  //       }
  //     }
  //   } else {
  //     setLoading(false);
  //   }
  //   setOpen(false);
  // };

  return (
    <>
      <Box>
        <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
          <DialogTitle id="responsive-dialog-title" style={{ fontFamily: 'kanit' }}>
            {'แจ้งเตือน'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText style={{ fontFamily: 'kanit' }}>
              ต้องการ {textnotify} ID:{id_update} หรือไม่?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => handleClose(0)} style={{ fontFamily: 'kanit' }}>
              ยกเลิก
            </Button>
            <Button onClick={() => handleClose(1)} autoFocus style={{ fontFamily: 'kanit' }}>
              ยืนยัน
            </Button>
          </DialogActions>
        </Dialog>
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
            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                    <Typography variant="body1">Loading....</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {items.map((row, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell align="left">
                        <Stack direction="row" spacing={1} alignItems="center">
                          {status == 'waiting' && <Dot color="warning" />}
                          {status == 'processing' && <Dot color="success" />}
                          <Typography>{index + 1}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">
                        <Chip color="info" label={row.token} variant="outlined" />
                      </TableCell>
                      <TableCell align="left">{row.registration_no}</TableCell>
                      <TableCell align="left">{row.driver_name}</TableCell>
                      <TableCell align="left">{row.driver_mobile}</TableCell>
                      <TableCell align="left">{row.company_name}</TableCell>
                      <TableCell align="left">
                        {/* {row.start_time ? moment(row.start_time).format('LT') : '-'} */}
                        {row.start_time ? row.start_time.slice(11, 19) : '-'}
                      </TableCell>
                      <TableCell align="center">
                        {status == 'waiting' && <Chip color="secondary" label={row.status} />}
                        {status == 'processing' && <Chip color="warning" label={row.status} />}
                      </TableCell>

                      <TableCell align="center" sx={{ '& button': { m: 1 } }}>
                        {status == 'waiting' && (
                          <Button
                            // sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            variant="contained"
                            size="small"
                            color="info"
                            onClick={() => handleClickOpen(row.step_id, 'call', row.queue_id)}
                            endIcon={<RightSquareOutlined />}
                          >
                            เรียกคิว
                          </Button>
                        )}
                        {status == 'processing' && (
                          <div>
                            <Button
                              // startIcon={<ArrowBackIosIcon />}
                              variant="contained"
                              size="small"
                              onClick={() => handleClickOpen(row.step_id, 'cancel', row.queue_id, row.station_id)}
                              style={{ fontFamily: 'kanit' }}
                              color="error"
                            >
                              ยกเลิก
                            </Button>
                            <Button
                              // endIcon={<DoneIcon />}
                              size="small"
                              variant="contained"
                              onClick={() => handleClickOpen(row.step_id, 'close', row.queue_id, row.station_id)}
                              style={{ fontFamily: 'kanit' }}
                            >
                              ปิดคิว
                            </Button>
                            {/* <Button
                            // sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            variant="contained"
                            size="medium"
                            color="error"
                            onClick={() => handleClickOpen(row.step_id, 'cancel', row.queue_id)}
                          >
                            ยกเลิก
                          </Button>

                          <Button
                            // sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            variant="contained"
                            size="medium"
                            color="primary"
                            onClick={() => handleClickOpen(row.step_id, 'close', row.queue_id)}
                            // endIcon={<RightSquareOutlined />}
                          >
                            ปิดคิว
                          </Button> */}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {items.length == 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      ไม่พบข้อมูล
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

// const tooltipStyle = {
//   filter: 'alpha(opacity=100)',
//   opacity: '1',
//   fontSize: 'small',
//   verticalAlign: 'middle',
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   marginTop: '-100px',
//   marginLeft: '-75px',
// };

// const roundedLoadingStyle = {
//   borderRadius: '5px',
//   fontFamily: 'Arial',
//   fontSize: '10pt',
//   border: '1px solid #747474',
//   width: '153px',
//   height: '153px',
//   backgroundColor: 'white',
//   position: 'fixed',
//   zIndex: '999',
//   textAlign: 'center',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
// };
