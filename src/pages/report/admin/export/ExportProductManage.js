import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { Button, Tooltip } from '@mui/material';
import { FileExcelOutlined } from '@ant-design/icons';
import LogoExport64 from 'components/@extended/LogoExport64';

const logoBase64 = LogoExport64();

// ฟังก์ชันจัดเรียงข้อมูลสินค้า
const sortProductsByName = (items) => {
  return items.sort((a, b) => {
    // ฟังก์ชันแยกตัวเลขออกจากชื่อสินค้า
    const parseName = (name) => {
      return name.split('-').map((segment) => {
        const numberMatch = segment.match(/\d+/);
        return numberMatch ? parseInt(numberMatch[0], 10) : segment;
      });
    };

    // แยกตัวเลขจากชื่อสินค้า
    const [a1, a2, a3] = parseName(a.name);
    const [b1, b2, b3] = parseName(b.name);

    // จัดเรียงตามตัวเลขแต่ละชุด
    if (a1 !== b1) return a1 - b1;
    if (a2 !== b2) return a2 - b2;
    return a3 - b3;
  });
};

// ฟังก์ชันการจัดกลุ่มข้อมูล
const groupData = (data) => {
  if (!data || !Array.isArray(data)) {
    console.error('Invalid data format. Data should be an array:', data);
    return {};
  }

  const groupedData = {};
  data.forEach((item) => {
    if (!groupedData[item.product_company_id]) {
      groupedData[item.product_company_id] = {
        companyName: item.product_company_name_th, // ชื่อบริษัทสำหรับการสร้างชื่อ Sheet
        sheetName: item.product_company_name_th2, // ชื่อ Sheet
        products: {} // เก็บข้อมูลสินค้าแต่ละตัวใน products
      };
    }

    if (!groupedData[item.product_company_id].products[item.product_id]) {
      groupedData[item.product_company_id].products[item.product_id] = {
        items: [],
        summary: {
          register_beginning_balance: 0,
          total_receive: 0,
          total_cutoff: 0,
          total_remain: 0
        }
      };
    }

    // เพิ่มข้อมูลสินค้าใน product_id นั้นๆ
    groupedData[item.product_company_id].products[item.product_id].items.push(item);

    // คำนวณยอดรวมของสินค้าแต่ละ product_id
    groupedData[item.product_company_id].products[item.product_id].summary.register_beginning_balance += parseFloat(
      item.register_beginning_balance || 0
    );
    groupedData[item.product_company_id].products[item.product_id].summary.total_receive += parseFloat(item.total_receive || 0);
    groupedData[item.product_company_id].products[item.product_id].summary.total_cutoff += parseFloat(item.total_cutoff || 0);
    groupedData[item.product_company_id].products[item.product_id].summary.total_remain += parseFloat(item.total_remain || 0);
  });

  // จัดเรียงข้อมูลสินค้าภายในแต่ละบริษัทโดยเรียงตาม 'name'
  Object.keys(groupedData).forEach((companyId) => {
    const products = groupedData[companyId].products;
    // แปลง object ของ products ให้เป็น array เพื่อทำการจัดเรียง
    const sortedProducts = Object.values(products).sort((a, b) => {
      if (a.items.length === 0 || b.items.length === 0) return 0;
      return sortProductsByName(a.items)[0].name.localeCompare(sortProductsByName(b.items)[0].name, undefined, { numeric: true });
    });
    // เก็บ sortedProducts กลับเข้าไปใน products ใหม่หลังจากเรียงเสร็จแล้ว
    groupedData[companyId].products = sortedProducts;
  });

  return groupedData;
};

