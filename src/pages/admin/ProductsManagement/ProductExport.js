import React, {
  useState,
  useEffect
  // , useRef
} from 'react';
// import { useNavigate } from 'react-router-dom';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import moment from 'moment/min/moment-with-locales';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'wareHouseNo',
    align: 'center',
    width: '5%',
    disablePadding: false,
    label: 'ลำดับ'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'บริษัท'
  },
  {
    id: 'contact_info',
    align: 'left',
    disablePadding: false,
    label: 'สินค้า'
  },
  {
    id: 'warehouse_id',
    align: 'left',
    disablePadding: false,
    label: 'ทะเบียน'
  },
  {
    id: 'department',
    align: 'left',
    disablePadding: false,
    label: 'วันที่ตั้งกอง'
  },
  {
    id: 'stetus',
    align: 'left',
    disablePadding: false,
    label: 'อายุกอง'
  },
  {
    id: 'product_brand_name',
    align: 'left',
    disablePadding: false,
    label: 'ตรา'
  },
  {
    id: 'warehouse_name',
    align: 'left',
    disablePadding: false,
    label: 'โกดัง'
  },
  {
    id: 'register_beginning_balance',
    align: 'right',
    disablePadding: false,
    label: 'ยอดยกมา'
  },
  {
    id: 'total_receive',
    align: 'right',
    disablePadding: false,
    label: 'รวมรับ'
  },
  {
    id: 'total_sold',
    align: 'right',
    disablePadding: false,
    label: 'รวมจ่าย'
  },
  {
    id: 'total_remain',
    align: 'right',
    disablePadding: false,
    label: 'ยอดคงเหลือ'
  },
  {
    id: 'note',
    align: 'left',
    disablePadding: false,
    label: 'หมายเหตุ'
  }
];

function CompantTableHead() {
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

function ProductExport({ data, onClickDownload }) {
  const [productList, setProductList] = useState([]);
  useEffect(() => {
    // getPermission();
    setProductList(data);
  }, [data, onClickDownload]);

  // =============== Get calculateAge จำนวนวัน  ===============//
  const calculateAge = (registrationDate) => {
    if (!registrationDate) return '-';

    const currentDate = moment(new Date()).format('YYYY-MM-DD');
    const regDate = moment(registrationDate).format('YYYY-MM-DD');
    // const regDate = new Date(registrationDate);

    const years = moment(currentDate).diff(regDate, 'years');
    const months = moment(currentDate).diff(regDate, 'months') % 12;
    const days = moment(currentDate).diff(regDate, 'days') % 30;

    let result = '';

    if (years !== 0) {
      result = `${years} ปี ${months} เดือน ${days} วัน`;
    } else {
      if (months !== 0) {
        result = `${months} เดือน ${days} วัน`;
      } else {
        result = `${days} วัน`;
      }
    }

    return result;
  };

  return (
    <TableContainer
      sx={{
        width: '100%',
        overflowX: 'auto',
        position: 'relative',
        display: 'none',
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
        ref={onClickDownload}
      >
        <CompantTableHead />
        <TableBody>
          {productList.map((row, index) => {
            return (
              <TableRow key={index}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="left">
                  {/* <QueueTag id={row.product_company_id} token={row.product_company_name_th2} /> */}
                  {row.product_company_name_th2}
                </TableCell>
                <TableCell align="left">
                  <span>{`'${row.name}`}</span>
                </TableCell>
                <TableCell align="left">
                  <span>{row.product_register_name ? row.product_register_name : '-'}</span>
                </TableCell>
                <TableCell align="left">
                  {row.product_register_date ? moment(row.product_register_date).format('DD/MM/YYYY') : '-'}
                </TableCell>
                <TableCell align="left">{row.product_register_date ? calculateAge(row.product_register_date) : '-'}</TableCell>
                <TableCell align="left">{row.product_brand_name}</TableCell>
                <TableCell align="left">{row.warehouse_name}</TableCell>
                <TableCell align="right">{row.register_beginning_balance}</TableCell>
                <TableCell align="right">{row.total_receive ? row.total_receive : '-'}</TableCell>
                <TableCell align="right">{row.total_sold ? row.total_sold : '-'}</TableCell>
                <TableCell align="right">
                  {row.total_remain ? (
                    <>
                      {parseFloat(row.total_remain) < 0 && <span style={{ color: 'red' }}>{row.total_remain}</span>}
                      {parseFloat(row.total_remain) > 0 && row.total_remain}
                    </>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell align="left">{row.product_register_remark ? row.product_register_remark : '-'}</TableCell>
              </TableRow>
            );
          })}
          {productList.length == 0 && (
            <TableRow>
              <TableCell colSpan={14} align="center">
                ไม่พบข้อมูล
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProductExport;
