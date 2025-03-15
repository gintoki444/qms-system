import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Get Role use
import { useSelector } from 'react-redux';

import axios from '../../../node_modules/axios/index';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
import * as queuesRequest from '_api/queueReques';
import * as reserveRequest from '_api/reserveRequest';
import * as stepRequest from '_api/StepRequest';

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
import { DiffOutlined, PrinterOutlined, EditOutlined, RollbackOutlined, ContainerOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function ReserveDetail() {
  const pageId = 8;
  const [loading, setLoading] = useState(false);
  const userRoles = useSelector((state) => state.auth.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);
  const [pageDetail, setPageDetail] = useState([]);
  const currentDate = moment(new Date()).format('YYYY-MM-DD');

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
            setCompanyId(result.product_company_id);
            checkQueueCompanyCount(result.product_company_id);
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

  // =============== Get Product Company ===============//
  const [productCompany, setProductCompany] = useState([]);
  const getProductCompany = () => {
    try {
      reserveRequest.getAllproductCompanys().then((response) => {
        setProductCompany(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [productBrandList, setProductBrandList] = useState([]);
  const getProductBrandList = async () => {
    reserveRequest.getAllproductBrand().then((response) => {
      if (response.length > 0) {
        setProductBrandList(response);
      }
    });
  };

  useEffect(() => {
    getProductBrandList();
    getProductCompany();
    if (Object.keys(userPermission).length > 0) {
      if (userPermission.permission.filter((x) => x.page_id === pageId).length > 0) {
        setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
        getReserve();
        getOrders();
      } else {
        setLoading(false);
      }
    }
  }, [id, userRoles, userPermission]);

  // ==============================|| Create Queue ||============================== //
  const [open, setOpen] = useState(false);
  const [notifytext, setNotifyText] = useState('');
  const [reserve_id, setReserveId] = useState(0);
  // const [total_quantity, setTotalQuantity] = useState(0);
  const [brand_code, setBrandCode] = useState('');
  const [conpany_id, setCompanyId] = useState('');

  // ฟังก์ชันที่ใช้ในการเพิ่ม 0 ถ้าจำนวนน้อยกว่า 10
  const padZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };
  //update การจองในการสร้าง queue
  // const updateReserveStatus = (reserve_id) => {
  //   const reserveStatus = {
  //     status: 'completed'
  //   };
  //   try {
  //     reseveRequest.putReserveStatus(reserve_id, reserveStatus).then((result) => {
  //       if (result.status == 'ok') {
  //         navigate('/reserve');
  //         setOpen(false);
  //       } else {
  //         setOpen(false);
  //         console.log(message);
  //       }
  //     });
  //   } catch (error) {
  //     setOpen(false);
  //     console.log(error);
  //   }
  // };
  // const handleClickOpen = (id, click, total_quantity, brand_code, conpany_id) => {

  const handleClickOpen = (id) => {
    try {
      // if (total_quantity === '0') {
      //   alert('reserve_id: ' + id + ' ไม่พบข้อมูลสั่งซื้อ กรุณาเพิ่มข้อมูล');
      //   return;
      // } else {
      setNotifyText('ต้องการอนุมัติการจองคิวหรือไม่?');
      //กำหนดค่า click มาจากเพิ่มข้อมูลคิว
      setReserveId(id);
      // setTotalQuantity(total_quantity);
      setOpen(true);
      // }
    } catch (e) {
      console.log(e);
    }
    //กำหนดข้อความแจ้งเตือน
    // setNotifyText('ต้องการสร้างคิวหรือไม่?');
  };

  const [onclickSubmit, setOnClickSubmit] = useState(false);
  const handleClose = (flag) => {
    if (flag === 1) {
      setOnClickSubmit(true);
      //click มาจากการลบ
      setLoading(true);
      // addQueue(reserve_id, total_quantity);
      addQueue(reserve_id);
    } else if (flag === 0) {
      setOpen(false);
    }
  };

  async function updateQueuesStatus(queueId) {
    try {
      // ดึง currentDate มาใช้
      const currentDate = await stepRequest.getCurrentDate();

      // ดึงข้อมูล Step ของ Queue มาใช้
      const response = await queuesRequest.getAllStepById(queueId);

      // ใช้ for...of เพื่อรองรับ async/await ภายในลูป
      for (const x of response) {
        const statusData = {
          status: 'waiting',
          station_id: 27,
          updated_at: currentDate
        };

        // ตรวจสอบ remark เพื่อเปลี่ยนแปลง status
        if (x.remark !== 'ชั่งเบา') {
          statusData.status = 'none';
        }

        // บันทึกข้อมูล status ของ step แต่ละตัว
        await stepRequest.updateStatusStep(x.step_id, statusData);
      }

      // เมื่อบันทึกเสร็จสิ้นทั้งหมด
      window.location.href = '/queues/detail/' + queueId;
    } catch (error) {
      console.log(error);
    }
  }

  //ตรวจสอบว่ามีการสร้าง Queue จากข้อมูลการจองหรือยัง
  async function getQueueIdByReserve(reserve_id, status) {
    try {
      await reserveRequest.getQueuesByIdReserve(reserve_id).then((response) => {
        if (status === 'create') {
          updateQueuesStatus(response[0].queue_id);
        } else {
          window.location.href = '/queues/detail/' + response[0].queue_id;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

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

  async function checkQueueCompanyCount(id) {
    const newCurrentDate = await stepRequest.getCurrentDate();
    return await new Promise((resolve) => {
      queuesRequest
        .getQueueTokenByIdCom(id, moment(newCurrentDate).format('YYYY-MM-DD'), moment(newCurrentDate).format('YYYY-MM-DD'))
        .then((response) => {
          if (response) {
            setBrandCode(response.product_company_code);
            resolve(response.queue_count_company_code);
          }
        });
    });
  }
  //สร้าง Queue รับค่า reserve_id
  function createQueuef(reserve_id, brand_code, queue_number) {
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
          // token: brand_code + padZero(reserve_id),
          token: brand_code + padZero(queue_number),
          //"token": brand_code + padZero(reserve_id),
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
      .then(() => {})
      .catch((error) => console.log('error', error));
  };

  // const getQueuesCount = () => {
  //   return new Promise((resolve, reject) => {
  //     const currentDate = moment(new Date()).format('YYYY-MM-DD');

  //     const requestOptions = {
  //       method: 'GET',
  //       redirect: 'follow'
  //     };

  //     fetch(apiUrl + '/queues/count?start_date=' + currentDate + '&end_date=' + currentDate, requestOptions)
  //       .then((response) => response.json())
  //       .then((result) => {
  //         resolve(result['queue_count']);
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // };

  //สร้าง addQueue รับค่า reserve_id ,total_quantity
  // const addQueue = async (id, total_quantity) => {
  const addQueue = async (id) => {
    try {
      //ตรวจสอบข้อมูลคิว มีการสร้างจาก reserve id นี้แล้วหรือยัง
      const queuecountf = await checkQueueDataf(id);

      if (queuecountf === 0) {
        // if (total_quantity > 0) {
        //สร้างข้อมูลคิว
        const queue_number = (await checkQueueCompanyCount(conpany_id)) + 1;

        const queue_id_createf = await createQueuef(id, brand_code, queue_number);

        //แจ้งเตือนหลังจากสร้าง Queue แล้ว
        await getMessageCreateQueue(queue_id_createf, id);

        //สร้าง step 1-4
        await createStepsf(queue_id_createf, id);
        setOpen(false);
        setOnClickSubmit(false);
      } else {
        //alert("สร้างคิวแล้ว")
        updateReserveStatus(reserve_id);
        getQueueIdByReserve(id, 'create');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  //สร้าง ข้อความ Line notification
  const getMessageCreateQueue = async (queue_id, reserve_id) => {
    const queue_info = await getQueue(queue_id);
    const order_info = await getOrder(reserve_id);

    // การดึงข้อมูลสินค้าและจำนวนสินค้าแต่ละชิ้น
    const orderProducts = order_info.map((order) => {
      // เริ่มต้นด้วยข้อความว่าง
      let message_order = '';

      // สร้างข้อความสำหรับแต่ละสินค้า
      order.items.forEach((item) => {
        message_order += 'product: ' + item.name + ', qty: ' + `${parseFloat(item.quantity).toFixed(3)}` + ' ตัน' + '\n';
      });

      // คืนค่าข้อความที่สร้างขึ้นมา
      return message_order;
    });

    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;

    var link = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    link = link + '/queues/detail/' + queue_id;

    const messageLine = queue_info + 'รายการสินค้า:-' + '\n' + orderProducts + '\n' + link;

    lineNotify(messageLine);
    telegramNotify(messageLine);
  };

  function getQueue(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };

        fetch(apiUrl + '/queue/' + id, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            // setQueueToken(result[0]['token'])
            // setQueues(result)

            const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            const token_m = result[0]['token'];
            const company_name_m = 'บริษัท: ' + result[0]['company_name'];
            const registration_no_m = 'ทะเบียนรถ: ' + result[0]['registration_no'];
            const driver_name_m = 'คนขับรถ: ' + result[0]['driver_name'];
            const driver_mobile_m = 'เบอร์โทร: ' + result[0]['mobile_no'];
            const product_name_m = '';

            const textMessage =
              'แจ้งเตือนการสร้างคิว:- ' +
              '\n' +
              'วันที่: ' +
              currentDate +
              '\n' +
              '\n' +
              'หมายเลขคิว: ' +
              token_m +
              '\n' +
              company_name_m +
              '\n' +
              registration_no_m +
              '\n' +
              driver_name_m +
              '\n' +
              driver_mobile_m +
              '\n' +
              product_name_m +
              '\n';

            // setMessage(textMessage)
            resolve(textMessage);
          })
          .catch((error) => console.log('error', error));
      }, 100);
    });
  }

  function getOrder(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };

        fetch(apiUrl + '/orders/' + id, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            // setOrders(result)
            resolve(result);
          })
          .catch((error) => console.log('error', error));
        //resolve('Async operation completed');
      }, 100);
    });
  }

  //สร้าง ขั้นตอนการรับสินค้า
  function createStepsf(queue_id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        let newTran = {
          transactions: [
            {
              order: 1,
              description: 'ชั่งเบา',
              queue_id: queue_id,
              status: 'waiting',
              station_id: 27,
              remark: 'ชั่งเบา',
              created_at: currentDate,
              updated_at: currentDate
            },
            {
              order: 2,
              description: 'ขึ้นสินค้า',
              queue_id: queue_id,
              status: 'none',
              station_id: 27,
              remark: 'ขึ้นสินค้า',
              created_at: currentDate,
              updated_at: currentDate
            },
            {
              order: 3,
              description: 'ชั่งหนัก',
              queue_id: queue_id,
              status: 'none',
              station_id: 27,
              remark: 'ชั่งหนัก ',
              created_at: currentDate,
              updated_at: currentDate
            },
            {
              order: 4,
              description: 'เสร็จสิ้น',
              queue_id: queue_id,
              status: 'none',
              station_id: 27,
              remark: 'เสร็จสิ้น',
              created_at: currentDate,
              updated_at: currentDate
            }
          ]
        };
        if (reserveData.product_brand_id === 45 || reserveData.product_brand_id === 46) {
          newTran.transactions[1].status = 'completed';
        }
        var raw = JSON.stringify(newTran);
        // var raw = JSON.stringify({
        //   transactions: [
        //     {
        //       order: 1,
        //       description: 'ชั่งเบา',
        //       queue_id: queue_id,
        //       status: 'waiting',
        //       station_id: 27,
        //       remark: 'ชั่งเบา',
        //       created_at: currentDate,
        //       updated_at: currentDate
        //     },
        //     {
        //       order: 2,
        //       description: 'ขึ้นสินค้า',
        //       queue_id: queue_id,
        //       status: 'none',
        //       station_id: 27,
        //       remark: 'ขึ้นสินค้า',
        //       created_at: currentDate,
        //       updated_at: currentDate
        //     },
        //     {
        //       order: 3,
        //       description: 'ชั่งหนัก',
        //       queue_id: queue_id,
        //       status: 'none',
        //       station_id: 27,
        //       remark: 'ชั่งหนัก ',
        //       created_at: currentDate,
        //       updated_at: currentDate
        //     },
        //     {
        //       order: 4,
        //       description: 'เสร็จสิ้น',
        //       queue_id: queue_id,
        //       status: 'none',
        //       station_id: 27,
        //       remark: 'เสร็จสิ้น',
        //       created_at: currentDate,
        //       updated_at: currentDate
        //     }
        //   ]
        // });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch(apiUrl + '/transactions', requestOptions)
          .then((response) => response.json())
          .then(() => {
            window.location.href = '/queues/detail/' + queue_id;
          })
          .catch((error) => console.log('error', error));

        resolve('Async operation completed');
      }, 100);
    });
  }

  const lineNotify = (message) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      message: message
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(apiUrl + '/line-notify', requestOptions)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  };

  const telegramNotify = (message) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      message: message
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(apiUrl + '/telegram-notify', requestOptions)
      .then((response) => response.json())
      .catch((error) => console.error(error));
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
        <DialogTitle id="responsive-dialog-title">
          <Typography variant="h5">{'แจ้งเตือน'}</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{notifytext}</DialogContentText>
        </DialogContent>
        <DialogActions align="center" sx={{ justifyContent: 'center!important', p: 2 }}>
          {onclickSubmit == true ? (
            <>
              <CircularProgress color="primary" />
            </>
          ) : (
            <>
              <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
                ยกเลิก
              </Button>
              <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
                ยืนยัน
              </Button>
            </>
          )}
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
                        <Grid item xs={12} md={6}>
                          <Typography variant="body1">
                            <strong>เลขที่คำสั่งซื้อ : </strong> {order.ref_order_id}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body1">
                            <strong>วันที่สั่งซื้อสินค้า : </strong> {moment(order.order_date).format('DD/MM/YYYY')}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body1">
                            <strong>บริษัท(สินค้า) : </strong>{' '}
                            {productCompany.find((x) => x.product_company_id === order.product_company_id)?.product_company_name_th}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body1">
                            <strong>ตราสินค้า : </strong>{' '}
                            {productBrandList.find((x) => x.product_brand_id === order.product_brand_id)?.product_brand_name}
                          </Typography>
                        </Grid>
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
            </Grid>
          </MainCard>

          <Grid item xs={12} sx={{ '& button': { m: 1, mt: 2 } }} align="center">
            {reserveData.status !== 'completed' &&
              pageDetail.length > 0 &&
              (pageDetail[0].permission_name === 'manage_everything' || pageDetail[0].permission_name === 'add_edit_delete_data') && (
                // {(userRoles === 9 || userRoles === 1) && reserveData.status !== 'completed' && (
                <Button
                  size="mediam"
                  variant="outlined"
                  color="success"
                  disabled={
                    reserveData.status === 'completed' ||
                    currentDate !== moment(reserveData.pickup_date).format('YYYY-MM-DD') ||
                    reserveData.car_id == 1 ||
                    reserveData.driver_id == 1 ||
                    ((reserveData.product_brand_id === 45 || reserveData.product_brand_id === 46) &&
                      parseFloat(reserveData.total_quantity) === 0)
                  }
                  onClick={() => handleClickOpen(reserveData.reserve_id, reserveData.total_quantity)}
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
            {reserveData.status === 'completed' && (
              <Button
                size="mediam"
                variant="contained"
                color="primary"
                onClick={() => getQueueIdByReserve(reserveData.reserve_id, 'detail')}
                startIcon={<ContainerOutlined />}
              >
                ข้อมูลคิว
              </Button>
            )}

            {reserveData.status !== 'completed' && (
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
