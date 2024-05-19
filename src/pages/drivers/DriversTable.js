import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import {
  Box,
  ButtonGroup,
  Button,
  Tooltip,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Backdrop,
  CircularProgress
} from '@mui/material';

import axios from '../../../node_modules/axios/index';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
import * as driverRequest from '_api/driverRequest';
import MUIDataTable from 'mui-datatables';

function DriverTable({ permission }) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [driver, setDriver] = useState([]);

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    getDrivers();
  }, [permission]);

  const getDrivers = () => {
    setLoading(true);
    try {
      driverRequest.getAllDriver(userId).then((response) => {
        setLoading(false);
        const newData = response.map((item, index) => {
          return {
            ...item,
            No: index + 1,
            fullName: item.firstname + ' ' + item.lastname
          };
        });
        setDriver(newData);
      });
    } catch (error) {
      console.log(error);
    }
  };
  // =============== Get Company DataTable ===============//
  const options = {
    viewColumns: false,
    print: false,
    download: false,
    selectableRows: 'none',
    elevation: 0,
    rowsPerPage: 25,
    responsive: 'standard',
    sort: false,
    rowsPerPageOptions: [25, 50, 75, 100],
    customToolbar: () => {
      return (
        <>
          {permission && (permission === 'manage_everything' || permission === 'add_edit_delete_data') && (
            <Button size="mediam" color="success" variant="outlined" onClick={() => addDrivers()} startIcon={<PlusCircleOutlined />}>
              เพิ่มข้อมูล
            </Button>
          )}
        </>
      );
    }
  };

  const columns = [
    {
      name: 'No',
      label: 'ลำดับ',
      options: {
        setCellHeaderProps: () => ({
          style: { textAlign: 'center' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'center' }
        })
      }
    },
    {
      // + 'lastname'
      name: 'fullName',
      label: 'ชื่อ-นามสกุล'
    },
    {
      name: 'mobile_no',
      label: 'เบอร์โทร',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
        // setCellProps: () => ({ style: { color: 'red', textAlign: 'center' } }),
        // setCellHeaderProps: () => ({ style: { color: 'red', textAlign: 'center' } })
      }
    },
    {
      name: 'id_card_no',
      label: 'เลขที่บัตรประชาชน',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'driver_id',
      label: 'Actions',
      options: {
        customBodyRender: (value) => (
          <ButtonGroup variant="contained" aria-label="Basic button group">
            <Tooltip title="แก้ไข">
              <Button
                variant="contained"
                size="medium"
                color="primary"
                disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                sx={{ minWidth: '33px!important', p: '6px 0px' }}
                onClick={() => updateDrivers(value)}
              >
                <EditOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="ลบ">
              <Button
                variant="contained"
                size="medium"
                color="error"
                disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                sx={{ minWidth: '33px!important', p: '6px 0px' }}
                onClick={() => handleClickOpen(value)}
              >
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </ButtonGroup>
        ),

        setCellHeaderProps: () => ({
          style: { textAlign: 'center' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'center' }
        })
      }
    }
  ];

  const navigate = useNavigate();
  const addDrivers = () => {
    navigate('/drivers/add');
  };

  const updateDrivers = (id) => {
    navigate('/drivers/update/' + id);
  };

  const deleteDrivers = (id) => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: apiUrl + '/deletedriver/' + id,
      headers: {}
    };

    console.log(config.url);

    axios
      .request(config)
      .then((result) => {
        console.log(result);
        if (result.data.status === 'ok') {
          enqueueSnackbar('ลบข้อมูลคนขับรถสำเร็จ!', { variant: 'success' });
          getDrivers();
        } else {
          setLoading(false);
          enqueueSnackbar('ลบข้อมูลคนขับรถไม่สำเร็จ เนื่องจากมีการใช้งานอยู่!', { variant: 'error' });
          // alert(result.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // HadleClick Popup
  const [driver_id, setCompany_id] = useState('');
  const [textnotify, setText] = useState('');

  const handleClickOpen = (driver_id) => {
    setCompany_id(driver_id);
    setText('ลบข้อมูลคนขับรถ');
    setOpen(true);
  };

  const handleClose = (flag) => {
    if (flag === 1) {
      setLoading(true);
      setOpen(false);

      deleteDrivers(driver_id);
    } else if (flag === 0) {
      setOpen(false);
    }
  };
  return (
    <Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title" style={{ fontFamily: 'kanit' }} align="center">
          {'แจ้งเตือน'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontFamily: 'kanit' }}>
            ต้องการ{' '}
            <strong>
              <span style={{ color: '#000' }}>{textnotify}</span>
            </strong>{' '}
            หรือไม่?
          </DialogContentText>
        </DialogContent>

        <DialogActions align="center" sx={{ justifyContent: 'center!important', p: 2 }}>
          <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
            ยกเลิก
          </Button>
          <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
            ยืนยัน
          </Button>
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
      <MUIDataTable title={<Typography variant="h5">ข้อมูลคนขับรถ</Typography>} data={driver} columns={columns} options={options} />
    </Box>
  );
}

export default DriverTable;
