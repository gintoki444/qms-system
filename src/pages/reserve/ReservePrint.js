import React, { useState, useEffect } from 'react';

import './style/PrintStyles.css';
import logo from '../../assets/images/ICON-02.png';

import QRCode from 'react-qr-code';
import { Grid, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import moment from '../../../node_modules/moment/moment';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { useLocation } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL;

function ReservePrint() {
  const [company, setCompany] = useState('');
  const [registration_no, setRegistrationNo] = useState('');
  const [driver_name, setDriverName] = useState('');
  const [license_no, setLicenseNo] = useState('');
  const [brand_group_description, setBrandGroupDescription] = useState('');
  const [warehouse_description, setWarehouseDescription] = useState('');
  const [reserve_description, setReserveDescription] = useState('');
  const [tax_no, setTaxNo] = useState('');
  const [pickup_date, setPickupDate] = useState('');
  const [orders, setOrders] = useState([]);
  const [total_quantity, setTotalQuantity] = useState([]);

  const location = useLocation();

  const receivedID = location.state?.reserveId;
  const prurl = window.location.host + '/reserve/update/' + receivedID;
  //pickup_date

  useEffect(() => {
    getReserve(receivedID);
    getOrder(receivedID);
  }, []);

  const getReserve = (reserve_id) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    //const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    fetch(apiUrl + '/reserve/' + reserve_id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result['status'] === 'ok') {
          setCompany(result['reserve'][0]['company']);
          setRegistrationNo(result['reserve'][0]['registration_no']);
          setDriverName(result['reserve'][0]['firstname'] + ' ' + result['reserve'][0]['lastname']);
          setLicenseNo(result['reserve'][0]['license_no']);
          setBrandGroupDescription(result['reserve'][0]['brand_group_description']);
          setWarehouseDescription(result['reserve'][0]['warehouse_description']);
          setReserveDescription(result['reserve'][0]['reserve_description']);
          setTaxNo(result['reserve'][0]['tax_no']);
          setPickupDate(result['reserve'][0]['pickup_date']);
          setTotalQuantity(result['reserve'][0]['total_quantity']);
          console.log(result);
        }
      })
      .catch((error) => console.log('error', error));
  };

  const getOrder = (id) => {
    return new Promise(() => {
      setTimeout(() => {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };

        fetch(apiUrl + '/orders/' + id, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            setOrders(result);
          })
          .catch((error) => console.log('error', error));
      }, 300);
    });
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) => (theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900]),
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          padding: '25px'
        }}
      >
        <Grid container paddingTop={'55px'} justifyContent="space-between">
          <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
              <div className="logo-container" style={{ textAlign: 'center' }}>
                <img src={logo} alt="Company Logo" className="logo" style={{ width: '100px', textAlign: 'center' }} />
              </div>
              <div>
                <br></br>
              </div>
            </Box>
            <Box sx={{ flexGrow: 1 }} style={bodyStyle}>
              <div className="slip-info" style={{ textAlign: 'center' }}>
                <p>ข้อมูลการรับสินค้า</p>
                {/* รายละเอียดของ Slip ต่าง ๆ */}
              </div>
              <table>
                <thead></thead>
                <tbody>
                  <tr>
                    <td colSpan={'2'}>
                      <p>
                        <strong>ชื่อบริษัท/ร้านค้า:</strong> {company}
                      </p>
                    </td>
                    <td>
                      <p></p>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={'2'}>
                      <p>
                        <strong>เลขที่ผู้เสียภาษี:</strong> {tax_no}{' '}
                      </p>
                    </td>
                    <td>
                      <p></p>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={'2'}>
                      <p>
                        <strong>เบรน(ตรา)สินค้า: </strong> {brand_group_description}
                      </p>
                    </td>
                    <td>
                      <p></p>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={'2'}>
                      <p>
                        <strong>รายละเอียดการจอง: </strong> {reserve_description}{' '}
                      </p>
                    </td>
                    <td>
                      <p></p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <strong>ชื่อผู้ขับ:</strong> {driver_name}{' '}
                      </p>
                    </td>
                    <td>
                      <p>
                        <strong>ทะเบียนรถ:</strong> {registration_no}{' '}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <strong>เลขที่ใบขับขี่:</strong> {license_no}{' '}
                      </p>
                    </td>
                    <td>
                      <p>
                        <strong>จำนวนสินค้า:</strong> {total_quantity} ตัน{' '}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <strong> คลังสินค้า:</strong> {warehouse_description}{' '}
                      </p>
                    </td>
                    <td>
                      {' '}
                      <p>
                        <strong>วันที่เข้ารับสินค้า:</strong> {pickup_date ? moment(pickup_date).format('dd/MM/yyyy') : '-'}{' '}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>
            <Box>
              <div style={bodyStyle}>
                {orders.map((order) => (
                  <div key={order.order_id}>
                    <h3>
                      <strong>Order ID:</strong> {order.order_id}
                    </h3>
                    <hr />
                    <p>
                      <strong>Order Date:</strong> {order.order_date ? moment(order.rder_date).format('dd/MM/yyyy') : '-'}{' '}
                    </p>
                    <p>
                      <strong>Detail:</strong> {order.description}
                    </p>
                    <p>
                      <strong>Total Amount:</strong> {order.total_amount} ตัน
                    </p>
                    <h3>Items:</h3>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell style={headStyle}>Product Name</TableCell>
                          <TableCell style={headStyle}>Quantity</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <hr /> {/* เพิ่มเส้นขั้นระหว่างแต่ละ order */}
                  </div>
                ))}
              </div>
            </Box>
            <Box>
              <div className="slip-container" style={{ textAlign: 'center', padding: '20px' }}>
                <div className="qr-code-container" style={{ textAlign: 'center' }}>
                  <QRCode value={prurl} className="qr-code" size={128} />
                </div>
                <div>
                  <p>{prurl}</p>
                </div>
              </div>
            </Box>
          </MainCard>
        </Grid>
      </Box>
    </>
  );
}

export default ReservePrint;

const headStyle = {
  fontWeight: 'bold',
  fontFamily: 'kanit',
  fontSize: 16
};

const bodyStyle = {
  fontFamily: 'kanit'
};
