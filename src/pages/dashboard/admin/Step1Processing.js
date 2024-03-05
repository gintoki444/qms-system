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
    label: 'สถานี (ชั่งเบา)'
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

export default function Step1Processing() {
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
      fetch(apiUrl + '/step1processing')
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
    window.location.href = '/admin/step1';
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
                  <TableCell align="center" >
                    <Chip color="success" sx={{ width: '110px' }} label={'กำลังชั่งเบา'} />
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
          {/* <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const isItemSelected = isSelected(row.trackingNo);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.trackingNo}
                  selected={isItemSelected}
                >
                  <TableCell component="th" id={labelId} scope="row" align="left">
                    <Link color="secondary" component={RouterLink} to="">
                      {row.trackingNo}
                    </Link>
                  </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="left">
                    <OrderStatus status={row.carbs} />
                  </TableCell>
                  <TableCell align="right">
                    <NumberFormat value={row.protein} displayType="text" thousandSeparator prefix="$" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody> */}
        </Table>
      </TableContainer>
    </Box>
  );
}
