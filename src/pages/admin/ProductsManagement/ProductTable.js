import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Box,
  ButtonGroup,
  Button,
  Tooltip,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Link api url
import * as adminRequest from '_api/adminRequest';
import moment from 'moment/min/moment-with-locales';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'wareHouseNo',
    align: 'center',
    width: '5%',
    disablePadding: false,
    label: 'ลำดับ'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'บริษัท'
  },
  {
    id: 'contact_info',
    align: 'left',
    disablePadding: false,
    label: 'สินค้า'
  },
  {
    id: 'warehouse_id',
    align: 'left',
    disablePadding: false,
    label: 'ทะเบียน'
  },
  {
    id: 'department',
    align: 'left',
    disablePadding: false,
    label: 'วันที่ตั้งกอง'
  },
  {
    id: 'stetus',
    align: 'left',
    disablePadding: false,
    label: 'อายุกอง'
  },
  {
    id: 'stetus',
    align: 'left',
    disablePadding: false,
    label: 'ตรา'
  },
  {
    id: 'stetus',
    align: 'left',
    disablePadding: false,
    label: 'โกดัง'
  },
  {
    id: 'stetus',
    align: 'right',
    disablePadding: false,
    label: 'ยอดยกมา'
  },
  {
    id: 'action',
    align: 'right',
    width: '10%',
    disablePadding: false,
    label: 'Actions'
  }
];

function CompantTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'} width={headCell.width}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function ProductTable() {
  //   const [car, setCar] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // getPermission();
    getWareHouseManager();
  }, []);

  const [productList, setProductList] = useState([]);
  const getWareHouseManager = async () => {
    setLoading(true);
    try {
      adminRequest.getAllProductRegister().then((response) => {
        setProductList(response);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== Get calculateAge จำนวนวัน  ===============//
  const calculateAge = (registrationDate) => {
    if (!registrationDate) return '-';

    const currentDate = moment(new Date()).format('YYYY-MM-DD');
    const regDate = moment(registrationDate).format('YYYY-MM-DD');
    // const regDate = new Date(registrationDate);

    const years = moment(currentDate).diff(regDate, 'years');
    const months = moment(currentDate).diff(regDate, 'months') % 12;
    const days = moment(currentDate).diff(regDate, 'days') % 30;

    let result = '';

    if (years !== 0) {
      result = `${years} ปี ${months} เดือน ${days} วัน`;
    } else {
      if (months !== 0) {
        result = `${months} เดือน ${days} วัน`;
      } else {
        result = `${days} วัน`;
      }
    }

    return result;
    //return `${years} ปี ${months} เดือน ${days} วัน`;
  };

  // ลบข้อมูล Manager
  const [manager_id, setManager_id] = useState(false);
  const [textnotify, setText] = useState('');

  const handleClickOpen = (manager_id) => {
    setManager_id(manager_id);
    setText('ลบข้อมูล');
    setOpen(true);
  };

  const handleClose = (flag) => {
    if (flag === 1) {
      setLoading(true);
      deteteManager(manager_id);
    }
    setOpen(false);
  };

  const deteteManager = (id) => {
    try {
      adminRequest.deleteManagerWareHouse(id).then(() => {
        getWareHouseManager();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  const updateWareHouse = (id) => {
    navigate('/admin/warehouse/update/' + id);
  };

  //   const deleteCar = (id) => {
  //     let config = {
  //       method: 'delete',
  //       maxBodyLength: Infinity,
  //       url: apiUrl + '/deletecar/' + id,
  //       headers: {}
  //     };

  //     axios
  //       .request(config)
  //       .then((result) => {
  //         if (result.data.status === 'ok') {
  //           alert(result.data.message);
  //           getCar();
  //         } else {
  //           alert(result.data['message']['sqlMessage']);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };
  return (
    <Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title" style={{ fontFamily: 'kanit' }}>
          {'แจ้งเตือน'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontFamily: 'kanit' }}>ต้องการ {textnotify} หรือไม่?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleClose(0)} style={{ fontFamily: 'kanit' }}>
            ยกเลิก
          </Button>
          <Button onClick={() => handleClose(1)} autoFocus style={{ fontFamily: 'kanit' }}>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer
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
          <CompantTableHead />
          {!loading ? (
            <TableBody>
              {productList.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{row.product_company_name_th}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.product_register_name}</TableCell>
                    <TableCell align="left">
                      {row.product_register_date ? moment(row.product_register_date).format('DD/MM/YYYY') : '-'}
                    </TableCell>
                    <TableCell align="left">{row.product_register_date ? calculateAge(row.product_register_date) : '-'}</TableCell>
                    <TableCell align="left">{row.product_brand_name}</TableCell>
                    <TableCell align="left">{row.warehouse_name}</TableCell>
                    <TableCell align="right">{row.register_beginning_balance}</TableCell>
                    {/* {permission.length > 0 &&  */}
                    <TableCell align="center">
                      <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Tooltip title="แก้ไข">
                          <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            onClick={() => updateWareHouse(row.manager_id)}
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
                            onClick={() => handleClickOpen(row.manager_id)}
                          >
                            <DeleteOutlined />
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
                    </TableCell>
                    {/* } */}
                  </TableRow>
                );
              })}
              {productList.length == 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                  <Typography variant="body1">Loading....</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ProductTable;
