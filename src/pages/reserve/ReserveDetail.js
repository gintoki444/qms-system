import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Get Role use
import { useSelector } from 'react-redux';

import axios from '../../../node_modules/axios/index';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

import QRCode from 'react-qr-code';
import logo from '../../assets/images/ICON-02.png';

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

// DateTime
import moment from 'moment';

function ReserveDetail() {
  const [loading, setLoading] = useState(false);
  const userRoles = useSelector((state) => state.auth.roles);

  // =============== Get Reserve ID ===============//
  const [reserveData, setReservData] = useState({});
  const { id } = useParams();
  const prurl = window.location.origin + '/reserve/update/' + id;
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
  const getOrder = async () => {
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
    getOrder();
    getReserve();
  }, [id]);

  // ==============================|| Create Queue ||============================== //
  const [open, setOpen] = useState(false);
  const [notifytext, setNotifyText] = useState('');
  const [reserve_id, setReserveId] = useState(0);
  const [total_quantity, setTotalQuantity] = useState(0);
  const [brand_code, setBrandCode] = useState('');

  // ฟังก์ชันที่ใช้ในการเพิ่ม 0 ถ้าจำนวนน้อยกว่า 10
  const padZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  const handleClickOpen = (id, total_quantity, brand_code) => {
    try {
      if (total_quantity === '0') {
        alert('reserve_id: ' + id + ' ไม่พบข้อมูลสั่งซื้อ กรุณาเพิ่มข้อมูล');
        return;
      } else {
        setNotifyText('ต้องการสร้างคิวหรือไม่?');
        //กำหนดค่า click มาจากเพิ่มข้อมูลคิว
        setReserveId(id);
        setTotalQuantity(total_quantity);
        setBrandCode(brand_code);
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
      addQueue(reserve_id, total_quantity);
    }
    setOpen(false);
  };

  //ตรวจสอบว่ามีการสร้าง Queue จากข้อมูลการจองหรือยัง
  async function checkQueueDataf(reserve_id) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: apiUrl + '/queuecountbyres/' + reserve_id,
      headers: {}
    };
    return await new Promise((resolve) => {
      axios.request(config).then((response) => {
        if (response.data.status === 'ok') {
          response.data.queuecount.map((data) => {
            resolve(data.queuecount);
          });
        } else {
          alert(result['message']);
        }
      });
    });
  }

  //สร้าง Queue รับค่า reserve_id
  function createQueuef(reserve_id, brand_code) {
    return new Promise((resolve) => {
      setTimeout(() => {
        //วันที่ปัจจุบัน
        const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const queueDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        var raw = JSON.stringify({
          reserve_id: reserve_id,
          queue_date: queueDate,
          token: brand_code + padZero(reserve_id),
          description: brand_code + '-Reserver id: ' + padZero(reserve_id),
          created_at: currentDate,
          updated_at: currentDate
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch(apiUrl + '/addqueue', requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (result['status'] === 'ok') {
              //update การจองในการสร้าง queue
              updateReserveStatus(reserve_id);

              resolve(result['results']['insertId']);
            }
          })
          .catch((error) => console.log('error', error));
        //resolve('Async operation completed');
      }, 300);
    });
  }

  //update การจองในการสร้าง queue
  const updateReserveStatus = (reserve_id) => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      status: 'completed'
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(apiUrl + '/updatereservestatus/' + reserve_id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('updatereservestatus: ' + result);
      })
      .catch((error) => console.log('error', error));
  };

  //สร้าง addQueue รับค่า reserve_id ,total_quantity
  const addQueue = async (id, total_quantity) => {
    try {
      //ตรวจสอบข้อมูลคิว มีการสร้างจาก reserve id นี้แล้วหรือยัง
      const queuecountf = await checkQueueDataf(id);

      if (queuecountf === 0) {
        if (total_quantity > 0) {
          //สร้างข้อมูลคิว
          const queue_id_createf = await createQueuef(id, brand_code);

          //สร้าง step 1-4
          await createStepsf(queue_id_createf, id);
        } else {
          alert('reserve_id: ' + id + 'ไม่พบข้อมูลสั่งซื้อ กรุณาเพิ่มข้อมูล');
        }
      } else {
        //alert("สร้างคิวแล้ว")
        const queue_id = await getQueueIdf(id);
        window.location.href = '/queue/' + queue_id + '/' + id;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  //สร้าง ขั้นตอนการรับสินค้า
  function createStepsf(queue_id, reserve_id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        var raw = JSON.stringify({
          transactions: [
            {
              order: 1,
              description: 'ชั่งเบา',
              queue_id: queue_id,
              status: 'waiting',
              station_id: 27,
              remark: 'ทดสอบ-ชั่งเบา',
              created_at: '2024-01-27',
              updated_at: '2024-01-27'
            },
            {
              order: 2,
              description: 'ขึ้นสินค้า',
              queue_id: queue_id,
              status: 'none',
              station_id: 27,
              remark: 'ทดสอบ-ขึ้นสินค้า',
              created_at: '2024-01-15',
              updated_at: '2024-01-15'
            },
            {
              order: 3,
              description: 'ชั่งหนัก',
              queue_id: queue_id,
              status: 'none',
              station_id: 27,
              remark: 'ทดสอบ-ชั่งหนัก ',
              created_at: '2024-01-13',
              updated_at: '2024-01-13'
            },
            {
              order: 4,
              description: 'เสร็จสิ้น',
              queue_id: queue_id,
              status: 'none',
              station_id: 27,
              remark: 'ทดสอบ-เสร็จสิ้น',
              created_at: '2024-01-13',
              updated_at: '2024-01-13'
            }
          ]
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch(apiUrl + '/transactions', requestOptions)
          .then((response) => response.json())
          .then(() => {
            window.location.href = '/queue/' + queue_id + '/' + reserve_id;
          })
          .catch((error) => console.log('error', error));

        resolve('Async operation completed');
      }, 100);
    });
  }

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
        <Grid item xs={12} lg={7}>
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
                <Grid container spacing={1} sx={{ pl: 2, pr: 2 }}>
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
              </Grid>
            </Grid>
          </MainCard>
          <Grid item xs={12} sx={{ '& button': { m: 1 } }}>
            {orderList.length > 0 && reserveData.status !== 'completed' && userRoles === 9 && (
              <Button
                size="mediam"
                variant="outlined"
                color="success"
                onClick={() => handleClickOpen(reserveData.reserve_id, reserveData.total_quantity, reserveData.brand_code)}
              >
                ออกบัตรคิว
              </Button>
            )}

            {orderList.length > 0 && (
              <Button size="mediam" variant="contained" color="info" onClick={() => reservePrint(reserveData.reserve_id)}>
                พิมพ์
              </Button>
            )}

            {orderList.length > 0 && reserveData.status !== 'completed' && (
              <Button size="mediam" type="submit" variant="contained" color="primary" onClick={() => reserveEdit(reserveData.reserve_id)}>
                แก้ไขข้อมูลการจอง
              </Button>
            )}

            <Button
              size="mediam"
              variant="contained"
              color="error"
              onClick={() => {
                backToReserce();
              }}
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
