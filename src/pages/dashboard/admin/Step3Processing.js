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
  Link,
  // tableCellClasses
  // Typography
  Chip
} from '@mui/material';

// import moment from 'moment';

// Link api queues
// import * as getReport from '_api/reportRequest';
// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'queueNum',
    align: 'center',
    disablePadding: false,
    label: 'หมายเลขคิว'
  },
  {
    id: 'station',
    align: 'left',
    disablePadding: true,
    label: 'สถานี (ชั่งหนัก)'
  },
  {
    id: 'setup_pile_date',
    align: 'left',
    disablePadding: true,
    label: 'ทะเบียนรถ'
  },
  {
    id: 'company',
    align: 'left',
    disablePadding: true,
    width: '20%',
    label: 'บริษัท'
  },
  {
    id: 'driver',
    align: 'left',
    disablePadding: false,
    width: '10%',
    label: 'คนขับ'
  },
  {
    id: 'tell',
    align: 'left',
    disablePadding: false,
    label: 'เบอร์โทร'
  },
  {
    id: 'starttime',
    align: 'center',
    disablePadding: false,
    label: 'เวลาเริ่ม'
  },
  {
    id: 'endtime',
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

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            width={headCell.width}
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

export default function Step2Processing() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  // const [selected] = useState([]);

  // const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 60000); // เรียกใช้ฟังก์ชันทุก 1 นาที (60000 มิลลิวินาที)

    return () => clearInterval(intervalId); // ลบตัวจับเวลาเมื่อคอมโพเนนต์ถูกยกเลิก
  }, []);

  const fetchData = async () => {
    await processingGet();
    // setLoading(false);
  };
  const processingGet = () => {
    return new Promise((resolve, reject) => {
      fetch(apiUrl + '/step3processing')
        .then((res) => res.json())
        .then((result) => {
          setItems(result);
          resolve(); // ส่งคืนเมื่อการเรียก API เสร็จสมบูรณ์
        })
        .catch((error) => reject(error)); // ส่งคืนเมื่อเกิดข้อผิดพลาดในการเรียก API
    });
  };
  function preventDefault(event) {
    event.preventDefault();
    window.location.href = '/admin/step3';
  }
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

          <TableBody>
            {items.length > 0 &&
              items.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" >
                    <Chip color="primary" sx={{ width: '95px' }} label={row.token} />
                  </TableCell>
                  <TableCell align="left">{row.station_description}</TableCell>
                  <TableCell align="left" >
                    <Chip color="primary" sx={{ width: '95px' }} label={row.registration_no} />
                  </TableCell>
                  <TableCell align="left" >
                    {row.company_name}
                  </TableCell>
                  <TableCell align="left" >
                    {row.driver_name}
                  </TableCell>
                  <TableCell align="left" >
                    {row.driver_mobile}
                  </TableCell>
                  <TableCell align="center">{row.start_time ? row.start_time.slice(11, 19) : '-'}</TableCell>
                  <TableCell align="left">{row.elapsed_time ? row.elapsed_time : '-'}</TableCell>
                  <TableCell align="center" >
                    <Chip color="success" sx={{ width: '110px' }} label={'กำลังชั่งหนัก'} />
                  </TableCell>
                </TableRow>
              ))}
            <TableRow>
              <TableCell colSpan={7}>
                <Link color="primary" href="/step2" onClick={preventDefault} sx={{ mt: 3 }}>
                  รายการทั้งหมด
                </Link>
              </TableCell>
            </TableRow>

            {items.length == 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
