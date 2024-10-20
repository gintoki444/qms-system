import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import moment from 'moment';

// material-ui
import {
  Chip,
  Paper,
  Button,
  Grid,
  Tooltip,
  // Typography,
  Dialog,
  DialogActions,
  DialogContent,
  // DialogContentText,
  DialogTitle,
  CircularProgress
  // Backdrop
} from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import * as queueRequest from '_api/queueReques';
import {
  EditOutlined
  // DeleteOutlined,
  // DiffOutlined,
  // ProfileOutlined
  // , WarningOutlined
} from '@ant-design/icons';

function ResetStepButton({ data, stepId }) {
  const stepList = [
    {
      id: 'step1',
      detail: 'ชั่งเบา'
    },
    {
      id: 'step2',
      detail: 'ขึ้นสินค้า'
    },
    {
      id: 'step3',
      detail: 'ชั่งหนัก'
    },
    {
      id: 'step4',
      detail: 'เสร็จสิ้น'
    }
  ];
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stationStatus, setStationStatus] = useState('');

  useEffect(() => {}, [stationStatus]);

  const [stepLists, setStepLists] = useState(false);
  const getAllStepByQueue = async (id, step) => {
    try {
      queueRequest.getAllStepById(id).then((response) => {
        console.log('getStepByQueueId :', response);
        const matchingData = response.find((x) => x.remark.includes(step));
        // const status = matchingData?.status;
        // if (!matchingData?.status) {
        //   matchingData.status = 'none';
        // }
        console.log('matchingData :', matchingData);
        console.log('matchingData.status :', matchingData?.status);
        setStepLists(matchingData);
        setStationStatus(matchingData.status);
        setLoading(false);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const [textnotify, setTextnotify] = useState('');
  const handleClickOpen = async (queue_id, onClick, step) => {
    console.log('queue_id :', queue_id);
    console.log('onClick :', onClick);
    console.log('step :', stepList.find((x) => x.id === step)?.detail);
    setTextnotify(stepList.find((x) => x.id === step)?.detail);
    setLoading(true);
    await getAllStepByQueue(queue_id, stepList.find((x) => x.id === step)?.detail);
    // if (onClick === 'delete') {
    //   if (step1_status === 'processing' || step1_status === 'completed') {
    //     alert('คิวนี้ถูกเรียกแล้ว! ไม่สามารถลบข้อมูลนี้ได้');
    //     return;
    //   }
    //   setReserve_id(reserve_id);
    //   setText('ลบข้อมูล');
    //   setDel(queue_id);
    // } else if (onClick === 'reset') {
    //   setText('รีเซตสถานะ');
    //   // setQueueData(queueData);
    // }
    // setOnClick(onClick);
    setOpen(true);
  };

  // const [onclickSubmit, setOnClickSubmit] = useState(false);
  const handleClose = (flag) => {
    if (flag === 1) {
      console.log(stepLists);
      // setOnClickSubmit(true);
      // setLoading(true);

      // deteteQueue(id_del);
      // //update = waiting การจองเมื่อลบคิว queue
      // updateReserveStatus(reserve_id);
      setOpen(false);
    } else {
      setStepLists({});
      setStationStatus('');
      setOpen(false);
    }
  };

  const handleSelectCloseStation = (e) => {
    console.log('stationStatus :', stationStatus);
    setStationStatus(e);
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title" style={{ fontFamily: 'kanit', textAlign: 'center' }}>
          แก้ไขข้อมูล {'" ' + textnotify + ' "'}
        </DialogTitle>
        <DialogContent
        //  sx={{ width: 350 }}
        >
          <Grid container alignItems="center" justifyContent="flex-end" spacing={2}>
            <Grid item xs={12} align="center">
              <Paper variant="outlined" sx={{ p: '8px 16px' }}>
                {/* ( โกดัง :<strong> {stationsData.warehouse_detail?.description}</strong> ) {stationsData.station_description} */}
                <FormControl>
                  {stationStatus}
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    defaultValue={'completed'}
                    // defaultValue={stepLists.status === 'completed' ? 'completed' : stepLists.status === 'waiting' ? 'waiting' : 'none'}
                    onChange={(e) => handleSelectCloseStation(e.target.value)}
                  >
                    <FormControlLabel
                      value="none"
                      // disabled={stationsData?.station_status == 'none'}
                      control={<Radio />}
                      label={<Chip color="secondary" label="ล้างสถานะ" />}
                    />
                    <FormControlLabel
                      value="waiting"
                      // disabled={stationsData?.station_status == 'waiting'}
                      control={<Radio />}
                      label={<Chip color="secondary" label="รอเรียกคิว" />}
                    />
                    <FormControlLabel
                      value="completed"
                      // disabled={stationsData?.station_status == 'completed'}
                      control={<Radio />}
                      label={<Chip color="success" label="สำเร็จ" />}
                    />
                  </RadioGroup>
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions align="center" sx={{ justifyContent: 'center!important', p: 2 }}>
          {loading == true ? (
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
      <Tooltip title="รีเซต">
        <span>
          <Button
            sx={{ minWidth: '33px!important', p: '6px 0px' }}
            variant="contained"
            size="medium"
            color="info"
            onClick={() => handleClickOpen(data.queue_id, 'reset', stepId)}
          >
            <EditOutlined />
          </Button>
        </span>
      </Tooltip>
    </>
  );
}

export default ResetStepButton;
