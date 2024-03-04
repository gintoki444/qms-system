import React, { useState, useEffect } from 'react';

import {
  useMediaQuery,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Backdrop,
  Tooltip,
  ButtonGroup
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Link api queues
import * as getQueues from '_api/queueReques';
const apiUrl = process.env.REACT_APP_API_URL;

import CircularProgress from '@mui/material/CircularProgress';
import { RightSquareOutlined } from '@ant-design/icons';
import moment from 'moment/min/moment-with-locales';

export const Step2Table = ({ status, title, onStatusChange }) => {
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
      id: 'pickerDate',
      align: 'left',
      disablePadding: false,
      width: '8%',
      label: 'วันที่เข้ารับสินค้า'
    },
    {
      id: 'queueID',
      align: 'center',
      disablePadding: false,
      width: '5%',
      label: 'หมายเลขคิว'
    },
    {
      id: 'registration_no',
      align: 'center',
      disablePadding: true,
      width: '10%',
      label: 'ทะเบียนรถ'
    },
    {
      id: 'station',
      align: 'left',
      disablePadding: true,
      width: '170px',
      label: 'สถานีบริการ'
    },
    {
      id: 'branName',
      align: 'left',
      disablePadding: false,
      width: '10%',
      label: 'ร้านค้า/บริษัท'
    },
    {
      id: 'driver',
      align: 'left',
      disablePadding: true,
      width: '13%',
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
      id: 'times',
      align: 'left',
      disablePadding: false,
      width: '10%',
      label: 'เวลาเริ่ม'
    },
    {
      id: 'selectedStation',
      align: 'center',
      disablePadding: false,
      width: '5%',
      label: 'สถานะ'
    },
    {
      id: 'statusTitle',
      align: 'center',
      disablePadding: false,
      label: status === 'waiting' ? 'หัวจ่าย' : 'ทีมขึ้นสินค้า'
    },
    {
      id: 'action',
      align: 'right',
      disablePadding: false,
      width: '120px',
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
  // const [selectedStation, setSelectedStation] = useState('');
  const [selectedLoadingTeam, setSelectedLoadingTeam] = useState('');
  const [stations, setStations] = useState([]);
  const [loadingteams, setLoadingTeams] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  saveLoading;
  const [message, setMessage] = useState('');

  //เพิ่ม function get จำนวนสถานีของ step 1
  const station_num = 17;

  //const [loadingteam, setLoadingTeam] = React.useState('');
  const [staion_id, setStationId] = useState(0);

  useEffect(() => {
    fetchData();
  }, [status, onStatusChange]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Use different API functions based on the status
      if (status === 'waiting') {
        await waitingGet();
      } else if (status === 'processing') {
        await processingGet();
      }
      await getStation();
      await getLoadingTeam();
      await getStepCount(2, 'processing');
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors if needed
    }
  };

  const waitingGet = async () => {
    try {
      await getQueues.getStep2Waitting().then((response) => {
        setItems(response);
        cleckStations();
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const cleckStations = async () => {
    try {
      getQueues.getStep2Processing().then((response) => {
        setItems2(response);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const processingGet = async () => {
    try {
      getQueues.getStep2Processing().then((response) => {
        setItems(response);
        setItems2(response);
        setLoading(false);
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
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
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
        if (fr === 'call') {
          // ตัวเลขที่ต้องการค้นหา stations_id ที่เลือกไปแล้ว
          const foundItem = items2.find((item) => item.station_id === stations_id);
          console.log('foundItem ;', foundItem);
          console.log('items2 ;', items2);

          if (foundItem) {
            // พบ item ที่มี station_id ที่ต้องการ
            alert("หัวจ่าย '" + foundItem.station_description + "' ไม่ว่าง");
            setLoading(false);
            console.log('Found item:', foundItem);
            return;
          } else {
            // การใช้งาน Line Notify
            getStepToken(step_id)
              .then(({ queue_id, token }) => {
                lineNotify(queue_id, token);
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          }
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
            await getStepCount(2, 'processing');
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

  //Update start_time of step

  const handleClickOpen = (step_id, fr, queues_id, station_id) => {

    //ข้อความแจ้งเตือน
    //call = เรียกคิว, close = ปิดคิว, cancel = ยกเลิกคิว
    if (fr === 'call') {
      setText('เรียกคิว');
      setMessage('ขึ้นสินค้า–STEP2 เรียกคิว');
    } else {
      if (fr === 'close') {
        setMessage('ขึ้นสินค้า–STEP2 ปิดคิว');
        setText('ปิดคิว');
      } else {
        setMessage('ขึ้นสินค้า–STEP2 ยกเลิกเรียกคิว');
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

  const updateStartTime = (step_id) => {
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
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }

          fetchData();
          onStatusChange(status === 'waiting' ? 'processing' : 'waiting');
          setSaveLoading(false);
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

  const handleClose = async (flag) => {
    setLoading(true);
    //call = เรียกคิว, close = ปิดคิว, cancel = ยกเลิกคิว
    if (flag === 1) {
      if (fr === 'call') {
        if (station_count < station_num) {
          setOpen(false);
          if (staion_id) {
            setStationCount(station_count + 1);
            await step1Update(id_update, 'processing', staion_id);
            await updateStartTime(id_update);
          } else {
            alert('กรุณาเลือกหัวจ่าย');
            setLoading(false);
          }
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
            setOpen(false);

            // การใช้งาน Line Notify
            getStepToken(id_update)
              .then(({ queue_id, token }) => {
                lineNotify(queue_id, token);
              })
              .catch((error) => {
                console.error('Error:', error);
                // ทำอะไรกับข้อผิดพลาด
              });

            setStationCount(station_count - 1);
            await updateLoadingTeam(id_update);
            await updateLoadingTeam(id_update_next);
            await step2Update(id_update_next, 'waiting', 27);
            await updateEndTime(id_update);
            await updateStartTime(id_update_next);
            await step1Update(id_update, 'completed', staion_id);
          } catch (error) {
            console.error(error);
            // จัดการข้อผิดพลาดตามที่ต้องการ
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
          }
        } else {
          // การใช้งาน Line Notify
          getStepToken(id_update)
            .then(({ queue_id, token }) => {
              lineNotify(queue_id, token);
            })
            .catch((error) => {
              console.error('Error:', error);
              // ทำอะไรกับข้อผิดพลาด
            });

          setStationCount(station_count - 1);
          step1Update(id_update, 'waiting', 27);
          updateStartTime(id_update);

          // Trigger the parent to reload the other instance with the common status
        }
      }
    } else {
      setLoading(false);
    }
    setOpen(false);
  };

  //Update lineNotify Message
  const lineNotify = (queue_id, token) => {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;

    var link = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    link = link + '/queues/detail/' + queue_id;

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      message: message + ' หมายเลขคิว: ' + token + '\n' + link
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(apiUrl + '/line-notify', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));
  };

  // Get Step Token
  const getStepToken = (step_id) => {
    return new Promise((resolve, reject) => {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      fetch(apiUrl + '/getsteptoken/' + step_id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.length > 0) {
            const { queue_id, reserve_id, token } = result[0];
            resolve({ queue_id, reserve_id, token });
          } else {
            reject('No data found');
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
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

  const [selectedStations, setSelectedStations] = useState({}); // ใช้ state สำหรับการเก็บสถานีที่ถูกเลือกในแต่ละแถว

  const handleStationChange = (event, row) => {
    const { value } = event.target;
    setSelectedStations((prevState) => ({
      ...prevState,
      [row.step_id]: value // เก็บค่าสถานีที่ถูกเลือกในแต่ละแถวโดยใช้ step_id เป็น key
    }));

    // sendStationIdToBackend(row.step_id, value);
  };

  // const sendStationIdToBackend = (stationId) => {
  //   //console.log(stepId, stationId)
  //   setSelectedStation(stationId);
  // };

  return (
    <>
      <Box>
        {saveLoading && (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
            open={saveLoading}
          >
            <CircularProgress color="primary" />
          </Backdrop>
        )}
        <Grid sx={{ p: 2 }}>
          <Typography variant="h4">
            {title}
            {status === 'processing' && (
              <span>
                {' '}
                ( {station_count}/{station_num} สถานี )
              </span>
            )}
          </Typography>
        </Grid>

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
        <Grid>
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
            <Table aria-labelledby="tableTitle">
              <QueueTableHead />
              {loading ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={12} align="center">
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
                        <TableCell align="center">
                          <Typography>
                            <strong>{index + 1}</strong>
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{moment(row.queue_date).format('DD/MM/YYYY')}</TableCell>
                        <TableCell align="center">
                          <Chip color="primary" label={row.token} />
                        </TableCell>
                        <TableCell align="center">
                          <Chip color="primary" sx={{ width: '90px' }} label={row.registration_no} />
                        </TableCell>
                        <TableCell align="left">
                          <Typography sx={{ width: '160px' }}>{row.station_description}</Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography sx={{ width: '240px' }}>{row.company_name}</Typography>
                        </TableCell>
                        <TableCell align="left">{row.driver_name}</TableCell>
                        <TableCell align="left">{row.driver_mobile}</TableCell>
                        <TableCell align="left">
                          {/* {row.start_time ? moment(row.start_time).format('LT') : '-'} */}
                          {row.start_datetime ? row.start_datetime.slice(11, 19) : row.start_time.slice(11, 19)}
                        </TableCell>
                        <TableCell align="center">
                          {status == 'waiting' && <Chip color="warning" sx={{ width: '95px' }} label={'รอขึ้นสินค้า'} />}
                          {status == 'processing' && <Chip color="success" sx={{ width: '95px' }} label={'ขึ้นสินค้า'} />}
                        </TableCell>

                        <TableCell align="center" style={{ fontFamily: 'kanit' }}>
                          {status == 'waiting' && (
                            <FormControl sx={{ minWidth: 140 }} size="small">
                              <InputLabel id={`station-select-label-${row.step_id}`} style={{ fontFamily: 'kanit' }} size="small">
                                หัวจ่าย
                              </InputLabel>
                              <Select
                                size="small"
                                labelId={`station-select-label-${row.step_id}`}
                                label="หัวจ่าย"
                                value={selectedStations[row.step_id] || row.reserve_station_id} // ใช้สถานีที่ถูกเลือกในแต่ละแถวหรือสถานีที่ถูกจองเริ่มต้น
                                onChange={(event) => handleStationChange(event, row)}
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
                            <FormControl sx={{ minWidth: 140 }} size="small">
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

                        <TableCell align="right" width="120" sx={{ width: 120, maxWidth: 120 }}>
                          <ButtonGroup aria-label="button group" sx={{ alignItems: 'center' }}>
                            {status == 'waiting' && (
                              <Tooltip title="เรียกคิว">
                                <Button
                                  // sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                  variant="contained"
                                  size="small"
                                  color="info"
                                  onClick={() =>
                                    handleClickOpen(
                                      row.step_id,
                                      'call',
                                      row.queue_id,
                                      selectedStations[row.step_id] || row.reserve_station_id
                                    )
                                  }
                                  endIcon={<RightSquareOutlined />}
                                >
                                  เรียกคิว
                                </Button>
                              </Tooltip>
                            )}

                            {status == 'processing' && (
                              <div>
                                <Tooltip title="ยกเลิก">
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
                                </Tooltip>
                                <Tooltip title="ปิดคิว">
                                  <span>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={() => handleClickOpen(row.step_id, 'close', row.queue_id, row.station_id)}
                                      style={{ fontFamily: 'kanit' }}
                                    >
                                      ปิดคิว
                                    </Button>
                                  </span>
                                </Tooltip>
                              </div>
                            )}
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {items.length == 0 && (
                    <TableRow>
                      <TableCell colSpan={12} align="center">
                        ไม่พบข้อมูล
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Grid>
      </Box>
    </>
  );
};
