import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
// import { styled } from '@mui/material/styles';

// import { Link as RouterLink } from 'react-router-dom';

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
  // Typography
  // , Chip
} from '@mui/material';

import moment from 'moment';

// third-party
// import NumberFormat from 'react-number-format';

// Link api queues
import * as getReport from '_api/reportRequest';

// project import
// import Dot from 'components/@extended/Dot';

// function createData(trackingNo, name, fat, carbs, protein) {
//   return { trackingNo, name, fat, carbs, protein };
// }

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'NO.',
    align: 'center',
    disablePadding: false,
    label: 'ลำดับ.'
  },
  {
    id: 'Products',
    align: 'left',
    disablePadding: false,
    label: 'สินค้า.'
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
    id: 'remaining_total',
    align: 'center',
    disablePadding: false,
    label: 'จ่าย (ตัน)'
  },
  {
    id: 'total_sold_1',
    align: 'left',
    disablePadding: false,
    label: 'รวมจ่าย (กระสอบ)'
  },
  {
    id: 'total_sold_2',
    align: 'center',
    disablePadding: false,
    label: 'รวมจ่าย (ตัน)'
  },
  {
    id: 'total_sold_3',
    align: 'center',
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
  // const [selected] = useState([]);

  // const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  useEffect(() => {
    getOrderSumQty();
  }, []);

  const [items, setItems] = useState([]);
  const getOrderSumQty = () => {
    const dateNow = moment(new Date()).format('YYYY-MM-DD');

    try {
      getReport.getOrdersProducts(dateNow).then((response) => {
        console.log('response :', response);
        setItems(response);
      });
    } catch (e) {
      console.log(e);
    }
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
            {items.map((row, index) => {
              return (
                <TableRow key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.product_register ? row.product_register : '-'}</TableCell>
                  <TableCell align="left">{row.setup_pile_date ? moment(row.setup_pile_date).format('DD/MM/yyyy') : '-'}</TableCell>
                  <TableCell align="right">
                    {(parseFloat(row.total_sold) + parseFloat(row.remaining_quantity)).toLocaleString()} T
                  </TableCell>
                  <TableCell align="left" sx={{ p: 0 }}>
                    <Table size="small" lined="none">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left" sx={{ p: 1 }}>
                            คิว
                          </TableCell>
                          <TableCell align="right" sx={{ p: 1 }}>
                            ตัน
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell align="left">{item.token}</TableCell>
                            <TableCell align="right">{parseFloat((item.total_products * 1).toFixed(3))}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                  <TableCell align="center">{parseFloat((row.total_sold * 20).toFixed(0))}</TableCell>
                  <TableCell align="center">{parseFloat((row.total_sold * 1).toFixed(3))}</TableCell>
                  <TableCell align="center">{parseFloat((row.remaining_quantity * 1).toFixed(3))}</TableCell>
                </TableRow>
              );
            })}

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
