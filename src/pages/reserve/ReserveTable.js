import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import moment from 'moment';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// material-ui
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button } from '@mui/material';

// project import
import Dot from 'components/@extended/Dot';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

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
    label: 'บริษัท'
  },
  {
    id: 'totalQuantity',
    align: 'right',
    disablePadding: false,
    label: 'จำนวน'
  },
  {
    id: 'status',
    align: 'left',
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
      title = 'Approved';
      break;
    case 'waiting':
      color = 'error';
      title = 'Rejected';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.string
};

export default function ReserveTable() {
  const [items, setItems] = useState([]);
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');

  useEffect(() => {
    getReserve();
  }, []);

  const getReserve = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: apiUrl + '/allreserves',
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
                    <Button variant="contained" size="medium" color="primary">
                      <EditOutlined />
                    </Button>
                    <Button variant="contained" size="medium" color="error">
                      <DeleteOutlined />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
