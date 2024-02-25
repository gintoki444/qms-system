import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';

// project import
// import Dot from 'components/@extended/Dot';
import { EditOutlined, DeleteOutlined, DiffOutlined, ProfileOutlined } from '@ant-design/icons';

import axios from 'axios';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'reserveNo',
    align: 'left',
    disablePadding: false,
    label: 'รหัสการจอง.'
  },
  {
    id: 'dateReserve',
    align: 'left',
    disablePadding: true,
    label: 'วันที่จอง'
  },
  {
    id: 'dateQueue',
    align: 'left',
    disablePadding: true,
    label: 'วันที่เข้ารับสินค้า'
  },
  {
    id: 'brandCode',
    align: 'left',
    disablePadding: true,
    label: 'Brand Code'
  },
  {
    id: 'description',
    align: 'left',
    disablePadding: false,
    label: 'รายละเอียด'
  },
  {
    id: 'Company',
    align: 'center',
    disablePadding: false,
    label: 'ร้านค้า/บริษัท'
  },
  {
    id: 'totalQuantity',
    align: 'right',
    disablePadding: false,
    label: 'จำนวน'
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: false,
    label: 'สถานะการจอง'
  },
  {
    id: 'action',
    align: 'center',
    disablePadding: false,
    label: 'Actions'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //
function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
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
      <Chip color={color ? color : ''} label={title} />
    </Stack>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.string
};

export default function ReserveTable() {
  const userRoles = useSelector((state) => state.auth.roles);
  const [items, setItems] = useState([]);
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    console.log('userRoles :', userRoles);
    getReserve();
  }, []);

  const getReserve = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: apiUrl + '/allreserves/' + userId,
      headers: {}
    };

    axios
      .request(config)
      .then((response) => {
        setItems(response.data);
        // setItems(response.data.filter((x) => x.status !== 'completed'));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const navigate = useNavigate();
  const updateDrivers = (id) => {
    navigate('/reserve/update/' + id);
  };

  const deleteDrivers = (id) => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: apiUrl + '/deletedriver/' + id,
      headers: {}
    };

    console.log(config.url);

    axios
      .request(config)
      .then((result) => {
        console.log(result);
        if (result.data.status === 'ok') {
          alert(result.data.message);
          getDrivers();
        } else {
          alert(result.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
          console.log('response.data.queuecount :', response.data.queuecount);
          response.data.queuecount.map((data) => {
            console.log('data :', data.queuecount);
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

        console.log(raw);

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
        window.location.href = '/queues/detail/' + queue_id;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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
          .then((result) => {
            console.log(result);
            window.location.href = '/queues/detail/' + queue_id;
          })
          .catch((error) => console.log('error', error));

        resolve('Async operation completed');
      }, 100);
    });
  }

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
          <TableBody>
            {items.map((row, index) => {
              return (
                <TableRow key={index}>
                  <TableCell align="left">{row.reserve_id}</TableCell>
                  <TableCell align="left">{moment(row.created_date).format('DD/MM/YYYY')}</TableCell>
                  <TableCell align="left">{moment(row.pickup_date).format('DD/MM/YYYY')}</TableCell>
                  <TableCell align="left">{row.brand_code}</TableCell>
                  <TableCell align="left">{row.description}</TableCell>
                  <TableCell align="center">{row.company}</TableCell>
                  <TableCell align="right">{row.total_quantity}</TableCell>
                  <TableCell align="center">
                    <OrderStatus status={row.status} />
                  </TableCell>
                  <TableCell align="center" sx={{ '& button': { m: 1 } }}>
                    <Tooltip title="รายละเอียด">
                      <Button
                        variant="outlined"
                        sx={{ minWidth: '33px!important', p: '6px 0px' }}
                        size="medium"
                        color="success"
                        onClick={() => reserveDetail(row.reserve_id)}
                      >
                        <ProfileOutlined />
                      </Button>
                    </Tooltip>

                    {row.status !== 'completed' && (
                      <Tooltip title="สร้างคิว">
                        <Button
                          variant="contained"
                          sx={{ minWidth: '33px!important', p: '6px 0px' }}
                          size="medium"
                          color="info"
                          onClick={() => handleClickOpen(row.reserve_id, row.total_quantity, row.brand_code)}
                        >
                          <DiffOutlined />
                        </Button>
                      </Tooltip>
                    )}

                    {row.status !== 'completed' && (
                      <Tooltip title="แก้ไข">
                        <Button
                          variant="contained"
                          sx={{ minWidth: '33px!important', p: '6px 0px' }}
                          size="medium"
                          color="primary"
                          onClick={() => updateDrivers(row.reserve_id)}
                        >
                          <EditOutlined />
                        </Button>
                      </Tooltip>
                    )}

                    {row.status !== 'completed' && (
                      <Tooltip title="ลบ">
                        <Button
                          variant="contained"
                          sx={{ minWidth: '33px!important', p: '6px 0px' }}
                          size="medium"
                          color="error"
                          onClick={() => deleteDrivers(row.reserve_id)}
                        >
                          <DeleteOutlined />
                        </Button>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}

            {items.length == 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
