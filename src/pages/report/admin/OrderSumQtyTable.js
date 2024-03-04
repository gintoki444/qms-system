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
  // tableCellClasses
  CircularProgress,
  Typography
  // , Chip
} from '@mui/material';

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
    id: 'Products',
    align: 'left',
    disablePadding: false,
    label: 'สินค้า'
  },
  {
    id: 'product_register',
    align: 'left',
    disablePadding: true,
    label: 'ทะเบียน'
  },
  {
    id: 'brand',
    align: 'left',
    disablePadding: true,
    label: 'ตรา'
  },
  {
    id: 'total_sold',
    align: 'right',
    disablePadding: true,
    label: 'รวมจ่าย (กระสอบ)'
  },
  {
    id: 'total_yok_sold',
    align: 'right',
    disablePadding: true,
    label: 'รวมจ่าย (ตัน)'
  },
  {
    id: 'remaining_total',
    align: 'left',
    disablePadding: false,
    label: 'โกดัง'
  },
  {
    id: 'date',
    align: 'left',
    disablePadding: false,
    label: 'วันที่กอง'
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

export default function OrderSumQtyTable({ startDate, endDate }) {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [loading, setLoading] = useState(true);
  // const [selected] = useState([]);
  //   const currentDate = moment(new Date()).format('YYYY-MM-DD');

  // const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 6000); // เรียกใช้ฟังก์ชันทุก 1 นาที (60000 มิลลิวินาที)

    return () => clearInterval(intervalId); // ลบตัวจับเวลาเมื่อคอมโพเนนต์ถูกยกเลิก
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

    fetch(apiUrl + '/ordersproducts2?start_date=' + startDate + '&end_date=' + endDate, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setItems(result);
        //console.log(result);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  // รวม grand total ของ quantity ของทุกรายการ items
  const grandTotalQuantity = items.reduce((acc, item) => {
    return acc + parseFloat(item.total_sold);
  }, 0);
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
                      {row.name}
                    </TableCell>
                    <TableCell align="left" style={{ fontFamily: 'kanit' }}>
                      {row.product_register ? row.product_register : '-'}
                    </TableCell>
                    <TableCell align="left" style={{ fontFamily: 'kanit' }}>
                      {row.brand_group}
                    </TableCell>
                    <TableCell align="right" style={{ fontFamily: 'kanit' }}>
                      {parseFloat((row.total_sold * 20).toFixed(0))}
                    </TableCell>
                    <TableCell align="right" style={{ fontFamily: 'kanit' }}>
                      {parseFloat((row.total_sold * 1).toFixed(3))
                        .toFixed(3)
                        .padStart(5, '0')}
                    </TableCell>
                    <TableCell align="left" style={{ fontFamily: 'kanit' }}>
                      {row.warehouse_name}
                    </TableCell>
                    <TableCell align="left" style={{ fontFamily: 'kanit' }}>
                      {row.setup_pile_date ? moment(new Date()).format('DD-MM-YYYY') : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              <TableRow>
                <TableCell colSpan={6} align="right" sx={{ p: 3 }}>
                  <Typography variant="h5">ยอดรวมจ่าย: </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h5">
                    <span style={{ color: 'red' }}>{parseFloat((grandTotalQuantity * 20).toFixed(0)).toLocaleString()}</span> กระสอบ
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h5">
                    <span style={{ color: 'red' }}>{parseFloat(grandTotalQuantity.toFixed(3))}</span> ตัน{' '}
                  </Typography>
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
