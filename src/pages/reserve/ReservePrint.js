import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './style/PrintStyles.css';
import logo from '../../assets/images/ICON-02.png';

import QRCode from 'react-qr-code';

import { Grid, Paper, Typography, Button, Divider, Backdrop, CircularProgress } from '@mui/material';
import moment from '../../../node_modules/moment/moment';

import { useLocation } from 'react-router-dom';

const printPageStyle = {
  width: '210mm',
  minHeight: '297mm',
  padding: '24px 42px',
  margin: 'auto'
};

const apiUrl = process.env.REACT_APP_API_URL;

function ReservePrint() {
  const [open, setOpen] = useState(false);
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
  const backLink = location.state?.link;
  const prurl = window.location.origin + '/reserve/update/' + receivedID;

  //pickup_date
  const navigate = useNavigate();
  useEffect(() => {
    if (!receivedID) {
      navigate('/reserve');
    }
    getReserve(receivedID);
    getOrder(receivedID);
  }, []);

  const getReserve = (reserve_id) => {
    setOpen(true);
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
            setOpen(false);
          })
          .catch((error) => console.log('error', error));
      }, 300);
    });
  };

  // ========= [ Click print ]  ========= //
  const [isPrinting, setIsPrinting] = useState(false);
  const handlePrint = () => {
    setIsPrinting(true);

    setTimeout(() => {
      window.print();
    }, 500);

    setTimeout(() => {
      setIsPrinting(false);
    }, 1000);
  };

  const backTo = () => {
    navigate(backLink);
  };
  return (
    <>
      <Paper style={{ ...printPageStyle }} elevation={2}>
        {open && (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
            open={open}
          >
            <CircularProgress color="primary" />
          </Backdrop>
        )}
        <Grid alignItems="center" justifyContent="space-between">
          <Grid container rowSpacing={1} columnSpacing={2.75} sx={{ pt: 4 }}>
            <Grid item xs={12} align="center">
              <img src={logo} alt="Company Logo" className="logo" style={{ width: '100px', textAlign: 'center' }} />
              <Typography variant="h4" gutterBottom>
                ข้อมูลการรับสินค้า
              </Typography>
              <Divider light sx={{ mb: 5 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                <strong>
                  <u>ข้อมูลบริษัท/ร้านค้า</u>
                </strong>
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                <strong>ชื่อบริษัท/ร้านค้า:</strong> {company}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                <strong>เลขที่ผู้เสียภาษี:</strong> {tax_no}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                <strong>เบรน(ตรา)สินค้า: </strong> {brand_group_description}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                <strong>รายละเอียดการจอง: </strong> {reserve_description}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ mb: 1 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                <strong>
                  <u>ข้อมูลรถและคนขับรถ</u>
                </strong>
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                <strong>ชื่อผู้ขับ:</strong> {driver_name}{' '}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                <strong>ทะเบียนรถ:</strong> {registration_no}{' '}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                <strong>เลขที่ใบขับขี่:</strong> {license_no}{' '}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                <strong>จำนวนสินค้า:</strong> {total_quantity} ตัน{' '}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                <strong> คลังสินค้า:</strong> {warehouse_description}{' '}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                <strong>วันที่เข้ารับสินค้า:</strong> {pickup_date ? moment(pickup_date).format('DD/MM/yyyy') : '-'}{' '}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ mb: 1 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5">
                <u>
                  <strong>ข้อมูลรายการสั่งซื้อสินค้า </strong>
                </u>
                <Divider sx={{ mb: 1 }} light />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {orders.map((order) => (
                <Grid container rowSpacing={0} columnSpacing={2.75} key={order.order_id}>
                  <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                      <strong>เลขที่ใบสั่งซื้อ :</strong> {order.ref_order_id}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                      <strong>วันที่สั่งซื้อ :</strong> {order.order_date ? moment(order.rder_date).format('dd/MM/yyyy') : '-'}{' '}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom>
                      <strong>รายละเอียด : </strong> {order.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 1, ml: 1, mr: 1 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>ข้อมูลสินค้า</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ ml: 1, mr: 1 }}>
                    {order.items.map((item) => (
                      <Grid container rowSpacing={0} columnSpacing={2.75} key={item.item_id}>
                        <Grid item xs={6}>
                          <Typography variant="body1" gutterBottom>
                            <strong>สินค้า :</strong> {item.name}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body1" gutterBottom>
                            <strong>จำนวน : </strong>
                            {item.quantity} ตัน
                          </Typography>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ mb: 1 }} />
            </Grid>

            <Grid item xs={12} align="center" sx={{ mt: 3 }}>
              <QRCode value={prurl} className="qr-code" size={128} />

              <Typography variant="body1" gutterBottom>
                {prurl}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{ '& button': { m: 1 }, mt: 3 }} align="center">
            <Button variant="contained" color="primary" onClick={handlePrint} style={{ display: isPrinting ? 'none' : 'inline-flex' }}>
              พิมพ์
            </Button>

            <Button variant="contained" color="error" onClick={backTo} style={{ display: isPrinting ? 'none' : 'inline-flex' }}>
              ย้อนกลับ
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default ReservePrint;

// const headStyle = {
//   fontWeight: 'bold',
//   fontFamily: 'kanit',
//   fontSize: 16
// };

// const bodyStyle = {
//   fontFamily: 'kanit'
// };
