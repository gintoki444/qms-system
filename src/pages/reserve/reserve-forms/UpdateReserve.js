import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from '../../../../node_modules/axios/index';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
// const userId = localStorage.getItem('user_id');

// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from '@mui/material';
import MainCard from 'components/MainCard';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
// import { SaveOutlined, DiffOutlined, PrinterOutlined, RollbackOutlined } from '@ant-design/icons';
import { DiffOutlined, PlusCircleOutlined, PrinterOutlined, SaveOutlined, RollbackOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function UpdateReserve() {
  const userRoles = useSelector((state) => state.auth.roles);
  const [loading, setLoading] = useState(false);
  const [checkDate, setCheckDate] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const dateNow = moment(new Date()).format('YYYY-MM-DD');
  const [user_Id, setUserId] = useState(false);

  // =============== Get Reserve ID ===============//
  const [reservationData, setReservationData] = useState({
    description: '',
    company_id: '',
    car_id: '',
    driver_id: '',
    status: 'waiting',
    total_quantity: '',
    pickup_date: '',
    brand_group_id: '',
    warehouse_id: '',
    created_at: '',
    updated_at: '',
    firstname: '',
    lastname: '',
    role: '',
    country: '',
    email: '',
    avatar: '',
    name: '',
    open_time: '',
    tax_no: '',
    phone: '',
    address: '',
    zipcode: '',
    contact_person: '',
    contact_number: '',
    registration_no: '',
    brand: '',
    color: '',
    license_no: '',
    mobile_no: '',
    r_description: '',
    company: '',
    driver: ''
  });
  const { id } = useParams();

  const getReserve = () => {
    setLoading(true);
    const urlapi = apiUrl + `/reserve/` + id;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          res.data.reserve.map((result) => {
            console.log(result.user_id);
            setUserId(result.user_id);
            if (currentDate == moment(result.pickup_date).format('YYYY-MM-DD')) {
              setCheckDate(true);
            }
            setReservationData(result);
            getCompanyLsit();
          });
        }
      })
      .catch((err) => console.log(err));
  };

  // =============== Get Company ===============//
  const [companyList, setCompanyList] = useState([]);
  const getCompanyLsit = () => {
    console.log('user_Id', user_Id);
    const urlapi = apiUrl + `/allcompany/` + user_Id;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          setCompanyList(res.data);
          getCarLsit();
        }
      })
      .catch((err) => console.log(err));
  };

  // =============== Get Car ===============//
  const [carList, setCarList] = useState([]);
  const getCarLsit = () => {
    const urlapi = apiUrl + `/allcars/` + user_Id;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          setCarList(res.data);
          getDriverLsit();
        }
      })
      .catch((err) => console.log(err));
  };

  // =============== Get Driver ===============//
  const [driverList, setDriverList] = useState([]);
  const getDriverLsit = () => {
    const urlapi = apiUrl + `/alldrivers/` + user_Id;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          setDriverList(res.data);
          getOrders();
        }
      })
      .catch((err) => console.log(err));
  };

  // =============== Get Brand ===============//
  const [brandList, setBrandList] = useState([]);
  const getBrandList = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    fetch(apiUrl + '/allproductbrandgroup', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setBrandList(result);
      })
      .catch((error) => console.log('error', error));
  };

  // =============== Get Warehouses ===============//
  const [warehousesList, setWarehousesList] = useState([]);
  const getWarehouses = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    fetch(apiUrl + '/allwarehouses', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setWarehousesList(result);
      })
      .catch((error) => console.log('error', error));
  };

  // =============== Get order ===============//
  const [orderList, setOrderList] = useState([]);
  const getOrders = async () => {
    const urlapi = apiUrl + `/orders/` + id;
    await axios
      .get(urlapi)
      .then((res) => {
        setOrderList(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  // =============== useEffect ===============//
  useEffect(() => {
    getReserve();
    if (user_Id) {
      getWarehouses();
      getBrandList();
    }
    // getProduct();
  }, [user_Id]);

  // =============== Validate Forms ===============//
  const validationSchema = Yup.object().shape({
    company_id: Yup.string().required('กรุณาเลือกบริษัท/ร้านค้า'),
    brand_group_id: Yup.string().required('กรุณาเลือกกลุ่มสินค้า'),
    pickup_date: Yup.string().required('กรุณาเลือกวันที่เข้ารับสินค้า'),
    description: Yup.string().required('กรุณากรอกiรายละเอียดการจอง')
  });

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values, { setErrors, setStatus, setSubmitting }) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    try {
      values.user_id = user_Id;
      values.pickup_date = moment(values.pickup_date).format('YYYY-MM-DD HH:mm:ss');
      values.created_at = currentDate;
      values.updated_at = currentDate;

      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: apiUrl + `/updatereserve/${id}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: values
      };

      console.log('values :', values);

      axios
        .request(config)
        .then((result) => {
          if (result.data.status === 'ok') {
            window.location.href = '/reserve';
          } else {
            alert(result['message']['sqlMessage']);
          }

          setStatus({ success: false });
          setSubmitting(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  // =============== เพิ่มรายการสินค้า ===============//
  const addOrder = () => {
    window.location = `/order/add/${id}`;
    // navigate(`/order/add/${id}`);
  };

  const navigate = useNavigate();

  const backToReserce = () => {
    navigate('/reserve');
  };

  const initialValue = {
    company_id: reservationData.company_id || '',
    car_id: reservationData.car_id || '',
    brand_group_id: reservationData.brand_group_id || '',
    driver_id: reservationData.driver_id || '',
    description: reservationData.description,
    pickup_date: moment(reservationData.pickup_date).format('YYYY-MM-DD'),
    warehouse_id: reservationData.warehouse_id || '',
    status: reservationData.status,
    total_quantity: reservationData.total_quantity
  };

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
        console.log('id :', id);
        console.log('total_quantity :', total_quantity);
        console.log('brand_code :', brand_code);

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
      setLoading(true);
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
          const queue_number = (await getQueuesCount()) + 1;

          const queue_id_createf = await createQueuef(id, brand_code, queue_number);

          //แจ้งเตือนหลังจากสร้าง Queue แล้ว
          await getMessageCreateQueue(queue_id_createf, id);

          //สร้าง step 1-4
          //createStep(queue_id_createf)
          await createStepsf(queue_id_createf);
          setLoading(true);
        } else {
          alert('reserve_id: ' + id + 'ไม่พบข้อมูลสั่งซื้อ กรุณาเพิ่มข้อมูล');
        }
      } else {
        //alert("สร้างคิวแล้ว")
        // const queue_id = await getQueueIdf(id);
        window.location.href = '/queues/detail/' + queue_id;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  //สร้าง get Queues Counts
  const getQueuesCount = () => {
    return new Promise((resolve, reject) => {
      const currentDate = moment(new Date()).format('YYYY-MM-DD');

      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      fetch(apiUrl + '/queues/count?start_date=' + currentDate + '&end_date=' + currentDate, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          resolve(result['queue_count']);
        })
        .catch((error) => {
          reject(error);
        });
    });
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
            window.location.href = '/queues/detail/' + queue_id;
          })
          .catch((error) => console.log('error', error));

        resolve('Async operation completed');
      }, 100);
    });
  }

  //สร้าง Message lineNotify
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
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));
  };

  const reservePrint = (id) => {
    navigate('/prints/reserve', { state: { reserveId: id, link: '/reserve/update/' + id } });
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
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmits} enableReinitialize={true}>
            {({ handleBlur, handleChange, handleSubmit, isSubmitting, values, touched, errors }) => (
              <form noValidate onSubmit={handleSubmit}>
                <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h5">ข้อมูลจองคิวรับสินค้า</Typography>
                      <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>บริษัท/ร้านค้า*</InputLabel>
                        <TextField
                          select
                          variant="outlined"
                          name="company_id"
                          value={values.company_id}
                          onChange={handleChange}
                          placeholder="เลือกบริษัท/ร้านค้า"
                          onBlur={handleBlur}
                          fullWidth
                        >
                          {companyList.map((companias) => (
                            <MenuItem key={companias.company_id} value={companias.company_id}>
                              {companias.name}
                            </MenuItem>
                          ))}
                        </TextField>
                        {touched.company_id && errors.company_id && (
                          <FormHelperText error id="helper-text-company-car">
                            {errors.company_id}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>กลุ่มสินค้า*</InputLabel>
                        <TextField
                          select
                          variant="outlined"
                          name="brand_group_id"
                          value={values.brand_group_id}
                          onChange={handleChange}
                          placeholder="เลือกกลุ่มสินค้า"
                          fullWidth
                        >
                          {brandList.map((brand) => (
                            <MenuItem key={brand.brand_group_id} value={brand.brand_group_id}>
                              {brand.group_code} - {brand.description}
                            </MenuItem>
                          ))}
                        </TextField>
                        {touched.brand_group_id && errors.brand_group_id && (
                          <FormHelperText error id="helper-text-company-car">
                            {errors.brand_group_id}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>รถบรรทุก</InputLabel>
                        <TextField
                          select
                          variant="outlined"
                          name="car_id"
                          value={values.car_id}
                          onChange={handleChange}
                          placeholder="เลือกรถบรรทุก"
                          fullWidth
                        >
                          <MenuItem value="" disabled>
                            <em>Placeholder</em>
                          </MenuItem>
                          {carList.map((cars) => (
                            <MenuItem key={cars.car_id} value={cars.car_id}>
                              {cars.registration_no} : {cars.brand}
                            </MenuItem>
                          ))}
                        </TextField>
                        {touched.company && errors.company && (
                          <FormHelperText error id="helper-text-company-car">
                            {errors.company}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>คนขับรถ</InputLabel>
                        <TextField
                          select
                          variant="outlined"
                          type="date"
                          name="driver_id"
                          value={values.driver_id}
                          onChange={handleChange}
                          placeholder="เลือกคนขับรถ"
                          fullWidth
                        >
                          {driverList.map((driver) => (
                            <MenuItem key={driver.driver_id} value={driver.driver_id}>
                              {driver.firstname} {driver.lastname}
                            </MenuItem>
                          ))}
                        </TextField>
                        {touched.company && errors.company && (
                          <FormHelperText error id="helper-text-company-car">
                            {errors.company}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>วันที่เข้ารับสินค้า*</InputLabel>
                        <TextField
                          required
                          fullWidth
                          type="date"
                          id="pickup_date"
                          name="pickup_date"
                          onBlur={handleBlur}
                          value={values.pickup_date}
                          onChange={handleChange}
                          inputProps={{
                            min: currentDate
                          }}
                        />
                        {touched.pickup_date && errors.pickup_date && (
                          <FormHelperText error id="helper-text-pickup_date">
                            {errors.pickup_date}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>หัวข้อการจอง*</InputLabel>
                        <OutlinedInput
                          id="description"
                          type="description"
                          value={values.description}
                          name="description"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="หัวข้อการจอง"
                          error={Boolean(touched.description && errors.description)}
                        />
                        {touched.description && errors.description && (
                          <FormHelperText error id="helper-text-description">
                            {errors.description}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>คลังสินค้า</InputLabel>
                        <TextField
                          select
                          variant="outlined"
                          name="warehouse_id"
                          value={values.warehouse_id}
                          onChange={handleChange}
                          placeholder="เลือกคลังสินค้า"
                          fullWidth
                        >
                          {warehousesList &&
                            warehousesList.map((warehouses) => (
                              <MenuItem key={warehouses.warehouse_id} value={warehouses.warehouse_id}>
                                {warehouses.description}
                              </MenuItem>
                            ))}
                        </TextField>
                        {touched.company && errors.company && (
                          <FormHelperText error id="helper-text-company-car">
                            {errors.company}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>จำนวนสินค้า</InputLabel>
                        <OutlinedInput
                          id="total_quantity"
                          type="text"
                          sx={{ fontWeight: 600 }}
                          disabled
                          value={parseFloat(values.total_quantity).toFixed(4)}
                          name="color"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="จำนวนสินค้า"
                          fullWidth
                          error={Boolean(touched.total_quantity && errors.total_quantity)}
                        />
                        {touched.total_quantity && errors.total_quantity && (
                          <FormHelperText error id="helper-text-total_quantity">
                            {errors.total_quantity}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5">ข้อมูลรายการสั่งซื้อสินค้า</Typography>
                      </Grid>
                      <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                      {orderList.length === 0 && (
                        <Grid item xs={6} sx={{ p: 2 }}>
                          <Typography variant="body1">
                            <strong>ไม่มีข้อมูลสินค้า</strong>
                          </Typography>
                        </Grid>
                      )}

                      <Grid item xs={12} sx={{ p: 2 }}>
                        {orderList.map((order, index) => (
                          <Grid item xs={12} key={index} sx={{ mb: 2 }}>
                            <Grid container spacing={2} sx={{ mb: '15px' }}>
                              <Grid item xs={12} md={12}>
                                <Typography variant="body1">
                                  <strong>เลขที่คำสั่งซื้อ : </strong> {order.ref_order_id}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={12}>
                                <Typography variant="body1">
                                  <strong>รายละเอียด : </strong> {order.description}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid item xs={12} md={12}></Grid>
                            <Grid item xs={12} md={6}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ p: '12px' }}>สินค้า</TableCell>
                                    <TableCell align="right" sx={{ p: '12px' }}>
                                      จำนวน (ตัน)
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {order.items.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell width={'50%'}>{item.name}</TableCell>
                                      <TableCell align="right">{item.quantity} ตัน</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Grid>
                            <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                          </Grid>
                        ))}
                        <Stack direction="row" alignItems="center" spacing={0}>
                          <Button
                            size="mediam"
                            variant="outlined"
                            color="success"
                            onClick={() => addOrder()}
                            startIcon={<PlusCircleOutlined />}
                          >
                            เพิ่มข้อมูลสินค้า
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sx={{ '& button': { m: 1 }, pl: '8px' }}>
                    <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                    {orderList.length > 0 && reservationData.status !== 'completed' && userRoles === 10 && checkDate == true && (
                      <Button
                        size="mediam"
                        variant="outlined"
                        color="success"
                        disabled={
                          values.status === 'completed' ||
                          dateNow !== moment(values.pickup_date).format('YYYY-MM-DD') ||
                          values.total_quantity == 0 ||
                          checkDate == false
                        }
                        onClick={() =>
                          handleClickOpen(reservationData.reserve_id, reservationData.total_quantity, reservationData.group_code)
                        }
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
                        onClick={() => reservePrint(id)}
                        startIcon={<PrinterOutlined />}
                      >
                        พิมพ์
                      </Button>
                    )}
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      size="mediam"
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveOutlined />}
                    >
                      บันทึกข้อมูลการจอง
                    </Button>

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
                </MainCard>
              </form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default UpdateReserve;
