import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
import * as reserveRequest from '_api/reserveRequest';
import * as queuesRequest from '_api/queueReques';
import * as stepRequest from '_api/StepRequest';

import QueueTag from 'components/@extended/QueueTag';

// Get Role use
import { useSelector } from 'react-redux';

// material-ui
import {
  Box,
  Stack,
  Chip,
  Tooltip,
  ButtonGroup,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Backdrop,
  CircularProgress
} from '@mui/material';

// project import
import {
  EditOutlined,
  DeleteOutlined,
  DiffOutlined,
  ProfileOutlined
  // , WarningOutlined
} from '@ant-design/icons';
import CancleQueueButton from 'components/@extended/CancleQueueButton';
import axios from 'axios';
import * as functionAddLogs from 'components/Function/AddLog';

import MUIDataTable from 'mui-datatables';

// ==============================|| ORDER TABLE - STATUS ||============================== //
const OrderStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case 'pending':
      color = 'error';
      title = 'รอคำสั่งซื้อ';
      break;
    case 'completed':
      color = 'success';
      title = 'สำเร็จ';
      break;
    case 'waiting':
      color = 'warning';
      title = 'รอออกคิว';
      break;
    case 'cancle':
      color = 'secondary';
      title = 'ยกเลิกคิว';
      break;
    default:
      color = 'secondary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
      <Tooltip title={title}>
        <Chip color={color ? color : ''} label={title} sx={{ minWidth: 70 }} />
      </Tooltip>
    </Stack>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.string
};

