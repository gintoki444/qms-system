import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';

// get queue api
const apiUrl = process.env.REACT_APP_API_URL;
import * as queueRequest from '_api/queueReques';

// material-ui
import {
  Box,
  ButtonGroup,
  Button,
  Chip,
  Tooltip,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Backdrop,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Snackbar,
  Alert
} from '@mui/material';

import { ProfileOutlined, DeleteOutlined, RetweetOutlined } from '@ant-design/icons';

import MUIDataTable from 'mui-datatables';
import CopyLinkButton from 'components/CopyLinkButton';
import { getCurrentDate } from '_api/StepRequest';
import { AddAuditLogs } from '_api/adminRequest';

// ==============================|| RESET STEP BUTTON ||============================== //
const ResetStepButton = ({ data, onReset }) => {
  const [openReset, setOpenReset] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const userId = localStorage.getItem('user_id');

  const stepConfig = [
    { id: 'step1', order: 1, label: 'ชั่งเบา (S1)', status: data.step1_status },
    { id: 'step2', order: 2, label: 'ขึ้นสินค้า (S2)', status: data.step2_status },
    { id: 'step3', order: 3, label: 'ชั่งหนัก (S3)', status: data.step3_status },
    { id: 'step4', order: 4, label: 'เสร็จสิ้น (S4)', status: data.step4_status }
  ];

  const canResetStep = (stepOrder) => {
    const currentStep = stepConfig.find((step) => step.order === stepOrder);
    const prevStep = stepConfig.find((step) => step.order === stepOrder - 1);
    const nextStep = stepConfig.find((step) => step.order === stepOrder + 1);

    return prevStep?.status === 'completed' && currentStep?.status === 'none' && (!nextStep || nextStep?.status === 'none');
  };

  const handleResetClick = () => {
    setOpenReset(true);
  };

  const handleResetConfirm = async () => {
    if (!selectedStep) {
      alert('กรุณาเลือกขั้นตอนที่ต้องการรีเซต');
      return;
    }

    setLoadingReset(true);
    try {
      const steps = await queueRequest.getStepsByQueueId(data.queue_id);
      const stepOrder = stepConfig.find((step) => step.id === selectedStep).order;
      const currentStep = steps.find((step) => step.order === stepOrder);

      if (!currentStep) {
        throw new Error('Step data not found');
      }

      await step1Update(currentStep.step_id, 'waiting', currentStep.station_id);
      const datalog = {
        audit_user_id: userId,
        audit_action: 'I',
        audit_system_id: currentStep.station_id,
        audit_system: 'step id:' + currentStep.step_id,
        audit_screen: 'ข้อมูลคิว',
        audit_description: 'รีเซตสถานะของ step :waiting'
      };
      await AddAuditLogs(datalog);
      onReset();
      setOpenReset(false);
      setSelectedStep(null);
    } catch (error) {
      console.error('Reset failed:', error);
      alert('ไม่สามารถรีเซตสถานะได้: ' + error.message);
    } finally {
      setLoadingReset(false);
    }
  };

  const handleResetClose = () => {
    setOpenReset(false);
    setSelectedStep(null);
  };

  const handleStepSelect = (event) => {
    setSelectedStep(event.target.value);
  };

  return (
    <>
      <Tooltip title="รีเซตสถานะ">
        <span>
          <Button
            sx={{ minWidth: '33px!important', p: '6px 0px' }}
            variant="contained"
            size="medium"
            color="warning"
            onClick={handleResetClick}
            disabled={!stepConfig.some((step) => canResetStep(step.order))}
          >
            <RetweetOutlined />
          </Button>
        </span>
      </Tooltip>
      <Dialog open={openReset} onClose={handleResetClose}>
        <DialogTitle>
          <h4 style={{ fontFamily: 'kanit', margin: 0, textAlign: 'center', fontSize: 18 }}>เลือกขั้นตอนเพื่อรีเซต</h4>
        </DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <Typography variant="body" sx={{ fontSize: 16 }}>
              <strong>ข้อมูลสถานะ :</strong> เมื่อกดรีเซตสถานะจะถูกเปลี่ยนเป็นสถานะ <strong>รอเรียกคิว</strong>
            </Typography>
            <RadioGroup value={selectedStep} onChange={handleStepSelect}>
              {stepConfig.map((step) => (
                <FormControlLabel
                  key={step.id}
                  value={step.id}
                  control={<Radio />}
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', fontFamily: 'kanit' }}>
                      {step.label} - สถานะ : {step.status === 'none' ? '-' : <QueueStatus status={step.status} />}
                    </span>
                  }
                  disabled={!canResetStep(step.order)}
                  style={{ fontFamily: 'kanit' }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center!important', p: 2 }}>
          {loadingReset ? (
            <CircularProgress color="primary" />
          ) : (
            <>
              <Button color="error" variant="contained" onClick={handleResetClose}>
                ยกเลิก
              </Button>
              <Button color="primary" variant="contained" onClick={handleResetConfirm} disabled={!selectedStep}>
                ยืนยัน
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

ResetStepButton.propTypes = {
  data: PropTypes.object,
  onReset: PropTypes.func
};

// ==============================|| STEP UPDATE FUNCTION ||============================== //
const step1Update = async (id, statusupdate, stations_id) => {
  const currentDate = await getCurrentDate();
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

  return fetch(apiUrl + '/updatestepstatus/' + id, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result['status'] === 'ok') {
        return;
      } else {
        throw new Error('Update failed');
      }
    })
    .catch((error) => {
      console.error('error', error);
      throw error;
    });
};

// ==============================|| ORDER TABLE - STATUS ||============================== //
const QueueStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case 'pending':
      color = 'error';
      title = 'รอคำสั่งซื้อ';
      break;
    case 'processing':
      color = 'warning';
      title = 'ดำเนินการ';
      break;
    case 'completed':
      color = 'success';
      title = 'สำเร็จ';
      break;
    case 'waiting':
      color = 'secondary';
      title = 'รอเรียกคิว';
      break;
    case 'cancle':
      color = 'error';
      title = 'ยกเลิกคิว';
      break;
    default:
      color = 'secondary';
      title = '-';
  }

  return (
    <Tooltip title={title}>
      <Chip color={color} label={title} sx={{ minWidth: '78.7px!important' }} />
    </Tooltip>
  );
};

QueueStatus.propTypes = {
  status: PropTypes.string
};

export default function QueueTable({ startDate, endDate, permission, queusList, onFilter }) {
  const [open, setOpen] = useState(false);
  const userRoles = useSelector((state) => state.auth.roles);
  const userID = useSelector((state) => state.auth.user_id);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (userRoles) getQueue();
  }, [startDate, endDate, userRoles, permission, onFilter]);

  const getQueue = async () => {
    try {
      let response;
      if (userRoles == 8) {
        response = await queueRequest.getAllqueueUserByDate(userID, startDate, endDate);
      } else {
        response = await queueRequest.getAllqueueByDateV2(startDate, endDate);
      }

      const newData = response.map((item, index) => ({
        ...item,
        No: index + 1
      }));

      if (onFilter) {
        const filteredData = newData.filter((x) => x.product_company_id === onFilter);
        setItems(filteredData);
      } else {
        queusList(newData);
        setItems(newData);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  // =============== Get Company DataTable ===============//
  const options = {
    viewColumns: false,
    print: false,
    download: false,
    selectableRows: 'none',
    elevation: 0,
    rowsPerPage: 100,
    responsive: 'standard',
    rowsPerPageOptions: [100, 200, 300]
  };

  const columns = [
    {
      name: 'No',
      label: 'ลำดับ',
      options: {
        sort: true,
        setCellHeaderProps: () => ({
          style: { textAlign: 'center' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'center' }
        })
      }
    },
    {
      name: 'queue_date',
      label: 'วันที่เข้ารับสินค้า',
      options: {
        sort: true,
        customBodyRender: (value) => <Typography variant="body">{moment(value.slice(0, 10)).format('DD/MM/YY')}</Typography>
      }
    },
    {
      name: 'token',
      label: 'หมายเลขคิว',
      options: {
        sort: true,
        customBodyRender: (value) => <Chip color={'primary'} label={value} sx={{ width: 70, border: 1 }} />
      }
    },
    {
      name: 'reserve_description',
      label: 'รหัสคิวเดิม',
      options: {
        sort: true,
        customBodyRender: (value) => (value ? <strong style={{ color: 'red' }}>{value}</strong> : '-')
      }
    },
    {
      name: 'company_name',
      label: 'ร้านค้า/บริษัท',
      options: {
        sort: true,
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'registration_no',
      label: 'ทะเบียนรถ',
      options: {
        sort: true,
        customBodyRender: (value) => (
          <Tooltip title={`คลิกเพื่อคัดลอก: ${value}`}>
            <Chip 
              color={'primary'} 
              label={value} 
              sx={{ 
                width: 122, 
                border: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
              onClick={() => copyToClipboard(value)}
            />
          </Tooltip>
        )
      }
    },
    {
      name: 'driver_name',
      label: 'ชื่อผู้ขับ',
      options: {
        sort: true,
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'driver_mobile',
      label: 'เบอร์โทรศัพท์',
      options: {
        sort: true,
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'queue_id',
      label: 'ชั่งเบา(S1)',
      options: {
        customBodyRender: (value, tableMeta) => {
          const queueDat = items[tableMeta.rowIndex];
          return (
            <div style={{ textAlign: 'center' }}>
              {queueDat.step1_status !== 'none' ? (
                <>
                  {parseFloat(queueDat.step1_status) <= 0 ? (
                    <QueueStatus status={'pending'} />
                  ) : (
                    <QueueStatus status={queueDat.step1_status} />
                  )}
                </>
              ) : (
                '-'
              )}
            </div>
          );
        }
      }
    },
    {
      name: 'queue_id',
      label: 'ขึ้นสินค้า(S2)',
      options: {
        customBodyRender: (value, tableMeta) => {
          const queueDat = items[tableMeta.rowIndex];
          return (
            <div style={{ textAlign: 'center' }}>
              {queueDat.step2_status !== 'none' ? <QueueStatus status={queueDat.step2_status} /> : '-'}
            </div>
          );
        }
      }
    },
    {
      name: 'queue_id',
      label: 'ชั่งหนัก(S3)',
      options: {
        customBodyRender: (value, tableMeta) => {
          const queueDat = items[tableMeta.rowIndex];
          return (
            <div style={{ textAlign: 'center' }}>
              {queueDat.step3_status !== 'none' ? <QueueStatus status={queueDat.step3_status} /> : '-'}
            </div>
          );
        }
      }
    },
    {
      name: 'queue_id',
      label: 'เสร็จสิ้น(S4)',
      options: {
        customBodyRender: (value, tableMeta) => {
          const queueDat = items[tableMeta.rowIndex];
          return (
            <div style={{ textAlign: 'center' }}>
              {queueDat.step4_status !== 'none' ? <QueueStatus status={queueDat.step4_status} /> : '-'}
            </div>
          );
        }
      }
    },
    {
      name: 'queue_id',
      label: 'Actions',
      options: {
        customBodyRender: (value, tableMeta) => {
          const queueDat = items[tableMeta.rowIndex];
          const prurl = window.location.href + '/detail/';
          return (
            <ButtonGroup variant="plain" aria-label="Basic button group" sx={{ boxShadow: 'none!important' }}>
              {permission && (permission === 'manage_everything' || permission === 'add_edit_delete_data') && (
                <CopyLinkButton link={prurl} data={value} shortButton={true} />
              )}

              <Tooltip title="รายละเอียด">
                <span>
                  <Button
                    sx={{ minWidth: '33px!important', p: '6px 0px' }}
                    variant="contained"
                    size="medium"
                    color="info"
                    onClick={() => updateDrivers(value)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      window.open(`/queues/detail/${value}`, '_blank');
                    }}
                  >
                    <ProfileOutlined />
                  </Button>
                </span>
              </Tooltip>

              {permission && (permission === 'manage_everything' || permission === 'add_edit_delete_data') && (
                <ResetStepButton data={queueDat} onReset={getQueue} />
              )}

              {permission === 9999 && (
                <Tooltip title="ลบ">
                  <span>
                    <Button
                      variant="contained"
                      sx={{ minWidth: '33px!important', p: '6px 0px' }}
                      size="medium"
                      disabled={queueDat.step1_status === 'completed'}
                      color="error"
                      onClick={() => handleClickOpen(value, queueDat.reserve_id, queueDat.step1_status, 'delete')}
                    >
                      <DeleteOutlined />
                    </Button>
                  </span>
                </Tooltip>
              )}
            </ButtonGroup>
          );
        },
        setCellHeaderProps: () => ({
          style: { textAlign: 'center' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'center' }
        })
      }
    }
  ];

  // ยกเลิกข้อมูลการจองคิว
  const [reserve_id, setReserve_id] = useState(false);
  const [id_del, setDel] = useState(0);
  const [textnotify, setText] = useState('');
  const [onClick, setOnClick] = useState('');

  const handleClickOpen = (queue_id, reserve_id, step1_status, onClick) => {
    if (onClick === 'delete') {
      if (step1_status === 'processing' || step1_status === 'completed') {
        alert('คิวนี้ถูกเรียกแล้ว! ไม่สามารถลบข้อมูลนี้ได้');
        return;
      }
      setReserve_id(reserve_id);
      setText('ลบข้อมูล');
      setDel(queue_id);
    }
    setOnClick(onClick);
    setOpen(true);
  };

  const [onclickSubmit, setOnClickSubmit] = useState(false);
  const handleClose = (flag) => {
    if (onClick === 'delete') {
      if (flag === 1) {
        setOnClickSubmit(true);
        setLoading(true);

        deteteQueue(id_del);
        updateReserveStatus(reserve_id);
        setOpen(false);
      }
    }
    if (flag === 0) {
      setOpen(false);
    }
  };

  const deteteQueue = (queueId) => {
    setLoading(true);
    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow'
    };

    fetch(apiUrl + '/deletequeuestep/' + queueId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result['status'] === 'ok') {
          getQueue();
        }
      })
      .catch((error) => console.log('error', error));
  };

  const updateReserveStatus = (reserve_id) => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      status: 'waiting'
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(apiUrl + '/updatereservestatus/' + reserve_id, requestOptions)
      .then((response) => {
        response.json();
        setOnClickSubmit(false);
      })
      .catch((error) => console.log('error', error));
  };

  const navigate = useNavigate();
  const updateDrivers = (id) => {
    navigate('/queues/detail/' + id);
  };

  // ฟังก์ชันสำหรับ copy ทะเบียนรถ
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <Box
      sx={{
        '& .MuiTableCell-root': {
          textWrap: 'nowrap'
        }
      }}
    >
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title" style={{ fontFamily: 'kanit' }}>
          {'แจ้งเตือน'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontFamily: 'kanit' }}>ต้องการ {textnotify} หรือไม่?</DialogContentText>
        </DialogContent>
        <DialogActions align="center" sx={{ justifyContent: 'center!important', p: 2 }}>
          {onclickSubmit == true ? (
            <>
              <CircularProgress color="primary" />
            </>
          ) : (
            <>
              <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
                ยกเลิก
              </Button>
              <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
                ยืนยัน
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}

      <MUIDataTable title={<Typography variant="h5">ข้อมูลคิวรับสินค้า</Typography>} data={items} columns={columns} options={options} />
      
      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setCopySuccess(false)} severity="success" sx={{ width: '100%' }}>
          คัดลอกทะเบียนรถเรียบร้อยแล้ว!
        </Alert>
      </Snackbar>
    </Box>
  );
}
