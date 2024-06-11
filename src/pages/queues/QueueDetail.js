import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useParams, useNavigate } from 'react-router-dom';
import {
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Grid,
  Divider,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox
} from '@mui/material';

import moment from 'moment-timezone';

import MainCard from 'components/MainCard';
import PropTypes from 'prop-types';
import { StepContent } from '../../../node_modules/@mui/material/index';
import { PrinterOutlined, RollbackOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import CopyLinkButton from 'components/CopyLinkButton';
import CryptoJS from 'crypto-js';
const KeyCode = process.env.REACT_APP_CODE_URL;

// Get api queuesRequest
import * as queueRequest from '_api/queueReques'
import * as reserveRequest from '_api/reserveRequest';
const apiUrl = process.env.REACT_APP_API_URL;
const steps = ['ชั่งเบา', 'ขึ้นสินค้า', 'ชั่งหนัก', 'เสร็จสิ้น'];
const userId = localStorage.getItem('user_id');

// ฟังก์ชันที่ใช้ในการเพิ่ม 0 ถ้าจำนวนน้อยกว่า 10
const padZero = (num) => {
  return num < 10 ? `0${num}` : num;
};

function QueueDetail({ sx }) {
  const pageId = 6;
  const userPermission = useSelector((state) => state.auth?.user_permissions);
  const [pageDetail, setPageDetail] = useState([]);

  const userRoles = useSelector((state) => state.auth.roles);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [queueID, setQueueID] = useState('');

  const isMobile = useMediaQuery('(max-width:600px)');
  const [activeStep, setActiveStep] = useState(0);

  const prurl = window.location.origin + '/queues/detail/';

  useEffect(() => {

    const decryptData = () => {
      try {
        // Decode the Base64 string
        const decodedData = atob(id.toString());

        // Decrypt the data
        const bytes = CryptoJS.AES.decrypt(decodedData, KeyCode);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

        if (decryptedData) {
          setQueueID(decryptedData);
        } else {
          setQueueID(id);
        }
      } catch (error) {
        setQueueID(id);
        // console.error('Error decrypting data:', error);
      }
    };

    // Call the decryption function
    decryptData();
    // Decode the Base64 string
    // const decodedData = atob(id);
    // const bytes = CryptoJS.AES.decrypt(decodedData, KeyCode);
    // const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (Object.keys(userPermission).length > 0) {
      console.log('userRoles :', userRoles)
      if (userPermission.permission.filter((x) => x.page_id === pageId).length > 0) {
        setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
      } else {
        setOpen(false);
      }
    }

    if (queueID) {
      getQueueById(queueID);
      getQueueCount(queueID, 'completed');
      getQueue(queueID);
    }
  }, [id, userRoles, queueID, KeyCode, userPermission]);

  const [queue_token, setQueueToken] = useState('');
  const [queues, setQueues] = useState([]);
  const [queueNumber, setQueueNumber] = useState([]);

  function getDateFormat(end_time) {
    // แปลงวันที่จาก row.end_time เป็น moment object และกำหนดโซนเวลาเป็น 'Asia/Bangkok'
    const momentObj = moment(end_time).tz('Asia/Bangkok');

    // ตรวจสอบว่า momentObj อยู่ในวันที่ถัดไปหรือไม่ ถ้าใช่ให้ลบหนึ่งวัน
    if (momentObj.hours() >= 0 && momentObj.hours() < 12) {
      momentObj.subtract(1, 'days');
    }

    // แปลงรูปแบบวันที่ตามที่ต้องการ "18/04/2024"
    const formattedDate = momentObj.format('DD/MM/YYYY');

    return formattedDate;
  }

  const getQueue = (id) => {
    setLoading(true);
    try {
      queueRequest.getQueueDetailID(id).then((result) => {
        if (result.length > 0) {
          // const currentDate = moment(new Date()).format('DD/MM/YYYY');
          const currentDate = moment();

          // สร้างวันที่ก่อนหรือหลังจากวันปัจจุบันไม่เกิน 2 วัน
          const twoDaysBefore = moment().subtract(2, 'days');
          const targetDate = moment(result[0]['queue_date'].slice(0, 10));

          if (targetDate.isBetween(twoDaysBefore, currentDate, null, '[]')) {
            // if (getDateFormat(result[0]['queue_date']) === moment(new Date()).format('DD/MM/YYYY')) {
            setQueueToken(result[0]['token']);
            setQueues(result[0]);
            setQueueNumber(result[0]['queue_number']);
            getOrder(result[0].reserve_id);
            setLoading(false);
          } else {
            setErrorMessage('ข้อมูลคิวหมดอายุแล้ว');
            setError(true);
            setLoading(false);
          }
        } else {
          setError(true);
          setLoading(false);
        }
      });
    } catch (error) {
      // setErrorMessage('ข้อมูลคิวหมดอายุแล้ว');
      setError(true);
      setLoading(false);
      // navigate('/queues');
      console.log(error);
    }
  };

  function getQueueCount(queues_id, step_status) {
    queueRequest.getQueueCount(queues_id, step_status).then((result) => {
      try {
        result.map((data) => {
          setActiveStep(data.queues_count);
          if (data.queues_count == 3) {
            getQueueStep(4, queues_id);
          }
        });
      } catch (error) {
        console.log('error', error);
      }
    });
  }

  const [stepData, setStepData] = useState([]);
  function getQueueStep(stepnum, queues_id) {
    queueRequest.getStepByQueueId(stepnum, queues_id).then((result) => {
      try {
        result.map((data) => {
          setStepData(data);
        });
      } catch (error) {
        console.log('error', error);
      }
    });
  }

  const [orders, setOrders] = useState([]);
  const [totalItem, setTotalItem] = useState(0);

  function getOrder(id) {
    return new Promise(() => {
      setTimeout(() => {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };

        fetch(apiUrl + '/orders/' + id, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            let total = 0;
            result.map((data) => {
              total = total + parseFloat(data.total_amount);
              setTotalItem(total);
            });
            setOrders(result);
            setLoading(false);
          })
          .catch((error) => console.log('error', error));
        //resolve('Async operation completed');
      }, 100);
    });
  }

  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const getQueueById = (id) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(apiUrl + '/stepbyqueueidonly/' + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setItems(result);
      })
      .catch((error) => {
        console.log('error', error);
        setErrorMessage('ไม่พบข้อมูลคิว');
        setError(true);
        setLoading(false);
      });
  };
  //  ==================== [ ปิดคิว ] ====================
  const [open, setOpen] = useState(false);
  const [id_update, setUpdate] = useState(0);
  // const [team_id, setTeamId] = useState(0);
  const [message, setMessage] = useState('');

  const handleClickOpen = (step_id) => {
    setMessage('เสร็จสิ้น(ประตูทางออก)–STEP4 เปิดคิว');
    setOpen(true);
    setUpdate(step_id);
    // setTeamId(team_id);
  };

  const handleClose = (flag) => {
    if (flag == 1) {
      // การใช้งาน Line Notify
      getStepToken(id_update)
        .then(({ queue_id, token }) => {
          lineNotify(queue_id, token);
        })
        .catch((error) => {
          console.error('Error:', error);
          // ทำอะไรกับข้อผิดพลาด
        });

      // updateLoadingTeam(id_update, team_id);
      step1Update(id_update, 'completed', 24);
      updateEndTime(id_update);
      updateHasCover(id_update);
    } else {
      console.log('Cancen ');
    }
    setOpen(false);
  };

  function HasCover(checked) {
    // ใช้เงื่อนไข if เพื่อตรวจสอบค่าของ checked
    if (checked) {
      return 'Y'; // ถ้า checked เป็น true ให้คืนค่า "Y"
    } else {
      return 'N'; // ถ้า checked เป็น false ให้คืนค่า "N"
    }
  }

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
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }
        })
        .catch((error) => console.error(error));
    });
  };

  //Update ผ้าคลุมรถ
  const updateHasCover = async (step_id) => {
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        parent_has_cover: parent_has_cover,
        trailer_has_cover: trailer_has_cover
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
            backToQueues();
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
  /* End แจ้งเตือน Line Notify */

  //  ==================== [ End ปิดคิว ] ====================

  const [parent_has_cover, setParentHasCover] = useState('N');
  const [checked, setChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
    const has_cover = HasCover(event.target.checked);
    setParentHasCover(has_cover);
  };

  const [trailer_has_cover, setTrailerHasCover] = useState('N');
  const [checked2, setChecked2] = useState(false);
  const handleCheckboxChange2 = (event) => {
    setChecked2(event.target.checked);
    const has_cover = HasCover(event.target.checked);
    setTrailerHasCover(has_cover);

    console.log(trailer_has_cover);
  };

  const navigate = useNavigate();
  const printQueues = () => {
    navigate('/prints/queues', { state: { queuesId: queueID } });
  };
  const backToQueues = () => {
    navigate('/queues');
  };

  return (
    <>
      <Grid alignItems="center" justifyContent="space-between">
        {loading && (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
            open={loading}
          >
            <CircularProgress color="primary" />
          </Backdrop>
        )}

        <Dialog
          // fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title" align="center">
            <Typography variant="h5">{'ยืนยันรถออกจากโรงงาน'}</Typography>
          </DialogTitle>
          <DialogContent>
            <MainCard>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5">
                    <strong>ข้อมูลผู้ขับขี่:</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body">
                    <strong>ชื่อผู้ขับ :</strong> {queues.driver_name}{' '}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body">
                    <strong>ทะเบียนรถ :</strong> {queues.registration_no}{' '}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body">
                    <strong>เลขที่บัตรประชาชน :</strong> {'-'}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body">
                    <strong>เลขที่ใบขับขี่ :</strong> {queues.license_no}{' '}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5">
                    <strong>คลุมผ้าใบ (ตัวแม่) :</strong>
                    <Checkbox checked={checked} onChange={handleCheckboxChange} color="primary" inputProps={{ 'aria-label': 'Checkbox' }} />
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5">
                    <strong>คลุมผ้าใบ (ตัวลูก) :</strong>
                    <Checkbox
                      checked={checked2}
                      onChange={handleCheckboxChange2}
                      color="primary"
                      inputProps={{ 'aria-label': 'Checkbox' }}
                    />
                  </Typography>
                </Grid>
              </Grid>
            </MainCard>
            <DialogContentText>{/* ต้องการ {textnotify} ID:{id_update} หรือไม่? */}</DialogContentText>
          </DialogContent>
          <DialogActions align="center" sx={{ justifyContent: 'center!important' }}>
            <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
              ยกเลิก
            </Button>
            <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
              ยืนยัน
            </Button>
          </DialogActions>
        </Dialog>

        <Grid container spacing={3} rowSpacing={2} columnSpacing={2.75}>
          <Grid item xs={12} lg={10} sx={sx}>
            <MainCard>
              {error ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} align="center">
                    <Typography style={{ color: 'red', fontSize: 45 }}>
                      <ExclamationCircleOutlined />
                    </Typography>
                    <Typography variant="h4"> {errorMessage ? errorMessage : 'ไม่พบข้อมูลคิว'}</Typography>
                  </Grid>
                  {userRoles && (
                    <Grid item xs={12} align="center">
                      <Button
                        size="mediam"
                        variant="contained"
                        color="error"
                        onClick={() => {
                          backToQueues();
                        }}
                        startIcon={<RollbackOutlined />}
                      >
                        ย้อนกลับ
                      </Button>
                    </Grid>
                  )}
                </Grid>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    {isMobile ? (
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography variant="h5">
                            คิวที่ : <span style={{ color: 'red' }}> {padZero(queueNumber)}</span>
                          </Typography>
                          <Typography variant="h5">
                            หมายเลขคิวเดิม : <span style={{ color: 'red' }}> {queues.reserve_description}</span>
                          </Typography>
                        </Grid>
                        <Grid item xs={6} align="right">
                          <Typography variant="h5">หมายเลขคิว : {queue_token}</Typography>
                        </Grid>
                        <Grid item xs={12} align="right">
                          <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 1 }} />
                        </Grid>

                        <VerticalStepper
                          activeStep={activeStep}
                          steps={steps}
                          queue_token={queue_token}
                          queues={queues}
                          orders={orders}
                          totalItem={totalItem}
                          stepDetail={items}
                          stepId={activeStep}
                        />
                      </Grid>
                    ) : (
                      <div>
                        <Grid item xs={12}>
                          <Typography variant="h4">
                            {' '}
                            คิวที่ : <span style={{ color: 'red' }}> {padZero(queueNumber)}</span>
                            {/* <span style={{ color: 'red' }}>{queueNumber}</span> */}
                          </Typography>
                          <Typography variant="h5">
                            หมายเลขคิวเดิม : <span style={{ color: 'red' }}> {queues.reserve_description}</span>
                          </Typography>
                          <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                        </Grid>

                        <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} light />
                        <HorizontalStepper
                          activeStep={activeStep}
                          steps={steps}
                          queue_token={queue_token}
                          queues={queues}
                          orders={orders}
                          totalItem={totalItem}
                          stepDetail={items}
                          stepId={activeStep}
                        />
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={12} sx={{ '& button': { m: 1 }, p: '0 -6%!important' }} align="center">
                    {(pageDetail.length > 0 &&
                      (pageDetail[0].permission_name === 'manage_everything' || pageDetail[0].permission_name === 'add_edit_delete_data') || userRoles === 19) &&
                      activeStep == 3 && (
                        <Button size="mediam" variant="contained" color="primary" onClick={() => handleClickOpen(stepData.step_id)}>
                          ปิดคิว
                        </Button>
                      )}

                    {pageDetail.length > 0 &&
                      (pageDetail[0].permission_name === 'manage_everything' ||
                        pageDetail[0].permission_name === 'add_edit_delete_data') && (
                        <>
                          {getDateFormat(queues.queue_date) !== moment(new Date()).format('DD/MM/YYYY') && (
                            <>
                              <CopyLinkButton link={prurl} data={queueID} />
                              <Button
                                size="mediam"
                                variant="contained"
                                color="info"
                                d
                                onClick={() => {
                                  printQueues();
                                }}
                                startIcon={<PrinterOutlined />}
                              >
                                ตัวอย่างก่อนพิมพ์
                              </Button>
                            </>
                          )}
                          <Button
                            size="mediam"
                            variant="contained"
                            color="error"
                            onClick={() => {
                              backToQueues();
                            }}
                            startIcon={<RollbackOutlined />}
                          >
                            ย้อนกลับ
                          </Button>
                        </>
                      )}
                  </Grid>
                </Grid>
              )}
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
const VerticalStepper = ({ activeStep, steps, queue_token, queues, orders, totalItem, stepDetail, stepId }) => (
  <div>
    <Stepper activeStep={activeStep} orientation="vertical">
      {steps.map((label, index) => (
        <Step key={index}>
          <StepLabel>
            <Typography variant="h5">{label}</Typography>
          </StepLabel>
          <StepContent>
            {activeStep < 3 && (
              <QueueDetails
                queue_token={queue_token}
                queues={queues}
                orders={orders}
                totalItem={totalItem}
                stepDetail={stepDetail}
                stepId={stepId}
              />
            )}
          </StepContent>
        </Step>
      ))}
    </Stepper>
    {activeStep >= 3 && (
      <QueueDetails
        queue_token={queue_token}
        queues={queues}
        orders={orders}
        totalItem={totalItem}
        stepDetail={stepDetail}
        stepId={stepId}
      />
    )}
  </div>
);

