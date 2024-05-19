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
    label: 'ชื่อ-นามสกุล'
  },
  {
    id: 'contact_info',
    align: 'left',
    disablePadding: false,
    label: 'ข้อมูลติดต่อ'
  },
  // {
  //   id: 'warehouse_id',
  //   align: 'left',
  //   disablePadding: false,
  //   label: 'โกดัง'
  // },
  {
    id: 'department',
    align: 'left',
    disablePadding: false,
    label: 'แผนก'
  },
  {
    id: 'stetus',
    align: 'center',
    disablePadding: false,
    label: 'สถานะ'
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

function WareHouseTable({ permission }) {
  //   const [car, setCar] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wareHouseList, setWareHouseList] = useState([]);

  useEffect(() => {
    // getPermission();
    getManager();
  }, [permission]);

  const getManager = async () => {
    setLoading(true);
    try {
      adminRequest.getAllManager().then((response) => {
        setWareHouseList(response);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
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
      setOpen(false);
    } else if (flag === 0) {
      setOpen(false);
    }
  };

  const deteteManager = (id) => {
    try {
      adminRequest.deleteManagerWareHouse(id).then(() => {
        getManager();
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
              {wareHouseList.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{row.manager_name}</TableCell>
                    <TableCell align="left">{row.contact_info}</TableCell>
                    {/* <TableCell align="left">{row.description}</TableCell> */}
                    <TableCell align="left">{row.department}</TableCell>
                    <TableCell align="center">
                      {row.status == 'A' ? (
                        <Typography color="success" variant="body1" sx={{ color: 'green' }}>
                          <strong>ใช้งาน</strong>
                        </Typography>
                      ) : (
                        <Typography variant="body1" color="error">
                          <strong>ไม่ใช้งาน</strong>
                        </Typography>
                      )}
                    </TableCell>
                    {/* {permission.length > 0 &&  */}
                    <TableCell align="center">
                      <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Tooltip title="แก้ไข">
                          <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
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
                            disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
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
              {wareHouseList.length == 0 && (
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

export default WareHouseTable;
