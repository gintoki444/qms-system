import React, { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    Box,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    // Backdrop,
} from '@mui/material';
import MainCard from 'components/MainCard';

// Component สำหรับ Header
const SalesHeader = ({ data }) => (
    <div>
        {/* <p>
            <div style={{ backgroundColor: 'lightBlue', borderRadius: '10px', padding: '7px' }}>
                [ FER ] on {proxyUrl}
            </div>
        </p> */}
        <h2>Order No: {data.No}</h2>
        <Grid container spacing={2}>
            <Grid item xs={6}><b>คิวที่:</b> {data.Queue}</Grid>
            <Grid item xs={6}><b>ทะเบียนรถ:</b> {data.License_Plate_No}</Grid>
            <Grid item xs={6}><b>เลขที่(DO):</b> {data.Delivery_Slip_No}</Grid>
            <Grid item xs={6}><b>รหัสกระสอบ:</b> {data.Ship_to_Code}</Grid>
            <Grid item xs={6}><b>Sale Order No:</b> {data.No}</Grid>
            <Grid item xs={6}><b>วันที่:</b> {new Date(data.Posting_Date).toLocaleDateString()}</Grid>
            <Grid item xs={6}><b>ใบสั่งซื้อเลขที่:</b> {data.External_Document_No}</Grid>
            <Grid item xs={6}><b>หมายเหตุ:</b> {data.Remark}</Grid>
            <Grid item xs={6}><b>รหัสผู้ซื้อ:</b> {data.Sell_to_Customer_No}</Grid>
            <Grid item xs={6}><b>ชื่อผู้ซื้อ:</b> {data.Sell_to_Customer_Name}</Grid>
            <Grid item xs={6}><b>รหัสคลังสินค้า:</b> {data.Location_Code}</Grid>
            <Grid item xs={6}><b>ชื่อคลังสินค้า:</b> {data.LocationName}</Grid>
            <Grid item xs={6}><b>เวลาเริ่มขึ้นสินค้า:</b> {data.Time_In_Truck}</Grid>
        </Grid>
    </div>
);

// Component สำหรับ Item
const SalesItem = ({ item, itemDetails }) => (
    <TableRow>
        <TableCell>{item.Line_No}</TableCell>
        <TableCell>{itemDetails.No}</TableCell>
        <TableCell>{itemDetails.Description}</TableCell>
        <TableCell align="right">{item.Quantity}</TableCell>
        <TableCell align="right">{item.QuantityBag}</TableCell>
        <TableCell>{item.LocationName}</TableCell>
    </TableRow>
);

const proxyUrl = 'https://us-central1-queuesystemapi.cloudfunctions.net/api/navproxy';

