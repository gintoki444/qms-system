import PropTypes from 'prop-types';
import React, {
  useState,
  useEffect
  // , useRef
} from 'react';

import * as reportRequest from '_api/reportRequest';
import * as queueRequest from '_api/queueReques';

// material-ui
import {
  Box,
  // Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography
  // Button,
  // Stack
  // Button
} from '@mui/material';

// import { useDownloadExcel } from 'react-export-table-to-excel';
// import OrdersByItems from 'pages/dashboard/admin/OrdersByItems';
import moment from 'moment';
// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'date',
    align: 'center',
    disablePadding: false,
    label: 'วันที่'
  },
  {
    id: 'queue',
    align: 'center',
    disablePadding: false,
    label: 'คิว'
  },
  {
    id: 'queue_number',
    align: 'center',
    disablePadding: false,
    label: 'หมายเลขคิว'
  },
  {
    id: 'company_name',
    align: 'left',
    disablePadding: false,
    label: 'ลูกค้า'
  },
  {
    id: 'vehicle_registration',
    align: 'center',
    disablePadding: false,
    label: 'ทะเบียนรถ'
  },
  {
    id: 'product',
    align: 'left',
    disablePadding: false,
    label: 'สินค้า'
  },
  {
    id: 'registration',
    align: 'center',
    disablePadding: false,
    label: 'ทะเบียน'
  },
  {
    id: 'brand',
    align: 'center',
    disablePadding: false,
    label: 'ตรา'
  },
  {
    id: 'tons',
    align: 'right',
    disablePadding: false,
    label: 'ตัน'
  },
  {
    id: 'number_id',
    align: 'center',
    disablePadding: false,
    label: 'เลขที่'
  },
  {
    id: 'warehouse',
    align: 'center',
    disablePadding: false,
    label: 'โกดัง'
  },
  {
    id: 'fertilizer_crushing',
    align: 'center',
    disablePadding: false,
    label: 'รายการทุบปุ๋ย'
  },
  {
    id: 'stacking_date',
    align: 'center',
    disablePadding: false,
    label: 'วันที่ตั้งกอง'
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

function DailyProductOutTable({ startDate, endDate, clickDownload, onFilter, dataList }) {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [queueData, setQueueData] = useState([]);
  const [mappedData, setMappedData] = useState([]);

  // const currentDate = moment(new Date()).format('YYYY-MM-DD');

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, onFilter]);

  // Map ข้อมูลเมื่อ items และ queueData พร้อม
  useEffect(() => {
    if (items.length > 0 && queueData.length > 0) {
      const mapped = mapQueueWithProduct(items, queueData);
      setMappedData(mapped);
      setLoading(false);
    } else if (items.length > 0) {
      // ถ้ามีแค่ items ให้ map โดยไม่มี queue data
      const mapped = mapQueueWithProduct(items, []);
      setMappedData(mapped);
      setLoading(false);
    }
  }, [items, queueData, startDate]);

  const fetchData = async () => {
    await Promise.all([getOrderSumQty(), getQueueData()]);
  };

  const getOrderSumQty = () => {
    return reportRequest
      .getOrdersProduct(startDate, endDate)
      .then((result) => {
        if (onFilter) {
          setItems(result.filter((x) => x.product_company_id == onFilter));
        } else {
          setItems(result);
        }
        dataList(result);
        return result;
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
        return [];
      });
  };

  const getQueueData = () => {
    return queueRequest
      .getAllqueueByDateV2(startDate, endDate)
      .then((result) => {
        setQueueData(result);
        return result;
      })
      .catch((error) => {
        console.error('Error fetching queue data:', error);
        return [];
      });
  };

  // ฟังก์ชัน map ข้อมูล queue กับ product
  const mapQueueWithProduct = (productData, queueData) => {
    const mapped = [];

    // จัดเรียงข้อมูลตามบริษัทก่อน
    const sortedProductData = [...productData].sort((a, b) => {
      // เรียงตาม product_company_id ก่อน
      if (a.product_company_id !== b.product_company_id) {
        return a.product_company_id - b.product_company_id;
      }
      // ถ้า product_company_id เหมือนกัน ให้เรียงตามชื่อสินค้า
      return (a.name || '').localeCompare(b.name || '');
    });

    // จัดกลุ่มข้อมูลก่อน
    sortedProductData.forEach((product) => {
      if (product.items && product.items.length > 0) {
        product.items.forEach((item, index) => {
          // หาข้อมูล queue ที่ตรงกับ token
          const queueInfo = queueData.find((q) => q.token === item.token);

          const mappedItem = {
            date: startDate,
            queue: index, // ยังไม่ใส่หมายเลขคิว
            queue_number: item.token || '-',
            company_name: queueInfo.company_name ? queueInfo.company_name || '-' : '-',
            vehicle_registration: queueInfo ? queueInfo.registration_no || '-' : '-',
            product_name: product.name,
            product_register: product.product_register || '-',
            brand: product.brand_group || '-',
            tons: item.total_products ? parseFloat(item.total_products).toFixed(3) : '-',
            number_id: item.ref_order_id || '-',
            warehouse: product.warehouse_name || '-',
            fertilizer_crushing: (item.smash_quantity !== '0.0000' ? `${parseFloat(item.smash_quantity)} ตัน` : '-') || '-',
            stacking_date: product.setup_pile_date || '-',
            product_company_id: product.product_company_id
          };

          mapped.push(mappedItem);
        });
      } else {
        // ถ้าไม่มี items ให้แสดงข้อมูล product หลัก
        const mappedItem = {
          date: startDate,
          queue: '',
          queue_number: '-',
          vehicle_registration: '-',
          product_name: product.name,
          product_register: product.product_register || '-',
          brand: product.brand_group || '-',
          tons: product.total_sold ? parseFloat(product.total_sold).toFixed(3) : '-',
          number_id: product.ref_order_id || '-',
          warehouse: product.warehouse_name || '-',
          fertilizer_crushing: product.smash_quantity || '-',
          stacking_date: product.setup_pile_date || '-',
          product_company_id: product.product_company_id
        };

        mapped.push(mappedItem);
      }
    });

    // จัดเรียงข้อมูลที่ map แล้วตามบริษัทและคิว
    const sortedMappedData = mapped.sort((a, b) => {
      // เรียงตาม product_company_id ก่อน
      const aCompanyId = a.product_company_id || 0;
      const bCompanyId = b.product_company_id || 0;
      if (aCompanyId !== bCompanyId) {
        return aCompanyId - bCompanyId;
      }

      // ถ้า product_company_id เหมือนกัน ให้เรียงตาม queue_number (IF01, IF02, IF03, IF04...)
      const aQueueNum = a.queue_number || '';
      const bQueueNum = b.queue_number || '';

      // แยกตัวอักษรและตัวเลขจาก queue_number
      const aMatch = aQueueNum.match(/^([A-Za-z]+)(\d+)$/);
      const bMatch = bQueueNum.match(/^([A-Za-z]+)(\d+)$/);

      if (aMatch && bMatch) {
        const aPrefix = aMatch[1];
        const aNum = parseInt(aMatch[2]);
        const bPrefix = bMatch[1];
        const bNum = parseInt(bMatch[2]);

        // เรียงตาม prefix ก่อน (IF, II, etc.)
        if (aPrefix !== bPrefix) {
          return aPrefix.localeCompare(bPrefix);
        }

        // ถ้า prefix เหมือนกัน ให้เรียงตามตัวเลข
        return aNum - bNum;
      }

      // ถ้าไม่สามารถ parse ได้ ให้เรียงตาม string
      return aQueueNum.localeCompare(bQueueNum);
    });

    // ใส่หมายเลขคิวหลังจากจัดเรียงแล้ว
    let queueGroupCounter = 0;
    let currentQueueNumber = '';
    let itemIndexInGroup = 0;

    sortedMappedData.forEach((item) => {
      if (item.queue_number !== currentQueueNumber) {
        // หมายเลขคิวใหม่
        currentQueueNumber = item.queue_number;
        queueGroupCounter++;
        itemIndexInGroup = 1;
      } else {
        // หมายเลขคิวเดิม
        itemIndexInGroup++;
      }

      item.queue = `${queueGroupCounter}/${itemIndexInGroup}`;
    });

    return sortedMappedData;
  };

  // const [onclickShow, setOnClickShow] = useState(false);
  // const handleClickShow = () => {
  //   if (onclickShow == false) {
  //     setOnClickShow(true);
  //   } else {
  //     setOnClickShow(false);
  //   }
  // }
  return (
    <Box>
      {/* <Button color="primary" onClick={onDownload}>
        Click
      </Button> */}
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': {
            whiteSpace: 'nowrap',
            fontSize: '0.875rem',
            padding: '8px 12px'
          }
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
          ref={clickDownload}
        >
          <OrderTableHead order={order} orderBy={orderBy} />
          {!loading ? (
            <TableBody>
              {mappedData.length > 0 &&
                mappedData
                  .sort((a, b) => {
                    // เรียงตาม product_company_id ก่อน
                    const aCompanyId = a.product_company_id || 0;
                    const bCompanyId = b.product_company_id || 0;
                    if (aCompanyId !== bCompanyId) {
                      return aCompanyId - bCompanyId;
                    }

                    // ถ้า product_company_id เหมือนกัน ให้เรียงตาม queue_number (IF01, IF02, IF03, IF04...)
                    const aQueueNum = a.queue_number || '';
                    const bQueueNum = b.queue_number || '';

                    // แยกตัวอักษรและตัวเลขจาก queue_number
                    const aMatch = aQueueNum.match(/^([A-Za-z]+)(\d+)$/);
                    const bMatch = bQueueNum.match(/^([A-Za-z]+)(\d+)$/);

                    if (aMatch && bMatch) {
                      const aPrefix = aMatch[1];
                      const aNum = parseInt(aMatch[2]);
                      const bPrefix = bMatch[1];
                      const bNum = parseInt(bMatch[2]);

                      // เรียงตาม prefix ก่อน (IF, II, etc.)
                      if (aPrefix !== bPrefix) {
                        return aPrefix.localeCompare(bPrefix);
                      }

                      // ถ้า prefix เหมือนกัน ให้เรียงตามตัวเลข
                      return aNum - bNum;
                    }

                    // ถ้าไม่สามารถ parse ได้ ให้เรียงตาม string
                    return aQueueNum.localeCompare(bQueueNum);
                  })
                  .map((row, index) => {
                    return (
                      <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="center">{moment(row.date).format('DD/MM/YYYY')}</TableCell>
                         <TableCell align="center">
                           <span style={{ display: 'none' }}>{`'`}</span>
                           {row.queue}
                         </TableCell>
                        <TableCell align="center">{row.queue_number}</TableCell>
                        <TableCell align="left">{row.company_name}</TableCell>
                        <TableCell align="center">{row.vehicle_registration}</TableCell>
                        <TableCell align="left">
                          <span style={{ display: 'none' }}>{`'`}</span>
                          {row.product_name}
                        </TableCell>
                        <TableCell align="center">{row.product_register}</TableCell>
                        <TableCell align="center">{row.brand}</TableCell>
                        <TableCell align="right">{row.tons}</TableCell>
                        <TableCell align="center">{row.number_id}</TableCell>
                        <TableCell align="center">{row.warehouse}</TableCell>
                        <TableCell align="center">{row.fertilizer_crushing}</TableCell>
                        <TableCell align="center">{row.stacking_date ? moment(row.stacking_date).format('DD/MM/YYYY') : '-'}</TableCell>
                      </TableRow>
                    );
                  })}
              {mappedData.length == 0 && (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={12} align="center">
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

export default DailyProductOutTable;
