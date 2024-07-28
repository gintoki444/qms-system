import React, { useState } from 'react';
import {
  Typography,
  Button,
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  //   Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import SalesHeader from './SalesHeader';
import SalesItem from './SalesItem';
import { FileSearchOutlined, LoadingOutlined } from '@ant-design/icons';

const proxyUrl = 'https://asia-southeast1-icp-qms-api.cloudfunctions.net/apia2/navproxy';
import * as navitionRequest from '_api/navitionRequest';

function TestGetNavition({ soNumber, onSetData, proCompanyID }) {
  const [salesHeader, setSalesHeader] = useState(null);
  const [salesLines, setSalesLines] = useState([]);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const measureTime = async (label, fetchFunction) => {
    const start = performance.now();
    const result = await fetchFunction();
    const end = performance.now();
    return { result, time: end - start };
  };

  const getItemsFilterx = (description) => {
    return new Promise((resolve) => {
      try {
        navitionRequest.getProductRegisID(description).then((response) => {
          resolve(response);
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  const getItemFer = async () => {
    let companyName = '';
    let companyNameFull = '';
    if (proCompanyID === 1) {
      companyName = 'Fer';
      companyNameFull = 'Fertilizer';
    } else {
      companyName = 'Inter';
      companyNameFull = 'International';
    }
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Basic bmRhZG1pbjpOZXdkYXduOTk5');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    const response = await fetch(
      proxyUrl + "/DynamicsNAV100/ODataV4/Company('ICP%20" + companyNameFull + "')/OdataItem" + companyName,
      requestOptions
    );
    const result = await response.json();
    return result.value;
  };

  const getSaleHeadFer = async (orderNo) => {
    let companyName = '';
    let companyNameFull = '';
    if (proCompanyID === 1) {
      companyName = 'Fer';
      companyNameFull = 'Fertilizer';
    } else {
      companyName = 'Inter';
      companyNameFull = 'International';
    }
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Basic bmRhZG1pbjpOZXdkYXduOTk5');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    const response = await fetch(
      `${proxyUrl}/DynamicsNAV100/ODataV4/Company('ICP%20${companyNameFull}')/OdataSalesHeader${companyName}?$filter=No eq '${orderNo}'`,
      requestOptions
    );
    const result = await response.json();
    const sales = result.value.find((item) => item.No === orderNo);
    return sales;
  };

  const getSaleLine = async (orderNo) => {
    let companyName = '';
    let companyNameFull = '';
    if (proCompanyID === 1) {
      companyName = 'Fer';
      companyNameFull = 'Fertilizer';
    } else {
      companyName = 'Inter';
      companyNameFull = 'International';
    }
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Basic bmRhZG1pbjpOZXdkYXduOTk5');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    const response = await fetch(
      `${proxyUrl}/DynamicsNAV100/ODataV4/Company('ICP%20${companyNameFull}')/OdataSalesLine${companyName}?$filter=Document_No eq '${orderNo}'`,
      requestOptions
    );
    const result = await response.json();
    const salesline = result.value.filter((item) => item.Document_No === orderNo);
    return salesline;
  };

  const handleSubmit = async (e) => {
    const orderNo = e;
    setLoading(true);
    setOpen(true);
    let companyName = '';
    if (proCompanyID === 1) {
      companyName = 'Fer';
    } else {
      companyName = 'Inter';
    }
    const itemFerResult = await measureTime('GET: /OdataItem' + companyName, getItemFer);
    const salesHeaderResult = await measureTime('GET: /OdataSalesHeader' + companyName, () => getSaleHeadFer(orderNo));
    const salesLineResult = await measureTime('GET: /OdataSalesLine' + companyName, () => getSaleLine(orderNo));

    const setSaleLines = [];
    await salesLineResult.result.map((line) => {
      const items = itemFerResult.result.find((i) => i.No === line.No);
      line.items = items;
      const itemDetails = getItemsFilterx(items.Description);
      itemDetails
        .then((details) => {
          items.Detial = details;
          // คุณสามารถเก็บข้อมูลในตัวแปรหรือทำการประมวลผลต่อจากตรงนี้ได้
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      setSaleLines.push(line);
    });

    setItems(itemFerResult.result);
    setSalesHeader(salesHeaderResult.result);
    setSalesLines(setSaleLines);

    setLoading(false);
  };

  const handleClose = (flag) => {
    if (flag === 1) {
      setOpen(false);
      let setData = items;
      setData.orderSalesHeader = salesHeader;
      setData.orderSalesLines = salesLines;
      const orders = salesHeader;
      orders.item_list = salesLines;
      onSetData(orders);

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

  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title" align="center" sx={{ pt: 0, pb: 0, background: '#93ddff' }}>
          <h2 style={{ marginBottom: '0!important' }}>รายละเอียดคำสั่งซื้อ : {salesHeader?.No}</h2>
        </DialogTitle>
        <DialogContent>
          {salesHeader === null ? (
            <Box align="center" sx={{ pt: 3 }}>
              <Typography variant="body" align="center">
                <CircularProgress color="primary" />
              </Typography>
              <Typography variant="body" align="center">
                Loading
              </Typography>
            </Box>
          ) : (
            <>
              {salesHeader ? (
                <>
                  {salesHeader && <SalesHeader data={salesHeader} />}
                  <h3>รายการสินค้า : </h3>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography fontWeight="bold">ลำดับ</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="bold">รหัสสินค้า</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="bold">ชื่อสินค้า</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="bold">จำนวน (ตัน)</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="bold">จำนวน (กระสอบ)</Typography>
                          </TableCell>
                          {/* <TableCell>
                        <Typography fontWeight="bold">Location</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="bold">QMS:product_id</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="bold">QMS:product_name</Typography>
                      </TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {salesLines.map((line) => {
                          const itemDetails = items.find((i) => i.No === line.No);
                          return (
                            <SalesItem
                              key={line.Line_No}
                              item={line}
                              itemDetails={itemDetails}
                              //   getItemsFilter={getItemsFilterx}
                              //   getItemsFilterName={getItemsFiltery}
                            />
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <Box align="center" sx={{ pt: 3 }}>
                  <Typography variant="h5">ไม่พบข้อมูลคำสั่งซื้อ</Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions align="center" sx={{ justifyContent: 'center!important', p: 2 }}>
          <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
            ยกเลิก
          </Button>
          <Button color="primary" variant="contained" disabled={!salesHeader} onClick={() => handleClose(1)} autoFocus>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="outlined"
        // sx={{ minWidth: '33px!important', p: '9px', fontSize: '18px' }}
        disabled={loading || !soNumber}
        onClick={() => handleSubmit(soNumber)}
      >
        {loading ? (
          <LoadingOutlined />
        ) : (
          <>
            <FileSearchOutlined />
            {'   '}
            Navision
          </>
        )}
      </Button>
    </>
  );
}

export default TestGetNavition;
