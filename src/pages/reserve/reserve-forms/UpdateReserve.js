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
import * as companyRequest from '_api/companyRequest';
// import * as adminRequest from '_api/adminRequest';

const userId = localStorage.getItem('user_id');

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
  ButtonGroup,
  Autocomplete,
  Alert
} from '@mui/material';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import MainCard from 'components/MainCard';
import { useSnackbar } from 'notistack';
// import { SaveOutlined, DiffOutlined, PrinterOutlined, RollbackOutlined } from '@ant-design/icons';
import {
  DiffOutlined,
  PlusCircleOutlined,
  PrinterOutlined,
  SaveOutlined,
  RollbackOutlined,
  DeleteOutlined,
  StopOutlined,
  ContainerOutlined
} from '@ant-design/icons';

// DateTime
import moment from 'moment';

import AddCar from './AddCar';
import AddDriver from './AddDriver';

import * as functionAddLogs from 'components/Function/AddLog';

function UpdateReserve() {
  const pageId = 8;
  const userPermission = useSelector((state) => state.auth?.user_permissions);
  const [pageDetail, setPageDetail] = useState([]);

  const userRoles = useSelector((state) => state.auth.roles);
  // const userID = useSelector((state) => state.auth.user_id);
  const [loading, setLoading] = useState(false);
  const [checkDate, setCheckDate] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const dateNow = moment(new Date()).format('YYYY-MM-DD');
  const [user_Id, setUserId] = useState('');
  const [newCar, setNewCar] = useState([]);
  const [newDriver, setNewDriver] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

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
  const getCompanyList = (permission) => {
    if (user_Id) {
      try {
        let user_id = '';
        if (permission !== 'manage_everything') {
          user_id = user_Id;
        }
        companyRequest.getAllCompanyByuserId(user_id).then((response) => {
          setCompanyList(response);
          getCarLsit(permission);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // =============== Get Car ===============//
  const [carList, setCarList] = useState([]);
  const getCarLsit = (permission) => {
    let urlapi = '';
    // if ((userRoles && userRoles == 1) || userRoles == 9 || userRoles == 10) {
    if (permission !== 'manage_everything') {
      urlapi = apiUrl + `/allcars/` + user_Id;
    } else {
      urlapi = apiUrl + `/allcars/`;
    }
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          // setCarList(res.data.filter((x) => x.user_id == userID || x.user_id == user_Id || x.user_id == 1));
          setCarList(res.data);
          getDriverLsit(permission);
        }
      })
      .catch((err) => console.log(err));
  };

  // =============== Get Driver ===============//
  const [driverList, setDriverList] = useState([]);
  const getDriverLsit = (permission) => {
    let urlapi = '';
    // if ((userRoles && userRoles == 1) || userRoles == 9 || userRoles == 10) {
    if (permission !== 'manage_everything') {
      urlapi = apiUrl + `/alldrivers/` + user_Id;
    } else {
      urlapi = apiUrl + `/alldrivers/`;
    }
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          // setDriverList(res.data.filter((x) => x.user_id == userID || x.user_id == user_Id || x.user_id == 1));
          setDriverList(res.data);
          setLoading(false);
          getOrders();
        }
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
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const updateReserveTotal = async (id) => {
    try {
      reserveRequest.getReserTotalByID(id).then(() => {
        getReserve();
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

  // =============== useEffect ===============//
  useEffect(() => {
    setLoading(true);
    getProductBrandList();
    getProductCompany();
    if (Object.keys(userPermission).length > 0) {
      if (userPermission.permission.filter((x) => x.page_id === pageId).length > 0) {
        const permissionName = userPermission.permission.find((x) => x.page_id === pageId);
        setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
        getReserve();

        if (user_Id) {
          getCompanyList(permissionName.permission_name);
        }
      } else {
        setLoading(false);
      }
    }
  }, [user_Id, newCar, newDriver, userPermission]);

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

            if (newCar.length > 0) {
              newCar.map((x) => {
                result.car_id = x.car_id;
              });

              reserveRequest.putReserById(id, result);
            }

            if (newDriver.length > 0) {
              newDriver.map((x) => {
                result.driver_id = x.driver_id;
              });
              reserveRequest.putReserById(id, result);
            }

            result.pickup_date = moment(result.pickup_date).format('YYYY-MM-DD');
            setReservationData(result);
            setCompanyId(result.product_company_id);
            checkQueueCompanyCount(result.product_company_id);
            getProductBrand(result.product_company_id);
            getOrders();
          });
        }
      })
      .catch((err) => console.log(err));
  };

  // =============== InitialValue ===============//
  // const  [initialValue,setInitialValue] = useState({
  //   company_id: reservationData.company_id,
  //   car_id: reservationData.car_id,
  //   brand_group_id: reservationData.brand_group_id,
  //   product_company_id: reservationData.product_company_id || '',
  //   product_brand_id: reservationData.product_brand_id || '',
  //   driver_id: reservationData.driver_id,
  //   description: reservationData.description,
  //   pickup_date: moment(reservationData.pickup_date).format('YYYY-MM-DD'),
  //   status: reservationData.status,
  //   total_quantity: reservationData.total_quantity,
  //   reserve_station_id: reservationData.reserve_station_id,
  //   warehouse_id: reservationData.warehouse_id,
  //   contractor_id: reservationData.contractor_id,
  //   team_id: reservationData.team_id,
  //   labor_line_id: ''
  // });

  // =============== Validate Forms ===============//
  const validationSchema = Yup.object().shape({
    company_id: Yup.string().required('กรุณาเลือกบริษัท/ร้านค้า'),
    brand_group_id: Yup.string().required('กรุณาเลือกกลุ่มสินค้า'),
    product_company_id: Yup.string().required('กรุณาระบุบริษัท(สินค้า)'),
    product_brand_id: Yup.string().required('กรุณาระบุตรา(สินค้า)'),
    reserve_station_id: Yup.string().required('กรุณาเลือกหัวจ่าย'),
    pickup_date: Yup.string().required('กรุณาเลือกวันที่เข้ารับสินค้า'),
    car_id: Yup.string().required('กรุณาเลือกรถบรรทุก'),
    driver_id: Yup.string().required('กรุณาเลือกคนขับรถ'),
    reserve_description: Yup.string().required('กรุณาระบุรหัวคิวเดิม')
  });

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {
      values.user_id = user_Id;
      values.updated_at = currentDate;
      values.brand_group_id = values.product_company_id;
      values.description = values.reserve_description;

      await reserveRequest
        .putReserById(id, values)
        .then((result) => {
          if (result.status === 'ok') {
            const data = {
              audit_user_id: userId,
              audit_action: 'U',
              audit_system_id: id,
              audit_system: 'reserves',
              audit_screen: 'ข้อมูลการจองคิว',
              audit_description: 'แก้ไขข้อมูลจองคิวรับสินค้า'
            };
            AddAuditLogs(data);
            enqueueSnackbar('บันทึกข้อมูลสำเร็จ!', { variant: 'success' });
            getReserve();
            // window.location.href = '/reserve';
          } else {
            enqueueSnackbar('บันทึกข้อมูลไม่สำเร็จ!', { variant: 'error' });
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
  const [brand_code, setBrandCode] = useState('');
  const [conpany_id, setCompanyId] = useState('');

  // ฟังก์ชันที่ใช้ในการเพิ่ม 0 ถ้าจำนวนน้อยกว่า 10
  const padZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  const [orderId, setOrderId] = useState([]);
  const [onClick, setOnClick] = useState([]);
  const handleClickOpen = (id, onClick) => {
    try {
      if (onClick == 'add-queue') {
        setOnClick(onClick);
        setNotifyText('ต้องการอนุมัติการจองคิวหรือไม่?');
        setReserveId(id);
        setOpen(true);
      } else if (onClick == 'remain-queue') {
        setOpen(true);
        setReserveId(id);
        setOnClick(onClick);
        setNotifyText('ต้องการบันทึกข้อมูลคิวค้าง');
      } else {
        setOpen(true);
        setOrderId(id);
        setOnClick(onClick);
        setNotifyText('ต้องการลบข้อมูลการสั่งซื้อสินค้า');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [onclickSubmit, setOnClickSubmit] = useState(false);
  const handleClose = (flag) => {
    if (onClick == 'add-queue') {
      if (flag === 1) {
        //click มาจากการลบ
        setOnClickSubmit(true);
        setLoading(true);
        addQueue(reserve_id);
      } else if (flag === 0) {
        setOpen(false);
      }
    } else if (onClick == 'remain-queue') {
      if (flag === 1) {
        setOnClickSubmit(true);
        setLoading(true);
        updateQueueRemain(reserve_id);
        setOpen(false);
      } else if (flag === 0) {
        setOpen(false);
        setOnClickSubmit(false);
      }
    } else {
      if (flag === 1) {
        setOnClickSubmit(true);
        setLoading(true);
        deleteOrder();
        setOpen(false);
      } else if (flag === 0) {
        setOpen(false);
      }
    }
  };

  //ตรวจสอบว่ามีการสร้าง Queue จากข้อมูลการจองหรือยัง
  async function getQueueIdByReserve(reserve_id) {
    try {
      reserveRequest.getQueuesByIdReserve(reserve_id).then((response) => {
        window.location.href = '/queues/detail/' + response[0].queue_id;
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
    return await new Promise((resolve) => {
      queuesRequest.getQueueTokenByIdCom(id, currentDate, currentDate).then((response) => {
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
  const addQueue = async (id) => {
    try {
      //ตรวจสอบข้อมูลคิว มีการสร้างจาก reserve id นี้แล้วหรือยัง
      const queuecountf = await checkQueueDataf(id);

      if (queuecountf === 0) {
        //สร้างข้อมูลคิว
        const queue_number = (await checkQueueCompanyCount(conpany_id)) + 1;
        const queue_id_createf = await createQueuef(id, brand_code, queue_number);

        //แจ้งเตือนหลังจากสร้าง Queue แล้ว
        await getMessageCreateQueue(queue_id_createf, id);
        //สร้าง step 1-4
        await createStepsf(queue_id_createf);
        setOpen(false);
        setLoading(true);
        setOnClickSubmit(false);
      } else {
        //alert("สร้างคิวแล้ว")
        updateReserveStatus(reserve_id);
        getQueueIdByReserve(id);
        setOnClickSubmit(false);
        setOpen(false);
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
    const data = {
      audit_user_id: userId,
      audit_action: 'I',
      audit_system_id: queue_id,
      audit_system: 'queues',
      audit_screen: 'ข้อมูลคิว',
      audit_description: 'ออกบัตรคิว'
    };
    AddAuditLogs(data);

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
        };
        if (reservationData.product_brand_id === 45 || reservationData.product_brand_id === 46) {
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
        //       remark: 'ทดสอบ-ชั่งเบา',
        //       created_at: currentDate,
        //       updated_at: currentDate
        //     },
        //     {
        //       order: 2,
        //       description: 'ขึ้นสินค้า',
        //       queue_id: queue_id,
        //       status: 'none',
        //       station_id: 27,
        //       remark: 'ทดสอบ-ขึ้นสินค้า',
        //       created_at: currentDate,
        //       updated_at: currentDate
        //     },
        //     {
        //       order: 3,
        //       description: 'ชั่งหนัก',
        //       queue_id: queue_id,
        //       status: 'none',
        //       station_id: 27,
        //       remark: 'ทดสอบ-ชั่งหนัก ',
        //       created_at: currentDate,
        //       updated_at: currentDate
        //     },
        //     {
        //       order: 4,
        //       description: 'เสร็จสิ้น',
        //       queue_id: queue_id,
        //       status: 'none',
        //       station_id: 27,
        //       remark: 'ทดสอบ-เสร็จสิ้น',
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
  const updateQueueRemain = (reserve_id) => {
    const queueRemain = {
      queue_remain: true
    };
    try {
      reserveRequest.putQueueRemainByID(reserve_id, queueRemain).then(() => {
        setLoading(false);
        setOnClickSubmit(false);
      });
    } catch (error) {
      setOpen(false);
      console.log(error);
    }
  };

  // =============== เพิ่มรายการสินค้า ===============//
  const addOrder = () => {
    // window.location = `/order/add/${id}`;
    navigate(`/order/add/${id}`);
    // navigate(`/order/test-add/${id}`);
  };

  // =============== ลบรายการสินค้า ===============//
  const deleteOrder = () => {
    reserveRequest.deleteOrderId(orderId).then(() => {
      updateReserveTotal(id);
      setOnClickSubmit(false);
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

  // =============== เพิ่มข้อมูลรถ ===============//
  const handleSaveForm = (formData) => {
    setNewCar(formData);
    getReserve();
    getCarLsit();
    const data = {
      audit_user_id: userId,
      audit_action: 'I',
      audit_system_id: formData[0].car_id,
      audit_system: 'cars',
      audit_screen: 'ข้อมูลรถบรรทุก',
      audit_description: 'เพิ่มข้อมูลรถบรรทุก'
    };
    AddAuditLogs(data);
  };

  // =============== เพิ่มข้อมูลคนขับรถ ===============//
  const handleSaveDriverForm = (formData) => {
    setNewDriver(formData);
    getReserve();
    getDriverLsit();

    const data = {
      audit_user_id: userId,
      audit_action: 'I',
      audit_system_id: formData[0].driver_id,
      audit_system: 'drivers',
      audit_screen: 'ข้อมูลคนขับรถ',
      audit_description: 'เพิ่มข้อมูลคนขับรถ'
    };
    AddAuditLogs(data);
  };

  const AddAuditLogs = async (data) => {
    await functionAddLogs.AddAuditLog(data);
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

      {Object.keys(userPermission).length > 0 &&
        pageDetail.length === 0 &&
        pageDetail.length !== 0 &&
        (pageDetail[0].permission_name !== 'view_data' ||
          pageDetail[0].permission_name !== 'manage_everything' ||
          pageDetail[0].permission_name !== 'add_edit_delete_data') && (
          <Grid item xs={12}>
            <MainCard content={false}>
              <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="warning">คุณไม่มีสิทธิ์ใช้เข้าถึงข้อมูลนี้</Alert>
              </Stack>
            </MainCard>
          </Grid>
        )}
      {pageDetail.length !== 0 &&
        (pageDetail[0].permission_name === 'view_data' ||
          pageDetail[0].permission_name === 'manage_everything' ||
          pageDetail[0].permission_name === 'add_edit_delete_data') && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={10}>
              <Formik
                initialValues={reservationData}
                validationSchema={validationSchema}
                onSubmit={handleSubmits}
                enableReinitialize={true}
              >
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
                              <Autocomplete
                                //disablePortal
                                id="company-list"
                                options={companyList}
                                value={companyList.length > 0 ? companyList.find((item) => item.company_id === values.company_id) : []}
                                onChange={(e, value) => {
                                  const newValue = value ? value.company_id : '';
                                  setFieldValue('company_id', newValue);
                                }}
                                renderOption={(props, option) => (
                                  <li {...props} key={option.company_id}>
                                    {option.name}
                                  </li>
                                )}
                                getOptionLabel={(option) => (option.name !== undefined ? option.name : '')}
                                sx={{
                                  width: '100%',
                                  '& .MuiOutlinedInput-root': {
                                    padding: '3px 8px!important'
                                  },
                                  '& .MuiOutlinedInput-root .MuiAutocomplete-endAdornment': {
                                    right: '7px!important',
                                    top: 'calc(50% - 1px)'
                                  }
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    name="company_id"
                                    placeholder="เลือกบริษัท/ร้านค้า"
                                    error={Boolean(touched.company_id && errors.company_id)}
                                  />
                                )}
                              />
                              {/* <Select
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
                          </Select> */}
                            </FormControl>
                            {touched.company_id && errors.company_id && (
                              <FormHelperText error id="helper-text-company-car">
                                {errors.company_id}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Stack spacing={1}>
                            <InputLabel>วันที่เข้ารับสินค้า *</InputLabel>
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
                            <InputLabel>บริษัท (สินค้า) *</InputLabel>
                            <FormControl fullWidth>
                              <Select
                                displayEmpty
                                variant="outlined"
                                name="product_company_id"
                                value={values.product_company_id ? values.product_company_id : ''}
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
                                value={values.product_brand_id ? values.product_brand_id : ''}
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
                            <InputLabel>รถบรรทุก *</InputLabel>
                            <FormControl fullWidth>
                              <Autocomplete
                                //disablePortal
                                id="car-list"
                                options={carList}
                                value={carList.length > 0 ? carList.find((item) => item.car_id === values.car_id) : []}
                                onChange={(e, value) => {
                                  const newValue = value ? value.car_id : '';
                                  setFieldValue('car_id', newValue);
                                }}
                                renderOption={(props, option) => (
                                  <li {...props} key={option.car_id}>
                                    {option.car_id !== 1 ? option.registration_no : 'ไม่ระบุรถบรรทุก'}
                                  </li>
                                )}
                                getOptionLabel={(option) => {
                                  if (option.car_id !== undefined) {
                                    if (option.car_id !== 1) {
                                      return option.registration_no ? option.registration_no : '';
                                    } else {
                                      return 'ไม่ระบุรถบรรทุก';
                                    }
                                  } else {
                                    return '';
                                  }
                                }}
                                sx={{
                                  width: '100%',
                                  '& .MuiOutlinedInput-root': {
                                    padding: '3px 8px!important'
                                  },
                                  '& .MuiOutlinedInput-root .MuiAutocomplete-endAdornment': {
                                    right: '7px!important',
                                    top: 'calc(50% - 1px)'
                                  }
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    name="car_id"
                                    placeholder="เลือกรถบรรทุก"
                                    error={Boolean(touched.car_id && errors.car_id)}
                                  />
                                )}
                              />
                            </FormControl>
                            {touched.car_id && errors.car_id && (
                              <FormHelperText error id="helper-text-company-car">
                                {errors.car_id}
                              </FormHelperText>
                            )}
                          </Stack>
                          {
                            // reservationData.status !== 'completed' &&
                            pageDetail.length > 0 &&
                              (pageDetail[0].permission_name === 'manage_everything' ||
                                pageDetail[0].permission_name === 'add_edit_delete_data') && (
                                <AddCar userID={user_Id} onSaves={handleSaveForm} carsList={carList} />
                              )
                          }
                        </Grid>

                        <Grid item xs={12} md={6} align="left">
                          <Stack spacing={1}>
                            <InputLabel>คนขับรถ *</InputLabel>
                            <FormControl fullWidth>
                              <Autocomplete
                                //disablePortal
                                id="driver-list"
                                options={driverList}
                                name="driver_id"
                                value={driverList.length > 0 ? driverList.find((item) => item.driver_id === values.driver_id) : []}
                                // defaultValue={driverList.find((item) => item.driver_id === values.driver_id)?.driver_id}
                                onChange={(e, value) => {
                                  const newValue = value ? value.driver_id : '';
                                  setFieldValue('driver_id', newValue);
                                }}
                                renderOption={(props, option) => (
                                  <li {...props} key={option.driver_id}>
                                    {option.driver_id !== 1 ? option.firstname + ' ' + option.lastname : 'ไม่ระบุคนขับรถ'}
                                  </li>
                                )}
                                getOptionLabel={(option) => {
                                  if (option.driver_id !== 1 && option.driver_id !== undefined) {
                                    return option.firstname ? option.firstname + ' ' + option.lastname : '';
                                  } else {
                                    return 'ไม่ระบุคนขับรถ';
                                  }
                                }}
                                sx={{
                                  width: '100%',
                                  '& .MuiOutlinedInput-root': {
                                    padding: '3px 8px!important'
                                  },
                                  '& .MuiOutlinedInput-root .MuiAutocomplete-endAdornment': {
                                    right: '7px!important',
                                    top: 'calc(50% - 1px)'
                                  }
                                }}
                                error={Boolean(touched.driver_id && errors.driver_id)}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="เลือกคนขับรถ"
                                    error={Boolean(touched.driver_id && errors.driver_id)}
                                  />
                                )}
                              />
                            </FormControl>
                            {touched.driver_id && errors.driver_id && (
                              <FormHelperText error id="helper-text-driver_id-car">
                                {errors.driver_id}
                              </FormHelperText>
                            )}
                          </Stack>
                          {
                            // reservationData.status !== 'completed' &&
                            pageDetail.length > 0 &&
                              (pageDetail[0].permission_name === 'manage_everything' ||
                                pageDetail[0].permission_name === 'add_edit_delete_data') && (
                                <AddDriver userID={user_Id} onSaves={handleSaveDriverForm} driverList={driverList} />
                              )
                          }
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Stack spacing={1}>
                            <InputLabel>หมายเหตุ (รหัสคิวเดิม)</InputLabel>
                            <OutlinedInput
                              id="reserve_description"
                              type="reserve_description"
                              value={values.reserve_description}
                              // disabled
                              name="reserve_description"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="หมายเหตุ (รหัสคิวเดิม)"
                              error={Boolean(touched.reserve_description && errors.reserve_description)}
                            />
                            {touched.reserve_description && errors.reserve_description && (
                              <FormHelperText error id="helper-text-reserve_description">
                                {errors.reserve_description}
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
                                        {
                                          productCompany.find((x) => x.product_company_id === order.product_company_id)
                                            ?.product_company_name_th
                                        }
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <Typography variant="body1">
                                        <strong>ตราสินค้า : </strong>{' '}
                                        {productBrandList.find((x) => x.product_brand_id === order.product_brand_id)?.product_brand_name}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                      <Typography variant="body1">
                                        <strong>รายละเอียด : </strong> {order.description ? order.description : '-'}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                  <Grid item xs={12} md={12}></Grid>
                                  <Grid item xs={12} md={8}>
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
                                      {pageDetail.length > 0 &&
                                        (pageDetail[0].permission_name === 'manage_everything' ||
                                          pageDetail[0].permission_name === 'add_edit_delete_data') && (
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
                                        )}
                                    </Stack>
                                  </Grid>

                                  <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                                </Grid>
                              ))}
                            <Stack direction="row" alignItems="center" spacing={0}>
                              {pageDetail.length > 0 &&
                                (pageDetail[0].permission_name === 'manage_everything' ||
                                  pageDetail[0].permission_name === 'add_edit_delete_data') && (
                                  <Button
                                    size="mediam"
                                    variant="outlined"
                                    color="success"
                                    onClick={() => addOrder()}
                                    startIcon={<PlusCircleOutlined />}
                                  >
                                    เพิ่มข้อมูลสินค้า
                                  </Button>
                                )}
                            </Stack>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} sx={{ '& button': { m: 1 } }}>
                        <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />

                        {reservationData.status !== 'completed' &&
                          pageDetail.length > 0 &&
                          (pageDetail[0].permission_name === 'manage_everything' ||
                            pageDetail[0].permission_name === 'add_edit_delete_data') &&
                          checkDate == true && (
                            <Button
                              size="mediam"
                              variant="contained"
                              color="success"
                              disabled={
                                dateNow !== moment(values.pickup_date).format('YYYY-MM-DD') ||
                                checkDate == false ||
                                reservationData.car_id == 1 ||
                                reservationData.driver_id == 1 ||
                                ((reservationData.product_brand_id === 45 || reservationData.product_brand_id === 46) &&
                                  parseFloat(reservationData.total_quantity) === 0)
                              }
                              onClick={() => handleClickOpen(reservationData.reserve_id, 'add-queue', reservationData.total_quantity)}
                              startIcon={<DiffOutlined />}
                            >
                              สร้างคิว
                            </Button>
                          )}

                        {pageDetail.length > 0 &&
                          (pageDetail[0].permission_name === 'manage_everything' ||
                            pageDetail[0].permission_name === 'add_edit_delete_data') &&
                          checkDate == true && (
                            <Button
                              size="mediam"
                              variant="contained"
                              color="warning"
                              // disabled={
                              //   dateNow !== moment(values.pickup_date).format('YYYY-MM-DD') ||
                              //   checkDate == false ||
                              //   initialValue.car_id == 1 ||
                              //   initialValue.driver_id == 1
                              // }
                              onClick={() => handleClickOpen(reservationData.reserve_id, 'remain-queue')}
                              startIcon={<StopOutlined />}
                            >
                              คิวค้าง
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

                        {pageDetail.length > 0 &&
                          (pageDetail[0].permission_name === 'manage_everything' || reservationData.status !== 'completed') && (
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
                        {reservationData.status === 'completed' && (
                          <Button
                            size="mediam"
                            variant="contained"
                            color="primary"
                            onClick={() => getQueueIdByReserve(id)}
                            startIcon={<ContainerOutlined />}
                          >
                            ข้อมูลคิว
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
        )}
    </Grid>
  );
}

export default UpdateReserve;