export default function ReserveTable({ startDate, endDate, permission, onFilter, reserList, checkFilter }) {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const userRoles = useSelector((state) => state.auth.roles);
  const [items, setItems] = useState([]);
  // const [order] = useState('asc');
  // const [orderBy] = useState('trackingNo');
  const currentDate = moment(new Date()).format('YYYY-MM-DD');

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    setLoading(true);
    getCompanys();
    if (userRoles && permission) {
      getReserve();
    }
  }, [userRoles, startDate, endDate, permission, onFilter]);

  const getReserve = async () => {
    let urlGet = '';
    if (userRoles == 1 || userRoles == 10 || (permission && permission !== 'no_access_to_view_data')) {
      urlGet = '/allreservesrange?pickup_date1=' + startDate + '&pickup_date2=' + endDate;
    } else {
      urlGet = '/allreservespickup2?user_id=' + userId + '&pickup_date1=' + startDate + '&pickup_date2=' + endDate;
    }

    await reserveRequest.getAllReserveByUrl(urlGet).then((response) => {
      if (onFilter) {
        const filter = response.filter((x) => x.product_company_id === onFilter);
        const newData = filter.map((item, index) => {
          return {
            ...item,
            No: index + 1
          };
        });
        setItems(newData.filter((x) => x.product_company_id === onFilter));
        setLoading(false);
      } else {
        const newData = response.map((item, index) => {
          return {
            ...item,
            No: index + 1
          };
        });
        reserList(newData);
        setItems(newData);
        setLoading(false);
      }
    });
  };

  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    if (checkFilter) {
      const activeFilters = Object.keys(checkFilter).filter((key) => checkFilter[key]);
      if (activeFilters.length === 0) {
        setFilteredData(items);
      } else {
        const filtered = items.filter((item) => {
          // if (activeFilters.includes("waiting_order")) {
          //   return item.status === "completed" && parseInt(item.total_quantity) === 0;
          // }
          if (checkFilter.waiting_order && item.status === 'completed' && parseInt(item.total_quantity) === 0) {
            return true;
          }

          if (checkFilter.completed && item.status === 'completed' && parseInt(item.total_quantity) > 0) {
            return true;
          }
          // return activeFilters.includes(item.status);
          return activeFilters.includes(item.status) && !(item.status === 'completed' && parseInt(item.total_quantity) === 0);
        });
        setFilteredData(filtered);
      }
    }
  }, [checkFilter, items]);

  const [companys, setCompanys] = useState([]);
  const getCompanys = () => {
    try {
      reserveRequest.getAllproductCompanys().then((response) => {
        setCompanys(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getTokenCompany = (company_id) => {
    const token = companys.filter((x) => x.product_company_id == company_id);

    return token[0]?.product_company_code;
  };

  // ==============================|| Update reserve ||============================== //
  const navigate = useNavigate();
  const updateDrivers = (id) => {
    navigate('/reserve/update/' + id);
  };

  // ==============================|| delete reserve ||============================== //
  const deleteReserve = (id) => {
    try {
      reserveRequest.deleteReserById(id).then((response) => {
        if (response.status == 'ok') {
          getReserve();
          let data = {};
          if (onclick == 'delete') {
            data = {
              audit_user_id: userId,
              audit_action: 'D',
              audit_system_id: id,
              audit_system: 'reserves',
              audit_screen: 'ข้อมูลการจองคิว',
              audit_description: 'ลบการจองคิว'
            };
          } else {
            data = {
              audit_user_id: userId,
              audit_action: 'D',
              audit_system_id: id,
              audit_system: 'reserves',
              audit_screen: 'ข้อมูลการจองคิว',
              audit_description: 'ยกเลิกการจองคิว'
            };
          }
          AddAuditLogs(data);

          setSaveLoading(false);
          setOnClickSubmit(false);
        } else {
          alert('ไม่สามารถลบข้อมูลได้ : ' + response.message.sqlMessage);
          setSaveLoading(false);
          setOnClickSubmit(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  // ==============================|| Create Queue ||============================== //
  const [open, setOpen] = useState(false);
  const [notifytext, setNotifyText] = useState('');
  const [reserve_id, setReserveId] = useState(0);
  // const [total_quantity, setTotalQuantity] = useState(0);
  const [brand_code, setBrandCode] = useState('');
  const [conpany_id, setCompanyId] = useState('');
  const [onclick, setOnClick] = useState('');
  const [reserveData, setReserveData] = useState([]);

  // ฟังก์ชันที่ใช้ในการเพิ่ม 0 ถ้าจำนวนน้อยกว่า 10
  const padZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  const handleClickOpen = (id, click, total_quantity, brand_code, conpany_id, reserveData) => {
    if (total_quantity === '0') {
      alert('reserve_id: ' + id + ' ไม่พบข้อมูลสั่งซื้อ กรุณาเพิ่มข้อมูล');
      return;
    } else {
      if (click == 'delete') {
        setNotifyText('ต้องการลบข้อมูลการจอง?');
      } else {
        setNotifyText('ต้องการสร้างคิวหรือไม่?');
      }

      setReserveData(reserveData);
      setOnClick(click);
      setReserveId(id);
      // setTotalQuantity(total_quantity);
      setBrandCode(brand_code);
      setCompanyId(conpany_id);
      setOpen(true);
    }
  };

  const [onclickSubmit, setOnClickSubmit] = useState(false);
  const handleClose = (flag) => {
    if (flag === 1) {
      setOnClickSubmit(true);
      //click มาจากการลบ
      if (onclick == 'add-queue') {
        setSaveLoading(true);
        addQueue(reserve_id);
      }
      if (onclick == 'delete') {
        setSaveLoading(true);
        deleteReserve(reserve_id);
        setOpen(false);
      }
      if (onclick == 'cancle') {
        setSaveLoading(true);
        deleteReserve(reserve_id);
        setOpen(false);
      }
    } else if (flag === 0) {
      setOpen(false);
    }
  };

  //  99999999
  // อัพเดทสถานะคิว
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

  //  99999999
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

  //=========================================== ตรวจสอบว่ามีการสร้าง Queue จากข้อมูลการจองหรือยัง //===========================================
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
          // if (typeof response.data.queuecount !== Number) {
          //   resolve(response.data.queuecount);
          // } else {
          response.data.queuecount.map((data) => {
            resolve(data.queuecount);
          });
          // }
        } else {
          alert(result['message']);
        }
      });
    });
  }

  async function checkQueueCompanyCount(id) {
    const newCurrentDate = await stepRequest.getCurrentDate();
    return await new Promise((resolve) => {
      // const currentDate = moment(new Date()).format('YYYY-MM-DD');
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
  async function createQueuef(reserve_id, brand_code, queue_number) {
    const newCurrentDate = await stepRequest.getCurrentDate();
    return new Promise((resolve) => {
      setTimeout(() => {
        //วันที่ปัจจุบัน
        const currentDate = newCurrentDate;
        const queueDate = newCurrentDate;

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

  //สร้าง addQueue รับค่า reserve_id ,total_quantity
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
        //createStep(queue_id_createf)
        await createStepsf(queue_id_createf, id);
        setOnClickSubmit(false);
        setOpen(false);
        // } else {
        //   alert('reserve_id: ' + id + 'ไม่พบข้อมูลสั่งซื้อ กรุณาเพิ่มข้อมูล');
        // }
      } else {
        //alert("สร้างคิวแล้ว")
        setOpen(false);
        updateReserveStatus(id);
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
  };

  async function getQueue(id) {
    const newCurrentDate = await stepRequest.getCurrentDate();
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

            const currentDate = newCurrentDate;
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
  async function createStepsf(queue_id) {
    const data = {
      audit_user_id: userId,
      audit_action: 'I',
      audit_system_id: queue_id,
      audit_system: 'queues',
      audit_screen: 'ข้อมูลคิว',
      audit_description: 'ออกบัตรคิว'
    };
    AddAuditLogs(data);
    const newCurrentDate = await stepRequest.getCurrentDate();
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentDate = newCurrentDate;

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
              remark: 'ชั่งหนัก',
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

  // ==============================|| Reserve Detail ||============================== //
  const reserveDetail = (id) => {
    navigate('/reserve/detail/' + id);
  };

  const handleSetReload = (refresh) => {
    if (refresh === true) {
      getReserve();
    }
  };

  const AddAuditLogs = async (data) => {
    await functionAddLogs.AddAuditLog(data);
  };

  // =============== Get Reserve New DataTable ===============//
  const options = {
    viewColumns: false,
    print: false,
    download: false,
    selectableRows: 'none',
    elevation: 0,
    rowsPerPage: 100,
    responsive: 'standard',
    // sort: false,
    rowsPerPageOptions: [100, 200, 300],
    customBodyRender: (value) => {
      return <div style={{ whiteSpace: 'nowrap' }}>{value}</div>;
    }
  };

  const columns = [
    {
      name: 'No',
      label: 'ลำดับ',
      options: {
        sort: true,
        setCellHeaderProps: () => ({
          style: { textAlign: 'center' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'center' }
        })
      }
    },
    {
      name: 'created_date',
      label: 'วันที่จอง',
      options: {
        sort: true,
        setCellProps: () => ({
          style: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }),
        customBodyRender: (value) => (
          <Typography variant="body">{moment(value.slice(0, 10)).format('DD/MM/YY') + ' - ' + value.slice(11, 16) + 'น.'}</Typography>
        )
      }
    },
    {
      name: 'pickup_date',
      label: 'วันที่เข้ารับสินค้า',
      options: {
        sort: true,
        setCellHeaderProps: () => ({
          style: {
            whiteSpace: 'nowrap',
            align: 'center'
          }
        }),
        customBodyRender: (value) => <Typography variant="body">{moment(value.slice(0, 10)).format('DD/MM/YY')}</Typography>
      }
    },
    {
      name: 'registration_no',
      label: 'ทะเบียนรถ',
      options: {
        sort: true,
        customBodyRender: (value) => (
          <Tooltip title={value}>
            <Chip color={'primary'} label={value} sx={{ width: 122, border: 1 }} />
          </Tooltip>
        )
      }
    },
    {
      name: 'product_company_id',
      label: 'แบรนด์ Code',
      options: {
        sort: true,
        setCellHeaderProps: () => ({
          style: {
            whiteSpace: 'nowrap',
            align: 'center'
          }
        }),
        customBodyRender: (value, tableMeta) => {
          const rowData = tableMeta.rowData;
          const rowDataFilter = filteredData.find((x) => x.reserve_id === rowData[12]);
          return rowDataFilter.queue_token ? <QueueTag id={value} token={rowDataFilter.queue_token} /> : getTokenCompany(value);
        }
      }
    },
    {
      name: 'r_description',
      label: 'รหัสคิวเดิม',
      options: {
        sort: true,
        setCellHeaderProps: () => ({
          style: {
            whiteSpace: 'nowrap',
            align: 'center'
          }
        }),
        customBodyRender: (value) => (value ? <strong style={{ color: 'red' }}>{value}</strong> : '-')
      }
    },
    {
      name: 'company',
      label: 'ร้านค้า/บริษัท',
      options: {
        sort: true,
        setCellProps: () => ({
          style: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }),
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'description',
      label: 'Zone',
      options: {
        sort: true,
        setCellProps: () => ({
          style: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }),
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'driver',
      label: 'คนขับรถ',
      options: {
        sort: true,
        setCellProps: () => ({
          style: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }),
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'mobile_no',
      label: 'เบอร์โทรคนขับรถ',
      options: {
        sort: true,
        setCellHeaderProps: () => ({
          style: {
            whiteSpace: 'nowrap',
            align: 'center'
          }
        }),
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'total_quantity',
      label: 'จำนวน (ตัน)',
      options: {
        sort: true,
        setCellHeaderProps: () => ({
          style: {
            whiteSpace: 'nowrap',
            align: 'center'
          }
        }),
        customBodyRender: (value) => <Typography variant="body">{value ? parseFloat((value * 1).toFixed(3)) : '-'}</Typography>
      }
    },
    {
      name: 'status',
      label: 'สถานะออกคิว',
      options: {
        // sort: true,
        setCellHeaderProps: () => ({
          style: {
            whiteSpace: 'nowrap',
            align: 'center'
          }
        }),
        customBodyRender: (value, tableMeta) => {
          const queueDat = filteredData[tableMeta.rowIndex];

          return value == 'completed' && parseFloat(queueDat.total_quantity) == 0 ? (
            <OrderStatus status={'pending'} />
          ) : (
            <OrderStatus status={value} />
          );
          // value !== 'none' ? <>{parseFloat(value) <= 0 ? <QueueStatus status={'pending'} /> : <QueueStatus status={value} />}</> : '-'
        }
      }
    },
    {
      name: 'reserve_id',
      label: 'Actions',
      options: {
        customBodyRender: (value, tableMeta) => {
          const queueDat = filteredData[tableMeta.rowIndex];
          return (
            <ButtonGroup variant="plain" aria-label="Basic button group" sx={{ boxShadow: 'none!important' }}>
              <Tooltip title="รายละเอียด">
                <span>
                  <Button
                    sx={{ minWidth: '33px!important', p: '6px 0px' }}
                    variant="contained"
                    size="medium"
                    color="success"
                    onClick={() => reserveDetail(value)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      window.open(`reserve/detail/${value}`, '_blank');
                    }}
                  >
                    <ProfileOutlined />
                  </Button>
                </span>
              </Tooltip>

              {permission && (permission === 'manage_everything' || permission === 'add_edit_delete_data') && (
                <>
                  <Tooltip title="สร้างคิว">
                    <span>
                      <Button
                        variant="contained"
                        sx={{ minWidth: '33px!important', p: '6px 0px' }}
                        size="medium"
                        disabled={
                          queueDat.status === 'completed' ||
                          currentDate !== moment(queueDat.pickup_date).format('YYYY-MM-DD') ||
                          queueDat.car_id == 1 ||
                          queueDat.driver_id == 1 ||
                          ((queueDat.product_brand_id === 45 || queueDat.product_brand_id === 46) &&
                            parseFloat(queueDat.total_quantity) === 0)
                        }
                        color="info"
                        onClick={() =>
                          handleClickOpen(
                            value,
                            'add-queue',
                            queueDat.total_quantity,
                            getTokenCompany(queueDat.product_company_id),
                            queueDat.product_company_id,
                            queueDat
                          )
                        }
                      >
                        <DiffOutlined />
                      </Button>
                    </span>
                  </Tooltip>
                  <Tooltip title="แก้ไข">
                    <span>
                      <Button
                        variant="contained"
                        sx={{ minWidth: '33px!important', p: '6px 0px' }}
                        size="medium"
                        color="primary"
                        onClick={() => updateDrivers(value)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          window.open(`/reserve/update/${value}`, '_blank');
                        }}
                      >
                        <EditOutlined />
                      </Button>
                    </span>
                  </Tooltip>
                  <CancleQueueButton reserve_id={value} status={queueDat.status} handleReload={handleSetReload} />
                  <Tooltip title="ลบ">
                    <span>
                      <Button
                        variant="contained"
                        sx={{ minWidth: '33px!important', p: '6px 0px' }}
                        size="medium"
                        disabled={queueDat.status === 'completed' || queueDat.total_quantity > 0}
                        color="error"
                        onClick={() => handleClickOpen(value, 'delete', queueDat.total_quantity, queueDat.brand_code)}
                      >
                        <DeleteOutlined />
                      </Button>
                    </span>
                  </Tooltip>
                </>
              )}
            </ButtonGroup>
          );
        },

        setCellHeaderProps: () => ({
          style: { textAlign: 'center' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'center' }
        })
      }
    }
  ];

  return (
    <Box>
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

      {saveLoading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={saveLoading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}

      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      <MUIDataTable
        title={<Typography variant="h5">ตารางข้อมูลการจองคิว</Typography>}
        data={filteredData}
        columns={columns}
        options={options}
      />
    </Box>
  );
}
