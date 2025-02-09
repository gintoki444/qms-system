import React, { useState, useEffect } from 'react';

import {
  // useMediaQuery,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ButtonGroup,
  Button,
  Tooltip,
  Chip,
  // Stack,
  Checkbox,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
  // ButtonGroup
} from '@mui/material';
// import { useTheme } from '@mui/material/styles';
import MainCard from 'components/MainCard';
// Link api queues
import * as getQueues from '_api/queueReques';
import * as stepRequest from '_api/StepRequest';
const apiUrl = process.env.REACT_APP_API_URL;

import CircularProgress from '@mui/material/CircularProgress';
import { RightSquareOutlined } from '@ant-design/icons';
import moment from 'moment';
import QueueTag from 'components/@extended/QueueTag';
import AddtimeStep from './AddtimeStep';
import * as functionAddLogs from 'components/Function/AddLog';

export const Step4Table = ({ status, title, onStatusChange, onFilter, permission }) => {
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
      id: 'remarkQueue',
      align: 'center',
      disablePadding: false,
      // width: '5%',
      label: 'รหัสคิวเดิม'
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
      width: '15%',
      label: 'ร้านค้า/บริษัท'
    },
    {
      id: 'totals',
      align: 'right',
      disablePadding: true,
      label: 'จำนวน (ตัน)'
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
      width: '5%',
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
    // {
    //   id: 'checkBox1',
    //   align: 'center',
    //   disablePadding: false,
    //   width: '5%',
    //   label: 'คลุมผ้าใบ (ตัวแม่)'
    // },
    // {
    //   id: 'checkBox2',
    //   align: 'center',
    //   disablePadding: false,
    //   width: '5%',
    //   label: 'คลุมผ้าใบ (ตัวลูก)'
    // },
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
              {status === 'processing' && (
                <TableCell
                  key={headCell.id}
                  align={headCell.align}
                  width={headCell.width}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                >
                  {headCell.label}
                </TableCell>
              )}

              {status === 'waiting' && headCell.id !== 'checkBox2' && headCell.id !== 'checkBox1' && (
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
  // const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [id_update, setUpdate] = useState(0);
  // const [id_update_next, setUpdateNext] = useState(0);
  const [fr, setFrom] = useState('');
  const [textnotify, setText] = useState('');
  const [station_count, setStationCount] = useState(0);
  const [loading, setLoading] = useState(true); // สร้าง state เพื่อติดตามสถานะการโหลด
  const [team_id, setTeamId] = useState(0);
  const [message, setMessage] = useState('Test');
  const userId = localStorage.getItem('user_id');
  //เพิ่ม function get จำนวนสถานีของ step 1
  const station_num = 1;

  useEffect(() => {
    setLoading(true);
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 120000); // Polling every 5 seconds

    return () => clearInterval(intervalId);
  }, [status, onStatusChange, onFilter, permission]);

  const fetchData = async () => {
    if (status === 'waiting') {
      await waitingGet();
    } else if (status === 'processing') {
      await processingGet();
    }

    getStepCount(4, 'processing');
  };

  const waitingGet = async () => {
    try {
      getQueues.getStep4Waitting().then((response) => {
        if (onFilter == 0) {
          setItems(response);
        } else {
          setItems(response.filter((x) => x.product_company_id == onFilter) || []);
        }
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const processingGet = async () => {
    try {
      getQueues.getStep4Processing().then((response) => {
        setItems(response);
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const step1Update = async (step_id, statusupdate, station_id) => {
    setLoading(true);

    const currentDate = await stepRequest.getCurrentDate();
    // var currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

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
          // waitingGet();
          // processingGet();
          //2=Step ขึ้นสินค้า
          getStepCount(4, 'processing');
          setLoading(false);
        }
      })
      .catch((error) => console.log('error', error));
  };

  const getStepCount = (steps_order, steps_status) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(apiUrl + '/stepcount/' + steps_order + '/' + steps_status, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setStationCount(result[0]['step_count']);
      })
      .catch((error) => console.log('error', error));
  };

  const [id_update_next, setUpdateNext] = useState(0);
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

  //Update ทีมขึ้นสินค้าสำหรับ Step4
  const updateLoadingTeam = (step_id) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      team_id: team_id
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
        } else {
          console.log('not update LoadingTeam');
        }
      })
      .catch((error) => console.error(error));
  };

  const [queues, setQueues] = useState([]);
  const handleClickOpen = (step_id, fr, team_id, queues_id, queuesData) => {
    if (fr === 'call') {
      setMessage('เสร็จสิ้น(ประตูทางออก)–STEP4 เรียกคิว');
      setText('เรียกคิวที่');
    } else {
      if (fr === 'close') {
        setMessage('เสร็จสิ้น(ประตูทางออก)–STEP4 เปิดคิว');
        setText('ปิดคิวที่ ');
      } else {
        getStepId(3, queues_id);
        setMessage('ทวนสอบการชั่งหนัก (Step 3)');
        setText('ทวนสอบการชั่งหนัก คิวที่ ');
      }
    }
    setFrom(fr);
    setQueues(queuesData);
    setUpdate(step_id);
    setTeamId(team_id);
    setOpen(true);
  };

  //Update start_time of step
  const updateStartTime = async (step_id) => {
    //alert("updateStartTime")

    const currentDate = await stepRequest.getCurrentDate();
    // const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

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
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }
        })
        .catch((error) => console.error(error));
    });
  };

  //Update start_time of step
  const updateEndTime = async (step_id) => {
    //alert("updateEndTime")

    let currentDateNew = '';
    if (selectedDate && selectedTime) {
      const date = moment(selectedDate);
      const time = moment(selectedTime);
      const dateTime = moment(date)
        .set({
          hour: time.get('hour'),
          minute: time.get('minute'),
          second: time.get('second')
        })
        .format('YYYY-MM-DD HH:mm:ss');
      currentDateNew = dateTime;
      // setSubmittedDateTime(dateTime);
    } else {
      currentDateNew = await stepRequest.getCurrentDate();
      // currentDateNew = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    }

    // console.log('currentDateNew :', currentDateNew);
    // const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    // if (currentDateNew === 9999) {
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        start_time: currentDateNew
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
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }
        })
        .catch((error) => console.error(error));
    });
    // }
  };

  const handleClose = (flag) => {
    setLoading(true);
    // flag = 1 = ยืนยัน
    if (flag === 1) {
      //call = เรียกคิว, close = ปิดคิว, cancel = ยกเลิกคิว
      if (fr === 'call') {
        // station_count = จำนวนคิวที่กำลังเข้ารับบรการ, station_num = จำนวนหัวจ่ายในสถานีทั้งหมด
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

          const data = {
            audit_user_id: userId,
            audit_action: 'I',
            audit_system_id: id_update,
            audit_system: 'step4',
            audit_screen: 'ข้อมูลรถออกจากโรงงาน',
            audit_description: 'เรียกรถออกจากโรงงาน'
          };
          AddAuditLogs(data);

          step1Update(id_update, 'processing', 24);
          updateStartTime(id_update);
          setLoading(false);
          setOpen(false);
        } else {
          alert('สถานีบริการเต็ม');
          setLoading(false);
        }
      } else {
        if (fr === 'close') {
          // การใช้งาน Line Notify
          // if (id_update === 9999) {
          getStepToken(id_update)
            .then(({ queue_id, token }) => {
              lineNotify(queue_id, token);
            })
            .catch((error) => {
              console.error('Error:', error);
              // ทำอะไรกับข้อผิดพลาด
            });

          const data = {
            audit_user_id: userId,
            audit_action: 'U',
            audit_system_id: id_update,
            audit_system: 'step4',
            audit_screen: 'ข้อมูลรถออกจากโรงงาน',
            audit_description: 'บันทึกข้อมูลรถออกจากโรงงาน'
          };
          AddAuditLogs(data);

          updateLoadingTeam(id_update, team_id);
          step1Update(id_update, 'completed', 24);
          updateEndTime(id_update);
          updateHasCover(id_update);
          setLoading(false);
          setOpen(false);
          // }
        } else {
          console.log('id_update_next :', id_update_next);
          // if (id_update_next === 99999) {
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

          const data = {
            audit_user_id: userId,
            audit_action: 'D',
            audit_system_id: id_update,
            audit_system: 'step4',
            audit_screen: 'ข้อมูลรถออกจากโรงงาน',
            audit_description: 'ยกเลิกรถออกจากโรงงาน'
          };

          AddAuditLogs(data);
          step1Update(id_update_next, 'waiting', 27);
          step1Update(id_update, 'none', 27);
          updateStartTime(id_update);
          setLoading(false);
          setOpen(false);
          // }
        }
      }
    } else if (flag === 0) {
      setLoading(false);
      setOpen(false);
    }

    setSelectedDate(null);
    setSelectedTime(null);
    setClickDate(false);
  };

  /* แจ้งเตือน Line Notify */
  const lineNotify = (queue_id, token) => {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    // if (queue_id === 99999) {
    var link = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    link = link + '/queues/detail/' + queue_id;

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      message:
        message +
        ' หมายเลขคิว: ' +
        token +
        '\n' +
        'คลุมผ้าใบ(ตัวแม่): ' +
        parent_has_cover +
        '\n' +
        'คลุมผ้าใบ(ตัวลูก): ' +
        trailer_has_cover +
        '\n' +
        link
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
    // }
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
  /* End แจ้งเตือน Line Notify */

  const [parent_has_cover, setParentHasCover] = useState('N');
  const [checked, setChecked] = useState([]);

  const handleCheckboxChange = (id, name) => (event) => {
    const { value, checked } = event.target;
    // setChecked(event.target.checked);
    // const has_cover = HasCover(event.target.checked);
    // setParentHasCover(has_cover);

    const selectedOption = { id: id, name: name, value: checked ? value || true : false };

    setChecked((prevState) => {
      const updatedOptions = [...prevState];

      const index = updatedOptions.findIndex((option) => option.id === id && option.name === name);
      if (index !== -1) {
        updatedOptions[index] = selectedOption;
      } else {
        updatedOptions.push(selectedOption);
      }
      return updatedOptions;
    });
  };

  const [trailer_has_cover, setTrailerHasCover] = useState('N');
  const [checked2, setChecked2] = useState([]);

  const handleCheckboxChange2 = (id, name) => (event) => {
    // setChecked2(event.target.checked);
    // const has_cover = HasCover(event.target.checked);
    // setTrailerHasCover(has_cover);

    const { value, checked } = event.target;
    const selectedOption = { id: id, name: name, value: checked ? value || true : false };

    setChecked2((prevState) => {
      const updatedOptions = [...prevState];

      const index = updatedOptions.findIndex((option) => option.id === id && option.name === name);
      if (index !== -1) {
        updatedOptions[index] = selectedOption;
      } else {
        updatedOptions.push(selectedOption);
      }
      return updatedOptions;
    });
  };

  //Update ผ้าคลุมรถ
  const updateHasCover = async (step_id) => {
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const txt_parent_has_cover = checked.some((x) => x.id === step_id && x.value === 'on') === true ? 'Y' : 'N';
      const txt_trailer_has_cover = checked2.some((x) => x.id === step_id && x.value === 'on') === true ? 'Y' : 'N';
      setParentHasCover(txt_parent_has_cover);
      setTrailerHasCover(txt_trailer_has_cover);
      const raw = JSON.stringify({
        // parent_has_cover: parent_has_cover,
        // trailer_has_cover: trailer_has_cover
        parent_has_cover: txt_parent_has_cover,
        trailer_has_cover: txt_trailer_has_cover
      });

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      fetch(apiUrl + '/updatehascover/' + step_id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result['status'] === 'ok') {
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ

            // Reload
            fetchData();
            onStatusChange(status === 'waiting' ? 'processing' : 'waiting');
          } else {
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }
        })
        .catch((error) => console.error(error));
    });
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clickDate, setClickDate] = useState(false);

  const handleClickAddDate = (event) => {
    setClickDate(event.target.checked);
  };

  const AddAuditLogs = async (data) => {
    await functionAddLogs.AddAuditLog(data);
  };
  // const [submittedTime, setSubmittedTime] = useState(null);
  return (
    <>
      <Box>
        <Dialog
          // fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title" align="center" sx={{ fontSize: '18px' }}>
            {'แจ้งเตือน : '}
            {textnotify}
            <QueueTag id={queues.product_company_id || ''} token={queues.token} />
          </DialogTitle>
          {fr === 'close' && (
            <DialogContent sx={{ maxWidth: '480px' }}>
              <DialogContentText>
                <MainCard>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {clickDate && (
                        <AddtimeStep
                          selectedDate={selectedDate}
                          setSelectedDate={setSelectedDate}
                          selectedTime={selectedTime}
                          setSelectedTime={setSelectedTime}
                        />
                      )}
                      <Typography variant="h5">
                        <strong>ระบุวันที่ออกจากโรงงาน :</strong>
                        <Checkbox
                          checked={clickDate}
                          onChange={handleClickAddDate}
                          color="primary"
                          inputProps={{ 'aria-label': 'Checkbox' }}
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} align={'left'}>
                      <Typography variant="h5">
                        <strong>คลุมผ้าใบ (ตัวแม่) :</strong>
                        <Checkbox
                          checked={checked.find((X) => X.id === id_update)?.value}
                          onChange={handleCheckboxChange(id_update, 'checked1')}
                          color="primary"
                          inputProps={{ 'aria-label': 'Checkbox' }}
                        />
                        <strong>คลุมผ้าใบ (ตัวลูก) :</strong>
                        <Checkbox
                          checked={checked2.find((X) => X.id === id_update)?.value}
                          onChange={handleCheckboxChange2(id_update, 'checked2')}
                          color="primary"
                          inputProps={{ 'aria-label': 'Checkbox' }}
                        />
                      </Typography>
                    </Grid>
                  </Grid>
                </MainCard>
              </DialogContentText>
            </DialogContent>
          )}
          <DialogActions align="center" sx={{ justifyContent: 'center!important' }}>
            <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
              ยกเลิก
            </Button>
            <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
              ยืนยัน
            </Button>
          </DialogActions>
        </Dialog>
        {status === 'processing' && (
          <Grid sx={{ p: 2 }}>
            <Typography variant="h4">
              {title}
              <span>( {station_count} คัน )</span>
            </Typography>
          </Grid>
        )}
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
                    {status == 'waiting' ? (
                      <TableCell colSpan={12} align="center">
                        <CircularProgress />
                        <Typography variant="body1">Loading....</Typography>
                      </TableCell>
                    ) : (
                      <TableCell colSpan={14} align="center">
                        <CircularProgress />
                        <Typography variant="body1">Loading....</Typography>
                      </TableCell>
                    )}
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
                        <TableCell align="left">
                          {moment(row.queue_date.slice(0, 10)).format('DD/MM/YY')}
                          {row.queue_time ? ' - ' + row.queue_time.slice(0, 5) + 'น.' : ''}
                        </TableCell>
                        <TableCell align="left">
                          <QueueTag id={row.product_company_id || ''} token={row.token} />
                          {moment(row.queue_date.slice(0, 10)).format('DD/MM/YYYY') != moment(new Date()).format('DD/MM/YYYY') && (
                            <span style={{ color: 'red' }}> (คิวค้าง)</span>
                          )}
                        </TableCell>
                        <TableCell align="left">
                          {row.description ? <strong style={{ color: 'red' }}>{row.description}</strong> : '-'}
                        </TableCell>
                        <TableCell align="center">
                          <Chip color="primary" sx={{ width: '90px' }} label={row.registration_no} />
                        </TableCell>

                        {status == 'waiting' && <TableCell left="left">-</TableCell>}
                        {status == 'processing' && (
                          <TableCell align="left">
                            <Typography>
                              {row.station_description}
                              {/* {row.station_description.substring(0, 20)} {row.station_description.length >= 20 && '...'} */}
                            </Typography>
                          </TableCell>
                        )}

                        <TableCell align="left">
                          <Typography sx={{ width: '240px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {row.company_name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body">
                            <strong>{row.total_quantity ? parseFloat((row.total_quantity * 1).toFixed(3)) : '-'}</strong>
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{row.driver_name}</TableCell>
                        <TableCell align="left">{row.driver_mobile}</TableCell>
                        <TableCell align="left">{row.team_name ? row.team_name : '-'}</TableCell>
                        <TableCell align="left" width="10%">
                          {/* {row.start_time ? moment(row.start_time).format('LT') : '-'} */}
                          {row.start_time ? row.start_time.slice(11, 19) : '-'}
                        </TableCell>
                        <TableCell align="center">
                          {status == 'waiting' && <Chip color="warning" sx={{ width: '110px' }} label={'รอคิวตรวจสอบ'} />}
                          {status == 'processing' && <Chip color="success" sx={{ width: '110px' }} label={'กำลังตรวจสอบ'} />}
                        </TableCell>
                        {/* {status == 'processing' && (
                          <>
                            <TableCell align="center">
                              <Checkbox
                                checked={checked.find((X) => X.id === row.step_id)?.value}
                                onChange={handleCheckboxChange(row.step_id, 'checked1')}
                                color="primary"
                                inputProps={{ 'aria-label': 'Checkbox' }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Checkbox
                                checked={checked2.find((X) => X.id === row.step_id)?.value}
                                onChange={handleCheckboxChange2(row.step_id, 'checked2')}
                                color="primary"
                                inputProps={{ 'aria-label': 'Checkbox' }}
                              />
                            </TableCell>
                          </>
                        )} */}

                        <TableCell align="right" width="120" sx={{ pr: '0!important' }}>
                          <ButtonGroup aria-label="button group" sx={{ alignItems: 'center' }}>
                            <Tooltip title="เรียกคิว">
                              <span>
                                {status == 'waiting' && (
                                  <Button
                                    // sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                    variant="contained"
                                    size="small"
                                    color="info"
                                    disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                                    onClick={() => handleClickOpen(row.step_id, 'call', row.team_id, row.queue_id, row)}
                                    endIcon={<RightSquareOutlined />}
                                  >
                                    เรียกคิว
                                  </Button>
                                )}
                              </span>
                            </Tooltip>

                            {status == 'processing' && (
                              <>
                                <Tooltip title="เรียกคิว">
                                  <span>
                                    <Button
                                      // sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                      variant="contained"
                                      size="small"
                                      color="error"
                                      disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                                      onClick={() => handleClickOpen(row.step_id, 'cancel', row.team_id, row.queue_id, row)}
                                    >
                                      ทวนสอบ
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
                                      disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                                      onClick={() => handleClickOpen(row.step_id, 'close', row.team_id, row.queue_id, row)}
                                      // endIcon={<RightSquareOutlined />}
                                    >
                                      ปิดคิว
                                    </Button>
                                  </span>
                                </Tooltip>
                              </>
                            )}
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {items.length == 0 && (
                    <TableRow>
                      <TableCell colSpan={status == 'processing' ? 14 : 12} align="center">
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
