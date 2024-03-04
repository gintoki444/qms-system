import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
// import { styled } from '@mui/material/styles';

// import { Link as RouterLink } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;

// material-ui
import {
  Box,
  // Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography
  // , Chip
} from '@mui/material';

import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

import moment from 'moment';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'NO.',
    align: 'center',
    disablePadding: false,
    label: 'ลำดับ'
  },
  {
    id: 'times',
    align: 'left',
    disablePadding: false,
    label: 'วันที่'
  },
  {
    id: 'queue',
    align: 'center',
    disablePadding: true,
    label: 'คิวที่'
  },
  {
    id: 'queueNum',
    align: 'left',
    disablePadding: true,
    label: 'หมายเลขคิว'
  },
  {
    id: 'timeIn',
    align: 'left',
    disablePadding: true,
    label: 'เวลาเข้า'
  },
  {
    id: 'timeOut',
    align: 'left',
    disablePadding: true,
    label: 'เวลาออก'
  },
  {
    id: 'company',
    align: 'left',
    disablePadding: false,
    label: 'ชื่อร้าน'
  },
  {
    id: 'registration_no',
    align: 'left',
    disablePadding: false,
    label: 'ทะเบียนรถ'
  },
  {
    id: 'tel',
    align: 'left',
    disablePadding: false,
    label: 'เบอร์โทร'
  },
  {
    id: 'driveName',
    align: 'left',
    disablePadding: false,
    label: 'ชื่อผู้ขับ'
  },
  {
    id: 'checking1',
    align: 'center',
    disablePadding: false,
    label: 'คลุมผ้าใบ(ตัวแม่)'
  },
  {
    id: 'checking2',
    align: 'center',
    disablePadding: false,
    label: 'คลุมผ้าใบ(ตัวลูก)'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string
};

export default function CarsTimeInOutTable({ startDate, endDate }) {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [loading, setLoading] = useState(true);
  // const [selected] = useState([]);
  //   const currentDate = moment(new Date()).format('YYYY-MM-DD');

  // const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  // ฟังก์ชันที่ใช้ในการเพิ่ม 0 ถ้าจำนวนน้อยกว่า 10
  const padZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };
  useEffect(() => {
    fetchData();

    // const intervalId = setInterval(fetchData, 6000); // เรียกใช้ฟังก์ชันทุก 1 นาที (60000 มิลลิวินาที)

    // return () => clearInterval(intervalId); // ลบตัวจับเวลาเมื่อคอมโพเนนต์ถูกยกเลิก
  }, [startDate, endDate]);

  const [items, setItems] = useState([]);

  const fetchData = async () => {
    getOrderSumQty();
  };

  const getOrderSumQty = () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(apiUrl + '/carstimeinout?start_date=' + startDate + '&end_date=' + endDate, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setItems(result);
        //console.log(result);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  // รวม grand total ของ quantity ของทุกรายการ items
  //   const grandTotalQuantity = items.reduce((acc, item) => {
  //     return acc + parseFloat(item.total_sold);
  //   }, 0);
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
          <OrderTableHead order={order} orderBy={orderBy} />
          {!loading ? (
            <TableBody>
              {items.length > 0 &&
                items.map((row, index) => (
                  <TableRow key={row.step_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center" style={{ fontFamily: 'kanit' }}>
                      {index + 1}
                    </TableCell>
                    <TableCell align="left" style={{ fontFamily: 'kanit' }}>
                      {row.queue_date ? moment(new Date()).format('DD-MM-YYYY') : '-'}
                    </TableCell>
                    <TableCell align="center" style={{ fontFamily: 'kanit' }}>
                      {padZero(row.queue_number)}
                    </TableCell>
                    <TableCell align="center" style={{ fontFamily: 'kanit' }}>
                      {row.token}
                    </TableCell>
                    <TableCell align="left" style={{ fontFamily: 'kanit' }}>
                      <div style={{ backgroundColor: 'lightBlue', borderRadius: '10px', padding: '7px', whiteSpace: 'nowrap' }}>
                        {row.start_time ? row.start_time.slice(11, 19) : '-'}
                      </div>
                    </TableCell>
                    <TableCell align="left" style={{ fontFamily: 'kanit' }}>
                      <div style={{ backgroundColor: 'lightBlue', borderRadius: '10px', padding: '7px', whiteSpace: 'nowrap' }}>
                        {row.end_time ? row.end_time.slice(11, 19) : '-'}
                      </div>
                    </TableCell>
                    <TableCell align="left" style={{ fontFamily: 'kanit' }}>
                      {row.company_name}
                    </TableCell>
                    <TableCell align="left" style={{ fontFamily: 'kanit' }}>
                      {row.registration_no}
                    </TableCell>
                    <TableCell align="left" style={{ fontFamily: 'kanit' }}>
                      {row.driver_mobile}
                    </TableCell>
                    <TableCell align="left" style={{ fontFamily: 'kanit' }}>
                      {row.driver_name}
                    </TableCell>
                    <TableCell align="center" style={{ fontFamily: 'kanit' }}>
                      {row.parent_has_cover == 'Y' ? (
                        <Typography sx={{ fontSize: 24, color: 'green' }}>
                          <CheckCircleOutlined color="success" />
                        </Typography>
                      ) : (
                        <Typography sx={{ fontSize: 24, color: 'red' }}>
                          <CloseCircleOutlined />
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center" style={{ fontFamily: 'kanit' }}>
                      {row.trailer_has_cover == 'Y' ? (
                        <Typography sx={{ fontSize: 24, color: 'green' }}>
                          <CheckCircleOutlined color="success" />
                        </Typography>
                      ) : (
                        <Typography sx={{ fontSize: 24, color: 'red' }}>
                          <CloseCircleOutlined />
                        </Typography>
                      )}
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
