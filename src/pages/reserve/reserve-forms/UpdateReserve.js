import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from '../../../../node_modules/axios/index';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
import * as reserveRequest from '_api/reserveRequest';
import * as queuesRequest from '_api/queueReques';
// import * as adminRequest from '_api/adminRequest';

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
  CircularProgress,
  Tooltip,
  ButtonGroup
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
  RollbackOutlined,
  DeleteOutlined
  // EditOutlined
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
    product_company_id: '',
    product_brand_id: '',
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
          setCompanyList(res.data);
          getCarLsit();
        }
      })
      .catch((err) => console.log(err));
  };

  // =============== Get Car ===============//
  const [carList, setCarList] = useState([]);
  const getCarLsit = () => {
    let urlapi = '';
    if ((userRoles && userRoles == 1) || userRoles == 9 || userRoles == 10) {
      urlapi = apiUrl + `/allcars/`;
    } else {
      urlapi = apiUrl + `/allcars/` + user_Id;
    }
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
    let urlapi = '';
    if ((userRoles && userRoles == 1) || userRoles == 9 || userRoles == 10) {
      urlapi = apiUrl + `/alldrivers/`;
    } else {
      urlapi = apiUrl + `/alldrivers/` + user_Id;
    }
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
  // const [brandList, setBrandList] = useState([]);
  // const getBrandList = () => {
  //   var requestOptions = {
  //     method: 'GET',
  //     redirect: 'follow'
  //   };
  //   fetch(apiUrl + '/allproductbrandgroup', requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       setBrandList(result);
  //     })
  //     .catch((error) => console.log('error', error));
  // };

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

  const handleChangeProductCom = (e) => {
    getProductBrand(e.target.value);
  };

  // =============== Get Product Brand ===============//
  const [productBrand, setProductBrand] = useState([]);
  const getProductBrand = (id) => {
    try {
      reserveRequest.getProductBrandById(id).then((response) => {
        setProductBrand(response);
      });
    } catch (error) {
      console.log(error);
    }
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
    getProductCompany();
    // if (user_Id) {
    //   getBrandList();
    // }

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
            setCompanyId(result.product_company_id);
            checkQueueCompanyCount(result.product_company_id);
            getProductBrand(result.product_company_id);
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
    product_company_id: reservationData.product_company_id || '',
    product_brand_id: reservationData.product_brand_id || '',
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
    product_company_id: Yup.string().required('กรุณาระบุบริษัท(สินค้า)'),
    product_brand_id: Yup.string().required('กรุณาระบุตรา(สินค้า)'),
    reserve_station_id: Yup.string().required('กรุณาเลือกหัวจ่าย'),
    pickup_date: Yup.string().required('กรุณาเลือกวันที่เข้ารับสินค้า')
    // description: Yup.string().required('กรุณากรอกiรายละเอียดการจอง')
  });

  // =============== บันทึกข้อมูล ===============//
  // const updateTeamLoading = (values) => {
  //   adminRequest.putReserveTeam(id, values).then(() => {
  //     window.location.href = '/reserve';
  //   });
  // };
  const handleSubmits = async (values) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {
      values.user_id = user_Id;
      values.pickup_date = moment(values.pickup_date).format('YYYY-MM-DD HH:mm:ss');
      values.created_at = currentDate;
      values.updated_at = currentDate;
      values.brand_group_id = values.product_company_id;
      // const teamValue = {
      //   team_id: values.team_id,
      //   contractor_id: values.contractor_id
      // };

      await reserveRequest
        .putReserById(id, values)
        .then((result) => {
          if (result.status === 'ok') {
            window.location.href = '/reserve';
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
  const [conpany_id, setCompanyId] = useState('');

  // ฟังก์ชันที่ใช้ในการเพิ่ม 0 ถ้าจำนวนน้อยกว่า 10
  const padZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  const [orderId, setOrderId] = useState([]);
  const [onClick, setOnClick] = useState([]);
  const handleClickOpen = (id, onClick, total_quantity) => {
    try {
      if (onClick == 'add-queue') {
        if (total_quantity === '0') {
          alert('reserve_id: ' + id + ' ไม่พบข้อมูลสั่งซื้อ กรุณาเพิ่มข้อมูล');
          return;
        } else {
          setOnClick(onClick);
          setNotifyText('ต้องการอนุมัติการจองคิวหรือไม่?');
          //กำหนดค่า click มาจากเพิ่มข้อมูลคิว
          setReserveId(id);
          setTotalQuantity(total_quantity);
          setOpen(true);
        }
      } else {
        setOpen(true);
        setOrderId(id);
        setOnClick(onClick);
        setNotifyText('ต้องการลบข้อมูลการสั่งซื้อสินค้า');
      }
    } catch (e) {
      console.log(e);
    }
    //กำหนดข้อความแจ้งเตือน
    // setNotifyText('ต้องการสร้างคิวหรือไม่?');
  };

  const handleClose = (flag) => {
    if (onClick == 'add-queue') {
      if (flag === 1) {
        //click มาจากการลบ
        setLoading(true);
        // if (flag === 99) {
        addQueue(reserve_id, total_quantity);
        // }
      }
    } else {
      if (flag === 1) {
        setLoading(true);
        deleteOrder();
      }
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

  async function checkQueueCompanyCount(id) {
    return await new Promise((resolve) => {
      queuesRequest.getQueueTokenByIdCom(id, currentDate, currentDate).then((response) => {
        if (response) {
          setBrandCode(response.product_company_code);
          resolve(response.queue_count_company_code);
          console.log('getQueueTokenByIdCom:', response.queue_count_company_code);
          console.log('setBrandCode:', response.product_company_code);
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
      reserveRequest.putReserveStatus(reserve_id, reserveStatus);
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
          const queue_number = (await checkQueueCompanyCount(conpany_id)) + 1;

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
      .then((response) => response.text())
      .catch((error) => console.error(error));
  };

  // =============== เพิ่มรายการสินค้า ===============//
  const addOrder = () => {
    // window.location = `/order/add/${id}`;
    navigate(`/order/add/${id}`);
  };

  const deleteOrder = () => {
    reserveRequest.deleteOrderId(orderId).then(() => {
      getReserve();
    });
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

  // const updateOrder = (id) => {
  //   console.log(id);
  // };

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
            {({ handleBlur, handleChange, handleSubmit, isSubmitting, values, touched, errors, setFieldValue }) => (
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
                            {companyList.length > 0 &&
                              companyList.map((companias) => (
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
                    {/* 
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
                          {brandList.length > 0 &&
                            brandList.map((brand) => (
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
                    </Grid> */}

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>บริษัท (สินค้า) *</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            displayEmpty
                            variant="outlined"
                            name="product_company_id"
                            value={values.product_company_id || ''}
                            onChange={(e) => {
                              setFieldValue('product_company_id', e.target.value);
                              setFieldValue('product_brand_id', '');
                              handleChangeProductCom(e);
                            }}
                            fullWidth
                            error={Boolean(touched.product_company_id && errors.product_company_id)}
                          >
                            <MenuItem disabled value="">
                              เลือกบริษัท
                            </MenuItem>
                            {productCompany.length > 0 &&
                              productCompany.map((companias) => (
                                <MenuItem key={companias.product_company_id} value={companias.product_company_id}>
                                  {companias.product_company_name_th}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Stack>
                      {touched.product_company_id && errors.product_company_id && (
                        <FormHelperText error id="helper-text-product_company_id">
                          {errors.product_company_id}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>ตรา (สินค้า) *</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            displayEmpty
                            variant="outlined"
                            name="product_brand_id"
                            value={values.product_brand_id}
                            onChange={handleChange}
                            placeholder="เลือกสายแรงงาน"
                            fullWidth
                            error={Boolean(touched.product_brand_id && errors.product_brand_id)}
                          >
                            <MenuItem disabled value="">
                              เลือกตรา (สินค้า)
                            </MenuItem>
                            {productBrand.length > 0 &&
                              productBrand.map((brands) => (
                                <MenuItem key={brands.product_brand_id} value={brands.product_brand_id}>
                                  {brands.product_brand_name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Stack>
                      {touched.product_brand_id && errors.product_brand_id && (
                        <FormHelperText error id="helper-text-product_brand_id">
                          {errors.product_brand_id}
                        </FormHelperText>
                      )}
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
                          {carList.length > 0 &&
                            carList.map((cars) => (
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
                          {driverList.length > 0 &&
                            driverList.map((driver) => (
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
                        <InputLabel>เหตุผลการจอง</InputLabel>
                        <OutlinedInput
                          id="description"
                          type="description"
                          value={values.description}
                          name="description"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="เหตุผลการจอง"
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
                        {orderList.length > 0 &&
                          orderList.map((order, index) => (
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
                              <Grid item xs={12} md={6} sx={{ mt: 2 }}>
                                <Stack direction="row" alignItems="center" spacing={0}>
                                  <ButtonGroup variant="plain" aria-label="Basic button group" sx={{ boxShadow: 'none!important' }}>
                                    <Tooltip title="ลบคำสั่งซื้อ">
                                      <span>
                                        <Button
                                          variant="contained"
                                          sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                          size="medium"
                                          disabled={reservationData.status == 'completed' && userRoles === 8}
                                          color="error"
                                          // onClick={() => deleteDrivers(row.reserve_id)}
                                          onClick={() => handleClickOpen(order.order_id, 'delete-queue')}
                                        >
                                          <DeleteOutlined />
                                        </Button>
                                      </span>
                                    </Tooltip>
                                  </ButtonGroup>
                                </Stack>
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
                          onClick={() => handleClickOpen(reservationData.reserve_id, 'add-queue', reservationData.total_quantity)}
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
