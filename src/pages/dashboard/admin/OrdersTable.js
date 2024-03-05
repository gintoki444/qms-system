import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
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
  // tableCellClasses
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
    id: 'setup_pile_date',
    align: 'left',
    disablePadding: true,
    label: 'วันที่ตั้งกอง'
  },
  {
    id: 'total_sold',
    align: 'right',
    disablePadding: true,
    label: 'ยอดตั้งต้น (ตัน)'
  },
  {
    id: 'total_yok_sold',
    align: 'right',
    disablePadding: true,
    label: 'ยอดยกมา (ตัน)'
  },
  {
    id: 'remaining_total',
    align: 'center',
    disablePadding: false,
    label: 'จ่าย (ตัน)'
  },
  {
    id: 'total_sold_1',
    align: 'right',
    disablePadding: false,
    label: 'รวมจ่าย (กระสอบ)'
  },
  {
    id: 'total_sold_2',
    align: 'right',
    disablePadding: false,
    label: 'รวมจ่าย (ตัน)'
  },
  {
    id: 'total_sold_3',
    align: 'right',
    disablePadding: false,
    label: 'คงเหลือ (ตัน)'
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

export default function OrderTable() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [loading, setLoading] = useState(true);
  // const [selected] = useState([]);
  const currentDate = moment(new Date()).format('YYYY-MM-DD');

  // const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  useEffect(() => {
    fetchData();
  }, []);

  const [items, setItems] = useState([]);
  const fetchData = async () => {
    getOrderSumQty();
    //setLoading(false);
  };

  const getOrderSumQty = () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(apiUrl + '/ordersproducts?start_date=' + currentDate + '&end_date=' + currentDate, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setItems(result);
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
                    <TableCell align="center" style={{ fontFamily: 'Noto Sans Thai' }}>
                      {index + 1}
                    </TableCell>
                    <TableCell align="left" style={{ fontFamily: 'Noto Sans Thai' }}>
                      {row.name}
                    </TableCell>
                    <TableCell align="left" style={{ fontFamily: 'Noto Sans Thai' }}>
                      {row.product_register ? row.product_register : '-'}
                    </TableCell>
                    <TableCell align="left" style={{ fontFamily: 'Noto Sans Thai' }}>
                      {row.setup_pile_date ? moment(row.setup_pile_date).format('DD/MM/yyyy') : '-'}
                    </TableCell>
                    <TableCell align="right" style={{ fontFamily: 'Noto Sans Thai' }}>
                      {parseFloat((row.stock_quantity * 1).toFixed(3)).toLocaleString('en-US')}
                    </TableCell>
                    <TableCell align="right" style={{ fontFamily: 'Noto Sans Thai' }}>
                      {parseFloat((row.begin_day_stock * 1).toFixed(3)).toLocaleString('en-US')}
                      {/* 
                 {(parseFloat(row.total_sold) + parseFloat(row.remaining_quantity)).toLocaleString()}
                 */}
                    </TableCell>
                    <TableCell align="center" style={{ fontFamily: 'Noto Sans Thai' }}>
                      <div style={{ backgroundColor: 'lightBlue', borderRadius: '10px', padding: '7px' }}>
                        <div>
                          <table border={'0'}>
                            <thead></thead>
                            <tbody>
                              <tr>
                                <td align="center" style={{ fontFamily: 'Noto Sans Thai' }}>
                                  <strong>คิว</strong>
                                </td>
                                {row.items.map((item, index) => (
                                  <td key={index} align="center" style={{ fontFamily: 'Noto Sans Thai' }}>
                                    {item.token}
                                  </td>
                                ))}
                              </tr>
                              <tr>
                                <td align="center" style={{ fontFamily: 'Noto Sans Thai' }}>
                                  <strong>ตัน</strong>
                                </td>
                                {row.items.map((item, index) => (
                                  <td key={index} align="center" style={{ fontFamily: 'Noto Sans Thai' }}>
                                    {parseFloat((item.total_products * 1).toFixed(3))}
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="right" style={{ fontFamily: 'Noto Sans Thai' }}>
                      {parseFloat((row.total_sold * 20).toFixed(0)).toLocaleString('en-US')}
                    </TableCell>
                    <TableCell align="right" style={{ fontFamily: 'Noto Sans Thai' }}>
                      {parseFloat((row.total_sold * 1).toFixed(3)).toLocaleString('en-US')}
                    </TableCell>
                    <TableCell align="right" style={{ fontFamily: 'Noto Sans Thai' }}>
                      {parseFloat((row.remaining_quantity * 1).toFixed(3)).toLocaleString('en-US')}
                    </TableCell>
                  </TableRow>
                ))}
              <TableRow>
                <TableCell colSpan={8} align="right" sx={{ p: 3 }}>
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
