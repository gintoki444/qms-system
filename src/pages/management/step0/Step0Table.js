import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// Link api url
// const apiUrl = process.env.REACT_APP_API_URL;
// import * as queueRequest from '_api/queueReques';
import * as stepRequest from '_api/StepRequest';
import QueueTag from 'components/@extended/QueueTag';

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

import { EditOutlined } from '@ant-design/icons';

import CancleTeamStation from 'components/@extended/CancleTeamStation';
import AddTeamLoading from './step0-forms/AddTeamLoading';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'queueNo',
    align: 'center',
    disablePadding: false,
    label: 'ลำดับ'
  },
  {
    id: 'dateReserve',
    align: 'center',
    disablePadding: true,
    label: 'วันที่จอง'
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
    id: 'remarkQueue',
    align: 'center',
    disablePadding: false,
    // width: '5%',
    label: 'รหัสคิวเดิม'
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
    label: 'สถานะ'
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
      title = 'รอจัดการหัวจ่าย';
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
      title = 'รอเลือกหัวจ่าย';
      break;
    default:
      color = 'secondary';
      title = '-';
  }

  return (
    <Tooltip title={title}>
      <Chip color={color} label={title} sx={{ minWidth: '100px!important' }} />
    </Tooltip>
  );
};

QueueStatus.propTypes = {
  status: PropTypes.string
};

function Step0Table({ startDate, endDate, onFilter, permission, step0List }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const userRoles = useSelector((state) => state.auth.roles);
  const userId = useSelector((state) => state.auth.roles);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (userRoles && userId) {
      setLoading(true);
      getQueue();
    }

    // const intervalId = setInterval(() => {
    //   getQueue();
    // }, 60000); // Polling every 5 seconds

    // return () => clearInterval(intervalId);
  }, [userId, userRoles, startDate, endDate, onFilter, permission]);

  const getQueue = () => {
    try {
      stepRequest.getAllStep0ByDate(startDate, endDate).then((response) => {
        setItems(response.filter((x) => x.product_company_id == (onFilter + 1) && x.token !== null && parseFloat(x.total_quantity) > 0 && x.step2_status !== "completed" && x.step2_status !== "cancle") || []);
        step0List(response.filter((x) => x.token !== null && parseFloat(x.total_quantity) > 0 && x.step2_status !== "completed" && x.step2_status !== "cancle") || []);
        // setItems(response.filter((x) => x.product_company_id == (onFilter + 1) && x.token !== null && parseFloat(x.total_quantity) > 0));

        // step0List(response.filter((x) => x.product_company_id == (onFilter + 1) && x.token !== null && parseFloat(x.total_quantity) > 0));
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const updateDrivers = (id) => {
    navigate('/admin/step0/add-queues/' + id);
  };

  const handleSetReload = (refresh) => {
    if (refresh === true) {
      setLoading(true);
      getQueue();
    }
  }
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
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="left">
                        {moment(row.created_date.slice(0, 10)).format('DD/MM/YY') + ' - ' + row.created_date.slice(11, 16) + 'น.'}
                      </TableCell>
                      <TableCell align="left">{moment(row.queue_date.slice(0, 10)).format('DD/MM/YY')}</TableCell>
                      <TableCell align="center">
                        <QueueTag id={row.product_company_id} token={row.token} />

                        {/* <Chip color={'primary'} label={row.token} sx={{ width: 70, border: 1 }} /> */}
                        {row.queue_remain == 1 && <span style={{ color: 'red' }}> (คิวค้าง)</span>}
                      </TableCell>
                      <TableCell align="center">
                        {row.r_description ? <strong style={{ color: 'red' }}>{row.r_description}</strong> : '-'}
                      </TableCell>
                      <TableCell align="left">{row.company}</TableCell>
                      <TableCell align="left">{row.registration_no}</TableCell>
                      <TableCell align="left">{row.driver}</TableCell>
                      <TableCell align="left">{row.mobile_no}</TableCell>

                      {parseFloat(row.total_quantity) <= 0 && (
                        <TableCell align="center">
                          <QueueStatus status={'pending'} />
                        </TableCell>
                      )}

                      {parseFloat(row.total_quantity) > 0 && (
                        <TableCell align="center">
                          {row.team_id === null ? <QueueStatus status={'waiting'} /> : <QueueStatus status={'completed'} />}
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <ButtonGroup variant="plain" aria-label="Basic button group" sx={{ boxShadow: 'none!important' }}>
                          <AddTeamLoading
                            id={row.reserve_id}
                            handleReload={handleSetReload}
                            token={<QueueTag id={row.product_company_id} token={row.token} />}
                            permission={permission}
                          />
                          <Tooltip title="แก้ไข">
                            <span>
                              <Button
                                variant="contained"
                                sx={{ minWidth: '33px!important', p: '6px 0px', display: 'none' }}
                                size="medium"
                                color="primary"
                                disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                                onClick={() => updateDrivers(row.reserve_id)}
                              >
                                <EditOutlined />
                              </Button>
                            </span>
                          </Tooltip>
                          <CancleTeamStation reserveId={row.reserve_id} reserveData={row} handleReload={handleSetReload}
                            permission={permission} />
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