const HorizontalStepper = ({ activeStep, steps, queue_token, queues, orders, totalItem, stepDetail, stepId }) => (
  <div>
    <MainCard>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ ml: '-8%' }}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>
              <Typography variant="h5">{label}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </MainCard>
    <MainCard sx={{ mt: 2 }}>
      <div>
        {/* <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} light /> */}
        <QueueDetails
          queue_token={queue_token}
          queues={queues}
          orders={orders}
          totalItem={totalItem}
          stepDetail={stepDetail}
          stepId={stepId}
        />
      </div>
    </MainCard>
  </div>
);

const QueueDetails = ({ queue_token, queues, orders, totalItem, stepDetail, stepId }) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  // ==============================|| ORDER TABLE - STATUS ||============================== //
  const QueueStatus = ({ status, id }) => {
    const statusText = [
      {
        id: 0,
        detail: [
          {
            color: 'secondary',
            status: 'waiting',
            title: 'รอชั่งเบา'
          },
          {
            color: 'warning',
            status: 'processing',
            title: 'กำลังชั่งเบา'
          },
          {
            color: 'success',
            status: 'completed',
            title: 'สำเร็จ'
          },
          {
            color: 'secondary',
            status: 'none',
            title: 'รอชั่งเบา'
          }
        ]
      },
      {
        id: 1,
        detail: [
          {
            color: 'secondary',
            status: 'waiting',
            title: 'รอขึ้นสินค้า'
          },
          {
            color: 'warning',
            status: 'processing',
            title: 'กำลังขึ้นสินค้า'
          },
          {
            color: 'success',
            status: 'completed',
            title: 'สำเร็จ'
          },
          {
            color: 'secondary',
            status: 'none',
            title: 'รอขึ้นสินค้า'
          }
        ]
      },
      {
        id: 2,
        detail: [
          {
            color: 'secondary',
            status: 'waiting',
            title: 'รอชั่งหนัก'
          },
          {
            color: 'warning',
            status: 'processing',
            title: 'กำลังชั่งหนัก'
          },
          {
            color: 'success',
            status: 'completed',
            title: 'สำเร็จ'
          },
          {
            color: 'secondary',
            status: 'none',
            title: 'รอชั่งหนัก'
          }
        ]
      },
      {
        id: 3,
        detail: [
          {
            color: 'secondary',
            status: 'waiting',
            title: 'รอออกจากโรงงาน'
          },
          {
            color: 'warning',
            status: 'processing',
            title: 'กำลังออกจากโรงงาน'
          },
          {
            color: 'success',
            status: 'completed',
            title: 'สำเร็จ'
          },
          {
            color: 'secondary',
            status: 'none',
            title: 'รอออกจากโรงงาน'
          }
        ]
      }
    ];

    const queueTxt = statusText[id].detail.find((x) => x.status == status);

    return <Chip color={queueTxt.color} label={queueTxt.title} />;
  };

  QueueStatus.propTypes = {
    status: PropTypes.string,
    id: PropTypes.string
  };

  useEffect(() => {
    getProductBrandList();
    getProductCompany();
  }, []);
  // =============== Get Product Company ===============//
  const [productCompany, setProductCompany] = useState([]);
  const getProductCompany = () => {
    try {
      reserveRequest.getAllproductCompanys().then((response) => {
        setProductCompany(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [productBrandList, setProductBrandList] = useState([]);
  const getProductBrandList = async () => {
    reserveRequest.getAllproductBrand().then((response) => {
      if (response.length > 0) {
        setProductBrandList(response)
      }
    });
  }
  return (
    <Grid container spacing={2} sx={{ p: '0 3%' }}>
      {!isMobile && (
        <Grid item xs={12} md={6}>
          <Typography variant="h5">
            <strong>หมายเลขคิว :</strong> {queue_token}
          </Typography>
        </Grid>
      )}

      {isMobile && (
        <Grid item xs={12} sx={{ mt: 2, mb: 0 }}>
          <Typography variant="h5">
            <strong>ข้อมูลผู้ขับขี่:</strong>
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} md={6}>
        {stepDetail.map(
          (item, index) =>
            index === stepId && (
              <Typography key={index} variant="h5" sx={{ pl: { xs: 1, lg: '20%' } }}>
                <strong>สถานะ : </strong>
                <QueueStatus id={`${stepId}`} status={item.status} />
              </Typography>
            )
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="body">
          <strong>ชื่อผู้ขับ :</strong> {queues.driver_name}{' '}
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="body" sx={{ pl: { xs: 1, lg: '20%' } }}>
          <strong>ทะเบียนรถ :</strong> {queues.registration_no}{' '}
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="body">
          <strong>เลขที่ใบขับขี่ :</strong> {queues.license_no}{' '}
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="body" sx={{ pl: { xs: 1, lg: '20%' } }}>
          <strong>จำนวนสินค้า :</strong> {totalItem} ตัน
        </Typography>
      </Grid>

      {userId && (
        <>
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Divider sx={{ mb: { xs: 1, sm: 2 } }} />
            <Typography variant="h5">
              <strong>ข้อมูลรายการสั่งซื้อ:</strong>
            </Typography>
          </Grid>

          <Grid item xs={12}>
            {orders.map((order, item) => (
              <Grid container spacing={2} key={order.order_id}>
                <Grid item xs={12} sx={{ ml: 2, mr: 2 }}>
                  {/* {order.items.map((item) => ( */}
                  <Grid item xs={12} key={item} sx={{ mb: 2 }}>
                    <Grid container spacing={2} sx={{ mb: '15px' }}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                          <strong>เลขที่คำสั่งซื้อ : </strong> {order.ref_order_id}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6} >
                        <Typography variant="body1" sx={{ pl: { xs: 1, lg: '20%' } }}>
                          <strong>วันที่สั่งซื้อสินค้า : </strong> {moment(order.order_date).format('DD/MM/YYYY')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                          <strong>บริษัท(สินค้า) : </strong> {productCompany.find((x) => x.product_company_id === order.product_company_id)?.product_company_name_th}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1" sx={{ pl: { xs: 1, lg: '20%' } }}>
                          <strong>ตราสินค้า : </strong>  {productBrandList.find((x) => x.product_brand_id === order.product_brand_id)?.product_brand_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1" >
                          <strong>ยอดจ่าย : </strong> {parseFloat(order.total_amount)} ตัน
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Typography variant="body1">
                        <strong>รายละเอียด : </strong> {order.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={9}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ p: '12px' }}>สินค้า</TableCell>
                            <TableCell align="right" sx={{ p: '12px' }}>
                              จำนวน (ตัน)
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell width={'50%'}>{item.name}</TableCell>
                              <TableCell align="right">{parseFloat(item.quantity)} ตัน</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Grid>
                    {order.length > 1 && <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />}
                  </Grid>
                  {/* // <Grid container rowSpacing={0} columnSpacing={2.75} key={item.item_id}>
                //   <Grid item xs={6}>
                //     <Typography variant="body1" gutterBottom>
                //       <strong>สินค้า :</strong> {item.name}
                //     </Typography>
                //   </Grid>

                //   <Grid item xs={6}>
                //     <Typography variant="body1" gutterBottom>
                //       <strong>จำนวน : </strong>
                //       {item.quantity} ตัน
                //     </Typography>
                //   </Grid>
                // </Grid> */}
                  {/* ))} */}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Divider sx={{ mb: { xs: 1, sm: 2 } }} />
          <Typography variant="h5">
            <strong>ข้อมูลการรับสินค้า:</strong>
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body" sx={{ pl: 1 }}>
                <strong>น้ำหนักก่อนรับสินค้า :</strong> {queues.weight1 && queues.weight1 !== null ? parseFloat(queues.weight1) + ' ตัน' : '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body" sx={{ pl: { xs: 1, lg: '20%' } }}>
                <strong>น้ำหนักหลังรับสินค้า :</strong> {queues.weight2 && queues.weight2 !== null ? parseFloat(queues.weight2) + ' ตัน' : '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body" sx={{ pl: 1 }}>
                <strong>โกดัง :</strong> {queues.warehouse_name || '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body" sx={{ pl: { xs: 1, lg: '20%' } }}>
                <strong>หัวจ่าย :</strong> {queues.station_description || '-'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid >
  );
};

export default QueueDetail;
