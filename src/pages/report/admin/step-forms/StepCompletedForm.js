// import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
// import { styled } from '@mui/material/styles';

// import { Link as RouterLink } from 'react-router-dom';
// const apiUrl = process.env.REACT_APP_API_URL;

import * as reportRequest from '_api/reportRequest';

// material-ui
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
  Chip
  // , Chip
} from '@mui/material';

// import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

import moment from 'moment';
import 'moment-timezone';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'date-close',
    align: 'center',
    disablePadding: false,
    label: 'วันที่ปิดงาน'
  },
  {
    id: 'queue',
    align: 'center',
    disablePadding: true,
    label: 'หมายเลขคิว'
  },
  {
    id: 'station',
    align: 'left',
    disablePadding: true,
    label: 'สถานี'
  },
  {
    id: 'registration_no',
    align: 'left',
    disablePadding: false,
    label: 'ทะเบียนรถ'
  },
  {
    id: 'company',
    align: 'left',
    disablePadding: false,
    label: 'บริษัท/ร้านค้า'
  },
  {
    id: 'driveName',
    align: 'left',
    disablePadding: false,
    label: 'ชื่อผู้ขับ'
  },
  {
    id: 'tel',
    align: 'left',
    disablePadding: false,
    label: 'เบอร์โทร'
  },
  {
    id: 'time-in',
    align: 'center',
    disablePadding: false,
    label: 'เวลาเริ่ม'
  },
  {
    id: 'time-out',
    align: 'center',
    disablePadding: false,
    label: 'เวลาเสร็จ'
  },
  {
    id: 'time',
    align: 'center',
    disablePadding: false,
    label: 'เวลาที่ใช้'
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: false,
    label: 'สถานะ'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            // sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// OrderTableHead.propTypes = {
//   order: PropTypes.string,
//   orderBy: PropTypes.string
// };

function StepCompletedForm({ stepId, startDate, endDate }) {
  //   const [order] = useState('asc');
  //   const [orderBy] = useState('trackingNo');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [stepId, startDate, endDate]);

  const [items, setItems] = useState([]);
  const fetchData = async () => {
    setLoading(true);
    getStepCompleted();
  };

  const getStepCompleted = () => {
    try {
      reportRequest.getStepCompleted(stepId, startDate, endDate).then((response) => {
        if (response.length > 0) {
          setItems(response);
          getStepCompletedAvg();
        } else {
          setItems([]);
          setLoading(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [avgStep, setAvgStep] = useState([]);
  const getStepCompletedAvg = () => {
    try {
      reportRequest.getAvgStepCompleted(stepId, startDate, endDate).then((response) => {
        if (response.length > 0) {
          response.map((data) => {
            setAvgStep(data);
          });
          setLoading(false);
        } else {
          setAvgStep([]);
          setLoading(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Box sx={{ p: '16px 24px!important' }}>
        <Grid alignItems="center" justifyContent="space-between">
          <Grid container rowSpacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5">จำนวนรายการ: {avgStep.count_step ? avgStep.count_step : '-'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">
                รวมเวลาที่ใช้ทั้งหมด (นาที): {avgStep.sum_elapsed_time ? parseFloat(avgStep.sum_elapsed_time / 60).toFixed(2) : '-'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">
                ค่าเฉลี่ยเวลาที่ใช้ (นาที): {avgStep.average_elapsed_time ? parseFloat(avgStep.average_elapsed_time / 60).toFixed(2) : '-'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
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
          <OrderTableHead
          //    order={order} orderBy={orderBy}
          />
          {!loading ? (
            <TableBody>
              {items.length > 0 &&
                items.map((row, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center">
                      <div style={{ backgroundColor: 'lightBlue', borderRadius: '10px', padding: '7px' }}>
                        {moment(row.end_time).format('DD/MM/yyyy')}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div style={{ backgroundColor: 'lightBlue', borderRadius: '10px', padding: '7px' }}>{row.token}</div>
                    </TableCell>
                    <TableCell align="left">
                      <div style={{ backgroundColor: 'lightBlue', borderRadius: '10px', padding: '7px', fontFamily: 'kanit' }}>
                        {row.station_description}
                      </div>
                    </TableCell>
                    <TableCell align="left">{row.registration_no}</TableCell>
                    <TableCell align="left">{row.company_name}</TableCell>
                    <TableCell align="left">{row.driver_name}</TableCell>
                    <TableCell align="left">{row.driver_mobile}</TableCell>
                    <TableCell align="center">{row.start_time ? row.start_time.slice(11, 19) : '-'}</TableCell>
                    <TableCell align="center">{row.end_time ? row.end_time.slice(11, 19) : '-'}</TableCell>
                    <TableCell align="center">{row.elapsed_time ? row.elapsed_time : '-'}</TableCell>
                    <TableCell align="center">
                      <Chip color={'success'} label={'สำเร็จ'} sx={{ minWidth: '78.7px!important' }} />
                      {/* 
             <div style={{ backgroundColor: getColor(row.status), borderRadius: '10px', padding:'7px'}}>
                 {row.status}
               </div>
             */}
                    </TableCell>
                  </TableRow>
                ))}

              {items.length == 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              )}
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

export default StepCompletedForm;
