import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';

// get queue api
const apiUrl = process.env.REACT_APP_API_URL;
import * as queueRequest from '_api/queueReques';

// material-ui
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ButtonGroup,
  Button,
  Chip,
  Tooltip,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from '@mui/material';

import {
  ProfileOutlined,
  // EditOutlined
  DeleteOutlined
} from '@ant-design/icons';

// const currentDate = moment(new Date()).format('YYYY-MM-DD');

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'queueNo',
    align: 'center',
    disablePadding: false,
    label: 'ลำดับ'
  },
  {
    id: 'reserve_date',
    align: 'left',
    disablePadding: false,
    label: 'วันที่เข้ารับสินค้า'
  },
  {
    id: 'queue_token',
    align: 'center',
    disablePadding: false,
    label: 'หมายเลขคิว'
  },
  {
    id: 'branName',
    align: 'left',
    disablePadding: false,
    label: 'ร้านค้า/บริษัท'
  },
  {
    id: 'registration_no',
    align: 'center',
    disablePadding: true,
    label: 'ทะเบียนรถ'
  },
  {
    id: 'driver',
    align: 'left',
    disablePadding: true,
    label: 'ชื่อผู้ขับ'
  },
  {
    id: 'tel',
    align: 'left',
    disablePadding: true,
    label: 'เบอร์โทรศัพท์'
  },
  {
    id: 'step1',
    align: 'center',
    disablePadding: false,
    label: 'ชั่งเบา(S1)'
  },
  {
    id: 'step2',
    align: 'center',
    disablePadding: false,
    label: ' ขึ้นสินค้า(S2)'
  },
  {
    id: 'step3',
    align: 'center',
    disablePadding: false,
    label: 'ชั่งหนัก(S3)'
  },
  {
    id: 'step4',
    align: 'center',
    disablePadding: false,
    label: 'เสร็จสิ้น(S4)'
  },
  {
    id: 'action',
    align: 'center',
    disablePadding: false,
    label: 'Actions'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //
function QueueTableHead({ order, orderBy }) {
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

QueueTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string
};

// ==============================|| ORDER TABLE - STATUS ||============================== //
const QueueStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case 'pending':
      color = 'error';
      title = 'รอคำสั่งซื้อ';
      break;
    case 'processing':
      color = 'warning';
      title = 'ดำเนินการ';
      break;
    case 'completed':
      color = 'success';
      title = 'สำเร็จ';
      break;
    case 'waiting':
      color = 'secondary';
      title = 'รอเรียกคิว';
      break;
    default:
      color = 'secondary';
      title = '-';
  }

  return (
    <Tooltip title={title}>
      <Chip color={color} label={title} sx={{ minWidth: '78.7px!important' }} />
    </Tooltip>
  );
};

QueueStatus.propTypes = {
  status: PropTypes.string
};

