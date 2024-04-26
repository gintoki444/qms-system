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
  CircularProgress
} from '@mui/material';

import axios from '../../../node_modules/axios/index';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
import * as driverRequest from '_api/driverRequest';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'driver_No',
    align: 'center',
    width: '5%',
    disablePadding: false,
    label: 'ลำดับ'
  },
  {
    id: 'fullName',
    align: 'left',
    disablePadding: true,
    label: 'ชื่อ-นามสกุล'
  },
  {
    id: 'mobile_no',
    align: 'left',
    disablePadding: false,
    label: 'เบอร์โทร'
  },
  {
    id: 'id_no',
    align: 'left',
    disablePadding: false,
    label: 'เลขที่บัตรประชาชน'
  },
  // {
  //   id: 'license_no',
  //   align: 'left',
  //   disablePadding: false,
  //   label: 'เลขที่ใบขับขี่'
  // },
  {
    id: 'action',
    align: 'center',
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

function DriverTable() {
  const [open, setOpen] = useState(false);
  const [driver, setDriver] = useState([]);

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    getDrivers();
  }, []);

  const getDrivers = () => {
    setOpen(true);
    try {
      driverRequest.getAllDriver(userId).then((response) => {
        setOpen(false);
        setDriver(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
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
          alert(result.data.message);
          getDrivers();
        } else {
          alert(result.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
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
          <CompantTableHead company={driver} companyBy={driver} />

          {!open ? (
            <TableBody>
              {driver.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{row.firstname + ' ' + row.lastname}</TableCell>
                    <TableCell align="left">{row.mobile_no}</TableCell>
                    <TableCell align="left">{row.id_card_no}</TableCell>
                    {/* <TableCell align="left">{row.license_no}</TableCell> */}
                    <TableCell align="center">
                      <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Tooltip title="แก้ไข">
                          <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            onClick={() => updateDrivers(row.driver_id)}
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
                            onClick={() => deleteDrivers(row.driver_id)}
                          >
                            <DeleteOutlined />
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                );
              })}
              {driver.length == 0 && (
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
                <TableCell colSpan={5} align="center">
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

export default DriverTable;
