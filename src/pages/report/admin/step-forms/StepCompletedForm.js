import React, { useState, useEffect } from 'react';
import * as reportRequest from '_api/reportRequest';
import {
  Box,
  Grid,
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
import moment from 'moment';
import 'moment-timezone';
import { getAllProductCompany } from '_api/StepRequest';

const headCells = [
  { id: 'date-close', align: 'center', disablePadding: false, label: 'วันที่ปิดงาน' },
  { id: 'queue', align: 'center', disablePadding: true, label: 'หมายเลขคิว' },
  { id: 'station', align: 'left', disablePadding: true, label: 'สถานี' },
  { id: 'registration_no', align: 'left', disablePadding: false, label: 'ทะเบียนรถ' },
  { id: 'company', align: 'left', disablePadding: false, label: 'บริษัท/ร้านค้า' },
  { id: 'zone', align: 'center', disablePadding: false, label: 'Zone' },
  { id: 'driveName', align: 'left', disablePadding: false, label: 'ชื่อผู้ขับ' },
  { id: 'tel', align: 'left', disablePadding: false, label: 'เบอร์โทร' },
  { id: 'time-in', align: 'center', disablePadding: false, label: 'เวลาเริ่ม' },
  { id: 'time-out', align: 'center', disablePadding: false, label: 'เวลาเสร็จ' },
  { id: 'time', align: 'center', disablePadding: false, label: 'เวลาที่ใช้' },
  { id: 'weight1', align: 'center', disablePadding: false, label: 'น้ำหนักชั่งเบา' },
  { id: 'weight2', align: 'center', disablePadding: false, label: 'น้ำหนักชั่งหนัก' },
  { id: 'status', align: 'center', disablePadding: false, label: 'สถานะ' }
];

// ฟังก์ชันแปลง HH:MM:SS เป็นวินาที
const convertToSeconds = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

function StepCompletedForm({ stepId, startDate, endDate, companySelect, clickDownload }) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    count: 0,
    totalTime: 0, // รวมเวลาในหน่วยวินาที
    averageTime: 0 // ค่าเฉลี่ยในหน่วยวินาที
  });

  useEffect(() => {
    fetchData();
  }, [stepId, startDate, endDate, companySelect]);

  const fetchData = async () => {
    setLoading(true);
    await getStepCompleted();
  };

  function OrderTableHead() {
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <>
              {(stepId === 1 && headCell.id === 'weight2') ||
                (stepId === 3 && headCell.id === 'weight1') ||
                ((stepId === 2 || stepId === 4) && (headCell.id === 'weight1' || headCell.id === 'weight2')) || (
                  <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'}>
                    {headCell.label}
                  </TableCell>
                )}
            </>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  const getStepCompleted = async () => {
    try {
      const companyData = await getAllProductCompany();
      const response = await reportRequest.getStepCompleted(stepId, startDate, endDate);
      if (response.length > 0) {
        const mappedResponse = response.map((item) => {
          if (item.token) {
            const matchingCompany = companyData.find((company) => {
              return (
                company.product_company_code &&
                item.token.substring(0, company.product_company_code.length) === company.product_company_code
              );
            });
            if (matchingCompany) {
              return { ...item, ...matchingCompany };
            }
          }
          return item;
        });
        let filteredData = mappedResponse;
        if (companySelect && companySelect !== 99) {
          filteredData = mappedResponse.filter((item) => item.product_company_id === companySelect);
        }

        setItems(filteredData);

        // คำนวณ stats จาก filteredData
        const completedItems = filteredData.filter((item) => item.status === 'completed'); // นับเฉพาะรายการที่ completed
        const totalSeconds = completedItems.reduce((sum, item) => sum + convertToSeconds(item.elapsed_time), 0);
        const count = completedItems.length;
        const averageSeconds = count > 0 ? totalSeconds / count : 0;

        setStats({
          count,
          totalTime: totalSeconds,
          averageTime: averageSeconds
        });
        setLoading(false);
      } else {
        setItems([]);
        setStats({ count: 0, totalTime: 0, averageTime: 0 });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // จัดกลุ่มข้อมูลตาม product_company_id
  const groupedItems = items.reduce((groups, item) => {
    const key = item.product_company_id || 'undefined';
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});

  return (
    <Box>
      <Box sx={{ p: '16px 24px!important' }}>
        <Grid alignItems="center" justifyContent="space-between">
          <Grid container rowSpacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5">จำนวนรายการ: {stats.count || '-'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">รวมเวลาที่ใช้ทั้งหมด (นาที): {stats.totalTime ? (stats.totalTime / 60).toFixed(2) : '-'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">
                ค่าเฉลี่ยเวลาที่ใช้ (นาที): {stats.averageTime ? (stats.averageTime / 60).toFixed(2) : '-'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
        ref={clickDownload}
      >
        <Table
          aria-labelledby="tableTitle"
          sx={{
            '& .MuiTableCell-root:first-of-type': { pl: 2 },
            '& .MuiTableCell-root:last-of-type': { pr: 3 }
          }}
        >
          <OrderTableHead />
          {!loading ? (
            <TableBody>
              {items.length > 0 ? (
                Object.entries(groupedItems).map(([companyId, group]) => (
                  <React.Fragment key={companyId}>
                    <TableRow>
                      <TableCell
                        colSpan={13}
                        sx={{
                          backgroundColor: '#f0f0f0',
                          fontWeight: 'bold',
                          fontSize: '1rem'
                        }}
                      >
                        {group[0].product_company_name_th}
                      </TableCell>
                    </TableRow>
                    {group.map((row, index) => (
                      <TableRow key={`${companyId}-${index}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="center">
                          <div style={{ backgroundColor: 'lightBlue', borderRadius: '10px', padding: '7px' }}>
                            {row.end_time ? moment(row.end_time.slice(0, 10)).format('DD/MM/yyyy') : '-'}
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div style={{ backgroundColor: 'lightBlue', borderRadius: '10px', padding: '7px' }}>{row.token}</div>
                        </TableCell>
                        <TableCell align="left">
                          <div style={{ backgroundColor: 'lightBlue', borderRadius: '10px', padding: '7px', fontFamily: 'kanit' }}>
                            {row.station_description}
                          </div>
                        </TableCell>
                        <TableCell align="left">{row.registration_no}</TableCell>
                        <TableCell align="left">{row.company_name}</TableCell>
                        <TableCell align="center">{row.company_description || '-'}</TableCell>
                        <TableCell align="left">{row.driver_name}</TableCell>
                        <TableCell align="left">{row.driver_mobile}</TableCell>
                        <TableCell align="center">{row.start_time ? row.start_time.slice(11, 19) : '-'}</TableCell>
                        <TableCell align="center">{row.end_time ? row.end_time.slice(11, 19) : '-'}</TableCell>
                        <TableCell align="center">{row.elapsed_time ? row.elapsed_time : '-'}</TableCell>
                        {(stepId === 1 || stepId === 3) && <TableCell align="center">{stepId === 1 ? row.weight1 : row.weight2}</TableCell>}
                        <TableCell align="center">
                          {row.status === 'completed' ? (
                            <Chip color="success" label="สำเร็จ" sx={{ minWidth: '78.7px!important' }} />
                          ) : (
                            <Chip color="error" label="ยกเลิก" sx={{ minWidth: '78.7px!important' }} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={13} align="center">
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

export default StepCompletedForm;
