import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  ButtonGroup,
  Button,
  Tooltip,
  Typography,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  // IconButton,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

import {
  FileAddOutlined,
  EditOutlined,
  DeleteOutlined,
  SwitcherOutlined,
  ContainerOutlined,
  FileExcelOutlined,
  HistoryOutlined,
  PoweroffOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  ClearOutlined
} from '@ant-design/icons';

// Link api url
import * as adminRequest from '_api/adminRequest';
import moment from 'moment/min/moment-with-locales';

import QueueTag from 'components/@extended/QueueTag';
import MUIDataTable from 'mui-datatables';
import { useDownloadExcel } from 'react-export-table-to-excel';
import ProductExport from './ProductExport';
import ExportProductManage from 'pages/report/admin/export/ExportProductManage';

function ProductManagementTable({ onFilter, permission }) {
  //   const [car, setCar] = useState([]);
  // ======= Export file excel =======;
  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'product-management',
    sheet: moment(new Date()).format('DD-MM-YYYY')
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [groupedProductList, setGroupedProductList] = useState([]);
  
  // State สำหรับ filter (เก็บใน localStorage)
  const [filters, setFilters] = useState(() => {
    try {
      const savedFilters = localStorage.getItem('productManagementFilters');
      return savedFilters ? JSON.parse(savedFilters) : {
        productName: '',
        brandName: '',
        warehouseName: '',
        status: ''
      };
    } catch (error) {
      console.error('Error loading filters from localStorage:', error);
      return {
        productName: '',
        brandName: '',
        warehouseName: '',
        status: ''
      };
    }
  });

  // State สำหรับ debounced filters
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce filters เพื่อลดการเรียก API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300); // รอ 300ms หลังจากการพิมพ์ครั้งสุดท้าย

    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    // getPermission();
    getWareHouseManager();
  }, [onFilter, permission, debouncedFilters]);

  const getWareHouseManager = async () => {
    setLoading(true);
    try {
      adminRequest.getAllProductRegister().then((response) => {
        let processedData = [];

        if (onFilter) {
          const filterData = response.filter((x) => x.product_company_id == onFilter && x.total_remain > 0);
          processedData = filterData;
        } else {
          processedData = response.filter((x) => x.total_remain > 0);
        }

        processedData = applyFilters(processedData);
        // จัดกลุ่มข้อมูล
        const groupedData = groupProductData(processedData);
        setGroupedProductList(groupedData);
        setProductList(processedData);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // ฟังก์ชันจัดกลุ่มข้อมูล (ใช้ useCallback เพื่อเพิ่มประสิทธิภาพ)
  const groupProductData = useCallback((data) => {
    // เรียงข้อมูลตามชื่อสินค้า (เช่น 0-0-60, 11-6-34, 12-12-17)
    // สินค้าที่มีคำว่า "Scrap" จะอยู่ล่างสุด
    const sortedData = [...data].sort((a, b) => {
      const aIsScrap = a.name.toLowerCase().includes('scrap');
      const bIsScrap = b.name.toLowerCase().includes('scrap');
      
      // ถ้าทั้งคู่เป็น Scrap หรือทั้งคู่ไม่เป็น Scrap ให้เรียงตามชื่อ
      if (aIsScrap === bIsScrap) {
        return a.name.localeCompare(b.name, undefined, { 
          numeric: true, 
          sensitivity: 'base' 
        });
      }
      
      // ถ้า a เป็น Scrap และ b ไม่เป็น Scrap ให้ a อยู่หลัง
      if (aIsScrap && !bIsScrap) {
        return 1;
      }
      
      // ถ้า b เป็น Scrap และ a ไม่เป็น Scrap ให้ b อยู่หลัง
      return -1;
    });

    // จัดกลุ่มตามบริษัท → สินค้า → ตรา
    const grouped = {};

    sortedData.forEach((item, index) => {
      const companyKey = `${item.product_company_id}_${item.product_company_name_th2}`;
      const productKey = `${companyKey}_${item.name}`;
      const brandKey = `${productKey}_${item.product_brand_name || 'ไม่มีตรา'}`;

      if (!grouped[companyKey]) {
        grouped[companyKey] = {
          companyInfo: {
            id: item.product_company_id,
            name: item.product_company_name_th2
          },
          products: {}
        };
      }

      if (!grouped[companyKey].products[productKey]) {
        grouped[companyKey].products[productKey] = {
          productInfo: {
            name: item.name,
            register_name: item.product_register_name
          },
          brands: {}
        };
      }

      if (!grouped[companyKey].products[productKey].brands[brandKey]) {
        grouped[companyKey].products[productKey].brands[brandKey] = {
          brandInfo: {
            name: item.product_brand_name || 'ไม่มีตรา'
          },
          items: []
        };
      }

      grouped[companyKey].products[productKey].brands[brandKey].items.push({
        ...item,
        No: index + 1
      });
    });

    // แปลงเป็น array และเพิ่มข้อมูลสรุป
    const result = [];
    let globalIndex = 1;

    // เรียงกลุ่มบริษัทตาม ID เพื่อให้แสดงผลตามลำดับที่กำหนด
    const sortedCompanyKeys = Object.keys(grouped).sort((a, b) => {
      const idA = parseInt(a.split('_')[0]);
      const idB = parseInt(b.split('_')[0]);
      return idA - idB;
    });

    sortedCompanyKeys.forEach((companyKey) => {
      const company = grouped[companyKey];

      // เรียงสินค้าตามชื่อ (สินค้า Scrap อยู่ล่างสุด)
      const sortedProductKeys = Object.keys(company.products).sort((a, b) => {
        const productA = company.products[a].productInfo.name;
        const productB = company.products[b].productInfo.name;
        
        const aIsScrap = productA.toLowerCase().includes('scrap');
        const bIsScrap = productB.toLowerCase().includes('scrap');
        
        // ถ้าทั้งคู่เป็น Scrap หรือทั้งคู่ไม่เป็น Scrap ให้เรียงตามชื่อ
        if (aIsScrap === bIsScrap) {
          return productA.localeCompare(productB, undefined, { 
            numeric: true, 
            sensitivity: 'base' 
          });
        }
        
        // ถ้า a เป็น Scrap และ b ไม่เป็น Scrap ให้ a อยู่หลัง
        if (aIsScrap && !bIsScrap) {
          return 1;
        }
        
        // ถ้า b เป็น Scrap และ a ไม่เป็น Scrap ให้ b อยู่หลัง
        return -1;
      });

      sortedProductKeys.forEach((productKey) => {
        const product = company.products[productKey];

        // เรียงตราสินค้าตามชื่อ
        const sortedBrandKeys = Object.keys(product.brands).sort((a, b) => {
          const brandA = product.brands[a].brandInfo.name;
          const brandB = product.brands[b].brandInfo.name;
          return brandA.localeCompare(brandB, undefined, { 
            numeric: true, 
            sensitivity: 'base' 
          });
        });

        sortedBrandKeys.forEach((brandKey) => {
          const brand = product.brands[brandKey];

          // เรียงรายการสินค้าตามวันที่ตั้งกอง (น้อยไปมาก)
          const sortedItems = brand.items.sort((a, b) => {
            const dateA = new Date(a.product_register_date);
            const dateB = new Date(b.product_register_date);
            return dateA - dateB;
          });

          // เพิ่มรายการสินค้า
          sortedItems.forEach((item) => {
            result.push({
              ...item,
              No: globalIndex++,
              isSummary: false,
              groupKey: `${companyKey}_${productKey}_${brandKey}`
            });
          });

          // คำนวณข้อมูลสรุปสำหรับตราสินค้านี้
          const summary = calculateProductSummary(brand.items);
          result.push({
            ...summary,
            No: '',
            isSummary: true,
            groupKey: `${companyKey}_${productKey}_${brandKey}`,
            product_company_id: company.companyInfo.id,
            product_company_name_th2: company.companyInfo.name,
            name: product.productInfo.name,
            product_register_name: product.productInfo.register_name,
            product_brand_name: brand.brandInfo.name,
            warehouse_name: 'สรุป',
            product_register_date: '',
            product_register_remark: '',
            product_register_id: null
          });
        });
      });
    });

    return result;
  }, []);

  // ฟังก์ชันคำนวณข้อมูลสรุป (ใช้ useCallback เพื่อเพิ่มประสิทธิภาพ)
  const calculateProductSummary = useCallback((items) => {
    const summary = {
      register_beginning_balance: 0,
      total_receive: 0,
      total_sold: 0,
      total_remain: 0
    };

    items.forEach((item) => {
      summary.register_beginning_balance += parseFloat(item.register_beginning_balance || 0);
      summary.total_receive += parseFloat(item.total_receive || 0);
      summary.total_sold += parseFloat(item.total_sold || 0);
      summary.total_remain += parseFloat(item.total_remain || 0);
    });

    return summary;
  }, []);

  // ฟังก์ชันจัดการ filter
  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...filters,
      [field]: value
    };
    setFilters(newFilters);
    // บันทึกลง localStorage
    try {
      localStorage.setItem('productManagementFilters', JSON.stringify(newFilters));
    } catch (error) {
      console.error('Error saving filters to localStorage:', error);
    }
  };

  // ฟังก์ชันเคลียร์ filter
  const clearFilters = () => {
    const emptyFilters = {
      productName: '',
      brandName: '',
      warehouseName: '',
      status: ''
    };
    setFilters(emptyFilters);
    // ลบข้อมูลจาก localStorage
    try {
      localStorage.removeItem('productManagementFilters');
    } catch (error) {
      console.error('Error removing filters from localStorage:', error);
    }
  };

  // ฟังก์ชันกรองข้อมูล (ใช้ useMemo เพื่อเพิ่มประสิทธิภาพ)
  const applyFilters = useCallback((data) => {
    return data.filter(item => {
      if (debouncedFilters.productName && !item.name.toLowerCase().includes(debouncedFilters.productName.toLowerCase())) {
        return false;
      }
      if (debouncedFilters.brandName && !item.product_brand_name?.toLowerCase().includes(debouncedFilters.brandName.toLowerCase())) {
        return false;
      }
      if (debouncedFilters.warehouseName && !item.warehouse_name?.toLowerCase().includes(debouncedFilters.warehouseName.toLowerCase())) {
        return false;
      }
      if (debouncedFilters.status && item.product_register_staus !== debouncedFilters.status) {
        return false;
      }
      return true;
    });
  }, [debouncedFilters]);

  // ฟังก์ชันสร้างสีตามบริษัท (ใช้สีเดียวกับ QueueTag)
  const getCompanyColor = useCallback((companyId) => {
    let main;
    switch (parseInt(companyId)) {
      case 1:
        main = '#f68b71';
        break;
      case 2:
        main = '#f4ae4d';
        break;
      case 3:
        main = '#f7dc50';
        break;
      case 4:
        main = '#0071C1';
        break;
      case 5:
        main = '#8b6b8e';
        break;
      case 6:
        main = '#17cf6c';
        break;
      case 7:
        main = '#f9acc0';
        break;
      case 8:
        main = '#fec4a2';
        break;
      case 9:
        main = '#17cf6c';
        break;
      default:
        main = '#0071C1'; // ใช้สีน้ำเงินเป็นค่าเริ่มต้น
    }
    return main;
  }, []);

  // ฟังก์ชันสำหรับ navigation
  const navigate = useNavigate();
  const historyProductManagement = () => {
    navigate('/admin/product-register/historys/');
  };

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

  // =============== Get Company DataTable ===============//
  const options = useMemo(() => ({
    viewColumns: false,
    print: false,
    selectableRows: 'none',
    elevation: 0,
    rowsPerPage: 50,
    responsive: 'standard',
    sort: true,
    rowsPerPageOptions: [50, 100, 150, 200],
    download: false,
    customBodyRender: (value) => {
      return <div style={{ whiteSpace: 'nowrap' }}>{value}</div>;
    },
    setRowProps: (row, dataIndex) => {
      const rowData = groupedProductList[dataIndex];
      if (rowData && rowData.isSummary) {
        const companyColor = getCompanyColor(rowData.product_company_id);
        return {
          style: {
            backgroundColor: `${companyColor}15`, // เพิ่มความโปร่งใส 15%
            fontWeight: 'bold',
            border: `1px solid ${companyColor}30` // border โปร่งใส
          }
        };
      }
      return {};
    },
    customToolbar: () => {
      return (
        <>
          <Tooltip title="ประวัติกองสินค้า">
            <Button
              color="info"
              size="small"
              variant="contained"
              sx={{ fontSize: '18px', minWidth: '', p: '6px 10px' }}
              onClick={historyProductManagement}
            >
              <HistoryOutlined />
            </Button>
          </Tooltip>
          {productList === 999 && (
            <Tooltip title="Export Excel">
              <Button color="success" variant="contained" sx={{ fontSize: '18px', minWidth: '', p: '6px 10px' }} onClick={onDownload}>
                <FileExcelOutlined />
              </Button>
            </Tooltip>
          )}
          <Tooltip title="New Export Excel">
            <span>
              <ExportProductManage dataList={productList} />
            </span>
          </Tooltip>
        </>
      );
    }
  }), [groupedProductList, getCompanyColor, productList, onDownload, historyProductManagement]);

  const columns = useMemo(() => [
    {
      name: 'No',
      label: 'ลำดับ',
      options: {
        setCellHeaderProps: () => ({
          style: { textAlign: 'center', width: '5%' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'center' }
        }),
        customBodyRender: (value, tableMeta) => {
          const rowData = groupedProductList[tableMeta.rowIndex];
          if (rowData && rowData.isSummary) {
            return '';
          }
          return value;
        }
      }
    },
    {
      name: 'product_company_id',
      label: 'บริษัท',
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowData = groupedProductList[tableMeta.rowIndex];
          if (rowData && rowData.isSummary) {
            return '';
          }
          if (rowData && rowData.product_company_name_th2) {
            return <QueueTag id={value} token={rowData.product_company_name_th2} />;
          }
          return '';
        }
      }
    },
    {
      name: 'name',
      label: 'สินค้า',
      options: {
        setCellHeaderProps: () => ({
          style: { textAlign: 'center' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'center' }
        }),
        customBodyRender: (value, tableMeta) => {
          const rowData = groupedProductList[tableMeta.rowIndex];
          if (rowData && rowData.isSummary) {
            // แสดงชื่อสินค้าแบบ span หลายคอลัมน์ (เหมือนภาพตัวอย่าง)
            const companyColor = getCompanyColor(rowData.product_company_id);
            return (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  backgroundColor: `${companyColor}20`, // เพิ่มความโปร่งใส 20%
                  color: companyColor,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: `1px solid ${companyColor}`
                }}
              >
                {value}
              </Typography>
            );
          }
          return (
            <div style={{ textAlign: 'center' }}>
              <Tooltip title={value}>
                <span>{value.length > 8 ? `${value.substring(0, 8)}...` : value}</span>
              </Tooltip>
            </div>
          );
        }
      }
    },
    {
      name: 'product_register_name',
      label: 'ทะเบียน',
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowData = groupedProductList[tableMeta.rowIndex];
          if (rowData && rowData.isSummary) {
            return '';
          }
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
        customBodyRender: (value, tableMeta) => {
          const rowData = groupedProductList[tableMeta.rowIndex];
          if (rowData && rowData.isSummary) {
            return '';
          }
          return <Typography variant="body">{value ? moment(value.slice(0, 10)).format('DD/MM/YYYY') : '-'}</Typography>;
        }
      }
    },
    {
      name: 'product_register_date',
      label: 'อายุกอง',
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowData = groupedProductList[tableMeta.rowIndex];
          if (rowData && rowData.isSummary) {
            return '';
          }
          return <Typography variant="body">{value ? calculateAge(value) : '-'}</Typography>;
        }
      }
    },
    {
      name: 'product_brand_name',
      label: 'ตรา',
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowData = groupedProductList[tableMeta.rowIndex];
          if (rowData && rowData.isSummary) {
            return '';
          }
          return <Typography variant="body">{value ? value : '-'}</Typography>;
        }
      }
    },
    {
      name: 'product_register_staus',
      label: 'สถานะ',
      options: {
        setCellHeaderProps: () => ({
          style: { textAlign: 'center' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'center' }
        }),
        customBodyRender: (value, tableMeta) => {
          const rowData = groupedProductList[tableMeta.rowIndex];
          if (rowData && rowData.isSummary) {
            return '';
          }

          const isActive = value === 'A';
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              {isActive ? (
                <>
                  <CheckCircleOutlined style={{ color: '#4caf50', fontSize: '16px' }} />
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                    เปิด
                  </Typography>
                </>
              ) : (
                <>
                  <PoweroffOutlined style={{ color: '#f44336', fontSize: '16px' }} />
                  <Typography variant="body2" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                    ปิด
                  </Typography>
                </>
              )}
            </Box>
          );
        }
      }
    },
    {
      name: 'warehouse_name',
      label: 'โกดัง',
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowData = groupedProductList[tableMeta.rowIndex];
          if (rowData && rowData.isSummary) {
            const companyColor = getCompanyColor(rowData.product_company_id);
            return (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  backgroundColor: `${companyColor}20`, // เพิ่มความโปร่งใส 20%
                  color: companyColor,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: `1px solid ${companyColor}`
                }}
              >
                {value}
              </Typography>
            );
          }
          return <Typography variant="body">{value ? value : '-'}</Typography>;
        }
      }
    },
    {
      name: 'register_beginning_balance',
      label: 'ยอดยกมา',
      options: {
        setCellHeaderProps: () => ({
          style: { textAlign: 'right' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'right' }
        }),
        customBodyRender: (value, tableMeta) => {
          const rowData = groupedProductList[tableMeta.rowIndex];
          if (rowData && rowData.isSummary) {
            const companyColor = getCompanyColor(rowData.product_company_id);
            return (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'right',
                  backgroundColor: `${companyColor}20`,
                  color: companyColor,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: `1px solid ${companyColor}`
                }}
              >
                {value ? parseFloat(value).toLocaleString('th-TH', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '0.000'}
              </Typography>
            );
          }
          return (
            <Typography variant="body" sx={{ textAlign: 'right' }}>
              {value ? parseFloat(value).toLocaleString('th-TH', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '-'}
            </Typography>
          );
        }
      }
    },
    {
      name: 'total_receive',
      label: 'รวมรับ',
      options: {
        setCellHeaderProps: () => ({
          style: { textAlign: 'right' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'right' }
        }),
        customBodyRender: (value, tableMeta) => {
          const rowData = groupedProductList[tableMeta.rowIndex];
          if (rowData && rowData.isSummary) {
            const companyColor = getCompanyColor(rowData.product_company_id);
            return (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'right',
                  backgroundColor: `${companyColor}20`,
                  color: companyColor,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: `1px solid ${companyColor}`
                }}
              >
                {value ? parseFloat(value).toLocaleString('th-TH', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '0.000'}
              </Typography>
            );
          }
          return (
            <Typography variant="body" sx={{ textAlign: 'right' }}>
              {value ? parseFloat(value).toLocaleString('th-TH', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '-'}
            </Typography>
          );
        }
      }
    },
    {
      name: 'total_sold',
      label: 'รวมจ่าย',
      options: {
        setCellHeaderProps: () => ({
          style: { textAlign: 'right' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'right' }
        }),
        customBodyRender: (value, tableMeta) => {
          const rowData = groupedProductList[tableMeta.rowIndex];
          if (rowData && rowData.isSummary) {
            const companyColor = getCompanyColor(rowData.product_company_id);
            return (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'right',
                  backgroundColor: `${companyColor}20`,
                  color: companyColor,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: `1px solid ${companyColor}`
                }}
              >
                {value ? parseFloat(value).toLocaleString('th-TH', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '0.000'}
              </Typography>
            );
          }
          return (
            <Typography variant="body" sx={{ textAlign: 'right' }}>
              {value ? parseFloat(value).toLocaleString('th-TH', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '-'}
            </Typography>
          );
        }
      }
    },
    {
      name: 'total_remain',
      label: 'ยอดคงเหลือ',
      options: {
        setCellHeaderProps: () => ({
          style: { textAlign: 'right' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'right' }
        }),
        customBodyRender: (value, tableMeta) => {
          const rowData = groupedProductList[tableMeta.rowIndex];
          if (rowData && rowData.isSummary) {
            const companyColor = getCompanyColor(rowData.product_company_id);
            return (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'right',
                  backgroundColor: `${companyColor}20`,
                  color: companyColor,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: `1px solid ${companyColor}`
                }}
              >
                {value ? parseFloat(value).toLocaleString('th-TH', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '0.000'}
              </Typography>
            );
          }
          return value ? (
            <div style={{ textAlign: 'right' }}>
              {parseFloat(value) <= 0 && (
                <span style={{ color: 'red' }}>
                  {parseFloat(value).toLocaleString('th-TH', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                </span>
              )}
              {parseFloat(value) > 0 && parseFloat(value).toLocaleString('th-TH', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
            </div>
          ) : (
            <div style={{ textAlign: 'right' }}>-</div>
          );
        }
      }
    },
    {
      name: 'product_register_remark',
      label: 'หมายเหตุ',
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowData = groupedProductList[tableMeta.rowIndex];
          if (rowData && rowData.isSummary) {
            return '';
          }
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
        customBodyRender: (value, tableMeta) => {
          const rowData = groupedProductList[tableMeta.rowIndex];
          if (rowData && rowData.isSummary) {
            return '';
          }

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
                    onContextMenu={(e) => {
                      e.preventDefault();
                      window.open(`/admin/product-register/details/${value}`, '_blank');
                    }}
                  >
                    <ContainerOutlined />
                  </Button>
                </Tooltip>
                {permission && (permission === 'manage_everything' || permission === 'add_edit_delete_data') && (
                  <>
                    <Tooltip title={rowData.product_register_staus === 'A' ? 'ปิดสถานะ' : 'เปิดสถานะ'}>
                      <Button
                        variant="contained"
                        size="medium"
                        color={rowData.product_register_staus === 'A' ? 'error' : 'success'}
                        disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                        sx={{ minWidth: '33px!important', p: '6px 0px' }}
                        onClick={() => toggleProductStatus(value, rowData.product_register_staus)}
                      >
                        {rowData.product_register_staus === 'A' ? <PoweroffOutlined /> : <CheckCircleOutlined />}
                      </Button>
                    </Tooltip>
                    <Tooltip title="เบิกสินค้า">
                      <Button
                        variant="contained"
                        size="medium"
                        color="warning"
                        disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                        sx={{ minWidth: '33px!important', p: '6px 0px' }}
                        onClick={() => addCutOffProduct(value)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          window.open(`/admin/product-register/add-cutoff/${value}`, '_blank');
                        }}
                      >
                        <SwitcherOutlined />
                      </Button>
                    </Tooltip>
                    <Tooltip title="รับสินค้า">
                      <Button
                        variant="contained"
                        size="medium"
                        color="info"
                        disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                        sx={{ minWidth: '33px!important', p: '6px 0px' }}
                        onClick={() => addProductReceives(value)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          window.open(`/admin/product-register/add-receive/${value}`, '_blank');
                        }}
                      >
                        <FileAddOutlined />
                      </Button>
                    </Tooltip>
                    <Tooltip title="แก้ไข">
                      <Button
                        variant="contained"
                        size="medium"
                        color="primary"
                        disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                        sx={{ minWidth: '33px!important', p: '6px 0px' }}
                        onClick={() => updateProductManagement(value)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          window.open(`/admin/product-register/update/${value}`, '_blank');
                        }}
                      >
                        <EditOutlined />
                      </Button>
                    </Tooltip>
                    <Tooltip title="ลบ">
                      <Button
                        variant="contained"
                        size="medium"
                        color="error"
                        disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                        sx={{ minWidth: '33px!important', p: '6px 0px' }}
                        onClick={() => handleClickOpen(value)}
                      >
                        <DeleteOutlined />
                      </Button>
                    </Tooltip>
                  </>
                )}
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
  ], [groupedProductList, permission, getCompanyColor]);
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


  // ฟังก์ชันเปิด/ปิดสถานะสินค้า
  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      setLoading(true);
      const newStatus = currentStatus === 'A' ? 'I' : 'A';

      // หาข้อมูลสินค้าจาก productList
      const productData = productList.find((item) => item.product_register_id === productId);

      if (!productData) {
        console.error('ไม่พบข้อมูลสินค้า');
        return;
      }

      // เตรียมข้อมูลสำหรับอัปเดต
      const updateData = {
        product_company_id: productData.product_company_id,
        product_id: productData.product_id,
        product_brand_id: productData.product_brand_id,
        warehouse_id: productData.warehouse_id,
        product_register_name: productData.product_register_name,
        product_register_date: moment(productData.product_register_date).format('YYYY-MM-DD'),
        register_beginning_balance: productData.register_beginning_balance,
        product_register_remark: productData.product_register_remark,
        product_register_staus: newStatus // ใช้ product_register_staus ตามตัวอย่าง
      };

      await adminRequest.putProductRegisterById(productId, updateData);

      // รีเฟรชข้อมูล
      getWareHouseManager();

      // // แสดงข้อความแจ้งเตือน
      // const statusText = newStatus === 'A' ? 'เปิด' : 'ปิด';
      // console.log(`สถานะสินค้า ${statusText} เรียบร้อยแล้ว`);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตสถานะ:', error);
    } finally {
      setLoading(false);
    }
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

      {/* Filter Section */}
      <Box 
        sx={{ 
          // mb: 3, 
          pt: 3,
          pl: 3,
          pr: 3,
          // background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          // borderRadius: 2,
          // boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          // border: '1px solid #dee2e6'
        }}
      >
        {/* <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            color: '#495057',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <SearchOutlined sx={{ fontSize: '1.2rem', color: '#6c757d' }} />
          กรองข้อมูล
        </Typography> */}
        
        <Stack 
          direction="row" 
          spacing={2} 
          alignItems="center" 
          flexWrap="wrap"
        >
          <TextField
            size="small"
            label="ชื่อสินค้า"
            value={filters.productName}
            onChange={(e) => handleFilterChange('productName', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined sx={{ color: '#6c757d', fontSize: '1rem' }} />
                </InputAdornment>
              )
            }}
            sx={{ 
              minWidth: 200,
              backgroundColor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#007bff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#007bff',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#007bff',
              }
            }}
          />
          
          <TextField
            size="small"
            label="ตราสินค้า"
            value={filters.brandName}
            onChange={(e) => handleFilterChange('brandName', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined sx={{ color: '#6c757d', fontSize: '1rem' }} />
                </InputAdornment>
              )
            }}
            sx={{ 
              minWidth: 200,
              backgroundColor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#007bff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#007bff',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#007bff',
              }
            }}
          />
          
          <TextField
            size="small"
            label="โกดัง"
            value={filters.warehouseName}
            onChange={(e) => handleFilterChange('warehouseName', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined sx={{ color: '#6c757d', fontSize: '1rem' }} />
                </InputAdornment>
              )
            }}
            sx={{ 
              minWidth: 150,
              backgroundColor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#007bff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#007bff',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#007bff',
              }
            }}
          />
          
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: 120,
              backgroundColor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#007bff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#007bff',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#007bff',
              }
            }}
          >
            <InputLabel>สถานะ</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              label="สถานะ"
            >
              <MenuItem value="">ทั้งหมด</MenuItem>
              <MenuItem value="A">เปิด</MenuItem>
              <MenuItem value="I">ปิด</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<ClearOutlined />}
            onClick={clearFilters}
            sx={{ 
              minWidth: 120,
              height: 40,
              borderColor: '#6c757d',
              color: '#6c757d',
              fontWeight: '500',
              borderRadius: 1,
              '&:hover': {
                borderColor: '#495057',
                backgroundColor: '#f8f9fa',
                color: '#495057'
              }
            }}
          >
            เคลียร์
          </Button>
        </Stack>
      </Box>

      <MUIDataTable
        title={<Typography variant="h5">ข้อมูลกองสินค้า</Typography>}
        data={groupedProductList}
        columns={columns}
        options={options}
      />
      <ProductExport data={productList} onClickDownload={tableRef} />
    </Box>
  );
}

export default ProductManagementTable;
