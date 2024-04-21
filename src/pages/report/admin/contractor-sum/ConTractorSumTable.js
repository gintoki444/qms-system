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
  CircularProgress,
  Typography
  // , Chip
} from '@mui/material';

// import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

import moment from 'moment';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'NO.',
    align: 'center',
    disablePadding: false,
    width: '10%',
    label: 'ลำดับ'
  },
  {
    id: 'queueNum',
    align: 'left',
    disablePadding: true,
    width: '20%',
    label: 'เลขที่ใบเคลื่อนย้าย'
  },
  {
    id: 'registration_no',
    align: 'left',
    width: '10%',
    disablePadding: false,
    label: 'ทะเบียนรถ'
  },
  {
    id: 'formula',
    align: 'left',
    width: '10%',
    disablePadding: false,
    label: 'สูตร'
  },
  {
    id: 'totolCount',
    align: 'center',
    width: '50%',
    disablePadding: false,
    label: 'จำนวน/ตัน'
  }
];

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
            colSpan={headCell.id === 'totolCount' && 5}
            width={headCell.width ? headCell.width : 'auto'}
            sx={{ pt: '0!important', pb: '0!important', p: headCell.id === 'totolCount' ? '0!important' : 'auto' }}
          >
            <Typography variant="h5" sx={{ p: headCell.id == 'totolCount' && '8px!important' }}>
              {headCell.label}
            </Typography>
            {headCell.id == 'totolCount' && (
              <Table sx={{ backgroundColor: '#e8e8e8' }}>
                <TableRow>
                  <TableCell align="right" sx={{ pt: '8px!important', pb: '8px!important', width: '20%' }}>
                    ขึ้นสินค้า
                  </TableCell>
                  <TableCell align="right" sx={{ pt: '8px!important', pb: '8px!important', width: '20%' }}>
                    ทุบปุ๋ย
                  </TableCell>
                  <TableCell align="right" sx={{ pt: '8px!important', pb: '8px!important', width: '20%' }}>
                    เกี่ยวสลิง
                  </TableCell>
                  <TableCell align="right" sx={{ pt: '8px!important', pb: '8px!important', width: '20%' }}>
                    เรียงสลิง
                  </TableCell>
                  <TableCell align="right" sx={{ pt: '8px!important', pb: '8px!important', width: '20%' }}>
                    เกี่ยวจัมโบ้
                  </TableCell>
                </TableRow>
              </Table>
            )}
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
function ConTractorSumTable({ startDate, endDate, clickDownload, onFilter, nameCompany }) {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [loading, setLoading] = useState(true);
  // const [selected] = useState([]);
  //   const currentDate = moment(new Date()).format('YYYY-MM-DD');
  // const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;
  useEffect(() => {
    setCompanyName(nameCompany);
    fetchData();
  }, [startDate, endDate, onFilter, nameCompany]);

  const [items, setItems] = useState([]);

  const fetchData = async () => {
    getOrderSumQty();
  };

  const [companyName, setCompanyName] = useState('');
  const getOrderSumQty = () => {
    setLoading(true);
    try {
      reportRequest.getContractorSummary(startDate, endDate).then((response) => {
        // setCompanyName(response.filter((x) => x.contract_company_id == onFilter + 1)[0]);
        // console.log(response.length > 0?response.find((x) => x.contract_company_id == onFilter + 1).contract_company_name);
        setItems(response.filter((x) => x.contract_company_id == onFilter + 1));
        sumaryItems(response.filter((x) => x.contract_company_id == onFilter + 1));
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [totalSold, setTotalSold] = useState(0);
  const [totalSmash, setTotalSmash] = useState(0);
  const [totalslingHook, setTotalslingHook] = useState(0);
  const [totalSlingSort, setTotalSlingSort] = useState(0);
  const [totalJumboHook, setTotalJumboHook] = useState(0);
  const sumaryItems = (item) => {
    let numTotalSold = 0;
    let numtotalSmash = 0;
    let numtotalslingHook = 0;
    let numtotalSlingSort = 0;
    let numtotalJumboHook = 0;
    item.map((x) => {
      numTotalSold = numTotalSold + parseFloat(x.total_sold !== null ? x.total_sold : 0);
      numtotalSmash = numtotalSmash + parseFloat(x.total_smash !== null ? x.total_smash : 0);
      numtotalslingHook = numtotalslingHook + parseFloat(x.total_sling_hook !== null ? x.total_sling_hook : 0);
      numtotalSlingSort = numtotalSlingSort + parseFloat(x.total_sling_sort !== null ? x.total_sling_sort : 0);
      numtotalJumboHook = numtotalJumboHook + parseFloat(x.total_jumbo_hook !== null ? x.total_jumbo_hook : 0);
    });
    setTotalSold(numTotalSold);
    setTotalSmash(numtotalSmash);
    setTotalslingHook(numtotalslingHook);
    setTotalSlingSort(numtotalSlingSort);
    setTotalJumboHook(numtotalJumboHook);
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
          ref={clickDownload}
        >
          <TableHead>
            <TableRow>
              <TableCell colSpan={4}>
                <Typography variant="h5">
                  วันที่ :
                  {startDate == endDate
                    ? ' ' + moment(startDate).format('DD/MM/YYYY')
                    : moment(startDate).format('DD/MM/YYYY') + ' ถึง ' + moment(endDate).format('DD/MM/YYYY')}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h5" sx={{ textDecoration: 'underline' }}>
                  บริษัท : {companyName}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <OrderTableHead order={order} orderBy={orderBy} />
          {!loading ? (
            <TableBody>
              {items.length > 0 &&
                items.map((row, index) => (
                  <TableRow key={row.step_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{row.ref_order_id ? row.ref_order_id : '-'}</TableCell>
                    <TableCell align="left">{row.registration_no}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="right" sx={{ p: '0!important' }}>
                      <Table sx={{ backgroundColor: '#efefef' }}>
                        <TableRow>
                          <TableCell align="right" sx={{ width: '20%' }}>
                            {row.total_sold ? parseFloat(row.total_sold) : '0'}
                          </TableCell>
                          <TableCell align="right" sx={{ width: '20%' }}>
                            {row.total_smash ? parseFloat(row.total_smash) : '0'}
                          </TableCell>
                          <TableCell align="right" sx={{ width: '20%' }}>
                            {row.total_sling_hook ? parseFloat(row.total_sling_hook) : '0'}
                          </TableCell>
                          <TableCell align="right" sx={{ width: '20%' }}>
                            {row.total_sling_sort ? parseFloat(row.total_sling_sort) : '0'}
                          </TableCell>
                          <TableCell align="right" sx={{ width: '20%' }}>
                            {row.total_jumbo_hook ? parseFloat(row.total_jumbo_hook) : '0'}
                          </TableCell>
                        </TableRow>
                      </Table>
                    </TableCell>
                  </TableRow>
                ))}

              {items.length == 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell align="right" width="45%" colSpan={4}>
                  <Typography variant="h5"> ยอดจำนวนทุบ (ตัน)</Typography>
                </TableCell>
                <TableCell align="right" width="55%" sx={{ p: '0!important', backgroundColor: '#efefef' }}>
                  <Table sx={{ backgroundColor: '#efefef' }}>
                    <TableRow>
                      <TableCell align="right" sx={{ width: '20%' }}>
                        <strong style={{ color: 'red' }}> {totalSold ? totalSold + ' ตัน' : '-'}</strong>
                      </TableCell>
                      <TableCell align="right" sx={{ width: '20%' }}>
                        <strong style={{ color: 'red' }}>{totalSmash ? totalSmash + ' ตัน' : '-'}</strong>
                      </TableCell>
                      <TableCell align="right" sx={{ width: '20%' }}>
                        <strong style={{ color: 'red' }}>{totalslingHook ? totalslingHook + ' ตัน' : '-'}</strong>
                      </TableCell>
                      <TableCell align="right" sx={{ width: '20%' }}>
                        <strong style={{ color: 'red' }}> {totalSlingSort ? totalSlingSort + ' ตัน' : '-'}</strong>
                      </TableCell>
                      <TableCell align="right" sx={{ width: '20%' }}>
                        <strong style={{ color: 'red' }}> {totalJumboHook ? totalJumboHook + ' ตัน' : '-'}</strong>
                      </TableCell>
                    </TableRow>
                  </Table>
                </TableCell>
              </TableRow>
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
export default ConTractorSumTable;
