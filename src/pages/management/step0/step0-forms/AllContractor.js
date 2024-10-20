import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Stack,
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  // Chip
  Divider
} from '@mui/material';
import MainCard from 'components/MainCard';

import { useSnackbar } from 'notistack';

import * as adminRequest from '_api/adminRequest';
import * as stepRequest from '_api/StepRequest';
import * as lineNotifyApi from '_api/linenotify';
import * as userRequest from '_api/userRequest';

import moment from 'moment-timezone';
function AllContractor({ permission }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contractorList, setContractorList] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getUser();
  }, []);

  const userId = localStorage.getItem('user_id');
  const [userData, setUserData] = useState([]);
  const getUser = () => {
    userRequest.getAlluserId(userId).then((response) => {
      if (response) {
        response.map((result) => {
          setUserData(result);
        });
      }
    });
  };

  useEffect(() => {
    getContractor();
  }, [permission]);

  const getContractor = async () => {
    setLoading(true);
    try {
      adminRequest.getAllContractors().then((response) => {
        const filterContractors = response.filter((x) => x.status !== 'I' && x.contract_company_id !== 11);
        setContractorList(filterContractors);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== Open popup ===============//
  //   const [wareHouseData, setWareHouseData] = useState([]);
  const [contractorData, setContractorData] = useState({});
  const handleClickOpen = (data) => {
    setOpen(true);
    setContractorData(data);
  };
  const handleClose = async (flag) => {
    if (flag == 1) {
      updateContractor(contractorData.contractor_id, 'waiting', contractorData.contract_update);
    } else if (flag == 0) {
      setOpen(false);
    }
    setOpen(false);
  };

  // =============== บันทึกข้อมูล ===============//
  const updateContractor = async (id, status, date) => {
    // const currentDate = await stepRequest.getCurrentDate();

    try {
      const data = {
        contract_status: status,
        contract_update: moment(date).format('YYYY-MM-DD')
      };

      stepRequest.putContractorStatus(id, data).then((response) => {
        if (response.status === 'ok') {
          enqueueSnackbar('รีเซตสายแรงงานสำเร็จ !', { variant: 'success' });
          setMessageCreateReserve();
          getContractor();
        } else {
          enqueueSnackbar('รีเซตสายแรงงานไม่สำเร็จ :' + response.error, { variant: 'error' });
        }
      });
    } catch (error) {
      enqueueSnackbar('รีเซตสายแรงงานไม่สำเร็จ :' + error, { variant: 'error' });
      console.log(error);
      setLoading(false);
    }
  };

  const setMessageCreateReserve = async () => {
    const textMessage =
      'แจ้งเตือนการยกเลิกสายแรงงาน' +
      '\n' +
      'วันที่ยกเลิก: ' +
      moment(new Date()).format('DD/MM/YYYY HH:mm:ss') +
      '\n' +
      'ชื่อสาย: ' +
      contractorData.contractor_name +
      '\n' +
      'สังกัด: ' +
      contractorData.contract_company_name +
      '\n' +
      'ผู้ยกเลิก: ' +
      userData.firstname +
      ' ' +
      userData.lastname;
    if (contractorData.contractor_name === 9999) {
      lineNotifyApi.sendLinenotify(textMessage);
    }
  };

  // =============== Get Stations ===============//
  const styleStation = (status) => {
    let statusColor = '';
    if (status == 'working') {
      statusColor = 'warning';
    } else if (status == 'none') {
      statusColor = 'secondary';
    } else {
      statusColor = 'success';
    }
    return statusColor;
  };

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
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sx={{ mt: 1.5 }}>
        <MainCard content={true} title="สายแรงงานทั้งหมด">
          <Divider sx={{ mt: -2, mb: 1 }} />
          <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
            <DialogTitle id="responsive-dialog-title" align="center">
              <Typography variant="h5">{'ข้อมูลสายแรงงาน'}</Typography>
            </DialogTitle>
            <DialogContent sx={{ width: 350 }}>
              <Grid container alignItems="center" justifyContent="flex-end" spacing={2}>
                <Grid item xs={12} align="center">
                  <Typography variant="body" sx={{ fontSize: 16 }}>
                    ต้องการรีเซตสายแรงงาน <strong>{'" ' + contractorData.contractor_name + ' "'}</strong> ใช่/ไม่
                  </Typography>
                </Grid>
              </Grid>
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
          {loading ? (
            <Grid item xs={12} align="center">
              <CircularProgress />
            </Grid>
          ) : (
            <Grid container spacing={1}>
              {contractorList.length > 0 &&
                contractorList.map((row, index) => (
                  <Grid item xs={3} sm={2} md={2} lg={1} align="center" key={index}>
                    {row.contract_update && getDateFormat(row.contract_update) === moment(new Date()).format('DD/MM/YYYY')
                      ? row.contract_update.slice(11, 16) + ' น.'
                      : '--:--'}
                    <Paper
                      variant="outlined"
                      sx={{
                        p: '8px 16px',
                        bgcolor:
                          styleStation(
                            row.contract_status === 'working'
                              ? row.contract_status
                              : moment(row.contract_update?.slice(0, 10)).format('DD/MM/YYYY') !==
                                  moment(new Date()).format('DD/MM/YYYY') && row.contract_status === 'waiting'
                              ? 'none'
                              : 'waiting'
                          ) + '.main',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        '&:hover': {
                          bgcolor:
                            styleStation(
                              row.contract_status === 'working'
                                ? row.contract_status
                                : moment(row.contract_update?.slice(0, 10)).format('DD/MM/YYYY') !==
                                    moment(new Date()).format('DD/MM/YYYY') && row.contract_status === 'waiting'
                                ? 'none'
                                : 'waiting'
                            ) + '.light'
                        },
                        '&:active': {
                          bgcolor:
                            styleStation(
                              row.contract_status === 'working'
                                ? row.contract_status
                                : moment(row.contract_update?.slice(0, 10)).format('DD/MM/YYYY') !==
                                    moment(new Date()).format('DD/MM/YYYY') && row.contract_status === 'waiting'
                                ? 'none'
                                : 'waiting'
                            ) + '.dark'
                        }
                      }}
                      onClick={() => row.contract_status === 'working' && handleClickOpen(row)}
                    >
                      <Stack spacing={0}>
                        <Typography variant="h5" sx={{ fontSize: { sm: '1rem!important', lg: '0.8vw!important' } }}>
                          {row.contractor_name}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
            </Grid>
          )}
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default AllContractor;
