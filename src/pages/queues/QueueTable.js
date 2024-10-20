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
  CircularProgress,
  Backdrop
} from '@mui/material';

import {
  ProfileOutlined,
  // EditOutlined
  DeleteOutlined
} from '@ant-design/icons';

import MUIDataTable from 'mui-datatables';
import CopyLinkButton from 'components/CopyLinkButton';
// import ResetStepButton from 'components/@extended/ResetStepButton';

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
    case 'cancle':
      color = 'error';
      title = 'ยกเลิกคิว';
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

export default function QueueTable({ startDate, endDate, permission, queusList, onFilter }) {
  const [open, setOpen] = useState(false);
  const userRoles = useSelector((state) => state.auth.roles);
  const userID = useSelector((state) => state.auth.user_id);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  // const [order] = useState('asc');
  // const [orderBy] = useState('trackingNo');

  // const userId = localStorage.getItem('user_id');

  useEffect(() => {
    setLoading(true);
    if (userRoles) getQueue();
  }, [startDate, endDate, userRoles, permission, onFilter]);

  const getQueue = () => {
    try {
      if (userRoles == 8) {
        queueRequest.getAllqueueUserByDate(userID, startDate, endDate).then((response) => {
          if (onFilter) {
            const filter = response.filter((x) => x.product_company_id === onFilter);
            const newData = filter.map((item, index) => {
              return {
                ...item,
                No: index + 1
              };
            });
            setItems(newData.filter((x) => x.product_company_id === onFilter));
          } else {
            const newData = response.map((item, index) => {
              return {
                ...item,
                No: index + 1
              };
            });
            queusList(newData);
            setItems(newData);
          }
          setLoading(false);
        });
      } else {
        queueRequest.getAllqueueByDateV2(startDate, endDate).then((response) => {
          if (onFilter) {
            const filter = response.filter((x) => x.product_company_id === onFilter);
            const newData = filter.map((item, index) => {
              return {
                ...item,
                No: index + 1
              };
            });
            setItems(newData.filter((x) => x.product_company_id === onFilter));
          } else {
            const newData = response.map((item, index) => {
              return {
                ...item,
                No: index + 1
              };
            });
            queusList(newData);
            setItems(newData);
          }
          setLoading(false);
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // =============== Get Company DataTable ===============//
  const options = {
    viewColumns: false,
    print: false,
    download: false,
    selectableRows: 'none',
    elevation: 0,
    rowsPerPage: 100,
    responsive: 'standard',
    // sort: false,
    rowsPerPageOptions: [100, 200, 300]
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
      name: 'queue_date',
      label: 'วันที่เข้ารับสินค้า',
      options: {
        sort: true,
        customBodyRender: (value) => <Typography variant="body">{moment(value.slice(0, 10)).format('DD/MM/YY')}</Typography>
      }
    },
    {
      name: 'token',
      label: 'หมายเลขคิว',
      options: {
        sort: true,
        customBodyRender: (value) => <Chip color={'primary'} label={value} sx={{ width: 70, border: 1 }} />
      }
    },
    {
      name: 'reserve_description',
      label: 'รหัสคิวเดิม',
      options: {
        sort: true,
        customBodyRender: (value) => (value ? <strong style={{ color: 'red' }}>{value}</strong> : '-')
      }
    },
    {
      name: 'company_name',
      label: 'ร้านค้า/บริษัท',
      options: {
        sort: true,
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'registration_no',
      label: 'ทะเบียนรถ',
      options: {
        sort: true,
        customBodyRender: (value) => <Chip color={'primary'} label={value} sx={{ width: 122, border: 1 }} />
      }
    },
    {
      name: 'driver_name',
      label: 'ชื่อผู้ขับ',
      options: {
        sort: true,
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'driver_mobile',
      label: 'เบอร์โทรศัพท์',
      options: {
        sort: true,
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'queue_id',
      label: 'ชั่งเบา(S1)',
      options: {
        customBodyRender: (value, tableMeta) => {
          const queueDat = items[tableMeta.rowIndex];
          return (
            <div style={{ textAlign: 'center' }}>
              {queueDat.step1_status !== 'none' ? (
                <>
                  {parseFloat(queueDat.step1_status) <= 0 ? (
                    <QueueStatus status={'pending'} />
                  ) : (
                    <QueueStatus status={queueDat.step1_status} />
                  )}
                </>
              ) : (
                <>{'-'}</>
              )}
              {/* <ResetStepButton data={queueDat} stepId={'step1'} /> */}
              {/* <br />
              <Tooltip title="รายละเอียด">
                <span>
                  <Button
                    sx={{ minWidth: '33px!important', p: '6px 0px', mt: 1 }}
                    variant="contained"
                    size="medium"
                    color="info"
                    onClick={() => updateDrivers(value)}
                  >
                    รีเซต
                  </Button>
                </span>
              </Tooltip> */}
            </div>
          );
        }
      }
    },
    {
      name: 'step2_status',
      label: 'ขึ้นสินค้า(S2)',
      options: {
        // sort: true,
        customBodyRender: (value) => (value !== 'none' ? <QueueStatus status={value} /> : '-')
      }
    },
    {
      name: 'step3_status',
      label: 'ชั่งหนัก(S3)',
      options: {
        // sort: true,
        customBodyRender: (value) => (value !== 'none' ? <QueueStatus status={value} /> : '-')
      }
    },
    {
      name: 'step4_status',
      label: 'เสร็จสิ้น(S4)',
      options: {
        // sort: true,
        customBodyRender: (value) => (value !== 'none' ? <QueueStatus status={value} /> : '-')
      }
    },
    {
      name: 'queue_id',
      label: 'Actions',
      options: {
        customBodyRender: (value, tableMeta) => {
          const queueDat = items[tableMeta.rowIndex];
          const prurl = window.location.href + '/detail/';
          return (
            <ButtonGroup variant="plain" aria-label="Basic button group" sx={{ boxShadow: 'none!important' }}>
              {permission && (permission === 'manage_everything' || permission === 'add_edit_delete_data') && (
                <CopyLinkButton link={prurl} data={value} shortButton={true} />
              )}

              <Tooltip title="รายละเอียด">
                <span>
                  <Button
                    sx={{ minWidth: '33px!important', p: '6px 0px' }}
                    variant="contained"
                    size="medium"
                    color="info"
                    onClick={() => updateDrivers(value)}
                  >
                    <ProfileOutlined />
                  </Button>
                </span>
              </Tooltip>

              {/* {permission && (permission === 'manage_everything' || permission === 'add_edit_delete_data') && permission=== 9999 && ( */}

              {permission === 9999 && (
                <Tooltip title="ลบ">
                  <span>
                    <Button
                      variant="contained"
                      sx={{ minWidth: '33px!important', p: '6px 0px' }}
                      size="medium"
                      disabled={queueDat.step1_status === 'completed'}
                      color="error"
                      onClick={() => handleClickOpen(value, queueDat.reserve_id, queueDat.step1_status)}
                    >
                      <DeleteOutlined />
                    </Button>
                  </span>
                </Tooltip>
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

  // ยกเลิกข้อมูลการจองคิว
  const [reserve_id, setReserve_id] = useState(false);
  // const [queueData, setQueueData] = useState();
  const [id_del, setDel] = useState(0);
  const [textnotify, setText] = useState('');
  const [onClick, setOnClick] = useState('');

  const handleClickOpen = (queue_id, reserve_id, step1_status, onClick) => {
    if (onClick === 'delete') {
      if (step1_status === 'processing' || step1_status === 'completed') {
        alert('คิวนี้ถูกเรียกแล้ว! ไม่สามารถลบข้อมูลนี้ได้');
        return;
      }
      setReserve_id(reserve_id);
      setText('ลบข้อมูล');
      setDel(queue_id);
    } else if (onClick === 'reset') {
      setText('รีเซตสถานะ');
      // setQueueData(queueData);
    }
    setOnClick(onClick);
    setOpen(true);
  };

  const [onclickSubmit, setOnClickSubmit] = useState(false);
  const handleClose = (flag) => {
    if (onClick === 'delete') {
      if (flag === 1) {
        setOnClickSubmit(true);
        setLoading(true);

        deteteQueue(id_del);
        //update = waiting การจองเมื่อลบคิว queue
        updateReserveStatus(reserve_id);
        setOpen(false);
      }
    }
    if (flag === 0) {
      setOpen(false);
    }
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
      .then((response) => {
        response.json();
        setOnClickSubmit(false);
      })
      .catch((error) => console.log('error', error));
  };

  const navigate = useNavigate();
  const updateDrivers = (id) => {
    navigate('/queues/detail/' + id);
  };
  return (
    <Box
      sx={{
        '& .MuiTableCell-root': {
          textWrap: 'nowrap'
        }
      }}
    >
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title" style={{ fontFamily: 'kanit' }}>
          {'แจ้งเตือน'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontFamily: 'kanit' }}>ต้องการ {textnotify} หรือไม่?</DialogContentText>
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

      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}

      <MUIDataTable title={<Typography variant="h5">ข้อมูลคคิวรับสินค้า</Typography>} data={items} columns={columns} options={options} />
      {/* <TableContainer
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
      </TableContainer> */}
    </Box>
  );
}
