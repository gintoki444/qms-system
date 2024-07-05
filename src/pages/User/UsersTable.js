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
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Backdrop,
  Tooltip,
  ButtonGroup
} from '@mui/material';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Get api

import * as userRequest from '_api/userRequest';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'user_No',
    align: 'left',
    disablePadding: false,
    label: 'ID.'
  },
  // {
  //   id: 'avatar',
  //   align: 'left',
  //   disablePadding: true,
  //   label: 'รูปภาพ'
  // },
  {
    id: 'fullName',
    align: 'left',
    disablePadding: true,
    label: 'ชื่อ-นามสกุล'
  },
  {
    id: 'email',
    align: 'left',
    disablePadding: false,
    label: 'อีเมล'
  },
  {
    id: 'role',
    align: 'left',
    disablePadding: false,
    label: 'Role'
  },
  {
    id: 'action',
    align: 'center',
    disablePadding: false,
    label: 'Actions'
  }
];

function CompantTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function UsersTable({ permission }) {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  useEffect(() => {
    getUsers();
  }, [permission]);

  const getUsers = () => {
    setLoading(true);
    userRequest.getAlluser().then((result) => {
      // console.log(result)
      if (result) setUser(result);
      setLoading(false);
    });
  };

  const navigate = useNavigate();
  const updateDrivers = (id) => {
    navigate('/admin/users/update/' + id);
  };

  const deleteUsers = (id) => {
    try {
      userRequest.deleteUserRoles(id).then((response) => {
        if (response.status === 'ok') {
          userRequest.deleteUser(id).then((result) => {
            // console.log(result);
            if (result.status === 'ok') {
              // alert(result.message);
              getUsers();
            } else {
              setLoading(false);
              alert(result.message);
            }
          });
        } else {
          setLoading(false);
          alert(result.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
    //   let config = {
    //     method: 'delete',
    //     maxBodyLength: Infinity,
    //     url: apiUrl + '/deleteuser/' + id,
    //     headers: {}
    //   };

    //   console.log(config.url);

    //   axios
    //     .request(config)
    //     .then((result) => {
    //       console.log(result);
    //       if (result.data.status === 'ok') {
    //         alert(result.data.message);
    //         getDrivers();
    //       } else {
    //         alert(result.data.message);
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
  };


  const [user_id, setUser_id] = useState('');
  const [textnotify, setText] = useState('');

  const handleClickOpen = (user_id) => {
    setUser_id(user_id);
    setText('ลบข้อมูลผู้ใช้งาน');
    setOpen(true);
  };

  const handleClose = (flag) => {
    if (flag === 1) {
      setLoading(true);
      setOpen(false);

      deleteUsers(user_id);
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
              {user.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="left">{row.user_id}</TableCell>
                    {/* <TableCell align="left">{row.avatar}</TableCell> */}
                    <TableCell align="left">{row.firstname + ' ' + row.lastname}</TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="left">{row.role ? row.role : '-'}</TableCell>
                    <TableCell align="center">

                      <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Tooltip title="แก้ไข">
                          <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                            sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            onClick={() => updateDrivers(row.user_id)}
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
                            onClick={() => handleClickOpen(row.user_id)}
                          >
                            <DeleteOutlined />
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
                      {/* <Button
                        variant="contained"
                        disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                        sx={{ minWidth: '33px!important', p: '6px 0px' }}
                        size="medium"
                        color="primary"
                        onClick={() => updateDrivers(row.user_id)}
                      >
                        <EditOutlined />
                      </Button> */}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={13} align="center">
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

export default UsersTable;
