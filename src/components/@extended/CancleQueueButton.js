import { useState, useEffect } from 'react';
import { Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography } from '@mui/material';
import { WarningOutlined } from '@ant-design/icons';
import moment from 'moment-timezone';

import * as reserveRequest from '_api/reserveRequest';
import * as stepRequest from '_api/StepRequest';
import * as queueReques from '_api/queueReques';
import * as lineNotifyApi from '_api/linenotify';
import * as userRequest from '_api/userRequest';

import { useSnackbar } from 'notistack';

function CancleQueueButton({ reserve_id, status, handleReload }) {
  const [userData, setUserData] = useState([]);
  const userId = localStorage.getItem('user_id');
  useEffect(() => {}, [handleReload]);

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    userRequest.getAlluserId(userId).then((response) => {
      if (response) {
        response.map((result) => {
          setUserData(result);
        });
      }
    });
  };
  // const [notifytext, setNotifyText] = useState('');

  const handleClickOpen = () => {
    // setNotifyText('');
    setOpen(true);
  };
  const handleClose = (flag) => {
    if (flag === 1) {
      // setMessageCreateReserve(reserve_id);
      // if (reserve_id === 99999) {
      reserveRequest.getQueuesByIdReserve(reserve_id).then((response) => {
        const queueData = response.find((x) => x.reserve_id === reserve_id);
        // console.log(response);
        if (response.length > 0 && queueData.step2_status !== 'completed' && queueData.step2_status !== 'processing') {
          getQueueDetail(queueData.queue_id);
        } else {
          enqueueSnackbar('ไม่สามารถยกเลิกคิวนี้ได้! : เนื่องจากมีการรับสินค้าเรียบร้อย', { variant: 'error' });
        }
      });
      // }
      setOpen(false);
    } else if (flag === 0) {
      setOpen(false);
    }
  };

  const getQueueDetail = async (queueId) => {
    try {
      var currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const statusData = {
        status: 'cancle',
        station_id: 27,
        updated_at: currentDate
      };
      await queueReques.getAllStepById(queueId).then((response) => {
        response.map((x) => {
          stepRequest.updateStatusStep(x.step_id, statusData);
        });
        cancleReserve(reserve_id);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const cancleReserve = (reserve_id) => {
    try {
      const statusData = {
        status: 'cancle'
      };

      reserveRequest.putReserveStatus(reserve_id, statusData).then(() => {
        enqueueSnackbar('ยกเลิกคิวนี้สำเร็จ !', { variant: 'success' });
        setMessageCreateReserve(reserve_id);
        handleReload(true);
      });
    } catch (error) {
      enqueueSnackbar('ยกเลิกคิวเกิดข้อผิดพลาด', { variant: 'warning' });
      console.log(error);
    }
  };

  const setMessageCreateReserve = async (id) => {
    const prurl = window.location.origin + '/reserve/update/' + id;

    await reserveRequest.getReserDetailID(id).then((result) => {
      result.reserve.map((data) => {
        const company_name_m = 'บริษัท: ' + data.name;
        const registration_no_m = data.registration_no;
        // const driver_name_m = 'คนขับรถ: ' + data.driver;
        // const driver_mobile_m = 'เบอร์โทร: ' + data.mobile_no;

        const textMessage =
          'แจ้งเตือนการ การยกเลิกคิวรับสินค้า' +
          '\n' +
          'วันที่ยกเลิก: ' +
          moment(new Date()).format('DD/MM/YYYY HH:mm:ss') +
          '\n' +
          '\n' +
          company_name_m +
          '\n' +
          registration_no_m +
          '\n' +
          'ผู้ยกเลิก' +
          userData.firstname +
          ' ' +
          userData.lastname +
          // driver_name_m +
          '\n' +
          // driver_mobile_m +
          // +'\n' +
          // '\n' +
          // '\n' +
          prurl;

        // console.log(' textMessage: ', textMessage);

        // if (id === 9999) {
        lineNotifyApi.sendLinenotify(textMessage);
        lineNotifyApi.sendTelegramNotify(textMessage);
        // .then(() => {
        //   window.location.href = '/reserve/update/' + id;
        //   setLoading(false);
        // });
        // } else {
        //   window.location.href = '/reserve/update/' + id;
        // }
      });
    });
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">
          <Typography variant="h5" align="center">
            {'แจ้งเตือน : '}ต้องการยกเลิกคิวนี้ ?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            การยกเลิกคิวนี้จะล้างสถานะ <strong>(Step1-Step4)</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions align="center" sx={{ justifyContent: 'center!important', p: 2 }}>
          <>
            <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
              ยกเลิก
            </Button>
            <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
              ยืนยัน
            </Button>
          </>
        </DialogActions>
      </Dialog>

      <Tooltip title="ยกเลิก">
        <span>
          <Button
            variant="contained"
            sx={{ minWidth: '33px!important', p: '6px 0px' }}
            size="medium"
            color="warning"
            disabled={status === 'cancle' || status === 'waiting'}
            // onClick={() => deleteDrivers(row.reserve_id)}
            onClick={() => handleClickOpen(reserve_id, 'cancle')}
          >
            <WarningOutlined />
          </Button>
        </span>
      </Tooltip>
    </>
  );
}

export default CancleQueueButton;
