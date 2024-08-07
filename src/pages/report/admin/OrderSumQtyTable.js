import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
// import { styled } from '@mui/material/styles';

// import { Link as RouterLink } from 'react-router-dom';
import * as reportRequest from '_api/reportRequest';

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
    id: 'total_smash',
    align: 'right',
    disablePadding: true,
    label: 'จำนวนสินค้าทุบ (ตัน)'
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

export default function OrderSumQtyTable({ startDate, endDate, clickDownload, onFilter }) {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [loading, setLoading] = useState(true);
  // const [selected] = useState([]);
  //   const currentDate = moment(new Date()).format('YYYY-MM-DD');

  // const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  useEffect(() => {
    fetchData();

    // const intervalId = setInterval(fetchData, 6000); // เรียกใช้ฟังก์ชันทุก 1 นาที (60000 มิลลิวินาที)

    // return () => clearInterval(intervalId); // ลบตัวจับเวลาเมื่อคอมโพเนนต์ถูกยกเลิก
  }, [startDate, endDate, onFilter, clickDownload]);

  const [items, setItems] = useState([]);
  const fetchData = async () => {
    getOrderSumQty();
  };

  const getOrderSumQty = () => {
    setLoading(true);

    reportRequest
      .getOrdersProductSummary(startDate, endDate)
      .then((result) => {
        if (onFilter) {
          setItems(result.filter((x) => x.product_company_id == onFilter));
        } else {
          setItems(result.filter((x) => x.product_register_id));
        }
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  // รวม grand total ของ quantity ของทุกรายการ items
  const grandTotalQuantity = items.reduce((acc, item) => {
    return item.total_sold && acc + parseFloat(item.total_sold);
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
          ref={clickDownload}
        >
          <OrderTableHead order={order} orderBy={orderBy} />
          {!loading ? (
            <TableBody>
              {items.length > 0 &&
                items.map((row, index) => (
                  <TableRow key={row.step_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">
                      <span style={{ display: 'none' }}>{`'`}</span>
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.product_register ? row.product_register : '-'}</TableCell>
                    <TableCell align="left">{row.brand_group}</TableCell>
                    <TableCell align="right">{parseFloat((row.total_sold * 20).toFixed(0))}</TableCell>
                    <TableCell align="right">
                      {parseFloat((row.total_sold * 1).toFixed(3))
                        .toFixed(3)
                        .padStart(5, '0')}
                    </TableCell>
                    <TableCell align="right">{row.total_smash ? parseFloat(row.total_smash) : 0}</TableCell>
                    <TableCell align="left">{row.warehouse_name}</TableCell>
                    <TableCell align="left">
                      {row.setup_pile_date ? moment(row.setup_pile_date.slice(0, 10)).format('DD/MM/YYYY') : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              <TableRow>
                <TableCell colSpan={7} align="right" sx={{ p: 2 }}>
                  <Typography variant="h5">ยอดรวมจ่าย: </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h5">
                    <span style={{ color: 'red' }}>{parseFloat((grandTotalQuantity * 20).toFixed(0)).toLocaleString()}</span> กระสอบ
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h5">
                    <span style={{ color: 'red' }}>{parseFloat(grandTotalQuantity.toFixed(3)).toLocaleString()}</span> ตัน{' '}
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
