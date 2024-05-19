import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Box, Button, Typography, CircularProgress } from '@mui/material';

import {
  EditOutlined
  // DeleteOutlined
} from '@ant-design/icons';

// Get api

import * as getuser from '_api/userRequest';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'user_No',
    align: 'left',
    disablePadding: false,
    label: 'ID.'
  },
  {
    id: 'avatar',
    align: 'left',
    disablePadding: true,
    label: 'รูปภาพ'
  },
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

  useEffect(() => {
    getDrivers();
  }, [permission]);

  const getDrivers = () => {
    setLoading(true);
    getuser.getAlluser().then((result) => {
      if (result) setUser(result);
      setLoading(false);
    });
  };

  const navigate = useNavigate();
  const updateDrivers = (id) => {
    navigate('/admin/users/update/' + id);
  };

  // const deleteDrivers = (id) => {
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
  // };
  return (
    <Box>
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
                    <TableCell align="left">{row.avatar}</TableCell>
                    <TableCell align="left">{row.firstname + ' ' + row.lastname}</TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="left">{row.role ? row.role : '-'}</TableCell>
                    <TableCell align="center" sx={{ '& button': { m: 1 } }}>
                      <Button
                        variant="contained"
                        disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                        sx={{ minWidth: '33px!important', p: '6px 0px' }}
                        size="medium"
                        color="primary"
                        onClick={() => updateDrivers(row.user_id)}
                      >
                        <EditOutlined />
                      </Button>
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
