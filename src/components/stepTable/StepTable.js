import React, { useState, useEffect } from 'react';

import {
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
} from '@mui/material';

// project import
import Dot from 'components/@extended/Dot';

// Link api queues
import * as getQueues from '_api/queueReques';
const apiUrl = process.env.REACT_APP_API_URL;

import { RightSquareOutlined } from '@ant-design/icons';
import moment from 'moment';

import { useDispatch, useSelector } from 'react-redux';
import { setStation } from 'store/reducers/station';

export const StepTable = ({ status }) => {
  const station_count = useSelector((state) => state.station.station_count);
  const dispatch = useDispatch();

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
  useEffect(() => {
    refeshData();
  }, [status]);

  const refeshData = async () => {
    //ข้อมูล รอเรียกคิว step1
    if (status === 'waiting') {
      waitingGet();
    } else if (status === 'processing') {
      processingGet();
    }
    //ข้อมูล กำลังรับบริการ step1
    // await processingGet();
    //1=Step ชั่งเบา
    // await getStepcount(1, 'processing');
  };

  //ข้อมูล รอเรียกคิว step1
  const [items, setItems] = useState([]);
  const waitingGet = () => {
    try {
      getQueues.getStep1Waitting().then((response) => {
        setItems(response);
      });
    } catch (e) {
      console.log(e);
    }
  };

  //ข้อมูล รอเรียกคิว step1
  const processingGet = () => {
    try {
      getQueues.getStep1Processing().then((response) => {
        setItems(response);
        dispatch(setStation({ station_count: response.length }));
      });
    } catch (e) {
      console.log(e);
    }
  };

  //เปิดการแจ้งเตือน
  const [open, setOpen] = useState(false);
  const [id_update, setUpdate] = useState(0);
  const [textnotify, setText] = useState('');
  const [fr, setFrom] = useState('');
  // const [message, setMessage] = useState('');
  const [id_update_next, setUpdateNext] = useState(0);
  const station_num = 1;

  //get จำนวนคิวที่กำลังรับบริการ
  // function getStepcount(steps_order, steps_status) {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       var requestOptions = {
  //         method: 'GET',
  //         redirect: 'follow'
  //       };

  //       fetch(apiUrl + '/stepcount/' + steps_order + '/' + steps_status, requestOptions)
  //         .then((response) => response.json())
  //         .then((result) => {
  //           dispatch(setStation({ station_count: station_count }));
  //           resolve(result[0]['step_count']);
  //           //console.log(result[0]['step_count']);
  //         })
  //         .catch((error) => console.log('error', error));
  //     }, 100);
  //   });
  // }

  const handleClickOpen = (id, fr, queues_id) => {
    if (fr === 'call') {
      setText('เรียกคิว');
    }
    if (fr === 'close') {
      setText('ปิดคิว');
    }
    if (fr === 'cancel') {
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

  // sendMessageToLine
  // const sendMessageToLine = async () => {
  //   try {
  //     const myHeaders = new Headers();
  //     myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  //     myHeaders.append('Authorization', 'Bearer sbamBfSN9p1p24hfKU0FHuBnmQeO9TQDS6omxd2nwAn');

  //     const formdata = new FormData();
  //     formdata.append('message', message);

  //     const requestOptions = {
  //       method: 'POST',
  //       headers: myHeaders,
  //       body: formdata,
  //       redirect: 'follow'
  //     };

  //     fetch('https://notify-api.line.me/api/notify', requestOptions)
  //       .then((response) => response.text())
  //       .then((result) => console.log(result))
  //       .catch((error) => console.error(error));
  //   } catch (error) {
  //     console.error('Error sending message:', error.message);
  //   }
  // };

  //Update step status
  const step1Update = (id, statusupdate, stations_id) => {
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
            refeshData();
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

  // handleClose
  const handleClose = async (flag) => {
    // flag === 1 คลิกยืนยัน และ fr = คลิกมาจากปุ่มไหน
    if (flag === 1) {
      if (fr === 'call') {
        setTimeout(() => {
          if (station_count < station_num) {
            step1Update(id_update, 'processing', 2);
            // sendMessageToLine();
          } else {
            alert('สถานีบริการเต็ม' + station_count + ':' + station_num);
          }
        }, 100);
      }

      if (fr === 'close') {
        //ปิดคิว: Update waiting Step2 ตามหมายเลขคิว 27 = station ว่าง
        //step2Update(id_update_next,"waiting", 27);
        //step1Update(id_update, "completed", 2);
        try {
          await step2Update(id_update_next, 'waiting', 27);
          await step1Update(id_update, 'completed', 2);
        } catch (error) {
          console.error(error);
          // จัดการข้อผิดพลาดตามที่ต้องการ
          alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
      }

      if (fr === 'cancel') {
        //ยกเลิก
        step1Update(id_update, 'waiting', 27);
      }
    }
    setOpen(false);
  };

  return (
    <>
      <Box>
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
                            // sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() => handleClickOpen(row.step_id, 'cancel', row.queue_id)}
                          >
                            ยกเลิก
                          </Button>

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
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
