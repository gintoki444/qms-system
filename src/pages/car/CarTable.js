import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
import * as carRequest from '_api/carRequest';
import axios from '../../../node_modules/axios/index';

import MUIDataTable from 'mui-datatables';

function CarTable({ permission }) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [car, setCar] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const userRole = useSelector((state) => state.auth?.roles);
  const userId = localStorage.getItem('user_id');

  const [carTypeList, setCarTypeList] = useState([]);
  const getCarType = () => {
    carRequest.getAllCarType().then((response) => {
      setCarTypeList(response);
    });
  };

  // const [provincesList, setProvincesList] = useState([]);
  // const getProvinces = () => {
  //   carRequest.getAllProvinces().then((response) => {
  //     setProvincesList(response);
  //   });
  // };

  const setCarTypeName = (id) => {
    const carType = carTypeList.filter((x) => x.car_type_id == id);
    if (carType.length > 0) return carType[0].car_type_name;
  };

  useEffect(() => {
    // getPermission();
    if (userRole && permission) {
      getCar();
      getCarType();
      // getProvinces();
    }
  }, [userId, userRole, permission]);

  const getCar = async () => {
    setLoading(true);
    try {
      let user_id = '';
      // if (permission !== "manage_everything") {
      //   user_id = userId;
      // }
      carRequest.getAllCars(user_id).then((response) => {
        const newData = response.map((item, index) => {
          return {
            ...item,
            No: index + 1
          };
        });
        setCar(newData);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateCar = (id) => {
    navigate('/car/update/' + id);
  };

  const addCar = () => {
    navigate('/car/add');
  };

  const deleteCar = (id) => {
    setLoading(true);
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: apiUrl + '/deletecar/' + id,
      headers: {}
    };

    axios
      .request(config)
      .then((result) => {
        if (result.data.status === 'ok') {
          enqueueSnackbar('ลบข้อมูลรถบรรทุกสำเร็จ!', { variant: 'success' });
          getCar();
        } else {
          setLoading(false);
          enqueueSnackbar('ลบข้อมูลรถบรรทุกไม่สำเร็จ! เนื่องจากมีการใช้งานอยู่!', { variant: 'error' });
          // alert(result.data['message']['sqlMessage']);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
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
            <Button size="mediam" color="success" variant="outlined" onClick={() => addCar()} startIcon={<PlusCircleOutlined />}>
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
      name: 'registration_no',
      label: 'ทะเบียนรถ'
    },
    // {
    //   name: 'province_id',
    //   label: 'จังหวัด',
    //   options: {
    //     customBodyRender: (value) => (
    //       <Typography variant="body">{value ? provincesList.find((x) => x.province_id == value)?.name_th : '-'}</Typography>
    //     )
    //     // setC.;ellProps: () => ({ style: { color: 'red', textAlign: 'center' } }),
    //     // setCellHeaderProps: () => ({ style: { color: 'red', textAlign: 'center' } })
    //   }
    // },
    {
      name: 'car_type_id',
      label: 'ประเภทรถ',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? setCarTypeName(value) : '-'}</Typography>
      }
    },
    {
      name: 'car_id',
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
                onClick={() => updateCar(value)}
              >
                <EditOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="ลบ">
              <Button
                variant="contained"
                size="medium"
                color="error"
                disabled={permission !== 'manage_everything'}
                sx={{ minWidth: '33px!important', p: '6px 0px' }}
                onClick={() => handleClickOpen(value)}
              >
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </ButtonGroup>
        ),

        setCellHeaderProps: () => ({
          style: { textAlign: 'center', display: permission !== 'manage_everything' && permission !== 'add_edit_delete_data' && 'none' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'center' }
        })
      }
    }
  ];

  // HadleClick Popup
  const [car_id, setCompany_id] = useState('');
  const [textnotify, setText] = useState('');

  const handleClickOpen = (car_id) => {
    setCompany_id(car_id);
    setText('ลบข้อมูลรถบรรทุก');
    setOpen(true);
  };

  const handleClose = (flag) => {
    if (flag === 1) {
      setLoading(true);
      setOpen(false);

      deleteCar(car_id);
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
      <MUIDataTable title={<Typography variant="h5">ข้อมูลรถ</Typography>} data={car} columns={columns} options={options} />
    </Box>
  );
}

export default CarTable;
