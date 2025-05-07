import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';

// import { Link as RouterLink } from 'react-router-dom';
import * as dashboardRequest from '_api/dashboardRequest';

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
  Typography,
  // Link,
  tableCellClasses
  // Typography
  // Chip
} from '@mui/material';

// import moment from 'moment';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#3388f4',
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '20px'
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
    padding: '20px'
  }
}));
// Link api queues
// import * as getReport from '_api/reportRequest';
// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'companyName',
    align: 'center',
    disablePadding: false,
    width: '15%',
    label: 'บริษัท'
  },
  {
    id: 'allQueues',
    align: 'center',
    disablePadding: true,
    label: 'จำนวนคิวทั้งหมด'
  },
  {
    id: 'cancelOrder',
    align: 'center',
    disablePadding: true,
    label: 'ยกเลิก'
  },
  {
    id: 'pendingOrder',
    align: 'center',
    disablePadding: true,
    label: 'รอคำสั่งซื้อ'
  },
  {
    id: 'pendingStep1',
    align: 'center',
    disablePadding: true,
    // width: '20%',
    label: 'รอชั่งเบา'
  },
  {
    id: 'waitingStep2',
    align: 'center',
    disablePadding: false,
    // width: '10%',
    label: 'รอขึ้นสินค้า'
  },
  {
    id: 'processingStep2',
    align: 'center',
    disablePadding: false,
    // width: '10%',
    label: 'กำลังขึ้นสินค้า'
  },
  {
    id: 'pendingStep3',
    align: 'left',
    disablePadding: false,
    label: 'รอชั่งหนัก'
  },
  {
    id: 'doneStep2',
    align: 'center',
    disablePadding: false,
    // width: '10%',
    label: 'ขึ้นสินค้าสำเร็จ'
  }
  // {
  //     id: 'doneStep4',
  //     align: 'center',
  //     disablePadding: false,
  //     // width: '10%',
  //     label: 'รถออกจากโรงงาน'
  // }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            width={headCell.width}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string
};