// ฟังก์ชันสร้าง Worksheet
const createWorksheet = (workbook, companyName, sheetName, products) => {
  const worksheet = workbook.addWorksheet(sheetName);

  // เพิ่มโลโก้
  const imageId = workbook.addImage({
    base64: logoBase64,
    extension: 'png'
  });

  // เพิ่มหัวตารางที่แถว 5
  worksheet.getRow(5).values = [
    'สินค้า',
    'ทะเบียน',
    'วันที่ตั้งกอง',
    'อายุกอง',
    'ตรา',
    'โกดัง',
    'ยอดยกมา',
    'รวมรับ',
    'รวมจ่าย',
    'ยอดคงเหลือ',
    'หมายเหตุ'
  ];

  worksheet.columns = [
    { key: 'name', width: 19.89 },
    { key: 'product_register_name', width: 12.44 },
    { key: 'product_register_date', width: 14.22 },
    { key: 'age', width: 14.0 },
    { key: 'product_brand_name', width: 12.44 },
    { key: 'warehouse_name', width: 7 },
    { key: 'register_beginning_balance', width: 14.67 },
    { key: 'total_receive', width: 9.78 },
    { key: 'total_cutoff', width: 9.78 },
    { key: 'total_remain', width: 12.11 },
    { key: 'product_register_remark', width: 18.0 }
  ];

  // ตั้งค่า wrapText ให้กับทุกคอลัมน์และกำหนดฟอนต์ TH Sarabun New
  worksheet.columns.forEach((column) => {
    column.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.font = { name: 'TH Sarabun New', size: 14 }; // ตั้งฟอนต์เป็น TH Sarabun New
    });
  });

  // กำหนดรูปแบบหัวตาราง
  worksheet.getRow(5).eachCell((cell) => {
    cell.font = { size: 11, bold: true, name: 'TH Sarabun New' }; // ใช้ฟอนต์ TH Sarabun New สำหรับหัวตาราง
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCCC' } };
  });

  // เติมข้อมูลในตาราง
  let rowIndex = 6;

  Object.keys(products).forEach((productId) => {
    const productGroup = products[productId];
    if (!productGroup || !Array.isArray(productGroup.items)) return;

    productGroup.items.forEach((item) => {
      const row = worksheet.addRow({
        name: item.name,
        product_register_name: item.product_register_name,
        product_register_date: moment(item.product_register_date).format('DD/MM/YYYY'),
        age: calculateAge(item.product_register_date),
        product_brand_name: item.product_brand_name,
        warehouse_name: item.warehouse_name,
        register_beginning_balance: parseFloat(item.register_beginning_balance).toFixed(2),
        total_receive: parseFloat(item.total_receive).toFixed(2),
        total_cutoff: parseFloat(item.total_cutoff).toFixed(2),
        total_remain: parseFloat(item.total_remain).toFixed(2),
        product_register_remark: item.product_register_remark || '-'
      });

      // ตั้งค่า wrapText และ border ให้กับข้อมูลในแถวที่เพิ่มเข้าไป พร้อมฟอนต์ TH Sarabun New
      row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        cell.font = { name: 'TH Sarabun New', size: 11 }; // ตั้งฟอนต์เป็น TH Sarabun New
        cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };

        // เงื่อนไขสำหรับเซลล์ในคอลัมน์ K
        if (colNumber === 11) {
          // คอลัมน์ K คือคอลัมน์ที่ 11
          cell.font = { name: 'TH Sarabun New', size: 11, bold: true, color: { argb: 'FFFF0000' } }; // ตั้งเป็นตัวหนาและสีแดง
        }
      });

      rowIndex++;
    });

    // เพิ่มแถวสรุป
    const summaryRow = worksheet.addRow({
      name: `รวม ${productGroup.items[0].name}`,
      register_beginning_balance: productGroup.summary.register_beginning_balance.toFixed(2),
      total_receive: productGroup.summary.total_receive.toFixed(2),
      total_cutoff: productGroup.summary.total_cutoff.toFixed(2),
      total_remain: productGroup.summary.total_remain.toFixed(2)
    });

    // จัดรูปแบบแถวสรุป
    summaryRow.eachCell((cell, colNumber) => {
      cell.font = { size: 11, bold: true, color: { argb: 'FF000000' }, name: 'TH Sarabun New' }; // ใช้ฟอนต์ TH Sarabun New
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF99' } }; // สีพื้นหลังเหลือง
      cell.alignment = { vertical: 'middle', horizontal: colNumber === 1 ? 'center' : 'right', wrapText: true };
      cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    });

    // ทำการ Merge Cells สำหรับแถวสรุป
    worksheet.mergeCells(`A${summaryRow.number}:F${summaryRow.number}`); // รวมเซลล์ A-F สำหรับชื่อสินค้า
    worksheet.getCell(`A${summaryRow.number}`).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true }; // ชิดขวา

    worksheet.mergeCells(`J${summaryRow.number}:K${summaryRow.number}`); // รวมเซลล์ J-K สำหรับยอดคงเหลือรวม
    worksheet.getCell(`J${summaryRow.number}`).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }; // ชิดซ้าย

    rowIndex++;
  });

  // ตั้งค่าความสูงของแถว
  worksheet.getRow(1).height = 39;
  worksheet.getRow(2).height = 51;

  // เพิ่มข้อความใน A1:A2
  worksheet.mergeCells('A1:A2');
  worksheet.getCell('A1').value = 'บริษัท ไอ ซี พี เฟอทิไลเซอร์ จำกัด\nICP FERTILIZER CO., LTD.';
  worksheet.getCell('A1').alignment = {
    vertical: 'bottom',
    horizontal: 'center',
    wrapText: true
  };
  worksheet.getCell('A1').font = { size: 6, bold: true, name: 'TH Sarabun New' };
  worksheet.getCell('A1').border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  // เพิ่มข้อความใน B1:K2
  worksheet.mergeCells('B1:K2');
  worksheet.getCell('B1').value = 'รายงานการรับ-จ่ายสินค้า และสินค้าคงเหลือ';
  worksheet.getCell('B1').font = { size: 24, bold: true, name: 'TH Sarabun New' };
  worksheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  worksheet.getCell('B1').border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  // เพิ่มข้อมูลบริษัทในแถวที่ 3
  worksheet.getRow(3).height = 51;
  worksheet.mergeCells('B3:J3');
  worksheet.getCell('B3').value = companyName ? companyName : '';
  worksheet.getCell('B3').font = { size: 20, bold: true, name: 'TH Sarabun New' };
  worksheet.getCell('B3').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  //   worksheet.getCell('K3').value = `แผ่นที่ ..../....`;
  //   worksheet.getCell('K3').alignment = { vertical: 'middle', horizontal: 'center' };
  //   worksheet.getCell('K3').font = { size: 12, bold: true, name: 'TH Sarabun New' };
  worksheet.getCell('A3').border = {
    left: { style: 'thin' }
  };
  worksheet.getCell('A3').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('B3').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('K3').border = {
    right: { style: 'thin' }
  };
  worksheet.getCell('K3').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('K4').border = {
    right: { style: 'thin' }
  };

  // เพิ่มข้อความในแถวที่ 4
  worksheet.getRow(4).height = 33;
  worksheet.getCell('A4').value = 'ปุ๋ยสูตร';
  worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell('A4').font = { size: 11, bold: true, name: 'TH Sarabun New' };
  worksheet.getCell('J4').value = 'หน่วย "ตัน"';
  worksheet.getCell('J4').alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell('J4').font = { size: 11, bold: true, name: 'TH Sarabun New' };
  worksheet.getCell('A4').border = {
    left: { style: 'thin' }
  };
  worksheet.getCell('A4').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('B4').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('C4').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('D4').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('E4').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('F4').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('G4').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('H4').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('I4').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('J4').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('K4').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };

  // เพิ่มรูปโลโก้ในเอกสาร
  worksheet.addImage(imageId, {
    tl: { col: 0.9199, row: 0.2 }, // ปรับค่าตำแหน่งแนวนอนและแนวตั้งให้กับรูปภาพ
    ext: { width: 65, height: 55 } // ขนาดของรูปภาพ
  });

  // จัดการ Page Setup
  worksheet.pageSetup.paperSize = 9; // A4
  worksheet.pageSetup.orientation = 'portrait';
  worksheet.pageSetup.fitToPage = false; // ปิดการปรับขนาดอัตโนมัติ (fitToPage) เพื่อใช้ scale แทน
  worksheet.pageSetup.scale = 65; // ปรับให้เป็น 65% ของขนาดปกติ
  //   worksheet.pageSetup.fitToHeight = 1;
  //   worksheet.pageSetup.fitToWidth = 1;
  worksheet.pageSetup.printArea = `A1:K${rowIndex}`;
  worksheet.pageSetup.horizontalCentered = true;
  worksheet.pageSetup.verticalCentered = false;
  worksheet.pageSetup.margins = {
    left: 0.2,
    right: 0.2,
    top: 0.2,
    bottom: 0.5,
    header: 0.3,
    footer: 0.3
  };
  // ตั้งค่าให้แถวที่ 1 ถึง 4 เป็นส่วนหัวของทุกหน้า
  worksheet.pageSetup.printTitlesRow = '1:5';

  // กำหนด Footer สำหรับแสดงเลขหน้า
  worksheet.headerFooter.oddFooter = `แผ่นที่ &P / &N`; // "แผ่นที่ หน้า / หน้าทั้งหมด"

  // กำหนดให้ Footer แสดงในเซลล์ K3 (บนทุกหน้าของการพิมพ์)
  //   worksheet.getCell('K3').value = `แผ่นที่ ... / ...`; // ค่าที่จะเห็นใน Excel
  //   worksheet.getCell('K3').alignment = { vertical: 'middle', horizontal: 'center' };
  //   worksheet.getCell('K3').font = { size: 12, bold: true, name: 'TH Sarabun New' };
};

