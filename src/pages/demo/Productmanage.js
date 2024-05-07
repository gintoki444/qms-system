import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import MUIDataTable from 'mui-datatables';
import * as adminRequest from '_api/adminRequest';
import {
  Typography,
  // Table,
  // TableHead,
  // TableBody,
  // TableRow,
  // TableCell,
  // TableContainer,
  // Box,
  ButtonGroup,
  Button,
  Tooltip,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

import { FileAddOutlined, EditOutlined, DeleteOutlined, SwitcherOutlined, ContainerOutlined, FileExcelOutlined } from '@ant-design/icons';

import moment from 'moment';
import QueueTag from 'components/@extended/QueueTag';
import { useDownloadExcel } from 'react-export-table-to-excel';

function Productmanage({ onFilter }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);

  // ======= Export file excel =======;
  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'product-management',
    sheet: moment(new Date()).format('DD-MM-YYYY')
  });

  const getWareHouseManager = async () => {
    setLoading(true);
    try {
      adminRequest.getAllProductRegister().then((response) => {
        if (onFilter) {
          const filterData = response.filter((x) => x.product_company_id == onFilter);
          const newData = filterData.map((item, index) => {
            return {
              ...item,
              No: index + 1
            };
          });
          // setProductList(response.filter((x) => x.product_company_id == onFilter));
          setProductList(newData);
        } else {
          const newData = response.map((item, index) => {
            return {
              ...item,
              No: index + 1
            };
          });
          setProductList(newData);
        }
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // getPermission();
    getWareHouseManager();
  }, [onFilter]);

  // =============== Get Company DataTable ===============//
  const options = {
    viewColumns: false,
    print: false,
    selectableRows: 'none',
    elevation: 0,
    rowsPerPage: 50,
    responsive: 'standard',
    sort: false,
    rowsPerPageOptions: [50, 100, 150, 200],
    download: false,
    customToolbar: () => {
      return (
        <Tooltip title="Export Excel">
          <Button color="success" variant="contained" sx={{ fontSize: '18px', minWidth: '', p: '6px 10px' }} onClick={onDownload}>
            <FileExcelOutlined />
          </Button>
        </Tooltip>
      );
    }
  };

  const columns = [
    {
      name: 'No',
      label: 'ลำดับ',
      options: {
        // customBodyRender: (value, tableData) => {
        //   console.log('value :', value);
        //   console.log('tableData :', tableData);
        //   return (
        //     <>
        //       <span>{tableData.rowIndex + 1}</span>
        //     </>
        //   );
        // },
        setCellHeaderProps: () => ({
          style: { textAlign: 'center' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'center' }
        })
      }
    },
    {
      name: 'product_company_id',
      label: 'บริษัท',
      options: {
        customBodyRender: (value, tableMeta) => {
          const productData = productList[tableMeta.rowIndex];
          return <QueueTag id={value} token={productData.product_company_name_th2} />;
        }
      }
    },
    {
      name: 'name',
      label: 'สินค้า',
      options: {
        customBodyRender: (value) => (
          <Tooltip title={value}>
            <span>{value.length > 8 ? `${value.substring(0, 8)}...` : value}</span>
          </Tooltip>
        )
      }
    },
    {
      name: 'product_register_name',
      label: 'ทะเบียน',
      options: {
        customBodyRender: (value) => {
          return (
            <Tooltip title={value}>
              <span>{value.length > 20 ? `${value.substring(0, 20)}...` : value} </span>
            </Tooltip>
          );
        }
      }
    },
    {
      name: 'product_register_date',
      label: 'วันที่ตั้งกอง',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? moment(value).format('DD/MM/YYYY') : '-'}</Typography>
      }
    },
    {
      name: 'product_register_date',
      label: 'อายุกอง',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? calculateAge(value) : '-'}</Typography>
      }
    },
    {
      name: 'product_brand_name',
      label: 'ตรา',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'warehouse_name',
      label: 'โกดัง',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'register_beginning_balance',
      label: 'ยอดยกมา',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'total_receive',
      label: 'รวมรับ',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'total_sold',
      label: 'รวมจ่าย',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'total_remain',
      label: 'ยอดคงเหลือ',
      options: {
        customBodyRender: (value) =>
          value ? (
            <>
              {parseFloat(value) < 0 && <span style={{ color: 'red' }}>{value}</span>}
              {parseFloat(value) > 0 && value}
            </>
          ) : (
            '-'
          )
      }
    },
    {
      name: 'product_register_remark',
      label: 'หมายเหตุ',
      options: {
        customBodyRender: (value) => {
          // const productData = productList[tableMeta.rowIndex];
          return value ? (
            <Tooltip title={value}>
              <span>{value.length > 12 ? `${value.substring(0, 12)}...` : value}</span>
            </Tooltip>
          ) : (
            '-'
          );
        }
      }
    },
    {
      name: 'product_register_id',
      label: 'Actions',
      options: {
        customBodyRender: (value) => {
          // const productData = productList[tableMeta.rowIndex];
          // console.log(productData);
          // console.log(value);
          return (
            <>
              <ButtonGroup variant="contained" aria-label="Basic button group">
                <Tooltip title="รายละเอียดสินค้า">
                  <Button
                    variant="contained"
                    size="medium"
                    color="success"
                    sx={{ minWidth: '33px!important', p: '6px 0px' }}
                    onClick={() => productsDetails(value)}
                  >
                    <ContainerOutlined />
                  </Button>
                </Tooltip>
                <Tooltip title="เบิกสินค้า">
                  <Button
                    variant="contained"
                    size="medium"
                    color="warning"
                    sx={{ minWidth: '33px!important', p: '6px 0px' }}
                    onClick={() => addCutOffProduct(value)}
                  >
                    <SwitcherOutlined />
                  </Button>
                </Tooltip>
                <Tooltip title="รับสินค้า">
                  <Button
                    variant="contained"
                    size="medium"
                    color="info"
                    sx={{ minWidth: '33px!important', p: '6px 0px' }}
                    onClick={() => addProductReceives(value)}
                  >
                    <FileAddOutlined />
                  </Button>
                </Tooltip>
                <Tooltip title="แก้ไข">
                  <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    sx={{ minWidth: '33px!important', p: '6px 0px' }}
                    onClick={() => updateProductManagement(value)}
                  >
                    <EditOutlined />
                  </Button>
                </Tooltip>
                <Tooltip title="ลบ">
                  <Button
                    variant="contained"
                    size="medium"
                    color="error"
                    sx={{ minWidth: '33px!important', p: '6px 0px' }}
                    onClick={() => handleClickOpen(value)}
                  >
                    <DeleteOutlined />
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </>
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

  // ลบข้อมูล Manager
  const [product_id, setProductId] = useState(false);
  const [textnotify, setText] = useState('');

  const handleClickOpen = (manager_id) => {
    setProductId(manager_id);
    setText('ลบข้อมูล');
    setOpen(true);
  };

  const handleClose = (flag) => {
    if (flag === 1) {
      setLoading(true);
      deteteProductManagement(product_id);
      setOpen(false);
    } else if (flag === 0) {
      setOpen(false);
    }
  };

  const deteteProductManagement = (id) => {
    try {
      adminRequest.deteteProductRegister(id).then(() => {
        getWareHouseManager();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  const updateProductManagement = (id) => {
    navigate('/admin/product-register/update/' + id);
  };

  const addProductReceives = (id) => {
    navigate('/admin/product-register/add-receive/' + id);
  };

  const addCutOffProduct = (id) => {
    navigate('/admin/product-register/add-cutoff/' + id);
  };

  const productsDetails = (id) => {
    navigate('/admin/product-register/details/' + id);
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title" align="center">
          <Typography variant="h5">{'แจ้งเตือน'}</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>ต้องการ {textnotify} หรือไม่?</DialogContentText>
        </DialogContent>
        <DialogActions align="center" sx={{ justifyContent: 'center!important' }}>
          <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
            ยกเลิก
          </Button>
          <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
            ยืนยัน
          </Button>
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
      <MUIDataTable title={<Typography variant="h5">ข้อมูลกองสินค้า</Typography>} data={productList} columns={columns} options={options} />;
    </>
  );
}

export default Productmanage;