function SummaryQueueList({ startDate, endDate, dataList }) {
  // const [order] = useState('asc');
  // const [orderBy] = useState('trackingNo');
  // const [selected] = useState([]);

  // const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;
  const [items, setItems] = useState([]);
  const [items1, setItems1] = useState([]);
  const [items2, setItems2] = useState([]);
  const [items3, setItems3] = useState([]);
  const [items4, setItems4] = useState([]);
  const [items5, setItems5] = useState([]);
  const [items6, setItems6] = useState([]);
  const [items7, setItems7] = useState([]);
  const [items8, setItems8] = useState([]);
  const [items9, setItems9] = useState([]);
  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 60000); // เรียกใช้ฟังก์ชันทุก 1 นาที (60000 มิลลิวินาที)

    return () => clearInterval(intervalId); // ลบตัวจับเวลาเมื่อคอมโพเนนต์ถูกยกเลิก
  }, [startDate, endDate]);

  const fetchData = async () => {
    await processingGet();
    // setLoading(false);
  };
  const processingGet = async () => {
    try {
      dashboardRequest.getCompanyCounts(startDate, endDate).then((response) => {
        setItems(response);
        setItems1(response.filter((x) => x.product_company_code === 'IF'));
        setItems2(response.filter((x) => x.product_company_code === 'II'));
        setItems3(response.filter((x) => x.product_company_code === 'SK'));
        setItems4(response.filter((x) => x.product_company_code === 'JS'));
        setItems5(response.filter((x) => x.product_company_code === 'FC'));
        setItems6(response.filter((x) => x.product_company_code === 'FB'));
        setItems7(response.filter((x) => x.product_company_code === 'IB'));
        setItems8(response.filter((x) => x.product_company_code === 'IC'));
        setItems9(response.filter((x) => x.product_company_code === 'IV'));
        dataList(response);
      });
    } catch (error) {
      console.log(error);
    }
  };
  // function preventDefault(event) {
  //     event.preventDefault();
  //     window.location.href = '/admin/step1';
  // }
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
          <OrderTableHead
          // order={order} orderBy={orderBy}
          />

          <TableBody>
            {/* {items.length > 0 &&
                            items.map((row, index) => (
                                <>
                                    <StyledTableRow key={index}>
                                        <StyledTableCell align="left">
                                            <Typography variant='body1'><strong>{row.product_company_name_th}</strong></Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Typography variant='body1'>{row.queues_counts}</Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Typography variant='body1'>{row.step1_cancel_count}</Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Typography variant='body1'>{(row.no_order_queues_count - row.step1_cancel_count_no_order)}</Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Typography variant='body1'>{(row.step1_waiting_count - (row.no_order_queues_count - row.step1_cancel_count_no_order ))}</Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Typography variant='body1'>{row.step2_waiting_count}</Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Typography variant='body1'>{row.step2_processing_count}</Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Typography variant='body1'>{row.step3_waiting_count}</Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Typography variant='body1'>{row.step3_completed_count}</Typography>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow sx={{ borderBottom: 'solid 2px' }}>
                                        <StyledTableCell align="right">
                                            <strong>
                                                เวลาขึ้นสินค้าฉลี่ย :
                                                <span style={{ color: 'red', padding: '0 10px' }}>{row.step2_total_duration_minutes2 && row.step2_cars_count
                            ? parseFloat(row.step2_total_duration_minutes2 / row.step2_cars_count).toFixed(2)
                            : '0'}</span>
                                                นาที/คัน
                                            </strong>
                                        </StyledTableCell>
                                        <StyledTableCell align="right" colSpan={2}>
                                            <strong>จำนวนรถทั้งหมด </strong>
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            <Typography variant='h5'>{row.step2_cars_count + ' คัน'}</Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="right" colSpan={2}>
                                            <strong>จำนวนสินค้าที่เข้ารับทั้งหมด </strong>
                                        </StyledTableCell>
                                        <StyledTableCell align="left" colSpan={2}>
                                            <Typography variant='h5'>
                                                {row.step2_total_quantity ? (parseFloat(row.step2_total_quantity)*1).toLocaleString() + ' ตัน' : '0'}
                                            </Typography>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </>
                            ))
                        } */}
            {items.length === 0 && (
              <StyledTableRow>
                <StyledTableCell align="center" colSpan={9}>
                  ไม่พบข้อมูล
                </StyledTableCell>
              </StyledTableRow>
            )}
            {/* {items.length > 0 &&
                            items.map((row, index) => (
                                <> */}
            {items1.length > 0 &&
              items1.map((row, index) => (
                <>
                  <StyledTableRow key={index} style={{ backgroundColor: '#ffbeaf69' }}>
                    <StyledTableCell align="center">
                      <Typography variant="h5">
                        <strong>ICPF</strong>
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.queues_counts}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step1_cancel_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.no_order_queues_count - row.step1_cancel_count_no_order}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">
                        {row.step1_waiting_count - (row.no_order_queues_count - row.step1_cancel_count_no_order)}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_processing_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_completed_count}</Typography>
                    </StyledTableCell>
                    {/* <StyledTableCell align="center">
                                            <Typography variant='body1'>{row.step4_completed_count}</Typography>
                                        </StyledTableCell> */}
                  </StyledTableRow>
                  <StyledTableRow sx={{ borderBottom: 'solid 2px', backgroundColor: '#ffbeaf69' }}>
                    <StyledTableCell align="right">
                      <strong>
                        เวลาขึ้นสินค้าฉลี่ย :
                        <span style={{ color: 'red', padding: '0 10px' }}>
                          {row.step2_total_duration_minutes2 && row.step2_cars_count
                            ? parseFloat(row.step2_total_duration_minutes2 / row.step2_cars_count).toFixed(2)
                            : '0'}
                        </span>
                        นาที/คัน
                      </strong>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนรถทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Typography variant="h5">{row.step2_cars_count + ' คัน'}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนสินค้าที่เข้ารับทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left" colSpan={3}>
                      <Typography variant="h5">
                        {row.step2_total_quantity ? (parseFloat(row.step2_total_quantity) * 1).toLocaleString() + ' ตัน' : '0'}
                      </Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                </>
              ))}
            {items2.length > 0 &&
              items2.map((row, index) => (
                <>
                  <StyledTableRow key={index} style={{ backgroundColor: '#f4ae4d52' }}>
                    <StyledTableCell align="center">
                      <Typography variant="h5">
                        <strong>ICPI</strong>
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.queues_counts}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step1_cancel_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.no_order_queues_count - row.step1_cancel_count_no_order}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">
                        {row.step1_waiting_count - (row.no_order_queues_count - row.step1_cancel_count_no_order)}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_processing_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_completed_count}</Typography>
                    </StyledTableCell>
                    {/* <StyledTableCell align="center">
                                            <Typography variant='body1'>{row.step4_completed_count}</Typography>
                                        </StyledTableCell> */}
                  </StyledTableRow>
                  <StyledTableRow sx={{ borderBottom: 'solid 2px', backgroundColor: '#f4ae4d52' }}>
                    <StyledTableCell align="right">
                      <strong>
                        เวลาขึ้นสินค้าฉลี่ย :
                        <span style={{ color: 'red', padding: '0 10px' }}>
                          {row.step2_total_duration_minutes2 && row.step2_cars_count
                            ? parseFloat(row.step2_total_duration_minutes2 / row.step2_cars_count).toFixed(2)
                            : '0'}
                        </span>
                        นาที/คัน
                      </strong>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนรถทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Typography variant="h5">{row.step2_cars_count + ' คัน'}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนสินค้าที่เข้ารับทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left" colSpan={3}>
                      <Typography variant="h5">
                        {row.step2_total_quantity ? (parseFloat(row.step2_total_quantity) * 1).toLocaleString() + ' ตัน' : '0'}
                      </Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                </>
              ))}
            {items3.length > 0 &&
              items3.map((row, index) => (
                <>
                  <StyledTableRow key={index} style={{ backgroundColor: '#f7dc5063' }}>
                    <StyledTableCell align="center">
                      <Typography variant="h5">
                        <strong>SAHAI KASET</strong>
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.queues_counts}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step1_cancel_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.no_order_queues_count - row.step1_cancel_count_no_order}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">
                        {row.step1_waiting_count - (row.no_order_queues_count - row.step1_cancel_count_no_order)}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_processing_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_completed_count}</Typography>
                    </StyledTableCell>
                    {/* <StyledTableCell align="center">
                                            <Typography variant='body1'>{row.step4_completed_count}</Typography>
                                        </StyledTableCell> */}
                  </StyledTableRow>
                  <StyledTableRow sx={{ borderBottom: 'solid 2px', backgroundColor: '#f7dc5063' }}>
                    <StyledTableCell align="right">
                      <strong>
                        เวลาขึ้นสินค้าฉลี่ย :
                        <span style={{ color: 'red', padding: '0 10px' }}>
                          {row.step2_total_duration_minutes2 && row.step2_cars_count
                            ? parseFloat(row.step2_total_duration_minutes2 / row.step2_cars_count).toFixed(2)
                            : '0'}
                        </span>
                        นาที/คัน
                      </strong>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนรถทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Typography variant="h5">{row.step2_cars_count + ' คัน'}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนสินค้าที่เข้ารับทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left" colSpan={3}>
                      <Typography variant="h5">
                        {row.step2_total_quantity ? (parseFloat(row.step2_total_quantity) * 1).toLocaleString() + ' ตัน' : '0'}
                      </Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                </>
              ))}
            {items4.length > 0 &&
              items4.map((row, index) => (
                <>
                  <StyledTableRow key={index} style={{ backgroundColor: '#9cd6ff7a' }}>
                    <StyledTableCell align="center">
                      <Typography variant="h5">
                        <strong>JS888</strong>
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.queues_counts}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step1_cancel_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.no_order_queues_count - row.step1_cancel_count_no_order}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">
                        {row.step1_waiting_count - (row.no_order_queues_count - row.step1_cancel_count_no_order)}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_processing_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_completed_count}</Typography>
                    </StyledTableCell>
                    {/* <StyledTableCell align="center">
                                            <Typography variant='body1'>{row.step4_completed_count}</Typography>
                                        </StyledTableCell> */}
                  </StyledTableRow>
                  <StyledTableRow sx={{ borderBottom: 'solid 2px', backgroundColor: '#9cd6ff7a' }}>
                    <StyledTableCell align="right">
                      <strong>
                        เวลาขึ้นสินค้าฉลี่ย :
                        <span style={{ color: 'red', padding: '0 10px' }}>
                          {row.step2_total_duration_minutes2 && row.step2_cars_count
                            ? parseFloat(row.step2_total_duration_minutes2 / row.step2_cars_count).toFixed(2)
                            : '0'}
                        </span>
                        นาที/คัน
                      </strong>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนรถทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Typography variant="h5">{row.step2_cars_count + ' คัน'}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนสินค้าที่เข้ารับทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left" colSpan={3}>
                      <Typography variant="h5">
                        {row.step2_total_quantity ? (parseFloat(row.step2_total_quantity) * 1).toLocaleString() + ' ตัน' : '0'}
                      </Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                </>
              ))}
            {items5.length > 0 &&
              items5.map((row, index) => (
                <>
                  <StyledTableRow key={index} style={{ backgroundColor: '#7609a14f' }}>
                    <StyledTableCell align="center">
                      <Typography variant="h5">
                        <strong>ICPF ICAM</strong>
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.queues_counts}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step1_cancel_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.no_order_queues_count - row.step1_cancel_count_no_order}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">
                        {row.step1_waiting_count - (row.no_order_queues_count - row.step1_cancel_count_no_order)}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_processing_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_completed_count}</Typography>
                    </StyledTableCell>
                    {/* <StyledTableCell align="center">
                                            <Typography variant='body1'>{row.step4_completed_count}</Typography>
                                        </StyledTableCell> */}
                  </StyledTableRow>
                  <StyledTableRow sx={{ borderBottom: 'solid 2px', backgroundColor: '#7609a14f' }}>
                    <StyledTableCell align="right">
                      <strong>
                        เวลาขึ้นสินค้าฉลี่ย :
                        <span style={{ color: 'red', padding: '0 10px' }}>
                          {row.step2_total_duration_minutes2 && row.step2_cars_count
                            ? parseFloat(row.step2_total_duration_minutes2 / row.step2_cars_count).toFixed(2)
                            : '0'}
                        </span>
                        นาที/คัน
                      </strong>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนรถทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Typography variant="h5">{row.step2_cars_count + ' คัน'}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนสินค้าที่เข้ารับทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left" colSpan={3}>
                      <Typography variant="h5">
                        {row.step2_total_quantity ? (parseFloat(row.step2_total_quantity) * 1).toLocaleString() + ' ตัน' : '0'}
                      </Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                </>
              ))}
            {items6.length > 0 &&
              items6.map((row, index) => (
                <>
                  <StyledTableRow key={index} style={{ backgroundColor: '#17cf6c52' }}>
                    <StyledTableCell align="center">
                      <Typography variant="h5">
                        <strong>ICPF (BULK)</strong>
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.queues_counts}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step1_cancel_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.no_order_queues_count - row.step1_cancel_count_no_order}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">
                        {row.step1_waiting_count - (row.no_order_queues_count - row.step1_cancel_count_no_order)}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_processing_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_completed_count}</Typography>
                    </StyledTableCell>
                    {/* <StyledTableCell align="center">
                                            <Typography variant='body1'>{row.step4_completed_count}</Typography>
                                        </StyledTableCell> */}
                  </StyledTableRow>
                  <StyledTableRow sx={{ borderBottom: 'solid 2px', backgroundColor: '#17cf6c52' }}>
                    <StyledTableCell align="right">
                      <strong>
                        เวลาขึ้นสินค้าฉลี่ย :
                        <span style={{ color: 'red', padding: '0 10px' }}>
                          {row.step2_total_duration_minutes2 && row.step2_cars_count
                            ? parseFloat(row.step2_total_duration_minutes2 / row.step2_cars_count).toFixed(2)
                            : '0'}
                        </span>
                        นาที/คัน
                      </strong>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนรถทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Typography variant="h5">{row.step2_cars_count + ' คัน'}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนสินค้าที่เข้ารับทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left" colSpan={3}>
                      <Typography variant="h5">
                        {row.step2_total_quantity ? (parseFloat(row.step2_total_quantity) * 1).toLocaleString() + ' ตัน' : '0'}
                      </Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                </>
              ))}
            {items7.length > 0 &&
              items7.map((row, index) => (
                <>
                  <StyledTableRow key={index} style={{ backgroundColor: '#007737a1' }}>
                    <StyledTableCell align="center">
                      <Typography variant="h5">
                        <strong>ICPI (BULK)</strong>
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.queues_counts}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step1_cancel_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.no_order_queues_count - row.step1_cancel_count_no_order}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">
                        {row.step1_waiting_count - (row.no_order_queues_count - row.step1_cancel_count_no_order)}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_processing_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_completed_count}</Typography>
                    </StyledTableCell>
                    {/* <StyledTableCell align="center">
                                            <Typography variant='body1'>{row.step4_completed_count}</Typography>
                                        </StyledTableCell> */}
                  </StyledTableRow>
                  <StyledTableRow sx={{ borderBottom: 'solid 2px', backgroundColor: '#007737a1' }}>
                    <StyledTableCell align="right">
                      <strong>
                        เวลาขึ้นสินค้าฉลี่ย :
                        <span style={{ color: 'red', padding: '0 10px' }}>
                          {row.step2_total_duration_minutes2 && row.step2_cars_count
                            ? parseFloat(row.step2_total_duration_minutes2 / row.step2_cars_count).toFixed(2)
                            : '0'}
                        </span>
                        นาที/คัน
                      </strong>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนรถทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Typography variant="h5">{row.step2_cars_count + ' คัน'}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนสินค้าที่เข้ารับทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left" colSpan={3}>
                      <Typography variant="h5">
                        {row.step2_total_quantity ? (parseFloat(row.step2_total_quantity) * 1).toLocaleString() + ' ตัน' : '0'}
                      </Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                </>
              ))}
            {items8.length > 0 &&
              items8.map((row, index) => (
                <>
                  <StyledTableRow key={index} style={{ backgroundColor: '#eebbc9' }}>
                    <StyledTableCell align="center">
                      <Typography variant="h5">
                        <strong>ICPI ICAM</strong>
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.queues_counts}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step1_cancel_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.no_order_queues_count - row.step1_cancel_count_no_order}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">
                        {row.step1_waiting_count - (row.no_order_queues_count - row.step1_cancel_count_no_order)}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_processing_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_completed_count}</Typography>
                    </StyledTableCell>
                    {/* <StyledTableCell align="center">
                                            <Typography variant='body1'>{row.step4_completed_count}</Typography>
                                        </StyledTableCell> */}
                  </StyledTableRow>
                  <StyledTableRow sx={{ borderBottom: 'solid 2px', backgroundColor: '#eebbc9' }}>
                    <StyledTableCell align="right">
                      <strong>
                        เวลาขึ้นสินค้าฉลี่ย :
                        <span style={{ color: 'red', padding: '0 10px' }}>
                          {row.step2_total_duration_minutes2 && row.step2_cars_count
                            ? parseFloat(row.step2_total_duration_minutes2 / row.step2_cars_count).toFixed(2)
                            : '0'}
                        </span>
                        นาที/คัน
                      </strong>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนรถทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Typography variant="h5">{row.step2_cars_count + ' คัน'}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนสินค้าที่เข้ารับทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left" colSpan={3}>
                      <Typography variant="h5">
                        {row.step2_total_quantity ? (parseFloat(row.step2_total_quantity) * 1).toLocaleString() + ' ตัน' : '0'}
                      </Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                </>
              ))}
            {items9.length > 0 &&
              items9.map((row, index) => (
                <>
                  <StyledTableRow key={index} style={{ backgroundColor: '#fec4a2a3' }}>
                    <StyledTableCell align="center">
                      <Typography variant="h5">
                        <strong>ICPI IVIET</strong>
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.queues_counts}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step1_cancel_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.no_order_queues_count - row.step1_cancel_count_no_order}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">
                        {row.step1_waiting_count - (row.no_order_queues_count - row.step1_cancel_count_no_order)}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step2_processing_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_waiting_count}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography variant="body1">{row.step3_completed_count}</Typography>
                    </StyledTableCell>
                    {/* <StyledTableCell align="center">
                                            <Typography variant='body1'>{row.step4_completed_count}</Typography>
                                        </StyledTableCell> */}
                  </StyledTableRow>
                  <StyledTableRow sx={{ borderBottom: 'solid 2px', backgroundColor: '#fec4a2a3' }}>
                    <StyledTableCell align="right">
                      <strong>
                        เวลาขึ้นสินค้าฉลี่ย :
                        <span style={{ color: 'red', padding: '0 10px' }}>
                          {row.step2_total_duration_minutes2 && row.step2_cars_count
                            ? parseFloat(row.step2_total_duration_minutes2 / row.step2_cars_count).toFixed(2)
                            : '0'}
                        </span>
                        นาที/คัน
                      </strong>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนรถทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Typography variant="h5">{row.step2_cars_count + ' คัน'}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="right" colSpan={2}>
                      <strong>จำนวนสินค้าที่เข้ารับทั้งหมด </strong>
                    </StyledTableCell>
                    <StyledTableCell align="left" colSpan={3}>
                      <Typography variant="h5">
                        {row.step2_total_quantity ? (parseFloat(row.step2_total_quantity) * 1).toLocaleString() + ' ตัน' : '0'}
                      </Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                </>
              ))}
            {/* </>
                            ))
                        } */}
            {/* {items.length > 0 &&
                            items.map((row, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="center">
                                        <Chip color="primary" sx={{ width: '95px' }} label={row.token} />
                                    </TableCell>
                                    <TableCell align="left">{row.station_description}</TableCell>
                                    <TableCell align="left">
                                        <Chip color="primary" sx={{ width: '95px' }} label={row.registration_no} />
                                    </TableCell>
                                    <TableCell align="left">{row.company_name}</TableCell>
                                    <TableCell align="left">{row.driver_name}</TableCell>
                                    <TableCell align="left">{row.driver_mobile}</TableCell>
                                    <TableCell align="center">{row.start_time ? row.start_time.slice(11, 19) : '-'}</TableCell>
                                    <TableCell align="left">{row.elapsed_time ? row.elapsed_time : '-'}</TableCell>
                                    <TableCell align="center">
                                        <Chip color="success" sx={{ width: '110px' }} label={'กำลังชั่งเบา'} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        <TableRow>
                            <TableCell colSpan={11}>
                                <Link color="primary" href="/step2" onClick={preventDefault} sx={{ mt: 3 }}>
                                    รายการทั้งหมด
                                </Link>
                            </TableCell>
                        </TableRow>

                        {items.length == 0 && (
                            <TableRow>
                                <TableCell colSpan={11} align="center">
                                    ไม่พบข้อมูล
                                </TableCell>
                            </TableRow>
                        )} */}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default SummaryQueueList;
