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
  // Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  // OutlinedInput,
  FormControl,
  Input,
  InputAdornment,
  FormHelperText,
  CircularProgress
} from '@mui/material';

// project import
// import Dot from 'components/@extended/Dot';

// Link api queues
import * as getQueues from '_api/queueReques';
const apiUrl = process.env.REACT_APP_API_URL;

import { RightSquareOutlined } from '@ant-design/icons';
import moment from 'moment/min/moment-with-locales';

import { useDispatch, useSelector } from 'react-redux';
import { setStation } from 'store/reducers/station';
import { Grid } from '../../../../node_modules/@mui/material/index';

export const StepTable = ({ status, title, onStatusChange }) => {
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
      align: 'center',
      disablePadding: true,
      width: '10%',
      label: 'สถานีบริการ'
    },
    {
      id: 'branName',
      align: 'left',
      disablePadding: false,
      width: '',
      label: 'ร้านค้า/บริษัท'
    },
    {
      id: 'driver',
      align: 'left',
      disablePadding: true,
      width: '',
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
      id: 'weightStap1',
      align: 'center',
      disablePadding: true,
      width: '10%',
      label: 'น้ำหนักชั่งเบา'
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

  useEffect(() => {
    fetchData();
  }, [status, station_count, onStatusChange]);

  const fetchData = async () => {
    setLoading(true);
    //ข้อมูล รอเรียกคิว step1
    if (status === 'waiting') {
      await waitingGet();
    } else if (status === 'processing') {
      await processingGet();
    }
  };

  //ข้อมูล รอเรียกคิว step1
  const [items, setItems] = useState([]);
  const waitingGet = async () => {
    try {
      await getQueues.getStep1Waitting().then((response) => {
        setItems(response);
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  //ข้อมูล รอเรียกคิว step1
  const initialData = [0];
  const [weight, setWeight] = useState(initialData);
  const processingGet = async () => {
    try {
      await getQueues.getStep1Processing().then((response) => {
        setItems(response);
        dispatch(setStation({ station_count: response.length }));
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (index, value) => {
    const newInputValues = [...weight];
    newInputValues[index] = parseFloat(value);
    setWeight(newInputValues);
    console.log(value);
  };

  //เปิดการแจ้งเตือน
  const [open, setOpen] = useState(false);
  const [id_update, setUpdate] = useState(0);
  const [textnotify, setText] = useState('');
  const [fr, setFrom] = useState('');
  const [message, setMessage] = useState('');
  const [id_update_next, setUpdateNext] = useState(0);
  const station_num = 1;

  const handleClickOpen = (id, fr, queues_id) => {
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
    getStepId(2, queues_id);
    setOpen(true);
  };

  // handleClose
  const handleClose = async (flag) => {
    setLoading(true);
    // flag === 1 คลิกยืนยัน และ fr = คลิกมาจากปุ่มไหน
    if (flag === 1) {
      if (fr === 'call') {
        setOpen(false);
        setTimeout(() => {
          if (station_count < station_num) {
            // การใช้งาน Line Notify
            getStepToken(id_update)
              .then(({ queue_id, token }) => {
                lineNotify(queue_id, token);
              })
              .catch((error) => {
                console.error('Error:', error);
                // ทำอะไรกับข้อผิดพลาด
              });

            step1Update(id_update, 'processing', 2);
            updateStartTime(id_update);
          } else {
            alert('สถานีบริการเต็ม');
          }
        }, 100);
      }

      if (fr === 'close') {
        if (weight[0] === 0 || weight[0] === '') {
          alert('กรุณาใสน้ำหนักจากการชั่งเบา');
        } else {
          //alert(weight);
          try {
            setOpen(false);
            console.log(typeof weight[0]);

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
            await step1Update(id_update, 'completed', 2);
            await updateEndTime(id_update);
            await updateWeight1(id_update);
            await updateStartTime(id_update_next);
          } catch (error) {
            console.error(error);
            // จัดการข้อผิดพลาดตามที่ต้องการ
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
          }
        }
      }

      if (fr === 'cancel') {
        setOpen(false);
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
      }
    }
    setLoading(false);
    setOpen(false);
  };

  //Update น้ำหนักชั่งเบา
  const updateWeight1 = (step_id) => {
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        weight1: weight[0]
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
          //console.log(result)
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

  return (
    <>
      <Box>
        {/* {loading && (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
            open={loading}
          >
            <CircularProgress color="primary" />
          </Backdrop>
        )} */}
        <Grid sx={{ p: 2 }}>
          <Typography variant="h4">
            {title}
            {status === 'processing' && <span> ( {station_count} / 1 สถานี )</span>}
          </Typography>
        </Grid>

        <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
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
            <Table
              size="small"
              aria-labelledby="tableTitle"
              // sx={{
              //   '& .MuiTableCell-root:first-of-type': {
              //     pl: 2
              //   },
              //   '& .MuiTableCell-root:last-of-type': {
              //     pr: 3
              //   }
              // }}
            >
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
                  {items.map((row, index) => {
                    return (
                      <>
                        {row.status == status && (
                          <TableRow key={index}>
                            <TableCell align="center">
                              <Typography>
                                <strong>{index + 1}</strong>
                              </Typography>
                            </TableCell>
                            <TableCell align="left">{moment(row.queue_date).format('DD/MM/YYYY')}</TableCell>
                            <TableCell align="left">
                              <Chip color="primary" label={row.token} />
                            </TableCell>
                            <TableCell align="center">
                              <Chip color="primary" sx={{ width: '90px' }} label={row.registration_no} />
                            </TableCell>

                            {status == 'waiting' && <TableCell align="center">-</TableCell>}
                            {status == 'processing' && (
                              <TableCell align="center">
                                <Typography sx={{ width: '160px' }}>{row.station_description}</Typography>
                              </TableCell>
                            )}

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
                              {status == 'waiting' && <Chip color="warning" sx={{ width: '95px' }} label={'รอคิวชั่งเบา'} />}
                              {status == 'processing' && <Chip color="success" sx={{ width: '95px' }} label={'กำลังชั่งเบา'} />}
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
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    style={{ fontFamily: 'kanit' }}
                                  />
                                  <FormHelperText id="standard-weight-helper-text" style={{ fontFamily: 'kanit' }}>
                                    น้ำหนักชั่งเบา
                                  </FormHelperText>
                                </FormControl>
                                {/* <Stack spacing={1}>
                                  <OutlinedInput
                                    sx={{ height: '2rem' }}
                                    type="number"
                                    value={row.name}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    placeholder="0"
                                  />
                                </Stack> */}
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
                                        onClick={() => handleClickOpen(row.step_id, 'call', row.queue_id)}
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
                                          variant="contained"
                                          size="small"
                                          color="error"
                                          onClick={() => handleClickOpen(row.step_id, 'cancel', row.queue_id)}
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
                                          onClick={() => handleClickOpen(row.step_id, 'close', row.queue_id)}
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
                        )}
                      </>
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
