import React, { useEffect, useState } from 'react';

import * as stepRequest from '_api/StepRequest';
import * as adminRequest from '_api/adminRequest';

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
  Chip
} from '../../../../../node_modules/@mui/material/index';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import moment from 'moment-timezone';

function AllStations({ permission }) {
  const [loading, setLoading] = useState(true);
  const [stations, setStations] = useState([]);
  const [stations2, setStations2] = useState([]);
  const [stations3, setStations3] = useState([]);
  const [stationsSpacial, setStationsSpacial] = useState([]);

  useEffect(() => {
    getAllStation();
    getWarehouses();

    // const intervalId = setInterval(() => {
    //   getAllStation();
    // }, 60000); // Polling every 5 seconds

    // return () => clearInterval(intervalId);
  }, [permission]);

  const getAllStation = () => {
    setLoading(true);
    try {
      stepRequest.getAllStations().then((response) => {
        console.log(response);
        const stationGroup1 = response.filter((x) => x.station_group_id === 3 && x.station_id !== 32 && x.station_id !== 33 && x.station_id !== 34 && x.station_id !== 35 && x.station_id !== 36 && x.station_id !== 15 && x.station_id !== 16 && x.station_id !== 17 && x.warehouse_id != 8);

        const stationGroup2 = response.filter((x) => x.station_group_id === 3 && x.warehouse_id === 8);

        const stationGroup3 = response.filter((x) => x.station_group_id === 3 && (x.station_id === 15 || x.station_id === 16 || x.station_id === 17));

        const stationGroup4 = response.filter((x) => x.station_group_id === 3 && (x.station_id === 32 || x.station_id === 33 || x.station_id === 34 || x.station_id === 35 || x.station_id === 36));
        setStations(stationGroup1);
        setStations2(stationGroup2);
        setStations3(stationGroup3);
        setStationsSpacial(stationGroup4);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== Get Warehouses ===============//
  const [warehousesList, setWarehousesList] = useState([]);
  const getWarehouses = () => {
    adminRequest
      .getAllWareHouse()
      .then((result) => {
        setWarehousesList(result);
      })
      .catch((error) => console.log('error', error));
  };

  // =============== Get Stations ===============//
  const styleStation = (status) => {
    let statusColor = '';
    if (status == 'working') {
      statusColor = 'warning';
    } else if (status == 'closed') {
      statusColor = 'error';
    } else {
      statusColor = 'success';
    }
    return statusColor;
  };

  // =============== Open popup ===============//
  const [open, setOpen] = useState(false);
  //   const [wareHouseData, setWareHouseData] = useState([]);
  const [stationsData, setStationsData] = useState({});
  const handleClickOpen = (stations) => {
    setOpen(true);

    const setWareHouse = warehousesList.filter((x) => x.warehouse_id == stations.warehouse_id);
    stations.warehouse_detail = setWareHouse[0];
    setStationsData(stations);
  };
  const handleClose = async (flag) => {
    if (flag == 1) {
      if (stationsData.station_status !== stationStatus && stationStatus) {
        setLoading(true);
        updateStation(stationsData.station_id, stationStatus);
      }
      setOpen(false);
    }
    setStationStatus('');
    setOpen(false);
  };

  // =============== เลือกสถานะ หัวจ่าย ===============//
  const [stationStatus, setStationStatus] = useState('');
  const handleSelectCloseStation = (e) => {
    setStationStatus(e);
  };

  // =============== เลือกสถานะ หัวจ่าย ===============//
  const updateStation = (id, status) => {
    try {
      const data = {
        station_status: status,
        time_update: null
      };

      stepRequest.putStationStatus(id, data).then(() => {
        getAllStation();
        setStationStatus('');
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title" align="center">
          <Typography variant="h5">{'ข้อมูลหัวจ่าย'}</Typography>
        </DialogTitle>
        <DialogContent sx={{ width: 350 }}>
          <Grid container alignItems="center" justifyContent="flex-end" spacing={2}>
            <Grid item xs={12} align="center">
              <Paper variant="outlined" sx={{ p: '8px 16px' }}>
                ( โกดัง :<strong> {stationsData.warehouse_detail?.description}</strong> ) {stationsData.station_description}
              </Paper>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  defaultValue={stationsData.station_status == 'closed' ? 'closed' : 'waiting'}
                  onChange={(e) => handleSelectCloseStation(e.target.value)}
                >
                  <FormControlLabel value="waiting" control={<Radio />} label={<Chip color="success" label="เปิดหัวจ่าย" />} />
                  <FormControlLabel
                    value="closed"
                    disabled={stationsData.station_status == 'working'}
                    control={<Radio />}
                    label={<Chip color="error" label="ปิดหัวจ่าย" />}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions align="center" sx={{ justifyContent: 'center!important' }}>
          <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
            ยกเลิก
          </Button>
          <Button
            color="primary"
            variant="contained"
            disabled={
              stationsData.station_status == 'working' || (permission !== 'manage_everything' && permission !== 'add_edit_delete_data')
            }
            onClick={() => handleClose(1)}
            autoFocus
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
      {loading ? (
        <Grid item xs={12} align="center">
          <CircularProgress />
        </Grid>
      ) : (
        <>
          {stations.length > 0 &&
            stations.map((row, index) => (
              <Grid
                item
                xs={3}
                sm={2}
                md={2}
                lg={1}
                // sx={{ minWidth: { sm: '10%!important', lg: '10%!important' }, maxWidth: { sm: '10%!important', lg: '10%!important' } }}
                align="center"
                key={index}
              >
                {row.time_update && getDateFormat(row.time_update) === moment(new Date()).format('DD/MM/YYYY')
                  ? row.time_update.slice(11, 16)
                  : '--:--'}
                <Paper
                  variant="outlined"
                  sx={{
                    p: '8px 16px',
                    bgcolor: styleStation(row.station_status) + '.main',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      bgcolor: styleStation(row.station_status) + '.light'
                    },
                    '&:active': {
                      bgcolor: styleStation(row.station_status) + '.dark'
                    }
                  }}
                  onClick={() => handleClickOpen(row)}
                >
                  <Stack spacing={0}>
                    <Typography variant="h5" sx={{ fontSize: { sm: '1rem!important', lg: '0.8vw!important' } }}>
                      {row.station_description.length > 4
                        ? `${row.station_description.substring(0, 4)} #${index < 9 ? '0' + (index + 1) : index + 1}`
                        : row.station_description}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          {stations2.length > 0 &&
            stations2.map((row, index) => (
              <Grid
                item
                xs={3}
                sm={2}
                md={2}
                lg={1}
                // sx={{ minWidth: { sm: '10%!important', lg: '10%!important' }, maxWidth: { sm: '10%!important', lg: '10%!important' } }}
                align="center"
                key={index}
              >
                {row.time_update && getDateFormat(row.time_update) === moment(new Date()).format('DD/MM/YYYY')
                  ? row.time_update.slice(11, 16)
                  : '--:--'}
                <Paper
                  variant="outlined"
                  sx={{
                    p: '8px 16px',
                    bgcolor: styleStation(row.station_status) + '.main',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      bgcolor: styleStation(row.station_status) + '.light'
                    },
                    '&:active': {
                      bgcolor: styleStation(row.station_status) + '.dark'
                    }
                  }}
                  onClick={() => handleClickOpen(row)}
                >
                  <Stack spacing={0}>
                    <Typography variant="h5" sx={{ fontSize: { sm: '1rem!important', lg: '0.8vw!important' } }}>
                      {row.station_description.length > 4
                        ? `${row.station_description.substring(0, 4)} #${index < 9 ? (index + 16) : index + 1}`
                        : row.station_description}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          {stations3.length > 0 &&
            stations3.map((row, index) => (
              <Grid
                item
                xs={3}
                sm={2}
                md={2}
                lg={1}
                sx={index === 0 && { ml: '3%' }}
                // sx={{ minWidth: { sm: '10%!important', lg: '10%!important' }, maxWidth: { sm: '10%!important', lg: '10%!important' } }}
                align="center"
                key={index}
              >
                {row.time_update && getDateFormat(row.time_update) === moment(new Date()).format('DD/MM/YYYY')
                  ? row.time_update.slice(11, 16)
                  : '--:--'}
                <Paper
                  variant="outlined"
                  sx={{
                    p: '8px 16px',
                    bgcolor: styleStation(row.station_status) + '.main',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      bgcolor: styleStation(row.station_status) + '.light'
                    },
                    '&:active': {
                      bgcolor: styleStation(row.station_status) + '.dark'
                    }
                  }}
                  onClick={() => handleClickOpen(row)}
                >
                  <Stack spacing={0}>
                    <Typography variant="h5" sx={{ fontSize: { sm: '1rem!important', lg: '0.8vw!important' } }}>
                      {row.station_description.length > 4
                        ? `${row.station_description.substring(0, 4)} #${index < 9 ? (index + 13) : index + 1}`
                        : row.station_description}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          {stationsSpacial.length > 0 &&
            stationsSpacial.map((row, index) => (
              <Grid
                item
                xs={3}
                sm={2}
                md={2}
                lg={1}
                sx={index === 0 && { ml: '3%', minWidth: { sm: '5%!important', lg: '5%!important' }, maxWidth: { sm: '5%!important', lg: '5%!important' } } || { minWidth: { sm: '5%!important', lg: '5%!important' }, maxWidth: { sm: '5%!important', lg: '5%!important' } }}
                align="center"
                key={index}
              >
                {row.time_update && getDateFormat(row.time_update) === moment(new Date()).format('DD/MM/YYYY')
                  ? row.time_update.slice(11, 16)
                  : '--:--'}
                <Paper
                  variant="outlined"
                  sx={{
                    p: '8px 16px',
                    bgcolor: styleStation(row.station_status) + '.main',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      bgcolor: styleStation(row.station_status) + '.light'
                    },
                    '&:active': {
                      bgcolor: styleStation(row.station_status) + '.dark'
                    }
                  }}
                  onClick={() => handleClickOpen(row)}
                >
                  <Stack spacing={0}>
                    <Typography variant="h5" sx={{ fontSize: { sm: '1rem!important', lg: '0.8vw!important' } }}>
                      {row.station_description.length > 4
                        ? `${row.station_description.substring(0, 4)} #${index < 9 ? '0' + (index + 1) : index + 1}`
                        : row.station_description}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
        </>
      )}
    </Grid>
  );
}

export default AllStations;
