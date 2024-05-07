import React, { useState, useEffect } from 'react';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ButtonGroup,
  Button,
  Chip,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  FormControl,
  Input,
  InputAdornment,
  CircularProgress,
  Select,
  Grid,
  MenuItem
} from '@mui/material';

// project import
// import Dot from 'components/@extended/Dot';

// Link api queues
import * as queueReques from '_api/queueReques';
import * as stepRequest from '_api/StepRequest';
const apiUrl = process.env.REACT_APP_API_URL;

import { RightSquareOutlined, SoundOutlined } from '@ant-design/icons';
import moment from 'moment/min/moment-with-locales';

import { useDispatch, useSelector } from 'react-redux';
import { setStation } from 'store/reducers/station';

// Sound Call
import SoundCall from 'components/@extended/SoundCall';

import QueueTag from 'components/@extended/QueueTag';

export const StepTable = ({ status, title, onStatusChange, onFilter }) => {
  const [loading, setLoading] = useState(true); // สร้าง state เพื่อติดตามสถานะการโหลด

  const station_count = useSelector((state) => state.station.station_count);
  const dispatch = useDispatch();

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
      id: 'dateReserve',
      align: 'center',
      disablePadding: true,
      label: 'วันที่จอง'
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
      // width: '5%',
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
      width: '10%',
      label: 'สถานีบริการ'
    },
    {
      id: 'branName',
      align: 'left',
      disablePadding: false,
      width: '12%',
      label: 'ร้านค้า/บริษัท'
    },
    {
      id: 'driver',
      align: 'left',
      disablePadding: true,
      width: '12%',
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
      width: '5%',
      label: 'เวลาเริ่ม'
    },
    {
      id: 'status',
      align: 'center',
      disablePadding: false,
      width: '10%',
      label: 'สถานะ'
    },
    {
      id: 'soundCall',
      align: 'center',
      disablePadding: true,
      label: 'เรียกคิว'
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
            <>
              {(status === 'waiting' && headCell.id === 'soundCall') || (status !== 'waiting' && headCell.id == 'dateReserve') || (
                <TableCell
                  key={headCell.id}
                  align={headCell.align}
                  width={headCell.width}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                >
                  {headCell.label}
                </TableCell>
              )}
            </>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  useEffect(() => {
    getStation();
    fetchData();
  }, [status, onStatusChange, onFilter]);

  const fetchData = async () => {
    //ข้อมูล รอเรียกคิว step1
    if (status === 'waiting') {
      await waitingGet();
    } else if (status === 'processing') {
      await processingGet();
    }

    setLoading(false);
  };

  //ข้อมูล รอเรียกคิว step1
  const [items, setItems] = useState([]);
  const waitingGet = async () => {
    try {
      await queueReques.getStep1Waitting().then((response) => {
        if (onFilter == 0) {
          setItems(response.filter((x) => parseFloat(x.total_quantity) > 0));
        } else {
          setItems(response.filter((x) => x.product_company_id == onFilter && parseFloat(x.total_quantity) > 0) || []);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  //ข้อมูล รอเรียกคิว step1
  const processingGet = async () => {
    try {
      await queueReques.getStep1Processing().then((response) => {
        const step1 = response;
        queueReques.getStep3Processing().then((response) => {
          if (response.length > 0)
            response.map((x) => {
              step1.push(x);
            });
          setItems(step1);
          dispatch(setStation({ station_count: step1.length }));
        });
        // dispatch(setStation({ station_count: response.length }));
      });
    } catch (e) {
      console.log(e);
    }
  };

  const checkStations = (id) => {
    return new Promise((resolve, reject) => {
      queueReques
        .getStep1Processing()
        .then((response) => {
          const step1Check = response;

          queueReques.getStep3Processing().then((response) => {
            const step3Check = response;

            if (id == 2) {
              const countStep3 = step3Check.filter((x) => x.station_id == 23).length;
              const countStep1 = step1Check.filter((x) => x.station_id == id).length;

              const count = countStep3 + countStep1;
              resolve(count);
            } else {
              const countStep3 = step3Check.filter((x) => x.station_id == 30).length;
              const countStep1 = step1Check.filter((x) => x.station_id == id).length;

              const count = countStep3 + countStep1;
              resolve(count);
            }
          });
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  };

  const initialData = 0;
  const [weight, setWeight] = useState(initialData);
  const handleChange = (value) => {
    setWeight(parseFloat(value));
  };

  //เปิดการแจ้งเตือน
  const [open, setOpen] = useState(false);
  const [id_update, setUpdate] = useState(0);
  const [textnotify, setText] = useState('');
  const [fr, setFrom] = useState('');
  const [message, setMessage] = useState('');
  const [id_update_next, setUpdateNext] = useState(0);
  const station_num = 2;

  const [queues, setQueues] = useState([]);
  const handleClickOpen = (id, fr, queues_id, queuesData) => {
    if (fr === 'call') {
      setMessage('ชั่งเบา–STEP1 เรียกคิว');
      setText('เรียกคิว');
    }
    if (fr === 'close') {
      setMessage('ชั่งเบา–STEP1 ปิดคิว');
      setText('ปิดคิว');
    }
    if (fr === 'cancel') {
      setMessage('ชั่งเบา–STEP1 ยกเลิกเรียกคิว');
      setText('ยกเลิก');
    }

    //กำหนดค่าจากการ click
    setFrom(fr);

    //step id สำหรับ update
    setUpdate(id);
    // setMessage(textnotify + ' ' + queues_id);

    //get steps_id of step 2 from queue_id
    setQueues(queuesData);
    getStepId(2, queues_id);
    setOpen(true);
  };

  // ตรวจสอบค่าว่าง
  const isEmpty = (obj) => {
    return Object.entries(obj).length === 0;
  };

  // handleClose
  const handleClose = async (flag) => {
    // flag === 1 คลิกยืนยัน และ fr = คลิกมาจากปุ่มไหน
    if (flag === 1) {
      if (fr === 'call') {
        const checkstation = await checkStations(selectedStations[id_update]);
        if (checkstation > 0) {
          alert('สถานีบริการนี้กำลังใช้งานอยู่');
          return;
        }
        if (isEmpty(selectedStations)) {
          alert('กรุณาเลือกสถานีชั่งเบา!');
          return;
        }

        if (station_count < station_num) {
          setOpen(false);
          setLoading(true);
          // การใช้งาน Line Notify
          getStepToken(id_update)
            .then(({ queue_id, token }) => {
              lineNotify(queue_id, token);
            })
            .catch((error) => {
              console.error('Error:', error);
              // ทำอะไรกับข้อผิดพลาด
            });

          // handleCallQueue(queues);
          step1Update(id_update, 'processing', selectedStations[id_update]);
          updateStartTime(id_update);
          setOpen(false);
        } else {
          alert('สถานีบริการเต็ม');
        }
      }

      if (fr === 'close') {
        if (weight === 0 || weight === '') {
          alert('กรุณาใสน้ำหนักจากการชั่งเบา');
          return;
        } else {
          //alert(weight);
          try {
            setLoading(true);
            setOpen(false);
            setItems([]);
            // การใช้งาน Line Notify
            getStepToken(id_update)
              .then(({ queue_id, reserve_id, token }) => {
                lineNotify(queue_id, reserve_id, token);
              })
              .catch((error) => {
                console.error('Error:', error);
                // ทำอะไรกับข้อผิดพลาด
              });

            //เพิ่ม update น้ำหนักชั่ง
            await step2Update(id_update_next, 'waiting', 27);
            await step1Update(id_update, 'completed', queues.station_id);
            await updateEndTime(id_update);
            await updateWeight1(id_update);
            await updateStartTime(id_update_next);
            setOpen(false);
          } catch (error) {
            console.error(error);
            // จัดการข้อผิดพลาดตามที่ต้องการ
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
          }
        }
      }

      if (fr === 'cancel') {
        setLoading(true);
        setOpen(false);
        setItems([]);
        //ยกเลิก
        // การใช้งาน Line Notify
        getStepToken(id_update)
          .then(({ queue_id, token }) => {
            lineNotify(queue_id, token);
          })
          .catch((error) => {
            console.error('Error:', error);
            // ทำอะไรกับข้อผิดพลาด
          });
        await step1Update(id_update, 'waiting', 27);
        await updateStartTime(id_update);
        setOpen(false);
      }
    } else if (flag === 0) {
      setSelectedStations({});
      setOpen(false);
    }
  };

  //Update น้ำหนักชั่งเบา
  const updateWeight1 = (step_id) => {
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        weight1: weight
      });

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(apiUrl + '/updateweight1/' + step_id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result['status'] === 'ok') {
            setWeight(0);
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }
        })
        .catch((error) => console.error(error));
    });
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
      message: message + ' หมายเลขคิว: ' + token + '\n' + 'น้ำหนักชั่งเบา: ' + weight + ' ตัน' + '\n' + link
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(apiUrl + '/line-notify', requestOptions)
      .then((response) => response.text())
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

  //Update step status
  const step1Update = (id, statusupdate, stations_id) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
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

      fetch(apiUrl + '/updatestepstatus/' + id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result['status'] === 'ok') {
            resolve(); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            reject(result); // ส่งคืนเมื่อการอัปเดตไม่สำเร็จ
          }
        })
        .catch((error) => {
          console.error('error', error);
          reject(error); // ส่งคืนเมื่อเกิดข้อผิดพลาดในการเรียก API
        });
    });
  };

  //Update step step2Update
  const step2Update = (id, statusupdate, stations_id) => {
    return new Promise((resolve, reject) => {
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

      fetch(apiUrl + '/updatestepstatus/' + id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result['status'] === 'ok') {
            resolve(); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            reject(result); // ส่งคืนเมื่อการอัปเดตไม่สำเร็จ
          }
        })
        .catch((error) => {
          console.error('error', error);
          reject(error); // ส่งคืนเมื่อเกิดข้อผิดพลาดในการเรียก API
        });
    });
  };

  //get id for next step
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
          if (result['status'] === 'ok') {
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ

            // Reload
            fetchData();
            onStatusChange(status === 'waiting' ? 'processing' : 'waiting');
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
          if (result['status'] === 'ok') {
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }
        })
        .catch((error) => console.error(error));
    });
  };

  const handleCallQueue = (queues) => {
    let detialTxt = '';

    if (queues.station_description == 'รอเรียกคิว' && isEmpty(selectedStations)) {
      if (isEmpty(selectedStations)) {
        detialTxt = `เข้าสถานีชั่งเบา`;
      } else {
        const getStations = stations.filter((x) => x.station_id === selectedStations[queues.step_id]);
        const textStation = getStations[0].station_description;
        const updatedText = textStation.replace(/ชั่งเบาที่ /g, '');
        detialTxt = `เข้าสถานีชั่งเบาช่องที่${updatedText}`;
      }
    } else {
      if (isEmpty(selectedStations)) {
        const updatedText = queues.station_description.replace(/ชั่งเบาที่ /g, '');
        detialTxt = `เข้าสถานีชั่งเบาช่องที่${updatedText}`;
      } else {
        const getStations = stations.filter((x) => x.station_id === selectedStations[queues.step_id]);
        const textStation = getStations[0].station_description;
        const updatedText = textStation.replace(/ชั่งเบาที่ /g, '');
        detialTxt = `เข้าสถานีชั่งเบาช่องที่${updatedText}`;
      }
    }

    const cleanedToken = queues.token.split('').join(' ');
    const titleTxt = `ขอเชิญคิวหมายเลขที่ ${cleanedToken}`;
    // ==== แยกตัวอักษรป้ายทะเบียนรถ ====
    const titleTxtCar = queues.registration_no;
    // const cleanedString = titleTxtCar.replace(/[^\u0E00-\u0E7F\d\s]/g, '');
    const cleanedString = titleTxtCar;
    const spacedString = cleanedString.split('').join(' ').replace(/-/g, 'ขีด').replace(/\//g, 'ทับ').replace(/,/g, 'พ่วง');

    SoundCall(`${titleTxt} ทะเบียน ${spacedString} ${detialTxt}`);
  };

  const [stations, setStations] = useState([]); // ใช้ state สำหรับการเก็บสถานีที่ถูกเลือกในแต่ละแถว
  const getStation = () => {
    try {
      stepRequest.getAllStations().then((response) => {
        if (response) {
          setStations(response.filter((x) => x.station_group_id == 2));
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [selectedStations, setSelectedStations] = useState({}); // ใช้ state สำหรับการเก็บสถานีที่ถูกเลือกในแต่ละแถว
  const handleStationChange = (event, row) => {
    const { value } = event.target;
    setSelectedStations((prevState) => ({
      ...prevState,
      [row.step_id]: value // เก็บค่าสถานีที่ถูกเลือกในแต่ละแถวโดยใช้ step_id เป็น key
    }));
  };
  return (
    <>
      <Box>
        {status === 'processing' && (
          <Grid sx={{ p: 2 }}>
            <Typography variant="h4">
              {title}
              <span> ( {station_count} / 2 สถานี )</span>
            </Typography>
          </Grid>
        )}

        <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
          {fr === 'close' ? (
            <>
              <DialogTitle id="responsive-dialog-title" align="center">
                <Typography variant="h5">
                  ต้องการ {textnotify} เลขที่ {queues && queues.token} หรือไม่?
                </Typography>
              </DialogTitle>
              <DialogContent sx={{ width: 350 }}>
                <Grid container alignItems="center" justifyContent="flex-end" spacing={2}>
                  <Grid item xs={12}>
                    <InputLabel sx={{ fontSize: 16 }}>น้ำหนักชั่งเบา</InputLabel>
                    <FormControl variant="standard" sx={{ width: '100%', fontFamily: 'kanit' }}>
                      <Input
                        id="standard-adornment-weight"
                        endAdornment={<InputAdornment position="end">ตัน</InputAdornment>}
                        aria-describedby="standard-weight-helper-text"
                        inputProps={{
                          type: 'number',
                          'aria-label': 'weight'
                        }}
                        value={weight}
                        onChange={(e) => handleChange(e.target.value)}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </DialogContent>
            </>
          ) : (
            <>
              <DialogTitle id="responsive-dialog-title" align="center">
                <Typography variant="h5">
                  ต้องการ {textnotify} เลขที่ {queues && queues.token} หรือไม่?
                </Typography>
              </DialogTitle>

              {fr === 'call' && (
                <DialogContent sx={{ width: 350 }}>
                  <Grid container justifyContent="flex-end" spacing={2}>
                    <Grid item xs={12}>
                      <InputLabel>เครื่องชั่งเบา</InputLabel>
                      <FormControl sx={{ width: '100%' }} size="small">
                        <Select
                          displayEmpty
                          size="small"
                          value={selectedStations[queues.step_id] || ''}
                          onChange={(event) => handleStationChange(event, queues)}
                        >
                          <MenuItem disabled value="">
                            เลือกเครื่องชั่งเบา
                          </MenuItem>
                          {stations.map((station) => (
                            <MenuItem key={station.station_id} value={station.station_id}>
                              {station.station_description}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </DialogContent>
              )}
            </>
          )}

          <DialogActions align="center" sx={{ justifyContent: 'center!important' }}>
            <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
              ยกเลิก
            </Button>
            <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
              ยืนยัน
            </Button>
            {fr === 'call' && (
              <Button color="info" variant="contained" onClick={() => handleCallQueue(queues)} autoFocus endIcon={<SoundOutlined />}>
                เรียกคิว
              </Button>
            )}
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
            <Table size="small" aria-labelledby="tableTitle">
              <QueueTableHead status={status} />

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
                  {items.length > 0 &&
                    items.map((row, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell align="center">
                            <Typography>
                              <strong>{index + 1}</strong>
                            </Typography>
                          </TableCell>
                          {status == 'waiting' && (
                            <TableCell align="left">
                              {row.reserve_datetime &&
                                moment(row.reserve_datetime.slice(0, 10)).format('DD/MM/YY') +
                                  ' - ' +
                                  row.reserve_datetime.slice(11, 16) +
                                  'น.'}
                            </TableCell>
                          )}
                          <TableCell align="left">
                            {moment(row.queue_date.slice(0, 10)).format('DD/MM/YY')}
                            {row.queue_time ? ' - ' + row.queue_time.slice(0, 5) + 'น.' : ''}
                          </TableCell>
                          <TableCell align="left">
                            <QueueTag id={row.product_company_id} token={row.token} />
                            {moment(row.queue_date.slice(0, 10)).format('DD/MM/YYYY') < moment(new Date()).format('DD/MM/YYYY') && (
                              <span style={{ color: 'red' }}> (คิวค้าง)</span>
                            )}
                            {/* <Chip color="primary" label={row.token} /> */}
                          </TableCell>
                          <TableCell align="center">
                            <Chip color="primary" sx={{ width: '122px' }} label={row.registration_no} />
                          </TableCell>

                          {status == 'waiting' && <TableCell align="left">-</TableCell>}
                          {status == 'processing' && (
                            <TableCell align="left">
                              <Typography sx={{ width: '160px' }}>{row.station_description}</Typography>
                            </TableCell>
                          )}

                          <TableCell align="left">
                            <Typography sx={{ width: '240px' }}>
                              {row.company_name} ({row.count_car_id} คิว)
                            </Typography>
                          </TableCell>
                          <TableCell align="left">{row.driver_name}</TableCell>
                          <TableCell align="left">{row.driver_mobile}</TableCell>
                          <TableCell align="left">
                            {/* {row.start_time ? moment(row.start_time).format('LT') : '-'} */}
                            {row.start_datetime ? row.start_datetime.slice(11, 19) : row.start_time.slice(11, 19)}
                          </TableCell>
                          <TableCell align="center">
                            {status == 'waiting' && <Chip color="warning" sx={{ width: '95px' }} label={'รอคิวชั่งเบา'} />}
                            {status == 'processing' && row.station_id !== 23 && row.station_id !== 30 && (
                              <Chip color="success" sx={{ width: '95px' }} label={'กำลังชั่งเบา '} />
                            )}
                            {(row.station_id === 23 || row.station_id === 30) && (
                              <Chip color="success" sx={{ width: '95px' }} label={'กำลังชั่งหนัก '} />
                            )}
                          </TableCell>
                          {status == 'processing' && (
                            <TableCell align="center">
                              <Tooltip title="เรียกคิว">
                                <span>
                                  <Button
                                    sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                    variant="contained"
                                    size="small"
                                    align="center"
                                    color="info"
                                    onClick={() => handleCallQueue(row)}
                                  >
                                    <SoundOutlined />
                                  </Button>
                                </span>
                              </Tooltip>
                            </TableCell>
                          )}
                          <TableCell align="right" width="120" sx={{ width: 120, maxWidth: 120 }}>
                            <ButtonGroup aria-label="button group" sx={{ alignItems: 'center' }}>
                              <Tooltip title="เรียกคิว">
                                <span>
                                  {status == 'waiting' && (
                                    <Button
                                      // sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                      variant="contained"
                                      size="small"
                                      color="info"
                                      onClick={() => handleClickOpen(row.step_id, 'call', row.queue_id, row)}
                                      endIcon={<RightSquareOutlined />}
                                    >
                                      เรียกคิว
                                    </Button>
                                  )}
                                </span>
                              </Tooltip>

                              {status == 'processing' && (
                                <div>
                                  <Tooltip title="เรียกคิว">
                                    <span>
                                      <Button
                                        // sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                        disabled={row.station_id == 23 || row.station_id == 30}
                                        variant="contained"
                                        size="small"
                                        color="error"
                                        onClick={() => handleClickOpen(row.step_id, 'cancel', row.queue_id, row)}
                                      >
                                        ยกเลิก
                                      </Button>
                                    </span>
                                  </Tooltip>

                                  <Tooltip title="เรียกคิว">
                                    <span>
                                      <Button
                                        // sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                        variant="contained"
                                        size="small"
                                        color="primary"
                                        disabled={row.station_id == 23 || row.station_id == 30}
                                        onClick={() => handleClickOpen(row.step_id, 'close', row.queue_id, row)}
                                        // endIcon={<RightSquareOutlined />}
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
