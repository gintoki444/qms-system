// import React, { useEffect, useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
// import axios from 'axios';
import moment from 'moment';

const ExportExcel = ({ reportList }) => {
  // const [data, setData] = useState([reportList]);
  const data = reportList;

  // useEffect(() => {
  //     const fetchData = async () => {
  //         try {
  //             const response = await axios.get('https://asia-southeast1-icpfer-qms-api.cloudfunctions.net/apia2/queueslogs?startDate=2024-07-21&endDate=2024-07-21');
  //             console.log(response.data);  // Debug: Log fetched data
  //             setData(response.data);
  //         } catch (error) {
  //             console.error('Error fetching data:', error);
  //         }
  //     };

  //     fetchData();
  // }, []);

  const formatDataForExcel = () => {
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
      if (rowNumber === 1 || rowNumber === 2) {
        row.eachCell((cell) => {
          cell.style = headerStyle;
          cell.font = { size: 16 };
        });
      } else {
        // Apply font size for data rows
        row.eachCell((cell) => {
          cell.font = { size: 16 };
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

          worksheet.addRow([
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
        }
      });
    });

    return workbook;
  };

  const exportToExcel = async () => {
    const workbook = formatDataForExcel();
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, 'export.xlsx');
  };

  return <button onClick={exportToExcel}>Export to Excel</button>;
};

export default ExportExcel;
