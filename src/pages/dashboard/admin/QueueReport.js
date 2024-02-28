import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

// import { Link as RouterLink } from 'react-router-dom';

// material-ui
import {
  Box,
  Stack,
  Table,
  // TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
  // Chip
} from '@mui/material';

// third-party
// import NumberFormat from 'react-number-format';

// Link api queues
import * as getQueues from '_api/queueReques';

// project import
import Dot from 'components/@extended/Dot';

// function createData(trackingNo, name, fat, carbs, protein) {
//   return { trackingNo, name, fat, carbs, protein };
// }

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'queueID',
    align: 'center',
    disablePadding: false,
    label: 'รหัสคิว.'
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
    id: 'branName',
    align: 'left',
    disablePadding: false,
    label: 'ร้านค้า/บริษัท'
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: false,
    width: '8%',
    label: 'สถานะ'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function QueuesTableHead({ order, orderBy }) {
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

QueuesTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string
};

// ==============================|| ORDER TABLE - STATUS ||============================== //

const OrderStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'warning';
      title = 'Pending';
      break;
    case 1:
      color = 'success';
      title = 'Approved';
      break;
    case 2:
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
  status: PropTypes.number
};

// ==============================|| ORDER TABLE ||============================== //

export default function QueuesTable() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  // const [selected] = useState([]);

  // const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  useEffect(() => {
    processingGet();
  }, []);

  const [items, setItems] = useState([]);
  const processingGet = () => {
    try {
      console.log(items);
      getQueues.getStep2Processing().then((response) => {
        console.log(response);
        setItems(response);
        console.log(items);
      });
    } catch (e) {
      console.log(e);
    }
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
          <QueuesTableHead order={order} orderBy={orderBy} />

          {/* <TableBody>
            {items &&
              items.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="center">
                      <Chip color={'primary'} label={row.token} sx={{ width: 70, border: 1 }} />
                    </TableCell>
                    <TableCell align="left">{row.registration_no}</TableCell>
                    <TableCell align="left">{row.driver_name}</TableCell>
                    <TableCell align="left">{row.driver_mobile}</TableCell>
                    <TableCell align="left">{row.company_name}</TableCell>
                    <TableCell align="center">
                      <Chip color="warning" label={row.status} />
                    </TableCell>
                  </TableRow>
                );
              })}

            {items.length == 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody> */}
          {/* <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const isItemSelected = isSelected(row.trackingNo);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.trackingNo}
                  selected={isItemSelected}
                >
                  <TableCell component="th" id={labelId} scope="row" align="left">
                    <Link color="secondary" component={RouterLink} to="">
                      {row.trackingNo}
                    </Link>
                  </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="left">
                    <OrderStatus status={row.carbs} />
                  </TableCell>
                  <TableCell align="right">
                    <NumberFormat value={row.protein} displayType="text" thousandSeparator prefix="$" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody> */}
        </Table>
      </TableContainer>
    </Box>
  );
}
