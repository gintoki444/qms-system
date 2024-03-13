import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// Link api url
// const apiUrl = process.env.REACT_APP_API_URL;
import * as queueRequest from '_api/queueReques';

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
  Typography,
  //   Backdrop,
  CircularProgress
} from '@mui/material';

// project import
// import Dot from 'components/@extended/Dot';

import {
  ProfileOutlined,
  // EditOutlined
  DeleteOutlined
} from '@ant-design/icons';

// import axios from 'axios';

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
    align: 'left',
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
    label: 'รอจัดการหัวจ่าย'
  },
  {
    id: 'action',
    align: 'center',
    disablePadding: false,
    label: 'Actions'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //
function QueueTableHead() {
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

// ==============================|| ORDER TABLE - STATUS ||============================== //
const QueueStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
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

function Step0Table({ startDate, endDate }) {
  const [loading, setLoading] = useState(false);
  const userRoles = useSelector((state) => state.auth.roles);
  const userId = useSelector((state) => state.auth.roles);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (userRoles && userId) {
      getQueue();
    }
  }, [userId, userRoles, startDate, endDate]);

  const getQueue = () => {
    try {
      queueRequest.getAllqueueByDateV2(startDate, endDate).then((response) => {
        setItems(response.filter((x) => x.step1_status === 'none'));
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  // const getReserve = () => {
  //   let urlGet = `/allreservesrange?pickup_date1=${startDate}&pickup_date2=${endDate}`;
  //   setLoading(true);

  //   reserveRequest.getReserByUrl(urlGet).then((response) => {
  //     try {
  //       setItems(response.filter((x) => x.status == 'completed'));
  //       setLoading(false);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   });
  // };

  // const navigate = useNavigate();
  // const clickAddQueue = (id) => {
  //   navigate('/admin/step0/add-queues/' + id);
  // };

  // const cancelReserve = (id) => {
  //   console.log('cancel ', +id);
  // };
  return (
    <Box>
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
          <QueueTableHead />
          {!loading ? (
            <TableBody>
              {items.length > 0 &&
                items.map((row, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell align="center">{row.queue_number}</TableCell>
                      <TableCell align="left">{moment(row.queue_date).format('MM/DD/YYYY')}</TableCell>
                      <TableCell align="center">
                        <Chip color={'primary'} label={row.token} sx={{ width: 70, border: 1 }} />
                      </TableCell>
                      <TableCell align="left">{row.company_name}</TableCell>
                      <TableCell align="left">{row.registration_no}</TableCell>
                      <TableCell align="left">{row.driver_name}</TableCell>
                      <TableCell align="left">{row.driver_mobile}</TableCell>
                      <TableCell align="center">{row.step1_status !== 'none' ? <QueueStatus status={row.step1_status} /> : '-'}</TableCell>
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

                          {userRoles && userRoles === 1 && (
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

export default Step0Table;
