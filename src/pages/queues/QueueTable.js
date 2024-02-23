import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// material-ui
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Stack } from '@mui/material';

import {
  ProfileOutlined
  // EditOutlined
  // DeleteOutlined
} from '@ant-design/icons';

import axios from 'axios';

const currentDate = moment(new Date()).format('YYYY-MM-DD');

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'queueNo',
    align: 'left',
    disablePadding: false,
    label: 'ลำดับคิว.'
  },
  {
    id: 'branName',
    align: 'left',
    disablePadding: false,
    label: 'ร้านค้า/บริษัท'
  },
  {
    id: 'driver',
    align: 'left',
    disablePadding: true,
    label: 'ชื่อผู้ขับ'
  },
  {
    id: 'registration_no',
    align: 'left',
    disablePadding: true,
    label: 'ทะเบียนรถ'
  },
  {
    id: 'tel',
    align: 'left',
    disablePadding: true,
    label: 'เบอร์โทรศัพท์'
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: false,
    label: 'สถานะเข้ารับสินค้า'
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
const QueueStatus = ({ status, text }) => {
  let color;
  let title;

  switch (status) {
    case 'processing':
      color = 'warning';
      title = text;
      break;
    case 'completed':
      color = 'success';
      title = text;
      break;
    default:
      color = 'secondary';
      title = text;
  }

  return <Chip color={color} label={title} />;
};

QueueStatus.propTypes = {
  status: PropTypes.string
};

export default function QueueTable() {
  const [items, setItems] = useState([]);
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');

  // const userId = localStorage.getItem('user_id');

  useEffect(() => {
    getQueue();
  }, []);

  const getQueue = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: apiUrl + '/allqueuesbyqueuedate2?queue_date1=' + currentDate + '&queue_date2=' + currentDate,
      headers: {}
    };

    axios
      .request(config)
      .then((response) => {
        setItems(response.data.filter((x) => x.status !== 'completed'));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const navigate = useNavigate();
  const updateDrivers = (id) => {
    navigate('/queue/detail/' + id);
  };
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
          <TableBody>
            {items.map((row, index) => {
              return (
                <TableRow key={index}>
                  <TableCell align="left">{index + 1}</TableCell>
                  <TableCell align="center">{row.company}</TableCell>
                  <TableCell align="left">{row.driver_name}</TableCell>
                  <TableCell align="left">{row.registration_no}</TableCell>
                  <TableCell align="left">{row.driver_mobile}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
                      <QueueStatus status={row.step1_status} text={'ชั่งเบา'} />
                      <QueueStatus status={row.step2_status} text={'ขึ้นสินค้า'} />
                      <QueueStatus status={row.step3_status} text={'ชั่งหนัก'} />
                      <QueueStatus status={row.step4_status} text={'ชั่งเบา'} />
                    </Stack>
                  </TableCell>
                  <TableCell align="center" sx={{ '& button': { m: 1 } }}>
                    <Button
                      sx={{ minWidth: '33px!important', p: '6px 0px' }}
                      variant="contained"
                      size="medium"
                      color="info"
                      onClick={() => updateDrivers(row.reserve_id)}
                    >
                      <ProfileOutlined />
                    </Button>
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
