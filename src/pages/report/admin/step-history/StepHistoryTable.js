import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
// import { styled } from '@mui/material/styles';

// import { Link as RouterLink } from 'react-router-dom';
// const apiUrl = process.env.REACT_APP_API_URL;
import * as reserveRequest from '_api/reserveRequest';
import * as stepRequest from '_api/StepRequest';

// material-ui
import {
    Box,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Typography,
    // Button,
    Chip
} from '@mui/material';

// import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

// import moment from 'moment-timezone';

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
        align: 'center',
        disablePadding: true,
        label: 'หมายเลขคิว'
    },
    {
        id: 'queue',
        align: 'center',
        disablePadding: true,
        label: 'หมายเลขคิวเดิม'
    },
    {
        id: 'status_now',
        align: 'center',
        disablePadding: true,
        label: 'สถานะปัจจุบัน'
    },
    {
        id: 'reserves',
        align: 'center',
        disablePadding: true,
        label: 'ข้อมูลการจอง'
    },
    {
        id: 'orders',
        align: 'center',
        disablePadding: false,
        label: 'ข้อมูลคำสั่งซื้อ'
    },
    {
        id: 'weigh',
        align: 'center',
        disablePadding: false,
        label: 'ข้อมูลการชั่งน้ำหนัก'
    },
    {
        id: 'teamLoading',
        align: 'center',
        disablePadding: false,
        label: 'ข้อมูลทีมจ่ายสินค้า'
    },
    {
        id: 'productManages',
        align: 'center',
        disablePadding: false,
        label: 'ข้อมูลกองสินค้าที่จ่าย'
    }
];
import QueueTag from 'components/@extended/QueueTag';
import HistoryPopup from './HistoryPopup';

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
        getCompanys();
        getBrands();
        getOrderSumQty();
    };

    const getOrderSumQty = () => {

        // stepRequest.getAllStep0ByDate('2024-07-17', '2024-07-17').then((response) => {
        stepRequest.getAllStep0ByDate(startDate, endDate).then((response) => {
            response = response.filter((x) => x.step1_status !== "cancle");
            if (onFilter) {
                setItems(response.filter((x) => x.product_company_id === onFilter));
                dataList(response);
                setLoading(false);
            } else {
                setItems(response);
                dataList(response);
                setLoading(false);
            }
            setLoading(false);
        });
        // const requestOptions = {
        //     method: 'GET',
        //     redirect: 'follow'
        // };

        // fetch(apiUrl + '/carstimeinout?start_date=' + startDate + '&end_date=' + endDate, requestOptions)
        //     .then((response) => response.json()) 
        //     .then((result) => {
        //         console.log('onFilter ', onFilter)
        //         if (onFilter !== 0) {
        //             setItems(result.filter((x) => x.product_company_id === onFilter));
        //             dataList(result)
        //             setLoading(false);
        //         } else {
        //             console.log('result ', result);
        //             setItems(result);
        //             dataList(result)
        //             setLoading(false);
        //         }

        //     })
        //     .catch((error) => console.error(error));
    };

    const [companys, setCompanys] = useState([]);
    const getCompanys = () => {
        try {
            reserveRequest.getAllproductCompanys().then((response) => {
                setCompanys(response);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const [brands, setBrands] = useState([]);
    const getBrands = () => {
        try {
            reserveRequest.getAllproductBrand().then((response) => {
                setBrands(response);
            });
        } catch (error) {
            console.log(error);
        }
    };


    const getTokenCompany = (company_id) => {
        const token = companys.filter((x) => x.product_company_id == company_id);

        return token[0]?.product_company_code;
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
                                        <TableCell align="center">
                                            {row.token ? <QueueTag id={row.product_company_id} token={row.token} /> : getTokenCompany(row.product_company_id)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <strong>{row.r_description ? row.r_description : '-'}</strong>
                                        </TableCell>
                                        <TableCell align="center">
                                            <CurrentStatus data={row} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <HistoryPopup
                                                data={row}
                                                types={'reserves'}
                                                title={'ข้อมูลการจอง'}
                                                companyData={companys.find((x) => x.product_company_id === row.product_company_id)}
                                                brandData={brands.find((x) => x.product_brand_id === row.product_brand_id)}
                                                startDate={startDate}
                                                endDate={endDate}
                                            />
                                            {/* <Button variant="contained" color="info">รายละเอียด</Button> */}
                                        </TableCell>
                                        <TableCell align="center">
                                            <HistoryPopup
                                                data={row}
                                                types={'orders'}
                                                title={'ข้อมูลคำสั่งซื้อ'}
                                                companyData={companys}
                                                brandData={brands}
                                                startDate={startDate}
                                                endDate={endDate}
                                            />
                                            {/* <Button variant="contained" >รายละเอียด</Button> */}
                                        </TableCell>
                                        <TableCell align="center">
                                            <HistoryPopup
                                                data={row}
                                                types={'weight'}
                                                title={'ข้อมูลการชั่งน้ำหนัก'}
                                                companyData={companys}
                                                brandData={brands}
                                                startDate={startDate}
                                                endDate={endDate}
                                            />
                                            {/* <Button variant="contained" >รายละเอียด</Button> */}
                                        </TableCell>
                                        <TableCell align="center">
                                            <HistoryPopup
                                                data={row}
                                                types={'teams'}
                                                title={'ข้อมูลทีมจ่ายสินค้า'}
                                                companyData={companys}
                                                brandData={brands}
                                                startDate={startDate}
                                                endDate={endDate}
                                            />
                                            {/* <Button variant="contained">รายละเอียด</Button> */}
                                        </TableCell>
                                        <TableCell align="center">
                                            <HistoryPopup
                                                data={row}
                                                types={'products'}
                                                title={'ข้อมูลกองสินค้า'}
                                                companyData={companys}
                                                brandData={brands}
                                                startDate={startDate}
                                                endDate={endDate}
                                            />
                                            {/* <Button variant="contained" >รายละเอียด</Button> */}
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

// ==============================|| ORDER TABLE - STATUS ||============================== //
const QueueStatus = ({ status, title }) => {
    let color;

    switch (status) {
        case 'pending':
            color = 'error';
            break;
        case 'processing':
            color = 'warning';
            break;
        case 'completed':
            color = 'success';
            break;
        case 'waiting':
            color = 'secondary';
            break;
        case 'cancle':
            color = 'error';
            break;
        default:
            color = 'secondary';
    }

    return (
        <Tooltip title={title}>
            <Chip color={color} label={title} sx={{ minWidth: '132px!important' }} />
        </Tooltip>
    );
};

QueueStatus.propTypes = {
    status: PropTypes.string,
    title: PropTypes.string
};
const CurrentStatus = ({ data }) => {
    const { step1_status, step2_status, step3_status, step4_status } = data;

    const getCurrentStatus = () => {
        if (step1_status === 'waiting') {
            return <QueueStatus status={step1_status} title={'รอชั่งเบา'} />;
        } else if (step1_status === 'processing') {
            return <QueueStatus status={step1_status} title={'กำลังชั่งเบา'} />;
        } else if (step1_status === 'completed') {
            if (step2_status === 'waiting') {
                return <QueueStatus status={step2_status} title={'รอขึ้นสินค้า'} />;
            } else if (step2_status === 'processing') {
                return <QueueStatus status={step2_status} title={'กำลังขึ้นสินค้า'} />;
            } else if (step2_status === 'completed') {
                if (step3_status === 'waiting') {
                    return <QueueStatus status={step3_status} title={'รอชั่งหนัก'} />;
                } else if (step3_status === 'processing') {
                    return <QueueStatus status={step3_status} title={'กำลังชั่งหนัก'} />;
                } else if (step3_status === 'completed') {
                    if (step4_status === 'waiting') {
                        return <QueueStatus status={step4_status} title={'รอออกจากโรงงาน'} />;
                    } else if (step4_status === 'processing') {
                        return <QueueStatus status={step4_status} title={'กำลังออกจากโรงงาน'} />;
                    } else if (step4_status === 'completed') {
                        return <QueueStatus status={step4_status} title={'สำเร็จ'} />;
                    }
                }
            }
        }
        return 'รอออกคิว';
    };

    return (
        <>
            {getCurrentStatus()}
        </>
    );
};

export default StepHistoryTable