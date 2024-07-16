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
    CircularProgress,
    Typography
    // , Chip
} from '@mui/material';

import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

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
        id: 'queueNum',
        align: 'left',
        disablePadding: true,
        label: 'หมายเลขคิว'
    },
    {
        id: 'queue',
        align: 'center',
        disablePadding: true,
        label: 'คิวเดิม'
    },
    {
        id: 'timeIn',
        align: 'left',
        disablePadding: true,
        label: 'เวลาเข้า'
    },
    {
        id: 'timeOut',
        align: 'left',
        disablePadding: true,
        label: 'เวลาออก'
    },
    {
        id: 'company',
        align: 'left',
        disablePadding: false,
        label: 'ชื่อร้าน'
    },
    {
        id: 'registration_no',
        align: 'left',
        disablePadding: false,
        label: 'ทะเบียนรถ'
    },
    {
        id: 'tel',
        align: 'left',
        disablePadding: false,
        label: 'เบอร์โทร'
    },
    {
        id: 'driveName',
        align: 'left',
        disablePadding: false,
        label: 'ชื่อผู้ขับ'
    },
    {
        id: 'checking1',
        align: 'center',
        disablePadding: false,
        label: 'คลุมผ้าใบ(ตัวแม่)'
    },
    {
        id: 'checking2',
        align: 'center',
        disablePadding: false,
        label: 'คลุมผ้าใบ(ตัวลูก)'
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
function StepHistoryTable({ startDate, endDate, clickDownload, dataList, onFilter }) {
    const [order] = useState('asc');
    const [orderBy] = useState('trackingNo');
    const [loading, setLoading] = useState(true);
    // const [selected] = useState([]);
    //   const currentDate = moment(new Date()).format('YYYY-MM-DD');
    // const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

    // ฟังก์ชันที่ใช้ในการเพิ่ม 0 ถ้าจำนวนน้อยกว่า 10
    // const padZero = (num) => {
    //   return num < 10 ? `0${num}` : num;
    // };
    useEffect(() => {
        fetchData();
        // const intervalId = setInterval(fetchData, 6000); // เรียกใช้ฟังก์ชันทุก 1 นาที (60000 มิลลิวินาที)

        // return () => clearInterval(intervalId); // ลบตัวจับเวลาเมื่อคอมโพเนนต์ถูกยกเลิก
    }, [startDate, endDate, onFilter]);

    const [items, setItems] = useState([]);

    const fetchData = async () => {
        getOrderSumQty();
    };

    const getOrderSumQty = () => {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(apiUrl + '/carstimeinout?start_date=' + startDate + '&end_date=' + endDate, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log('onFilter ', onFilter)
                if (onFilter !== 0) {
                    setItems(result.filter((x) => x.product_company_id === onFilter));
                    dataList(result)
                    setLoading(false);
                } else {
                    console.log('result ', result);
                    setItems(result);
                    dataList(result)
                    setLoading(false);
                }

            })
            .catch((error) => console.error(error));
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
                    ref={clickDownload}
                >
                    <OrderTableHead order={order} orderBy={orderBy} />
                    {!loading ? (
                        <TableBody>
                            {items.length > 0 &&
                                items.map((row, index) => (
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell align="center">{row.token}</TableCell>
                                        <TableCell align="center">{row.reserve_description ? row.reserve_description : '-'}</TableCell>
                                        <TableCell align="left">
                                            <div style={{ backgroundColor: 'lightBlue', borderRadius: '10px', padding: '7px', whiteSpace: 'nowrap' }}>
                                                {/* {row.start_time ? row.start_time.slice(11, 19) : '-'} */}
                                                {row.start_time ? moment(row.start_time.slice(0, 10)).format('DD/MM/YYYY') : ''}
                                                {row.start_time ? ' ' + row.start_time.slice(11, 19) : '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell align="left">
                                            <div style={{ backgroundColor: 'lightBlue', borderRadius: '10px', padding: '7px', whiteSpace: 'nowrap' }}>
                                                {row.end_time ? moment(row.end_time.slice(0, 10)).format('DD/MM/YYYY') : ''}
                                                {row.end_time ? ' ' + row.end_time.slice(11, 19) : '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell align="left">{row.company_name}</TableCell>
                                        <TableCell align="left">{row.registration_no}</TableCell>
                                        <TableCell align="left">{`'${row.driver_mobile}`}</TableCell>
                                        <TableCell align="left">{row.driver_name}</TableCell>
                                        <TableCell align="center">
                                            {row.parent_has_cover == 'Y' ? (
                                                <Typography sx={{ fontSize: 18, color: 'green' }}>
                                                    <CheckCircleOutlined color="success" />
                                                    <span style={{ fontSize: 14, color: 'green', display: 'none', textAlign: 'center' }}>
                                                        {row.parent_has_cover}
                                                    </span>
                                                </Typography>
                                            ) : (
                                                <Typography sx={{ fontSize: 18, color: 'red' }}>
                                                    <CloseCircleOutlined />
                                                    <span style={{ fontSize: 14, color: 'red', display: 'none', textAlign: 'center' }}>N</span>
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.trailer_has_cover == 'Y' ? (
                                                <Typography sx={{ fontSize: 18, color: 'green' }}>
                                                    <CheckCircleOutlined color="success" />
                                                    <span style={{ fontSize: 14, color: 'green', display: 'none', textAlign: 'center' }}>
                                                        {row.trailer_has_cover}
                                                    </span>
                                                </Typography>
                                            ) : (
                                                <Typography sx={{ fontSize: 18, color: 'red' }}>
                                                    <CloseCircleOutlined />
                                                    <span style={{ fontSize: 14, color: 'red', display: 'none', textAlign: 'center' }}>N</span>
                                                </Typography>
                                            )}
                                        </TableCell>
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


export default StepHistoryTable