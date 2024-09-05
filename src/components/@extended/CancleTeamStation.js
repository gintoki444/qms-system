import { useState, useEffect } from 'react';
import {
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { WarningOutlined } from '@ant-design/icons';
// import moment from 'moment-timezone';

import * as reserveRequest from '_api/reserveRequest';
import * as adminRequest from '_api/adminRequest';
import * as functionAddLogs from 'components/Function/AddLog';
import * as stepRequest from '_api/StepRequest';
import moment from '../../../node_modules/moment/moment';
// import * as queueReques from '_api/queueReques';

// import { useSnackbar } from 'notistack';

function CancleTeamStation({ reserveId, handleReload, reserveData, permission }) {
  const userId = localStorage.getItem('user_id');
  const [loading, setLoading] = useState(false);
  useEffect(() => {}, [handleReload, permission]);

  const [reservationData, setReservationData] = useState({});
  const getReserve = async (reserveId) => {
    setLoading(true);
    // const urlapi = apiUrl + `/reserve/` + reserveId;
    await reserveRequest
      .getReserDetailID(reserveId)
      .then((res) => {
        if (res) {
          setReservationData(res.reserve[0]);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  // const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [notifytext, setNotifyText] = useState('');

  const handleClickOpen = () => {
    setNotifyText('ต้องการยกเลิกหัวจ่ายนี้');
    setOpen(true);
    getReserve(reserveId);
  };

  // =============== บันทึกข้อมูล ===============//
  const updateContractor = async (id, status) => {
    const currentDate = await stepRequest.getCurrentDate();

    try {
      const data = {
        contract_status: status,
        contract_update: Date(currentDate, 'YYYY-MM-DD')
      };

      stepRequest.putContractorStatus(id, data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const updateTeamLoading = (values) => {
    try {
      adminRequest.putReserveTeam(reserveId, values);
    } catch (error) {
      console.log(error);
    }
  };
  const updateTeamData = (values) => {
    try {
      adminRequest.putReserveTeamData(reserveId, values).then(() => handleReload(true));
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = async (flag) => {
    if (flag === 1) {
      const contractor_id = reserveData.contractor_id;
      updateContractor(contractor_id, 'waiting');

      reserveData.warehouse_id = 1;
      reserveData.reserve_station_id = 1;
      reserveData.team_id = null;
      reserveData.contractor_id = null;
      reserveData.labor_line_id = null;
      reserveData.pickup_date = moment(reserveData.pickup_date).format('YYYY-MM-DD');
      reserveData.updated_at = moment(reserveData.updated_at).format('YYYY-MM-DD');
      reserveData.team_data = null;
      reserveData.description = reserveData.r_description;

      const teamValue = {
        team_id: null,
        contractor_id: null,
        labor_line_id: null
      };

      console.log('reserveData :', reserveData);
      // console.log('reservationData :', reservationData);
      // if (reserveId === 9999) {
      await deleteContractorOthers(reservationData.contractor_other_id);
      reserveRequest
        .putReserById(reserveId, reserveData)
        .then((result) => {
          if (result.status === 'ok') {
            const data = {
              audit_user_id: userId,
              audit_action: 'D',
              audit_system_id: reserveId,
              audit_system: 'step0',
              audit_screen: 'ข้อมูลทีมขึ้นสินค้า',
              audit_description: 'ยกเลิกทีมขึ้นสินค้า'
            };
            AddAuditLogs(data);
            updateTeamLoading(teamValue);
            updateTeamData([]);
          } else {
            alert(result['message']['sqlMessage']);
          }
        })
        .then(() => {
          setOpen(false);
        })
        .catch((error) => {
          console.log(error);
        });
      // }
    } else if (flag === 0) {
      setOpen(false);
    }
  };

  const AddAuditLogs = async (data) => {
    await functionAddLogs.AddAuditLog(data);
  };

  const deleteContractorOthers = async (id) => {
    try {
      await adminRequest.deleteContractorOtherByID(id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        {loading && (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
            open={loading}
          >
            <CircularProgress color="primary" />
          </Backdrop>
        )}
        <DialogTitle id="responsive-dialog-title">
          <Typography variant="h5">{'แจ้งเตือน'}</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{notifytext}</DialogContentText>
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
            disabled={reserveData.team_id === null || (permission !== 'manage_everything' && permission !== 'add_edit_delete_data')}
            // onClick={() => deleteDrivers(row.reserve_id)}
            onClick={() => handleClickOpen()}
          >
            <WarningOutlined />
          </Button>
        </span>
      </Tooltip>
    </>
  );
}

export default CancleTeamStation;
