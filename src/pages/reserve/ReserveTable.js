import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
import * as reserveRequest from '_api/reserveRequest';
import * as queuesRequest from '_api/queueReques';

// Get Role use
import { useSelector } from 'react-redux';

// material-ui
import {
  Box,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
// import Dot from 'components/@extended/Dot';
import { EditOutlined, DeleteOutlined, DiffOutlined, ProfileOutlined } from '@ant-design/icons';

import axios from 'axios';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'No',
    align: 'center',
    disablePadding: true,
    label: 'ลำดับ'
  },
  // {
  //   id: 'dateReserve',
  //   align: 'center',
  //   disablePadding: true,
  //   label: 'วันที่จอง'
  // },
  {
    id: 'dateQueue',
    align: 'center',
    disablePadding: true,
    label: 'วันที่เข้ารับ'
  },
  {
    id: 'registration_no',
    align: 'center',
    disablePadding: true,
    label: 'ทะเบียนรถ'
  },
  {
    id: 'brandCode',
    align: 'center',
    disablePadding: true,
    label: 'เบรน Code'
  },
  {
    id: 'description',
    align: 'left',
    disablePadding: true,
    width: '12%',
    label: 'เหตุผลการจอง'
  },
  {
    id: 'Company',
    align: 'left',
    disablePadding: false,
    width: '15%',
    label: 'บริษัท'
  },
  {
    id: 'names',
    align: 'left',
    disablePadding: false,
    label: 'ชื่อผู้ติดต่อ'
  },
  {
    id: 'tels',
    align: 'left',
    disablePadding: false,
    label: 'เบอร์โทรผู้ติดต่อ'
  },
  {
    id: 'driverName',
    align: 'left',
    disablePadding: false,
    label: 'คนขับรถ'
  },
  {
    id: 'totalQuantity',
    align: 'right',
    disablePadding: false,
    label: 'จำนวน (ตัน)'
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: false,
    label: 'สถานะออกคิว'
  },
  {
    id: 'action',
    align: 'center',
    width: '10%',
    disablePadding: false,
    label: 'Actions'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //
function OrderTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'} width={headCell.width}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string
};

// ==============================|| ORDER TABLE - STATUS ||============================== //
const OrderStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case 'pending':
      color = 'warning';
      title = 'Pending';
      break;
    case 'completed':
      color = 'success';
      title = 'สำเร็จ';
      break;
    case 'waiting':
      color = 'warning';
      title = 'รออนุมัติ';
      break;
    default:
      color = 'secondary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
      <Chip color={color ? color : ''} label={title} sx={{ minWidth: 70 }} />
    </Stack>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.string
};

