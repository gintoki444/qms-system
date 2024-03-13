import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from '../../../../node_modules/axios/index';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
import * as reseveRequest from '_api/reserveRequest';
import * as adminRequest from '_api/adminRequest';

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
  TableContainer,
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

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import MainCard from 'components/MainCard';
// import { SaveOutlined, DiffOutlined, PrinterOutlined, RollbackOutlined } from '@ant-design/icons';
import {
  DiffOutlined,
  PlusCircleOutlined,
  PrinterOutlined,
  SaveOutlined,
  RollbackOutlined
  // , CheckCircleOutlined
} from '@ant-design/icons';

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
    reserve_station_id: '',
    brand: '',
    color: '',
    license_no: '',
    mobile_no: '',
    r_description: '',
    company: '',
    driver: ''
  });

  const { id } = useParams();

  // =============== Get Company ===============//
  const [companyList, setCompanyList] = useState([]);
  const getCompanyList = () => {
    const urlapi = apiUrl + `/allcompany/` + user_Id;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          console.log(res.data);
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
  
  // // =============== Get Warehouses ===============//
  // const [selectWarehouse, setSelectWareHouse] = useState('');
  // const [warehousesList, setWarehousesList] = useState([]);
  // const getWarehouses = () => {
  //   adminRequest
  //     .getAllWareHouse()
  //     .then((result) => {
  //       setWarehousesList(result);
  //     })
  //     .catch((error) => console.log('error', error));
  // };

  // const handleChangeWarehouse = (e) => {
  //   setTeamLoading([]);
  //   setTeamLoadingList([]);
  //   getStation(e.target.value);
  //   getTeamloading(e.target.value);
  // };

  // // =============== Get Stations ===============//
  // const [stationsList, setStationsList] = useState([]);
  // const getStation = (id) => {
  //   try {
  //     adminRequest.getStationsByWareHouse(id).then((response) => {
  //       setStationsList(response);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // // =============== Get TeamLoanding ===============//
  // // const [team_id, setTeamId] = useState([]);
  // const [teamloadingList, setTeamLoadingList] = useState([]);
  // const getTeamloading = (id) => {
  //   try {
  //     adminRequest.getLoadingTeamById(id).then((result) => {
  //       setTeamLoadingList(result);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const [teamLoading, setTeamLoading] = useState([]);
  // const getTeamManagers = async (id) => {
  //   try {
  //     const teamManager = await adminRequest.getTeamManager(id);
  //     const teamChecker = await adminRequest.getTeamChecker(id);
  //     const teamForklift = await adminRequest.getTeamForklift(id);
  //     const combinedData = [...teamManager, ...teamChecker, ...teamForklift];
  //     setTeamLoading(combinedData);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleChangeTeam = (e) => {
  //   setTeamLoading([]);
  //   getTeamManagers(e);
  // };

  // // =============== Get Contractor ===============//
  // const [contractorList, setContractorList] = useState([]);
  // const getAllContractor = () => {
  //   try {
  //     adminRequest.getAllContractors().then((result) => {
  //       setContractorList(result);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleChangeContractor = (e) => {
  //   getLaborLine(e.target.value);
  // };

  // =============== Get Contractor and laybor Line ===============//
  // const [layborLineList, setLayborLineList] = useState([]);
  // const getLaborLine = (id) => {
  //   try {
  //     adminRequest.getContractorById(id).then((result) => {
  //       setLayborLineList(result.labor_lines);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // =============== useEffect ===============//
  useEffect(() => {
    getReserve();
    if (user_Id) {
      getBrandList();
    }

    // if (userRoles === 9 || userRoles === 1) {
    //   getWarehouses();
    //   getAllContractor();
    // }
  }, [user_Id]);

  const getReserve = () => {
    setLoading(true);
    const urlapi = apiUrl + `/reserve/` + id;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          res.data.reserve.map((result) => {
            setUserId(result.user_id);
            if (dateNow == moment(result.pickup_date).format('YYYY-MM-DD')) {
              setCheckDate(true);
            }
            setReservationData(result);
            getCompanyList();

            // if (userRoles === 9 || userRoles === 1) {
            //   getStation(result.warehouse_id);
            //   getTeamloading(result.warehouse_id);
            //   getTeamManagers(result.team_id);
            //   getLaborLine(result.contractor_id);
            // }
          });
        }
      })
      .catch((err) => console.log(err));
  };

  // =============== InitialValue ===============//
  let initialValue = {
    company_id: reservationData.company_id,
    car_id: reservationData.car_id,
    brand_group_id: reservationData.brand_group_id,
    driver_id: reservationData.driver_id,
    description: reservationData.reserve_description,
    pickup_date: moment(reservationData.pickup_date).format('YYYY-MM-DD'),
    status: reservationData.status,
    total_quantity: reservationData.total_quantity,
    reserve_station_id: reservationData.reserve_station_id,
    warehouse_id: reservationData.warehouse_id,
    contractor_id: reservationData.contractor_id,
    team_id: reservationData.team_id,
    labor_line_id: ''
  };

  // =============== Validate Forms ===============//
  const validationSchema = Yup.object().shape({
    company_id: Yup.string().required('กรุณาเลือกบริษัท/ร้านค้า'),
    brand_group_id: Yup.string().required('กรุณาเลือกกลุ่มสินค้า'),
    reserve_station_id: Yup.string().required('กรุณาเลือกหัวจ่าย'),
    pickup_date: Yup.string().required('กรุณาเลือกวันที่เข้ารับสินค้า'),
    description: Yup.string().required('กรุณากรอกiรายละเอียดการจอง')
  });

  // =============== บันทึกข้อมูล ===============//
  const updateTeamLoading = (values) => {
    adminRequest.putReserveTeam(id, values).then(() => {
      window.location.href = '/reserve';
    });
  };
  const handleSubmits = async (values) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {
      values.user_id = user_Id;
      values.pickup_date = moment(values.pickup_date).format('YYYY-MM-DD HH:mm:ss');
      values.created_at = currentDate;
      values.updated_at = currentDate;

      const teamValue = {
        team_id: values.team_id,
        contractor_id: values.contractor_id
      };

      await reseveRequest
        .putReserById(id, values)
        .then((result) => {
          console.log('result ', result);
          if (result.status === 'ok') {
            updateTeamLoading(teamValue);
          } else {
            alert(result['message']['sqlMessage']);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================|| Create Queue ||============================== //
  const [open, setOpen] = useState(false);
  const [reserve_id, setReserveId] = useState(0);
  const [notifytext, setNotifyText] = useState('');
  const [total_quantity, setTotalQuantity] = useState(0);
  const [brand_code, setBrandCode] = useState('');

  // ฟังก์ชันที่ใช้ในการเพิ่ม 0 ถ้าจำนวนน้อยกว่า 10
  const padZero = (num) => {
    return num < 10 ? `0${num}` : num;
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
      // if (flag === 99) {
      addQueue(reserve_id, total_quantity);
      // }
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
    const reserveStatus = {
      status: 'completed'
    };
    try {
      reseveRequest.putReserveStatus(reserve_id, reserveStatus);
    } catch (error) {
      setOpen(false);
      console.log(error);
    }
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

  //แสดงข้อมูลคิว
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

  //แสดงข้อมูลรายการสินค้า
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

        var raw = JSON.stringify({
          transactions: [
            {
              order: 1,
              description: 'ชั่งเบา',
              queue_id: queue_id,
              status: 'waiting',
              station_id: 27,
              remark: 'ทดสอบ-ชั่งเบา',
              created_at: currentDate,
              updated_at: currentDate
            },
            {
              order: 2,
              description: 'ขึ้นสินค้า',
              queue_id: queue_id,
              status: 'none',
              station_id: 27,
              remark: 'ทดสอบ-ขึ้นสินค้า',
              created_at: currentDate,
              updated_at: currentDate
            },
            {
              order: 3,
              description: 'ชั่งหนัก',
              queue_id: queue_id,
              status: 'none',
              station_id: 27,
              remark: 'ทดสอบ-ชั่งหนัก ',
              created_at: currentDate,
              updated_at: currentDate
            },
            {
              order: 4,
              description: 'เสร็จสิ้น',
              queue_id: queue_id,
              status: 'none',
              station_id: 27,
              remark: 'ทดสอบ-เสร็จสิ้น',
              created_at: currentDate,
              updated_at: currentDate
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

  // =============== เพิ่มรายการสินค้า ===============//
  const addOrder = () => {
    // window.location = `/order/add/${id}`;
    navigate(`/order/add/${id}`);
  };

  // =============== กลับหน้า Reserve ===============//
  const navigate = useNavigate();
  const backToReserce = () => {
    navigate('/reserve');
  };

  // =============== พิมพ์ ===============//
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
        <Grid item xs={12} md={10}>
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
                        <FormControl fullWidth>
                          <Select
                            labelId="select-label"
                            id="select"
                            name="company_id"
                            value={values.company_id}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="เลือกบริษัท/ร้านค้า"
                          >
                            {companyList.map((companias) => (
                              <MenuItem key={companias.company_id} value={companias.company_id}>
                                {companias.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {/* <TextField
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
                        </TextField> */}
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
                              <TableContainer>
                                <Table
                                  aria-labelledby="tableTitle"
                                  size="small"
                                  sx={{
                                    '& .MuiTableCell-root:first-of-type': {
                                      pl: 2
                                    },
                                    '& .MuiTableCell-root:last-of-type': {
                                      pr: 3
                                    }
                                  }}
                                >
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
                              </TableContainer>
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

                    {/* ======= Operation ======= */}
                    {/* {(userRoles == 9 || userRoles == 1) && (
                      <Grid item xs={12}>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h5">ข้อมูลการเข้ารับสินค้า</Typography>
                        </Grid>
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                          <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                              <InputLabel>โกดังสินค้า</InputLabel>
                              <TextField
                                select
                                variant="outlined"
                                name="warehouse_id"
                                value={values.warehouse_id}
                                onChange={(e) => {
                                  setFieldValue('warehouse_id', e.target.value);
                                  handleChangeWarehouse(e);
                                }}
                                placeholder="เลือกโกดังสินค้า"
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
                              <InputLabel>หัวจ่าย</InputLabel>
                              <TextField
                                select
                                variant="outlined"
                                name="reserve_station_id"
                                value={values.reserve_station_id}
                                onChange={handleChange}
                                placeholder="เลือกคลังสินค้า"
                                fullWidth
                              >
                                {stationsList.map((station) => (
                                  <MenuItem key={station.station_id} value={station.station_id}>
                                    {station.station_description}
                                  </MenuItem>
                                ))}
                              </TextField>
                              {touched.reserve_station_id && errors.reserve_station_id && (
                                <FormHelperText error id="helper-text-reserve_station_id">
                                  {errors.reserve_station_id}
                                </FormHelperText>
                              )}
                            </Stack>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                              <InputLabel>ทีมรับสินค้า</InputLabel>
                              <FormControl>
                                <Select
                                  id="team_id"
                                  name="team_id"
                                  displayEmpty
                                  value={values.team_id}
                                  onChange={(e) => {
                                    setFieldValue('team_id', e.target.value);
                                    handleChangeTeam(e.target.value);
                                  }}
                                  input={<OutlinedInput />}
                                  inputProps={{ 'aria-label': 'Without label' }}
                                >
                                  <MenuItem disabled value="">
                                    ทีมรับสินค้า
                                  </MenuItem>
                                  {teamloadingList.map((teamload) => (
                                    <MenuItem key={teamload.team_id} value={teamload.team_id}>
                                      {teamload.team_name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Stack>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                              <InputLabel>สายแรงงาน {values.contractor_id}</InputLabel>
                              <TextField
                                select
                                variant="outlined"
                                name="contractor_id"
                                value={values.contractor_id}
                                onChange={(e) => {
                                  setFieldValue('contractor_id', e.target.value);
                                  handleChangeContractor(e);
                                }}
                                placeholder="ทีมรับสินค้า"
                                fullWidth
                              >
                                {contractorList.map((contractorList) => (
                                  <MenuItem key={contractorList.contractor_id} value={contractorList.contractor_id}>
                                    {contractorList.contractor_name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Stack>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                              <InputLabel>หมายเลขสาย</InputLabel>
                              <TextField
                                select
                                variant="outlined"
                                name="labor_line_id"
                                value={values.labor_line_id}
                                onChange={handleChange}
                                placeholder="ทีมรับสินค้า"
                                fullWidth
                              >
                                {layborLineList.map((layborLine) => (
                                  <MenuItem key={layborLine.labor_line_id} value={layborLine.labor_line_id}>
                                    {layborLine.labor_line_name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Stack>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <TableContainer>
                            <Table
                              aria-labelledby="tableTitle"
                              size="small"
                              sx={{
                                '& .MuiTableCell-root:first-of-type': {
                                  pl: 2
                                },
                                '& .MuiTableCell-root:last-of-type': {
                                  pr: 3
                                }
                              }}
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell align="center">ลำดับ</TableCell>
                                  <TableCell align="center">รายชื่อ</TableCell>
                                  <TableCell align="center">ตำแหน่ง</TableCell>
                                </TableRow>
                              </TableHead>
                              {teamLoading ? (
                                <TableBody>
                                  {teamLoading.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell align="center">{index + 1}</TableCell>
                                      <TableCell align="center">
                                        {item.manager_name && item.manager_name}
                                        {item.checker_name && item.checker_name}
                                        {item.forklift_name && item.forklift_name}
                                      </TableCell>
                                      <TableCell align="center">
                                        {item.manager_name && 'หัวหน้าโกดัง'}
                                        {item.checker_name && 'พนักงานจ่ายสินค้า'}
                                        {item.forklift_name && 'โฟล์คลิฟท์'}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={13} align="center">
                                    ไม่พบข้อมูล
                                  </TableCell>
                                </TableRow>
                              )}
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                    )} */}
                  </Grid>

                  <Grid item xs={12} sx={{ '& button': { m: 1 }, pl: '8px' }}>
                    <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />

                    {/* {orderList.length > 0 &&
                      reservationData.status !== 'completed' &&
                      (userRoles === 10 || userRoles === 1) &&
                      checkDate == true && (
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
                          startIcon={<CheckCircleOutlined />}
                        >
                          อนุมัติการจอง
                        </Button>
                      )} */}

                    {orderList.length > 0 &&
                      reservationData.status !== 'completed' &&
                      (userRoles === 9 || userRoles === 1) &&
                      checkDate == true && (
                        <Button
                          size="mediam"
                          variant="outlined"
                          color="success"
                          disabled={
                            dateNow !== moment(values.pickup_date).format('YYYY-MM-DD') || values.total_quantity == 0 || checkDate == false
                          }
                          onClick={() =>
                            handleClickOpen(reservationData.reserve_id, reservationData.total_quantity, reservationData.group_code)
                          }
                          startIcon={<DiffOutlined />}
                        >
                          สร้างคิว
                        </Button>
                      )}

                    {/* {orderList.length > 0 && reservationData.status !== 'completed' &&  && checkDate == true && (
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
                    )} */}
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
                    {reservationData.status !== 'completed' && (
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
