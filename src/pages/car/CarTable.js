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

function CarTable() {
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

  const [provincesList, setProvincesList] = useState([]);
  const getProvinces = () => {
    carRequest.getAllProvinces().then((response) => {
      setProvincesList(response);
    });
  };

  const setCarTypeName = (id) => {
    const carType = carTypeList.filter((x) => x.car_type_id == id);
    if (carType.length > 0) return carType[0].car_type_name;
  };

  useEffect(() => {
    // getPermission();
    getCar();
    getCarType();
    getProvinces();
  }, [userId]);

  const getCar = async () => {
    setLoading(true);
    try {
      carRequest.getAllCars(userId).then((response) => {
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
          {userRole && userRole !== 5 && (
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
    {
      name: 'province_id',
      label: 'จังหวัด',
      options: {
        customBodyRender: (value) => (
          <Typography variant="body">{value ? provincesList.find((x) => x.province_id == value)?.name_th : '-'}</Typography>
        )
        // setC.;ellProps: () => ({ style: { color: 'red', textAlign: 'center' } }),
        // setCellHeaderProps: () => ({ style: { color: 'red', textAlign: 'center' } })
      }
    },
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
      {/* <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          size="small"
          sx={{
            '& .MuiTableCell-root:first-of-type': {
              pl: 2
            },
            '& .MuiTableCell-root:last-of-type': {
              pr: 3
            }
          }}
        >
          <CompantTableHead car={car} carBy={car} />
          {!open ? (
            <TableBody>
              {car.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{row.registration_no}</TableCell>
                    <TableCell align="left">{row.province_id ? row.name_th : '-'}</TableCell>
                    <TableCell align="left">{row.car_type_id ? setCarTypeName(row.car_type_id) : '-'}</TableCell>
                    <TableCell align="center">
                      <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Tooltip title="แก้ไข">
                          <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            onClick={() => updateCar(row.car_id)}
                          >
                            <EditOutlined />
                          </Button>
                        </Tooltip>
                        <Tooltip title="ลบ">
                          <Button
                            variant="contained"
                            size="medium"
                            color="error"
                            sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            onClick={() => deleteCar(row.car_id)}
                          >
                            <DeleteOutlined />
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                );
              })}
              {car.length == 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                  <Typography variant="body1">Loading....</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer> */}
    </Box>
  );
}

export default CarTable;