export default function ReserveTable({ startDate, endDate }) {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const userRoles = useSelector((state) => state.auth.roles);
  const [items, setItems] = useState([]);
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const currentDate = moment(new Date()).format('YYYY-MM-DD');

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    getCompanys();
    if (userRoles) {
      getReserve();
    }
  }, [userRoles, startDate, endDate]);

  const getReserve = () => {
    setLoading(true);
    let urlGet = '';
    if (userRoles == 1 || userRoles == 10) {
      urlGet = '/allreservesrange?pickup_date1=' + startDate + '&pickup_date2=' + endDate;
    } else {
      urlGet = '/allreservespickup2?user_id=' + userId + '&pickup_date1=' + startDate + '&pickup_date2=' + endDate;
    }

    reserveRequest.getAllReserveByUrl(urlGet).then((response) => {
      setItems(response);
      setLoading(false);
    });
  };

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
          setSaveLoading(false);
        } else {
          alert('ไม่สามารถลบข้อมูลได้ : ' + response.message.sqlMessage);
          setSaveLoading(false);
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
  const [total_quantity, setTotalQuantity] = useState(0);
  const [brand_code, setBrandCode] = useState('');
  const [conpany_id, setCompanyId] = useState('');
  const [onclick, setOnClick] = useState('');

  // ฟังก์ชันที่ใช้ในการเพิ่ม 0 ถ้าจำนวนน้อยกว่า 10
  const padZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  const handleClickOpen = (id, click, total_quantity, brand_code, conpany_id) => {
    if (total_quantity === '0') {
      alert('reserve_id: ' + id + ' ไม่พบข้อมูลสั่งซื้อ กรุณาเพิ่มข้อมูล');
      return;
    } else {
      if (click == 'delete') {
        setNotifyText('ต้องการลบข้อมูลการจอง?');
      } else {
        setNotifyText('ต้องการสร้างคิวหรือไม่?');
      }
      console.log('brand_code :', brand_code);

      setOnClick(click);
      setReserveId(id);
      setTotalQuantity(total_quantity);
      setBrandCode(brand_code);
      setCompanyId(conpany_id);
      setOpen(true);
    }
  };

  const handleClose = (flag) => {
    if (flag === 1) {
      //click มาจากการลบ
      if (onclick == 'add-queue') {
        setSaveLoading(true);
        addQueue(reserve_id, total_quantity);
      }
      if (onclick == 'delete') {
        setSaveLoading(true);
        deleteReserve(reserve_id);
      }
    }
    setOpen(false);
  };

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
          resolve(response.queue_count_company_code);
          console.log('getQueueTokenByIdCom:', response.queue_count_company_code);
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
          await createStepsf(queue_id_createf, id);
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

  return (
    <Box>
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

      {saveLoading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={saveLoading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}

      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
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
          <OrderTableHead order={order} orderBy={orderBy} />
          {!loading ? (
            <TableBody>
              {items.length > 0 &&
                items.map((row, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell align="center">{index + 1}</TableCell>
                      {/* <TableCell align="left">{moment(row.created_date).format('DD/MM/YYYY')}</TableCell> */}
                      <TableCell align="center">
                        <Chip color={'primary'} label={moment(row.pickup_date).format('DD/MM/YYYY')} sx={{ minWidth: 95 }} />
                      </TableCell>
                      <TableCell align="center">
                        <Chip color={'primary'} label={row.registration_no} sx={{ width: 122, border: 1 }} />
                      </TableCell>
                      <TableCell align="center">{getTokenCompany(row.product_company_id)}</TableCell>
                      <TableCell align="left">
                        {row.r_description ? (
                          <Tooltip title={row.r_description}>
                            {row.r_description.substring(0, 30)} {row.r_description.length >= 20 && '...'}
                          </Tooltip>
                        ) : (
                          <>-</>
                        )}
                      </TableCell>
                      <TableCell align="left">{row.company}</TableCell>
                      <TableCell align="left">{row.contact_person}</TableCell>
                      <TableCell align="left">{row.contact_number}</TableCell>
                      <TableCell align="left">{row.driver}</TableCell>
                      <TableCell align="right"> {parseFloat((row.total_quantity * 1).toFixed(3))}</TableCell>
                      <TableCell align="center">
                        <OrderStatus status={row.status} />
                      </TableCell>
                      <TableCell align="center">
                        <ButtonGroup variant="plain" aria-label="Basic button group" sx={{ boxShadow: 'none!important' }}>
                          <Tooltip title="รายละเอียด">
                            <span>
                              <Button
                                variant="contained"
                                sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                size="medium"
                                color="success"
                                onClick={() => reserveDetail(row.reserve_id)}
                              >
                                <ProfileOutlined />
                              </Button>
                            </span>
                          </Tooltip>
                          {(userRoles === 9 || userRoles === 1) && (
                            <Tooltip title="สร้างคิว">
                              <span>
                                <Button
                                  // disabled
                                  variant="contained"
                                  sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                  size="medium"
                                  disabled={
                                    row.status === 'completed' ||
                                    currentDate !== moment(row.pickup_date).format('YYYY-MM-DD') ||
                                    row.total_quantity == 0
                                  }
                                  color="info"
                                  onClick={() =>
                                    handleClickOpen(
                                      row.reserve_id,
                                      'add-queue',
                                      row.total_quantity,
                                      getTokenCompany(row.product_company_id),
                                      row.product_company_id
                                    )
                                  }
                                >
                                  <DiffOutlined />
                                </Button>
                              </span>
                            </Tooltip>
                          )}
                          <Tooltip title="แก้ไข">
                            <span>
                              <Button
                                variant="contained"
                                sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                size="medium"
                                disabled={userRoles !== 1 && row.status === 'completed'}
                                color="primary"
                                onClick={() => updateDrivers(row.reserve_id)}
                              >
                                <EditOutlined />
                              </Button>
                            </span>
                          </Tooltip>
                          <Tooltip title="ลบ">
                            <span>
                              <Button
                                variant="contained"
                                sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                size="medium"
                                disabled={row.status === 'completed' || row.total_quantity > 0}
                                color="error"
                                // onClick={() => deleteDrivers(row.reserve_id)}
                                onClick={() => handleClickOpen(row.reserve_id, 'delete', row.total_quantity, row.brand_code)}
                              >
                                <DeleteOutlined />
                              </Button>
                            </span>
                          </Tooltip>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  );
                })}

              {items.length == 0 && (
                <TableRow>
                  <TableCell colSpan={13} align="center">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={13} align="center">
                  <CircularProgress />
                  <Typography variant="body1">Loading....</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
}
