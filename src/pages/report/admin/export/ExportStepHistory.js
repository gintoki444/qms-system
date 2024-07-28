import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import axios from 'axios';
import moment from 'moment';
import { Button, Backdrop, CircularProgress } from '@mui/material';
import { FileExcelOutlined } from '@ant-design/icons';

const ExportStepHistory = ({ startDate, endDate }) => {
  // const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {

  //     // fetchData();
  // }, [data]);

  const fetchData = async (startDate, endDate) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://asia-southeast1-icp-qms-api.cloudfunctions.net/apia2/queueslogs?startDate=${startDate}&endDate=${endDate}`
      );
      console.log(response.data); // Debug: Log fetched data
      if (response.data) {
        setLoading(false);
      }
      // setData(response.data);
      const workbook = await formatDataForExcel(response.data);
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, 'รายงานขั้นตอนการทำงาน' + startDate + '.xlsx');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatDataForExcel = async (data) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Set the column headers
    worksheet.addRow([
      'ข้อมูลการจอง',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'ข้อมูลรายการสั่งซื้อ',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'น้ำหนักชั่ง',
      '',
      '',
      '',
      '',
      '',
      '',
      'ข้อมูลทีมจ่ายสินค้า',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'ข้อมูลกองสินค้าที่จ่าย',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    ]);

    worksheet.addRow([
      'ลำดับ',
      'วันที่จอง',
      'ทะเบียนรถ',
      'รหัสคิว',
      'รหัสคิวเดิม',
      'บริษัท/ร้าน',
      'คนขับ',
      'เบอร์',
      'เวลา QR Code',
      'Log User',
      'เลขที่คำสั่งซื้อ',
      'ตราสินค้า',
      'ข้อมูลสินค้า',
      'จำนวน (ตัน)',
      'เวลาที่กด',
      'Log User',
      'หมายเหตุ',
      'เวลาที่ชั่ง',
      'สถานี',
      'ชั่งเบา',
      'Log User',
      'เวลาที่ชั่ง',
      'สถานี',
      'ชั่งหนัก',
      'Log User',
      'หัวหน้าโกดัง',
      'พนักงานจ่ายสินค้า',
      'โฟล์คลิฟท์',
      'สายแรงงาน',
      'โกดัง',
      'หัวจ่าย',
      'เวลาที่กด',
      'Log User',
      'กองสินค้า',
      'ทะเบียน',
      'จำนวน',
      'ทุบปุ๋ย',
      'เกี่ยวสลิง',
      'เรียงสลิง',
      'เกี่ยวจัมโบ้',
      'เวลาที่เข้าหัว',
      'เวลาที่กด',
      'Log Userจ่าย'
    ]);

    // Apply styles to header
    const headerStyle = {
      font: { bold: true },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFAA00' } },
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      }
    };

    worksheet.eachRow((row, rowNumber) => {
      console.log('rowNumber ', rowNumber);
      if (rowNumber === 1 || rowNumber === 2) {
        row.eachCell((cell) => {
          cell.style = headerStyle;
          // cell.font = { size: 12 };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.font = { size: 14, bold: true, name: 'Browallia New' };
        });
      } else {
        // Apply font size for data rows
        row.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.font = { size: 14, bold: true, name: 'Browallia New' };
        });
      }
    });

    // Merge cells for header groups
    worksheet.mergeCells('A1:J1');
    worksheet.mergeCells('K1:Q1');
    worksheet.mergeCells('R1:Y1');
    worksheet.mergeCells('Z1:AG1');
    worksheet.mergeCells('AH1:AQ1');

    // Add data rows
    data.forEach((item, index) => {
      item.o_orders_items.forEach((orderItem, orderIndex) => {
        const maxLen = Math.max(orderItem.s2_product_register.length || 1, 1);

        for (let j = 0; j < maxLen; j++) {
          const productRegister = orderItem.s2_product_register && orderItem.s2_product_register[j] ? orderItem.s2_product_register[j] : {};

          const row = worksheet.addRow([
            orderIndex === 0 && j === 0 ? index + 1 : '', // Display the index only once per main item
            orderIndex === 0 && j === 0 ? moment(item.r_queue_date?.slice(0, 10)).format('DD/MM/YYYY') || '' : '', // Only display for the first row of each main item
            orderIndex === 0 && j === 0 ? item.r_registration_no || '' : '',
            orderIndex === 0 && j === 0 ? item.r_token || '' : '',
            orderIndex === 0 && j === 0 ? item.r_org_queue_no || '' : '',
            orderIndex === 0 && j === 0 ? item.r_company_name || '' : '',
            orderIndex === 0 && j === 0 ? item.r_driver_name || '' : '',
            orderIndex === 0 && j === 0 ? item.r_driver_mobile || '' : '',
            orderIndex === 0 && j === 0 ? item.r_qr_create?.slice(11, 19) || '' : '', // เวลา QR Code
            orderIndex === 0 && j === 0 ? item.r_log_user || '' : '',
            orderIndex === 0 && j === 0 ? item.o_ref_order_id || '' : '',
            orderIndex === 0 && j === 0 ? item.o_description || '' : '',
            j === 0 ? orderItem.product_name || '' : '',
            j === 0 ? orderItem.quantity || '' : '',
            orderIndex === 0 && j === 0 ? item.s2_end_time?.slice(11, 19) || '' : '',
            orderIndex === 0 && j === 0 ? item.s2_log_user || '' : '',
            orderIndex === 0 && j === 0 ? item.o_description || '' : '', // หมายเหตุ
            orderIndex === 0 && j === 0 ? item.s1_end_time?.slice(11, 19) || '' : '',
            orderIndex === 0 && j === 0 ? item.s1_station_description || '' : '',
            orderIndex === 0 && j === 0 ? item.s1_weight1 || '' : '',
            orderIndex === 0 && j === 0 ? item.s1_log_user || '' : '',
            orderIndex === 0 && j === 0 ? item.s3_end_time?.slice(11, 19) || '' : '',
            orderIndex === 0 && j === 0 ? item.s3_station_description || '' : '',
            orderIndex === 0 && j === 0 ? item.s3_weight2 || '' : '',
            orderIndex === 0 && j === 0 ? item.s3_log_user || '' : '',
            orderIndex === 0 && j === 0 ? item.s0_team_data?.team_managers?.[0]?.manager_name || '' : '',
            orderIndex === 0 && j === 0 ? item.s0_team_data?.team_checkers?.[0]?.checker_name || '' : '',
            orderIndex === 0 && j === 0 ? item.s0_team_data?.team_forklifts?.[0]?.forklift_name || '' : '',
            orderIndex === 0 && j === 0 ? item.s0_contractor_name || '' : '',
            orderIndex === 0 && j === 0 ? item.s0_warehouse_name || '' : '',
            orderIndex === 0 && j === 0 ? item.s0_station_name || '' : '',
            orderIndex === 0 && j === 0 ? item.s0_station_name || '' : '', // เวลาที่กด
            orderIndex === 0 && j === 0 ? item.s0_log_user || '' : '',
            productRegister.product_name || '',
            productRegister.product_register_name || '',
            productRegister.product_register_quantity || '',
            productRegister.smash_quantity || '', // ทุบปุ๋ย
            productRegister.sling_hook_quantity || '', // เกี่ยวสลิง
            productRegister.sling_sort_quantity || '', // เรียงสลิง
            productRegister.jumbo_hook_quantity || '', // เกี่ยวจัมโบ้
            orderIndex === 0 && j === 0 ? item.s2_start_time?.slice(11, 19) || '' : '',
            orderIndex === 0 && j === 0 ? item.s2_end_time?.slice(11, 19) || '' : '',
            orderIndex === 0 && j === 0 ? item.s2_log_user || '' : ''
          ]);
          // Apply border and font size to all data cells
          row.eachCell((cell) => {
            cell.font = { size: 12 };
            cell.border = {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' }
            };
          });
        }
      });
    });

    return workbook;
  };

  const exportToExcel = async (startDate, endDate) => {
    await fetchData(startDate, endDate);
  };

  return (
    <>
      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      {/* <button onClick={exportToExcel}>{text}</button> */}
      <Button
        color="success"
        // disabled={itemList.length === 0}
        variant="contained"
        sx={{ fontSize: '18px', minWidth: '', p: '6px 10px' }}
        onClick={() => exportToExcel(startDate, endDate)}
        // onClick={() => handleExport(itemList, valueFilter)}
      >
        <FileExcelOutlined />
      </Button>
    </>
  );
};

export default ExportStepHistory;