function GetOrderNavision() {
    const [salesHeader, setSalesHeader] = useState(null);
    const [salesLines, setSalesLines] = useState([]);
    const [items, setItems] = useState([]);
    const [orderNo, setOrderNo] = useState('');
    // const [errors, setErrors] = useState({});
    const [timeData, setTimeData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    const measureTime = async (label, fetchFunction) => {
        console.time(label);
        const start = performance.now();
        const result = await fetchFunction();
        const end = performance.now();
        console.timeEnd(label);
        return { result, time: end - start };
    }

    const getItemFer = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic bmRhZG1pbjpOZXdkYXduOTk5");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        const response = await fetch(proxyUrl + "/DynamicsNAV100/ODataV4/Company('ICP%20Fertilizer')/OdataItemFer", requestOptions);
        const result = await response.json();
        return result.value;
    }

    const getSaleHeadFer = async (orderNo) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic bmRhZG1pbjpOZXdkYXduOTk5");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        const response = await fetch(`${proxyUrl}/DynamicsNAV100/ODataV4/Company('ICP%20Fertilizer')/OdataSalesHeaderFer`, requestOptions);
        const result = await response.json();
        const sales = result.value.find(item => item.No === orderNo);
        return sales;
    }

    const getSaleLine = async (orderNo) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic bmRhZG1pbjpOZXdkYXduOTk5");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        const response = await fetch(`${proxyUrl}/DynamicsNAV100/ODataV4/Company('ICP%20Fertilizer')/OdataSalesLineFer`, requestOptions);
        const result = await response.json();
        const salesline = result.value.filter(item => item.Document_No === orderNo);
        return salesline;
    }

    const handleTextChange = (e) => {
        setOrderNo(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setOpen(true);

        const itemFerResult = await measureTime('GET: /OdataItemFer', getItemFer);
        const salesHeaderResult = await measureTime('GET: /OdataSalesHeaderFer', () => getSaleHeadFer(orderNo));
        const salesLineResult = await measureTime('GET: /OdataSalesLineFer', () => getSaleLine(orderNo));

        setItems(itemFerResult.result);
        setSalesHeader(salesHeaderResult.result);
        setSalesLines(salesLineResult.result);

        console.log(salesHeaderResult.result);
        console.log(salesLineResult.result);

        const totalTime = salesHeaderResult.time + salesLineResult.time;
        setTimeData([
            { API: '(1) GET: /OdataItemFer', Time: itemFerResult.time.toFixed(2) + ' ms' },
            { API: '(2) GET: /OdataSalesHeaderFer', Time: salesHeaderResult.time.toFixed(2) + ' ms' },
            { API: '(3) GET: /OdataSalesLineFer', Time: salesLineResult.time.toFixed(2) + ' ms' },
            { Summary: `FER ใช้เวลารวม (2) + (3) = ${totalTime.toFixed(2)} ms ในการแสดงข้อมูล 1 รายการ` }
        ]);
        setLoading(false);
    }

    useEffect(() => {
        // handleSubmit(new Event('submit'));
    }, []);


    const handleClose = (flag) => {
        if (flag === 1) {
            setOpen(false);
            setSalesHeader(null);
            setItems([]);
            setSalesLines([]);

        } else if (flag === 0) {
            setOpen(false);
            setSalesHeader(null);
            setItems([]);
            setSalesLines([]);
        }
    };

    const totalQuantity = salesLines.reduce((sum, line) => sum + line.Quantity, 0);
    const totalQuantityBag = salesLines.reduce((sum, line) => sum + line.QuantityBag, 0);

    return (
        <>
            <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title" align="center">
                    <h2 style={{ marginBottom: '0!important' }}>รายละเอียด Order : {salesHeader?.No}</h2>
                </DialogTitle>
                <DialogContent>
                    {console.log(salesHeader)}
                    {salesHeader === null ? (
                        //     <Backdrop
                        //     sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
                        //     open={loading}
                        // >
                        //     <CircularProgress color="primary" />
                        // </Backdrop>
                        <Typography variant="body" align="center">
                            <CircularProgress color="primary" />
                            Loading
                        </Typography>
                    ) : (<>
                        {salesHeader && <SalesHeader data={salesHeader} />}
                        <h2 style={{ marginTop: '0!important' }}>Items:</h2>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><Typography fontWeight="bold">ลำดับ</Typography></TableCell>
                                        <TableCell><Typography fontWeight="bold">รหัสสินค้า</Typography></TableCell>
                                        <TableCell><Typography fontWeight="bold">ชื่อสินค้า</Typography></TableCell>
                                        <TableCell><Typography fontWeight="bold">จำนวน(ตัน)</Typography></TableCell>
                                        <TableCell><Typography fontWeight="bold">จำนวน(กระสอบ)</Typography></TableCell>
                                        <TableCell><Typography fontWeight="bold">โลเคชั่น</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {salesLines.map(line => {
                                        const itemDetails = items.find(i => i.No === line.No);
                                        return <SalesItem key={line.Line_No} item={line} itemDetails={itemDetails} />;
                                    })}
                                    <TableRow>
                                        <TableCell colSpan={3} align="right"><b>รวมทั้งสิ้น:</b></TableCell>
                                        <TableCell align="right"><b>{totalQuantity}</b></TableCell>
                                        <TableCell align="right"><b>{totalQuantityBag}</b></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <h2>API Call Times:</h2>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><Typography fontWeight="bold">API</Typography></TableCell>
                                        <TableCell><Typography fontWeight="bold">Time</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {timeData.map((time, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{time.API || time.Summary}</TableCell>
                                            <TableCell>{time.Time || ''}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>)
                    }
                </DialogContent>

                <DialogActions align="center" sx={{ justifyContent: 'center!important', p: 2 }}>
                    <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
                        ยกเลิก
                    </Button>
                    <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
                        ยืนยัน
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid item xs={12}>
                <MainCard content={false}>
                    <div style={{ padding: '20px' }}>
                        <form onSubmit={handleSubmit}>
                            <TableContainer component={Paper}>
                                <div style={{ padding: 10 }}>
                                    <Box display="flex" alignItems="center">
                                        <TextField
                                            required
                                            fullWidth
                                            id="reforder_id"
                                            label="NA Order ID"
                                            name="reforder_id"
                                            value={orderNo}
                                            onChange={handleTextChange}
                                            // error={!!errors.text2}
                                            // helperText={errors.text2 ? 'กรุณากรอก Order ID' : ''}
                                            autoComplete="reforder_id"
                                            size="small"
                                        />
                                        <Box marginLeft={2}>
                                            <Button variant="outlined" type="submit" disabled={loading}>
                                                {loading ? 'Loading...' : 'Navision...API'}
                                            </Button>
                                        </Box>
                                    </Box>
                                </div>
                            </TableContainer>
                        </form>
                    </div>
                </MainCard>
            </Grid>
        </>
    );
}

export default GetOrderNavision;
