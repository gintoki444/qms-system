import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Get Role use
import { useSelector } from 'react-redux';

import axios from '../../../node_modules/axios/index';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
import * as reseveRequest from '_api/reserveRequest';

// import QRCode from 'react-qr-code';
// import logo from '../../assets/images/ICON-02.png';

// material-ui
import {
  Button,
  Divider,
  Grid,
  Typography,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Backdrop,
  CircularProgress
} from '@mui/material';
import MainCard from 'components/MainCard';
import { DiffOutlined, PrinterOutlined, EditOutlined, RollbackOutlined, CheckCircleOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function ReserveDetail() {
  const [loading, setLoading] = useState(false);
  const userRoles = useSelector((state) => state.auth.roles);

  // =============== Get Reserve ID ===============//
  const [reserveData, setReservData] = useState({});
  const { id } = useParams();
  // const prurl = window.location.origin + '/reserve/update/' + id;
  const getReserve = () => {
    setLoading(true);
    const urlapi = apiUrl + `/reserve/` + id;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          res.data.reserve.map((result) => {
            setReservData(result);
            setLoading(false);
          });
        }
      })
      .catch((err) => console.log(err));
  };

  // =============== Get orders ID ===============//
  const [orderList, setOrderList] = useState([]);
  const getOrders = async () => {
    setLoading(true);

    const urlapi = apiUrl + `/orders/` + id;
    await axios
      .get(urlapi)
      .then((res) => {
        setOrderList(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getReserve();
    getOrders();
  }, [id, userRoles]);

  // ==============================|| Create Queue ||============================== //
  const [open, setOpen] = useState(false);
  const [notifytext, setNotifyText] = useState('');
  const [reserve_id, setReserveId] = useState(0);


  //update การจองในการสร้าง queue
  const updateReserveStatus = (reserve_id) => {
    const reserveStatus = {
      status: 'completed'
    };
    try {
      reseveRequest.putReserveStatus(reserve_id, reserveStatus).then((result) => {
        if (result.status == 'ok') {
          navigate('/reserve');
          setOpen(false);
        } else {
          setOpen(false);
          console.log(message);
        }
      });
    } catch (error) {
      setOpen(false);
      console.log(error);
    }
  };

  const handleClickOpen = (id, total_quantity) => {
    try {
      if (total_quantity === '0') {
        alert('reserve_id: ' + id + ' ไม่พบข้อมูลสั่งซื้อ กรุณาเพิ่มข้อมูล');
        return;
      } else {
        setNotifyText('ต้องการอนุมัติการจองคิวหรือไม่?');
        //กำหนดค่า click มาจากเพิ่มข้อมูลคิว
        setReserveId(id);
        // setTotalQuantity(total_quantity);
        // setBrandCode(brand_code);
        setOpen(true);
      }
    } catch (e) {
      console.log(e);
    }
    //กำหนดข้อความแจ้งเตือน
    // setNotifyText('ต้องการสร้างคิวหรือไม่?');
  };

  const handleClose = (flag) => {
    if (flag === 1) {
      //click มาจากการลบ
      updateReserveStatus(reserve_id);
      setLoading(true);
    }
    setOpen(false);
  };


  const navigate = useNavigate();
  const backToReserce = () => {
    navigate('/reserve');
  };

  const reservePrint = (id) => {
    navigate('/prints/reserve', { state: { reserveId: id, link: '/reserve/detail/' + id } });
  };

  const reserveEdit = (id) => {
    navigate('/reserve/update/' + id);
  };
  return (
    <Grid alignItems="center" justifyContent="space-between">
      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">{'แจ้งเตือน'}</DialogTitle>
        <DialogContent>
          <DialogContentText>{notifytext}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleClose(0)}>
            ยกเลิก
          </Button>
          <Button onClick={() => handleClose(1)} autoFocus>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container rowSpacing={1} columnSpacing={1.75}>
        <Grid item xs={12} lg={9}>
          <MainCard>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h5">ข้อมูลจองคิวรับสินค้า</Typography>
                <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
              </Grid>

              {/* Role 1 Company */}
              <Grid item xs={12}>
                <Typography variant="h5">
                  <u>
                    <strong>ข้อมูลร้านค้า/บริษัท </strong>
                  </u>
                  <Divider sx={{ mb: 1 }} light />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1} sx={{ pl: 2, pr: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" gutterBottom>
                      <strong>ชื่อร้านค้า/บริษัท :</strong> {reserveData.company}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" gutterBottom>
                      <strong>เลขทีผู้เสียภาษี :</strong> {reserveData.tax_no}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" gutterBottom>
                      <strong>วันที่จอง : </strong>
                      {moment(reserveData.pickup_date).format('DD/MM/YYYY')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" gutterBottom>
                      <strong>เบอร์โทรศัพท์ : </strong>
                      {reserveData.phone}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ p: 0, mb: 1 }} />
              </Grid>

              {/* Role 2 Driver */}
              <Grid item xs={12}>
                <Typography variant="h5">
                  <u>
                    <strong>ข้อมูลคนขับรถ </strong>
                  </u>
                </Typography>
                <Divider sx={{ mb: 1 }} light />
              </Grid>
              <Grid item xs={12} md={12}>
                <Grid container spacing={1} sx={{ pl: 2, pr: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" gutterBottom>
                      <strong>ชื่อ :</strong>
                      {reserveData.driver}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" gutterBottom>
                      <strong>เลขที่ใบขับขี่ :</strong>
                      {reserveData.license_no}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" gutterBottom>
                      <strong>เบอร์โทรศัพท์ :</strong>
                      {reserveData.mobile_no}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              {/* Role 3 Product */}
              <Grid item xs={12}>
                <Divider sx={{ p: 0 }} />
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
                <Grid container spacing={1} sx={{ pl: 2, pr: 2, mb: 2 }}>
                  {orderList.map((order, index) => (
                    <Grid item xs={12} key={index} sx={{ mt: 1 }}>
                      <Grid container spacing={2} sx={{ mb: '15px' }}>
                        {' '}
                        <Grid item xs={12} md={6}>
                          <Typography variant="body1">
                            <strong>เลขที่คำสั่งซื้อ : </strong> {order.ref_order_id}
                          </Typography>
                        </Grid>{' '}
                        <Grid item xs={12} md={6}>
                          <Typography variant="body1">
                            <strong>รายละเอียด : </strong> {order.description}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="body1">
                          <u>
                            <strong>ข้อมูลสินค้า </strong>
                          </u>
                        </Typography>
                        <Divider sx={{ mb: 1 }} light />
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Table size="small">
                          <TableBody>
                            {order.items.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell width={'50%'}>{item.name}</TableCell>
                                <TableCell>{item.quantity} ตัน</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>

                {orderList.length === 0 && (
                  <>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="h5">
                        <u>
                          <strong>ข้อมูลสินค้า </strong>
                        </u>
                      </Typography>
                      <Divider sx={{ mb: 1 }} light />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Typography variant="body1">
                        <strong>ไม่มีข้อมูล </strong>
                      </Typography>
                      <Divider sx={{ mb: 1, mt: 2 }} />
                    </Grid>
                  </>
                )}
              </Grid>
              {/* 
              <Grid item xs={12} align="center">
                <Divider sx={{ pt: 1 }} light />
                <Typography variant="h5" gutterBottom>
                  ข้อมูลการรับสินค้า
                </Typography>

                <Grid item xs={12} align="center">
                  <Divider sx={{ p: 2 }} light />
                  <img src={logo} alt="Company Logo" className="logo" style={{ width: '100px', textAlign: 'center' }} />
                  <Divider sx={{ p: 2 }} light />
                </Grid>

                <Grid item xs={12} align="center">
                  <QRCode value={prurl} className="qr-code" size={128} />
                  <Divider sx={{ p: 2 }} light />

                  <Typography variant="body2" gutterBottom>
                    {prurl}
                  </Typography>
                  <Divider sx={{ p: 2 }} light />
                </Grid>
              </Grid> */}
            </Grid>
          </MainCard>
          <Grid item xs={12} sx={{ '& button': { m: 1, mt: 2 } }} align="center">
            {orderList.length > 0 && reserveData.status !== 'completed' && (userRoles === 10 || userRoles === 1) && (
              <Button
                size="mediam"
                variant="outlined"
                color="success"
                disabled={
                  reserveData.status === 'completed' ||
                  reserveData.total_quantity == 0
                }
                onClick={() => handleClickOpen(reserveData.reserve_id, reserveData.total_quantity)}
                startIcon={<CheckCircleOutlined />}
              >
                อนุมัติการจอง
              </Button>
            )}

            {orderList.length > 0 && reserveData.status === 'completed' && (userRoles === 10 || userRoles === 1) && (
              <Button
                size="mediam"
                variant="outlined"
                color="success"
                onClick={() => handleClickOpen(reserveData.reserve_id, reserveData.total_quantity, reserveData.group_code)}
                startIcon={<DiffOutlined />}
              >
                สร้างคิว
              </Button>
            )}

            {orderList.length > 0 && (
              <Button
                size="mediam"
                variant="contained"
                color="info"
                onClick={() => reservePrint(reserveData.reserve_id)}
                startIcon={<PrinterOutlined />}
              >
                พิมพ์
              </Button>
            )}

            {orderList.length > 0 && reserveData.status !== 'completed' && (
              <Button
                size="mediam"
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => reserveEdit(reserveData.reserve_id)}
                startIcon={<EditOutlined />}
              >
                แก้ไขข้อมูล
              </Button>
            )}

            <Button
              size="mediam"
              variant="contained"
              color="error"
              onClick={() => {
                backToReserce();
              }}
              startIcon={<RollbackOutlined />}
            >
              ย้อนกลับ
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ReserveDetail;