export default function QueueTable({ startDate, endDate }) {
  const [open, setOpen] = useState(false);
  const userRoles = useSelector((state) => state.auth.roles);
  const userID = useSelector((state) => state.auth.user_id);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');

  // const userId = localStorage.getItem('user_id');

  useEffect(() => {
    setLoading(true);
    if (userRoles) getQueue();
  }, [startDate, endDate, userRoles]);

  const getQueue = () => {
    try {
      console.log('userID :', userID);
      if (userRoles == 8) {
        queueRequest.getAllqueueUserByDate(userID, startDate, endDate).then((response) => {
          setItems(response);
          setLoading(false);
        });
      } else {
        queueRequest.getAllqueueByDateV2(startDate, endDate).then((response) => {
          setItems(response);
          setLoading(false);
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // ยกเลิกข้อมูลการจองคิว
  const [reserve_id, setReserve_id] = useState(false);
  const [id_del, setDel] = useState(0);
  const [textnotify, setText] = useState('');

  const handleClickOpen = (queue_id, reserve_id, step1_status) => {
    if (step1_status === 'processing' || step1_status === 'completed') {
      alert('คิวนี้ถูกเรียกแล้ว! ไม่สามารถลบข้อมูลนี้ได้');
      return;
    }
    setReserve_id(reserve_id);
    setText('ลบข้อมูล');
    setDel(queue_id);
    setOpen(true);
  };

  const handleClose = (flag) => {
    if (flag === 1) {
      setLoading(true);

      deteteQueue(id_del);
      //update = waiting การจองเมื่อลบคิว queue
      updateReserveStatus(reserve_id);
    }
    setOpen(false);
  };

  const deteteQueue = (queueId) => {
    setLoading(true);
    //ลบคิว
    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow'
    };

    fetch(apiUrl + '/deletequeuestep/' + queueId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result['status'] === 'ok') {
          getQueue();
        }
      })
      .catch((error) => console.log('error', error));
  };

  const updateReserveStatus = (reserve_id) => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      status: 'waiting'
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(apiUrl + '/updatereservestatus/' + reserve_id, requestOptions)
      .then((response) => response.json())
      .catch((error) => console.log('error', error));
  };

  const navigate = useNavigate();
  const updateDrivers = (id) => {
    navigate('/queues/detail/' + id);
  };
  return (
    <Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title" style={{ fontFamily: 'kanit' }}>
          {'แจ้งเตือน'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontFamily: 'kanit' }}>ต้องการ {textnotify} หรือไม่?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleClose(0)} style={{ fontFamily: 'kanit' }}>
            ยกเลิก
          </Button>
          <Button onClick={() => handleClose(1)} autoFocus style={{ fontFamily: 'kanit' }}>
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
          <QueueTableHead order={order} orderBy={orderBy} />
          {!loading ? (
            <TableBody>
              {items.length > 0 &&
                items.map((row, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell align="center">{row.queue_number}</TableCell>
                      <TableCell align="left">{moment(row.queue_date).format('DD/MM/YYYY')}</TableCell>
                      <TableCell align="center">
                        <Chip color={'primary'} label={row.token} sx={{ width: 70, border: 1 }} />
                      </TableCell>
                      <TableCell align="left">{row.company_name}</TableCell>
                      <TableCell align="center">
                        <Chip color={'primary'} label={row.registration_no} sx={{ width: 122, border: 1 }} />
                      </TableCell>
                      <TableCell align="left">{row.driver_name}</TableCell>
                      <TableCell align="left">{row.driver_mobile}</TableCell>
                      <TableCell align="center">
                        {row.step1_status !== 'none' ? (
                          <>
                            {parseFloat(row.total_quantity) <= 0 ? (
                              <QueueStatus status={'pending'} />
                            ) : (
                              <QueueStatus status={row.step1_status} />
                            )}
                          </>
                        ) : (
                          '-'
                        )}
                      </TableCell>

                      <TableCell align="center">{row.step2_status !== 'none' ? <QueueStatus status={row.step2_status} /> : '-'}</TableCell>
                      <TableCell align="center">{row.step3_status !== 'none' ? <QueueStatus status={row.step3_status} /> : '-'}</TableCell>
                      <TableCell align="center">{row.step4_status !== 'none' ? <QueueStatus status={row.step4_status} /> : '-'}</TableCell>
                      <TableCell align="center">
                        <ButtonGroup variant="plain" aria-label="Basic button group" sx={{ boxShadow: 'none!important' }}>
                          <Tooltip title="รายละเอียด">
                            <span>
                              <Button
                                sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                variant="contained"
                                size="medium"
                                color="info"
                                onClick={() => updateDrivers(row.queue_id)}
                              >
                                <ProfileOutlined />
                              </Button>
                            </span>
                          </Tooltip>

                          {userRoles && userRoles === 10 && (
                            <Tooltip title="ลบ">
                              <span>
                                <Button
                                  variant="contained"
                                  sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                  size="medium"
                                  disabled={row.status === 'completed'}
                                  color="error"
                                  onClick={() => handleClickOpen(row.queue_id, row.reserve_id, row.step1_status)}
                                >
                                  <DeleteOutlined />
                                </Button>
                              </span>
                            </Tooltip>
                          )}

                          {userRoles && (userRoles === 1 || userRoles === 9) && (
                            <Tooltip title="ลบ">
                              <span>
                                <Button
                                  variant="contained"
                                  sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                  size="medium"
                                  disabled={row.status === 'completed'}
                                  color="error"
                                  onClick={() => handleClickOpen(row.queue_id, row.reserve_id, row.step1_status)}
                                >
                                  <DeleteOutlined />
                                </Button>
                              </span>
                            </Tooltip>
                          )}
                        </ButtonGroup>
                        {/* <Button 
                      sx={{ minWidth: '33px!important', p: '6px 0px' }}
                      variant="contained" size="medium" color="error" onClick={() => deleteDrivers(row.reserve_id)}>
                      <DeleteOutlined />
                    </Button> */}
                      </TableCell>
                    </TableRow>
                  );
                })}

              {items.length == 0 && (
                <TableRow>
                  <TableCell colSpan={11} align="center">
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
