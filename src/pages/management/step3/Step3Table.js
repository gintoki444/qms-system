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
  ButtonGroup,
  InputAdornment,
  FormHelperText,
  FormControl,
  Input
  // CircularProgress
  // ButtonGroup
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
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

export const Step3Table = ({ status, title, onStatusChange }) => {
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
      width: '10%',
      label: 'สถานีบริการ'
    },
    {
      id: 'branName',
      align: 'left',
      disablePadding: false,
      width: '15%',
      label: 'ร้านค้า/บริษัท'
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
      id: 'teamLoading',
      align: 'left',
      disablePadding: false,
      width: '10%',
      label: 'ทีมขึ้นสินค้า'
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
      id: 'weightStap1',
      align: 'center',
      disablePadding: true,
      width: '10%',
      label: 'น้ำหนักชั่งหนัก'
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
      <TableHead key={status+"01"}>
        <TableRow>
          {headCells.map((headCell) => (
            <>
              {(status === 'waiting' && headCell.id === 'weightStap1') || (
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

  const [items, setItems] = useState([]);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [id_update, setUpdate] = useState(0);
  const [id_update_next, setUpdateNext] = useState(0);
  const [fr, setFrom] = useState('');
  const [textnotify, setText] = useState('');
  const [station_count, setStationCount] = useState(0);
  const [loading, setLoading] = useState(true); // สร้าง state เพื่อติดตามสถานะการโหลด
  const [team_id, setTeamId] = useState(0);
  const [message, setMessage] = useState('');
  //เพิ่ม function get จำนวนสถานีของ step 1
  const station_num = 1;

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
      await getStepCount(3, 'processing');
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors if needed
    }
  };

  const waitingGet = async () => {
    try {
      await getQueues.getStep3Waitting().then((response) => {
        setItems(response);
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  //ข้อมูล รอเรียกคิว step
  const processingGet = async () => {
    try {
      await getQueues.getStep3Processing().then((response) => {
        setItems(response);
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const initialData = 0;
  const [weight, setWeight] = useState(initialData);

  const handleChange = (value) => {
    setWeight(parseFloat(value));
  };

  const step1Update = (step_id, statusupdate, station_id) => {
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
          // await waitingGet();
          // await processingGet();
          //3=Step ชั่งหนัก
          await getStepCount(3, 'processing');
        }
      })
      .catch((error) => console.log('error', error));
  };

  const step2Update = (id, statusupdate, station_id) => {
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

    fetch(apiUrl + '/updatestepstatus/' + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result['status'] === 'ok') {
          //alert("Upadte next step was completed")
          setLoading(false);
        }
      })
      .catch((error) => console.log('error', error));
  };

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

  //Update ทีมขึ้นสินค้าสำหรับ step3
  const updateLoadingTeam = (step_id) => {
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
    if (fr === 'call') {
      setMessage('ชั่งหนัก–STEP3 เรียกคิว');
      setText('เรียกคิว');
    } else {
      if (fr === 'close') {
        setMessage('ชั่งหนัก–STEP3 ปิดคิว');
        setText('ปิดคิว');
      } else {
        setMessage('ชั่งหนัก–STEP3 ยกเลิกเรียกคิว');
        setText('ยกเลิก');
      }
    }
    setFrom(fr);
    setUpdate(step_id);
    setTeamId(team_id);
    //get steps_id of step 4 from queues_id for next queues
    getStepId(4, queue_id);
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
            resolve(result);

            // Reload
            onStatusChange(status === 'waiting' ? 'processing' : 'waiting');
            fetchData();
            setLoading(false);
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
    setLoading(true);
    // flag = 1 = ยืนยัน
    if (flag === 1) {
      //call = เรียกคิว, close = ปิดคิว, cancel = ยกเลิกคิว
      if (fr === 'call') {
        // station_count = จำนวนคิวที่กำลังเข้ารับบรการ, station_num = จำนวนหัวจ่ายในสถานีทั้งหมด
        setWeight(0);
        if (station_count < station_num) {
          //เพิ่ม function get station id 3 = station id

          // การใช้งาน Line Notify
          getStepToken(id_update)
            .then(({ queue_id, token }) => {
              lineNotify(queue_id, token);
            })
            .catch((error) => {
              console.error('Error:', error);
              // ทำอะไรกับข้อผิดพลาด
            });

          step1Update(id_update, 'processing', 23);
          updateStartTime(id_update);
        } else {
          alert('สถานีบริการเต็ม');
          setLoading(false);
        }
      } else {
        if (fr === 'close') {
          //ปิดคิว: Update waiting Step2 ตามหมายเลขคิว
          if (weight === 0 || weight === '') {
            alert('กรุณาใสน้ำหนักจากการชั่งหนัก');
            setLoading(false);
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

            updateLoadingTeam(id_update_next, team_id);
            updateLoadingTeam(id_update, team_id);
            step2Update(id_update_next, 'waiting', 27);
            step1Update(id_update, 'completed', 23);
            updateEndTime(id_update);
            updateWeight2(id_update);
            updateStartTime(id_update_next);
          }
        } else {
          //ยกเลิก
          setWeight(0);
          // การใช้งาน Line Notify
          getStepToken(id_update)
            .then(({ queue_id, token }) => {
              lineNotify(queue_id, token);
            })
            .catch((error) => {
              console.error('Error:', error);
              // ทำอะไรกับข้อผิดพลาด
            });

          step1Update(id_update, 'waiting', 27);
          updateStartTime(id_update);
        }
      }
    } else {
      setLoading(false);
    }
    setOpen(false);
  };

  const updateWeight2 = (step_id) => {
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        weight2: weight
      });

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(apiUrl + '/updateweight2/' + step_id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          //console.log(result)
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

  /* แจ้งเตือน Line Notify */

  const lineNotify = (queue_id, token) => {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;

    var link = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    link = link + '/queues/detail/' + queue_id;

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      message: message + ' หมายเลขคิว: ' + token + '\n' + 'น้ำหนักชั่งหนัก: ' + weight + ' ตัน' + '\n' + link
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
                        <TableCell align="left"> {row.team_name ? row.team_name : '-'}</TableCell>
                        <TableCell align="left">
                          {/* {row.start_time ? moment(row.start_time).format('LT') : '-'} */}
                          {row.start_datetime ? row.start_datetime.slice(11, 19) : row.start_time.slice(11, 19)}
                        </TableCell>
                        <TableCell align="center">
                          {status == 'waiting' && <Chip color="warning" sx={{ width: '95px' }} label={'รอคิวชั่งหนัก'} />}
                          {status == 'processing' && <Chip color="success" sx={{ width: '95px' }} label={'กำลังชั่งหนัก'} />}
                        </TableCell>

                        {status == 'processing' && (
                          <TableCell align="center">
                            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '100px', fontFamily: 'kanit' }}>
                              <Input
                                id="standard-adornment-weight"
                                endAdornment={
                                  <InputAdornment position="end" style={{ fontFamily: 'kanit' }}>
                                    ตัน
                                  </InputAdornment>
                                }
                                aria-describedby="standard-weight-helper-text"
                                inputProps={{
                                  type: 'number',
                                  'aria-label': 'weight'
                                }}
                                value={weight}
                                onChange={(e) => handleChange(e.target.value)}
                                style={{ fontFamily: 'kanit' }}
                              />
                              <FormHelperText id="standard-weight-helper-text" style={{ fontFamily: 'kanit' }}>
                                น้ำหนักชั่งหนัก
                              </FormHelperText>
                            </FormControl>
                          </TableCell>
                        )}
                        <TableCell align="right" width="120" sx={{ width: 120, maxWidth: 120 }}>
                          <ButtonGroup aria-label="button group" sx={{ alignItems: 'center' }}>
                            {status == 'waiting' && (
                              <Button
                                // sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                variant="contained"
                                size="small"
                                color="info"
                                onClick={() => handleClickOpen(row.step_id, 'call', row.queue_id, row.team_id)}
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
                                  onClick={() => handleClickOpen(row.step_id, 'cancel', row.queue_id, row.team_id)}
                                  style={{ fontFamily: 'kanit' }}
                                  color="error"
                                >
                                  ยกเลิก
                                </Button>
                                <Button
                                  // endIcon={<DoneIcon />}
                                  size="small"
                                  variant="contained"
                                  onClick={() => handleClickOpen(row.step_id, 'close', row.queue_id, row.team_id)}
                                  style={{ fontFamily: 'kanit' }}
                                >
                                  ปิดคิว
                                </Button>
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
