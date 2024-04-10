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

import moment from 'moment';

function AllStations() {
  const [loading, setLoading] = useState(true);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    getAllStation();
    getWarehouses();
  }, []);

  const getAllStation = () => {
    setLoading(true);
    try {
      stepRequest.getAllStations().then((response) => {
        setStations(response.filter((x) => x.station_group_id == 3));
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
            disabled={stationsData.station_status == 'working'}
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
              <Grid item xs={6} md={2} lg={1} sx={{ minWidth: '10%!important' }} align="center" key={index}>
                {row.time_update && moment(row.time_update).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY')
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
                      bgcolor:  styleStation(row.station_status) + '.dark'
                    }
                  }}
                  onClick={() => handleClickOpen(row)}
                >
                  <Stack spacing={0}>
                    <Typography variant="h5">
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
