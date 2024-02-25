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
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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

export const Step2Table = ({ status }) => {
  // const station_count = useSelector((state) => state.station.station_count);
  // const dispatch = useDispatch();
  // console.log(station_count);

  // ==============================|| ORDER TABLE - HEADER ||============================== //
  const headCells = [
    {
      id: 'queueNo',
      align: 'left',
      disablePadding: false,
      label: 'ลำดับคิว.'
    },
    {
      id: 'queueID',
      align: 'left',
      disablePadding: false,
      label: 'รหัสคิว.'
    },
    {
      id: 'registration_no',
      align: 'left',
      disablePadding: true,
      label: 'ทะเบียนรถ'
    },
    {
      id: 'driver',
      align: 'left',
      disablePadding: true,
      label: 'ชื่อผู้ขับ'
    },
    {
      id: 'tel',
      align: 'left',
      disablePadding: true,
      label: 'เบอร์โทรศัพท์'
    },
    {
      id: 'branName',
      align: 'left',
      disablePadding: false,
      label: 'ร้านค้า/บริษัท'
    },
    {
      id: 'status',
      align: 'center',
      disablePadding: false,
      label: 'สถานะ'
    },
    {
      id: 'station',
      align: 'center',
      disablePadding: false,
      label: status === 'waiting' ? 'หัวจ่าย' : 'ทีมขึ้นสินค้า'
    },
    {
      id: 'action',
      align: 'center',
      disablePadding: false,
      label: 'Actions'
    }
  ];

  function QueueTableHead() {
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'}>
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  const [items, setItems] = useState([]);
  const [items2, setItems2] = useState([]);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [id_update, setUpdate] = useState(0);
  const [id_update_next, setUpdateNext] = useState(0);
  const [fr, setFrom] = useState('');
  const [textnotify, setText] = useState('');
  const [station_count, setStationCount] = useState(0);
  const [loading, setLoading] = useState(true); // สร้าง state เพื่อติดตามสถานะการโหลด
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedLoadingTeam, setSelectedLoadingTeam] = useState('');
  const [stations, setStations] = useState([]);
  const [loadingteams, setLoadingTeams] = useState([]);

  //เพิ่ม function get จำนวนสถานีของ step 1
  const station_num = 17;

  //const [loadingteam, setLoadingTeam] = React.useState('');
  const [staion_id, setStationId] = React.useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (status === 'waiting') {
        waitingGet();
      } else if (status === 'processing') {
        processingGet();
      }

      await getStation();
      await getLoadingTeam();
      await getStepCount(2, 'processing');
      setLoading(false);
    };

    fetchData();
  }, [status]);

  const waitingGet = () => {
    try {
      getQueues.getStep2Waitting().then((response) => {
        setItems(response);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const processingGet = () => {
    try {
      getQueues.getStep2Processing().then((response) => {
        setItems(response);
        setItems2(response);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getStepCount = (step_order, step_status) => {
    return new Promise((resolve, reject) => {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      fetch(apiUrl + '/stepcount/' + step_order + '/' + step_status, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setStationCount(result[0]['step_count']);
          resolve(); // ส่งคืนเมื่อการเรียก API เสร็จสมบูรณ์
        })
        .catch((error) => {
          console.log('error', error);
          reject(error); // ส่งคืนเมื่อเกิดข้อผิดพลาดในการเรียก API
        });
    });
  };

  const getStepId = (steps_order, queues_id) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(apiUrl + '/stepbyqueueid/' + steps_order + '/' + queues_id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setUpdateNext(result[0]['step_id']);
      })
      .catch((error) => console.log('error', error));
  };
  //Update ทีมขึ้นสินค้าสำหรับ step2

  const updateLoadingTeam = (step_id) => {
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        team_id: selectedLoadingTeam
      });

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
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            console.log('not update LoadingTeam');
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error); // ส่งคืนเมื่อเกิดข้อผิดพลาดในการเรียก API
        });
    });
  };

  //Update สถานะคิวที่ให้บริการ

  const step1Update = (step_id, statusupdate, stations_id) => {
    return new Promise((resolve, reject) => {
      setLoading(true);

      if (stations_id === '') {
        alert('กรุณาเลือกหัวจ่าย');
        setLoading(false);
        //reject("กรุณาเลือกหัจ่าย");
        return;
      } else {
        // ตัวเลขที่ต้องการค้นหา stations_id ที่เลือกไปแล้ว
        const foundItem = items2.find((item) => item.station_id === stations_id);

        if (foundItem) {
          // พบ item ที่มี station_id ที่ต้องการ
          alert("หัวจ่าย '" + foundItem.station_description + "' ไม่ว่าง");
          setLoading(false);
          console.log('Found item:', foundItem);
          return;
        }
      }

      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        status: statusupdate,
        station_id: stations_id,
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
            // await waitingGet();
            // await processingGet();

            await getStepCount(2, 'processing');
            setLoading(false);
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch((error) => {
          console.log('error', error);
          reject(error);
        });
    });
  };

  //Update ข้อมูลรอเรียกคิวสถานีถัดไป
  const step2Update = (step_id, statusupdate, station_id) => {
    return new Promise((resolve, reject) => {
      setLoading(true);

      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

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
        .then((result) => {
          if (result['status'] === 'ok') {
            setLoading(false);
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }
        })
        .catch((error) => {
          console.error('error', error);
          reject(error); // ส่งคืนเมื่อเกิดข้อผิดพลาดในการเรียก API
        });
    });
  };

  const handleClickOpen = (step_id, fr, queues_id, station_id) => {
    setLoading(true);

    //ข้อความแจ้งเตือน
    //call = เรียกคิว, close = ปิดคิว, cancel = ยกเลิกคิว
    if (fr === 'call') {
      setText('เรียกคิว');
    } else {
      if (fr === 'close') {
        setText('ปิดคิว');
      } else {
        setText('ยกเลิก');
      }
    }

    //กดปุ่มมาจากไหน
    setFrom(fr);
    setUpdate(step_id);
    setStationId(station_id);
    //get steps_id of step 3 from queues_id for next queues
    getStepId(3, queues_id);
    setOpen(true);
  };

  const handleClose = async (flag) => {
    //call = เรียกคิว, close = ปิดคิว, cancel = ยกเลิกคิว
    if (flag === 1) {
      if (fr === 'call') {
        // station_count = จำนวนคิวที่กำลังเข้ารับบรการ, station_num = จำนวนหัวจ่ายในสถานีทั้งหมด
        if (station_count < station_num) {
          //เพิ่ม function get station id 3 = station id
          step1Update(id_update, 'processing', selectedStation);
        } else {
          alert('สถานีบริการเต็ม');
          setLoading(false);
        }
      } else {
        if (fr === 'close') {
          //ปิดคิว: Update waiting Step2 ตามหมายเลขคิว 27 = Station ว่าง

          if (selectedLoadingTeam === '') {
            alert('กรุณาเลือกทีมขึ้นสินค้า');
            setOpen(false);
            setLoading(false);
            return;
          }

          try {
            //setLoading(true);
            await updateLoadingTeam(id_update);
            await updateLoadingTeam(id_update_next);
            await step2Update(id_update_next, 'waiting', 27);
            await step1Update(id_update, 'completed', staion_id);
            //setLoading(false);
          } catch (error) {
            console.error(error);
            // จัดการข้อผิดพลาดตามที่ต้องการ
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
          }
        } else {
          //ยกเลิก 27 = Station ว่าง
          step1Update(id_update, 'waiting', 27);
        }
      }
    } else {
      setLoading(false);
    }
    setOpen(false);
  };

  const getStation = () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    return new Promise((resolve, reject) => {
      fetch(apiUrl + '/allstations', requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setStations(result.filter((x) => x.station_group_id === 3));
          //alert(stations.length)
          // setStations(result)
          resolve(); // ส่งคืนเมื่อการเรียก API เสร็จสมบูรณ์
        })
        .catch((error) => {
          console.error(error);
          reject(error); // ส่งคืนเมื่อเกิดข้อผิดพลาดในการเรียก API
        });
    });
  };

  const getLoadingTeam = () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    return new Promise((resolve, reject) => {
      fetch(apiUrl + '/allloadingteams', requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setLoadingTeams(result);
          resolve(); // ส่งคืนเมื่อการเรียก API เสร็จสมบูรณ์
        })
        .catch((error) => {
          console.error(error);
          reject(error); // ส่งคืนเมื่อเกิดข้อผิดพลาดในการเรียก API
        });
    });
  };

  const handleLoadingTeamChange = (event) => {
    setSelectedLoadingTeam(event.target.value);
  };

  const handleStationChange = (event) => {
    setSelectedStation(event.target.value);
  };

  /*
  function getColor(status) {
    // ฟังก์ชันเลือกสีตามสถานะ
    switch (status) {
      case 'waiting':
        return '#90EE90';
      case 'processing':
        return 'yellow';
      case 'completed':
        return 'red';
      default:
        return 'inherit';
    }
  }
 */

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
                      <TableCell align="left" width="10%">
                        <Chip color="info" label={row.token} variant="outlined" />
                      </TableCell>
                      <TableCell align="left" width="10%">
                        {row.registration_no}
                      </TableCell>
                      <TableCell align="left" width="15%">
                        {row.driver_name}
                      </TableCell>
                      <TableCell align="left" width="10%">
                        {row.driver_mobile}
                      </TableCell>
                      <TableCell align="left" width="20%">
                        {row.company_name}
                      </TableCell>
                      <TableCell align="center" width="10%">
                        {status == 'waiting' && <Chip color="secondary" label={row.status} />}
                        {status == 'processing' && <Chip color="warning" label={row.status} />}
                      </TableCell>

                      <TableCell align="left" style={{ fontFamily: 'kanit' }}>
                        {status == 'waiting' && (
                          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id={'select-label-' + index} style={{ fontFamily: 'kanit' }} size="small">
                              หัวจ่าย
                            </InputLabel>
                            <Select
                              size="small"
                              label="หัวจ่าย"
                              id={'select-label-' + index}
                              value={selectedStation}
                              onChange={handleStationChange}
                            >
                              {stations.map((station) => (
                                <MenuItem key={station.station_id} value={station.station_id}>
                                  {station.station_description}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}

                        {status == 'processing' && (
                          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id={'select-label-' + index} style={{ fontFamily: 'kanit' }} size="small">
                              ทีมขึ้นสินค้า
                            </InputLabel>
                            <Select
                              size="small"
                              label="ทีมขึ้นสินค้า"
                              id={'select-label-' + index}
                              value={selectedLoadingTeam}
                              onChange={handleLoadingTeamChange}
                            >
                              {loadingteams.length > 0 &&
                                loadingteams.map((loadingteam) => (
                                  <MenuItem key={loadingteam.team_id} value={loadingteam.team_id}>
                                    {loadingteam.team_name}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        )}
                      </TableCell>

                      <TableCell align="center" width="15%" sx={{ '& button': { m: 1 } }}>
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
