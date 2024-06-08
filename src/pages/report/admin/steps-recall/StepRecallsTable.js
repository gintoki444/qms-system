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
  Typography,
  Chip
} from '@mui/material';

// import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

import moment from 'moment-timezone';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'NO.',
    align: 'center',
    disablePadding: false,
    label: 'ลำดับ'
  },
  {
    id: 'dateRecall',
    align: 'left',
    disablePadding: true,
    label: 'วันที่ทวนสอบ'
  },
  {
    id: 'queueNum',
    align: 'center',
    disablePadding: true,
    label: 'หมายเลขคิว'
  },
  {
    id: 'stations',
    align: 'left',
    disablePadding: true,
    label: 'สถานี'
  },
  {
    id: 'registration_no',
    align: 'left',
    disablePadding: false,
    label: 'ทะเบียนรถ'
  },
  {
    id: 'company',
    align: 'left',
    disablePadding: false,
    label: 'บริษัท/ร้านค้า'
  },
  {
    id: 'driveName',
    align: 'left',
    disablePadding: false,
    label: 'ชื่อผู้ขับ'
  },
  {
    id: 'tel',
    align: 'left',
    disablePadding: false,
    label: 'เบอร์โทร'
  },
  {
    id: 'timeIn',
    align: 'left',
    disablePadding: false,
    label: 'เวลาเริ่ม'
  },
  // {
  //   id: 'timeOut',
  //   align: 'left',
  //   disablePadding: false,
  //   label: 'เวลาเสร็จ'
  // },
  // {
  //   id: 'times',
  //   align: 'left',
  //   disablePadding: false,
  //   label: 'เวลาที่ใช้'
  // },
  {
    id: 'status',
    align: 'center',
    disablePadding: false,
    label: 'สถานะ'
  },
  {
    id: 'details',
    align: 'left',
    disablePadding: false,
    label: 'สาเหตุ'
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

function StepRecallsTable({
  startDate,
  endDate,
  // , clickDownload
  dataList
}) {
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
  }, [startDate, endDate]);

  const [items, setItems] = useState([]);

  const fetchData = async () => {
    getAllRecall();
  };

  const getAllRecall = () => {
    setLoading(true);
    try {
      reportRequest.getStepsRecall(startDate, endDate).then((response) => {
        setItems(response);
        dataList(response);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
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
          // ref={clickDownload}
        >
          <OrderTableHead order={order} orderBy={orderBy} />
          {!loading ? (
            <TableBody>
              {items.length > 0 &&
                items.map((row, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">
                      <div style={{ backgroundColor: 'lightBlue', borderRadius: '10px', padding: '7px', whiteSpace: 'nowrap' }}>
                        {/* {row.start_time ? row.start_time.slice(11, 19) : '-'} */}
                        {row.created_date ? moment(row.created_date.slice(0, 10)).format('DD/MM/YYYY') : ''}
                        {/* {row.created_date ? ' ' + row.created_date.slice(11, 19) : '-'} */}
                      </div>
                    </TableCell>
                    <TableCell align="center">{row.recall_data.token}</TableCell>
                    {/* <TableCell align="center">{padZero(row.queue_number)}</TableCell> */}
                    <TableCell align="left">
                      <div style={{ backgroundColor: 'lightBlue', borderRadius: '10px', padding: '7px', whiteSpace: 'nowrap' }}>
                        {row.recall_data.station_description}
                      </div>
                    </TableCell>
                    <TableCell align="left">{row.recall_data.registration_no}</TableCell>
                    <TableCell align="left">{row.recall_data.company_name}</TableCell>
                    <TableCell align="left">{row.recall_data.driver_name}</TableCell>
                    <TableCell align="left">{row.recall_data.driver_mobile}</TableCell>
                    <TableCell align="left">{row.recall_data.start_time ? row.recall_data.start_time.slice(11, 19) : '-'}</TableCell>
                    {/* <TableCell align="center">{row.recall_data.end_time ? row.recall_data.end_time.slice(11, 19) : '-'}</TableCell>
                    <TableCell align="center">{row.recall_data.elapsed_time ? row.recall_data.elapsed_time : '-'}</TableCell> */}
                    <TableCell align="center">
                      {row.recall_data.status == 'completed' && (
                        <Chip color={'success'} label={'สำเร็จ'} sx={{ minWidth: '78.7px!important' }} />
                      )}
                      {row.recall_data.status == 'processing' && (
                        <Chip color={'warning'} label={'รอตรวจสอบ'} sx={{ minWidth: '78.7px!important' }} />
                      )}
                    </TableCell>

                    <TableCell align="left">{row.remark}</TableCell>
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

export default StepRecallsTable;