// ฟังก์ชัน Export ข้อมูลเป็นไฟล์ Excel
const exportToExcel = async (data) => {
  const currentDate = moment(new Date()).format('DD-MM-YYYY');
  if (!data || !Array.isArray(data)) {
    console.error('Invalid data format for export:', data);
    return;
  }

  const workbook = new ExcelJS.Workbook();

  // ขั้นตอนที่ 1: จัดเรียงข้อมูลก่อน
  const sortedData = sortProductsByName(data);
  const groupedData = groupData(sortedData);

  if (!groupedData || Object.keys(groupedData).length === 0) {
    console.error('No data available for export:', groupedData);
    return;
  }

  // สร้าง Worksheet สำหรับแต่ละ companyId
  Object.keys(groupedData).forEach((companyId) => {
    const company = groupedData[companyId];
    createWorksheet(workbook, company.companyName, company.sheetName, company.products);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `รายงานการรับ-จ่ายสินค้า และสินค้าคงเหลือ_${currentDate}.xlsx`);
};

// คอมโพเนนต์ ExportProductManage
function ExportProductManage({ dataList }) {
  return (
    <Tooltip title="Export Excel">
      <Button
        color="success"
        variant="contained"
        sx={{ fontSize: '18px', minWidth: '', p: '6px 10px' }}
        onClick={() => exportToExcel(dataList)}
      >
        <FileExcelOutlined />
      </Button>
    </Tooltip>
  );
}

export default ExportProductManage;

// ฟังก์ชันคำนวณอายุของสินค้าในรูปแบบปี เดือน วัน
const calculateAge = (registrationDate) => {
  if (!registrationDate) return '-';

  const currentDate = moment(new Date());
  const regDate = moment(registrationDate);

  const years = currentDate.diff(regDate, 'years');
  const months = currentDate.diff(regDate, 'months') % 12;
  const days = currentDate.diff(regDate, 'days') % 30;

  let result = '';

  if (years !== 0) {
    result = `${years} ปี ${months} เดือน ${days} วัน`;
  } else if (months !== 0) {
    result = `${months} เดือน ${days} วัน`;
  } else {
    result = `${days} วัน`;
  }

  return result;
};
