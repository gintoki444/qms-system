import PropTypes from 'prop-types';
import React, {
  useState,
  useEffect
  // , useRef
} from 'react';

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
  CircularProgress,
  Typography
  // Button,
  // Stack
  // Button
} from '@mui/material';

// import { useDownloadExcel } from 'react-export-table-to-excel';
// import OrdersByItems from './OrdersByItems';
// import moment from 'moment';
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
    id: 'brand_group',
    align: 'left',
    disablePadding: true,
    label: 'ตราสินค้า'
  },
  {
    id: 'setup_pile_date',
    align: 'left',
    disablePadding: true,
    label: 'ทะเบียนสินค้า'
  },
  // {
  //   id: 'total_sold',
  //   align: 'right',
  //   disablePadding: true,
  //   label: 'ยอดตั้งต้น (ตัน)'
  // },
  // {
  //   id: 'total_yok_sold',
  //   align: 'right',
  //   disablePadding: true,
  //   label: 'ยอดรวมทั้งหมด (ตัน)'
  // },
  // {
  //   id: 'total_receive',
  //   align: 'right',
  //   disablePadding: true,
  //   label: 'ยอดรับ (ตัน)'
  // },
  // {
  //   id: 'total_cutoff',
  //   align: 'right',
  //   disablePadding: true,
  //   label: 'ยอดเบิก (ตัน)'
  // },
  // {
  //   id: 'remaining_total',
  //   align: 'center',
  //   disablePadding: false,
  //   label: 'จ่าย (ตัน)'
  // },
  // {
  //   id: 'total_sold_1',
  //   align: 'right',
  //   disablePadding: false,
  //   label: 'รวมจ่าย (กระสอบ)'
  // },
  {
    id: 'total_sold_2',
    align: 'right',
    disablePadding: false,
    label: 'ยอดจ่ายทั้งหมด (ตัน)'
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

export default function OrderTable({ startDate, endDate, clickDownload, onFilter, dataList }) {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [loading, setLoading] = useState(true);

  // const currentDate = moment(new Date()).format('YYYY-MM-DD');

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, onFilter]);

  const [items, setItems] = useState([]);
  const fetchData = async () => {
    getOrderSumQty();
  };

  const getOrderSumQty = () => {
    setLoading(true);
    reportRequest
      .getOrdersProductByOrder(startDate, endDate)
      .then((result) => {
        setItems(result.filter((x) => x.product_company_id === onFilter));
        dataList(result);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  // รวม grand total ของ quantity ของทุกรายการ items
  const grandTotalQuantity = items.reduce((acc, item) => {
    return acc + parseFloat(item.total_sold);
  }, 0);

  // const [onclickShow, setOnClickShow] = useState(false);
  // const handleClickShow = () => {
  //   if (onclickShow == false) {
  //     setOnClickShow(true);
  //   } else {
  //     setOnClickShow(false);
  //   }
  // }
  return (
    <Box>
      {/* <Button color="primary" onClick={onDownload}>
        Click
      </Button> */}
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
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">
                      <span style={{ display: 'none' }}>{`'`}</span>
                      {row.name}
                    </TableCell>
                    <TableCell align="left">
                      {/* <span style={{ display: 'none' }}>{`'`}</span> */}
                      {row.brand_group}
                    </TableCell>
                    <TableCell align="left">{row.product_register ? row.product_register : '-'}</TableCell>
                    {/* <TableCell align="left">{row.setup_pile_date ? moment(row.setup_pile_date).format('DD/MM/yyyy') : '-'}</TableCell> */}
                    {/* <TableCell align="right">{parseFloat((row.stock_quantity * 1).toFixed(3)).toLocaleString('en-US')}</TableCell> */}
                    {/* <TableCell align="right">
                      {parseFloat((row.begin_day_stock * 1).toFixed(3)).toLocaleString('en-US')}
                    </TableCell> */}
                    {/* <TableCell align="right">{parseFloat(row.total_receive)}</TableCell> */}
                    {/* <TableCell align="right">{parseFloat(row.total_cutoff)}</TableCell> */}
                    {/* <TableCell align="center"> */}
                    {/* <OrdersByItems productId={row.product_id} productReId={row.product_register_id} dates={startDate} /> */}
                    {/* <Stack flexDirection="row" alignItems="center" >
                        <div style={{ marginRight: '10px' }}>
                          <Button color={!onclickShow ? 'info' : 'error'} variant='outlined' onClick={handleClickShow}>
                            {!onclickShow ? 'รายละเอียด' : 'ยกเลิก'}
                          </Button>
                        </div>
                        {onclickShow && ( */}
                    {/* <div style={{ backgroundColor: 'lightBlue', borderRadius: '10px', padding: '7px', width: '100%' }}>
                        <div>
                          <table border={'0'}>
                            <thead></thead>
                            <tbody>
                              <tr>
                                <td align="center">
                                  <strong>คิว</strong>
                                </td>
                                {row.items.map((item, index) => (
                                  <td key={index} align="center">
                                    {item.token}
                                  </td>
                                ))}
                              </tr>
                              <tr>
                                <td align="center">
                                  <strong>ตัน</strong>
                                </td>
                                {row.items.map((item, index) => (
                                  <td key={index} align="center">
                                    {parseFloat((item.total_products * 1).toFixed(3))}
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div> */}
                    {/* )}
                      </Stack> */}
                    {/* </TableCell> */}
                    {/* <TableCell align="right">{parseFloat((row.total_sold * 20).toFixed(0)).toLocaleString('en-US')}</TableCell> */}
                    <TableCell align="right">{parseFloat((row.total_sold * 1).toFixed(3)).toLocaleString('en-US')}</TableCell>
                    <TableCell align="right">{parseFloat((row.remaining_quantity * 1).toFixed(3)).toLocaleString('en-US')}</TableCell>
                  </TableRow>
                ))}

              {items.length == 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell colSpan={4} align="right" sx={{ p: 3 }}>
                  <Typography variant="h4">ยอดรวมจ่าย :</Typography>
                </TableCell>
                <TableCell align="left" sx={{ p: 3, pl: 0 }}>
                  <Typography variant="h4">
                    <span style={{ color: 'red' }}>{parseFloat(grandTotalQuantity.toFixed(3)).toLocaleString()}</span> ตัน
                  </Typography>
                </TableCell>
              </TableRow>
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
