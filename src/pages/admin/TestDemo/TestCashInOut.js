import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';

import { Button } from '@mui/material';
// import logo from '../../../assets/images/logo.png';  // สมมติว่าคุณมีโลโก้ในโปรเจคของคุณ
import { FileExcelOutlined } from '@ant-design/icons';
import LogoExport64 from 'components/@extended/LogoExport64';

const logoBase64 = LogoExport64();

const createWorksheet = (workbook, data, sheetIndex, totalSheets, nameCompany) => {
  const worksheet = workbook.addWorksheet(`Report ${sheetIndex + 1}`);

  // เพิ่มโลโก้
  const imageId = workbook.addImage({
    base64: logoBase64,
    extension: 'png'
  });
  // ตั้งค่าความสูงของแถว
  worksheet.getRow(1).height = 28;
  worksheet.getRow(2).height = 51;

  // เพิ่มข้อความใน A2 และ A3
  worksheet.getCell('A2').value = 'บริษัท ไอ ซี พี เฟอทิไลเซอร์ จำกัด\nICP FERTILIZER CO., LTD.';
  worksheet.getCell('A2').alignment = { vertical: 'bottom', horizontal: 'center', wrapText: true };
  worksheet.getCell('A2').font = { size: 6, name: 'Times New Roman' };
  worksheet.mergeCells('A2:C2');
  worksheet.getCell('C1').border = {
    top: { style: 'thin' },
    right: { style: 'thin' }
  };
  worksheet.getCell('A1').border = {
    left: { style: 'thin' }
  };
  worksheet.getCell('A2').border = {
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' }
  };
  worksheet.getCell('A1').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('B1').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('C1').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('A3').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('D3').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };
  worksheet.getCell('H3').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }
  };

  // เพิ่มข้อความในแถวที่ 3
  worksheet.getCell('A3').value = `วันที่ ${moment(new Date()).format('…DD…/…MM…/…YYYY…')}`;
  worksheet.getCell('A3').alignment = { horizontal: 'left' }; // เพิ่มการจัดชิดขวา
  worksheet.getCell('A3').font = { size: 16, bold: true, name: 'Browallia New' };
  worksheet.mergeCells('A3:C3');
  worksheet.mergeCells('H3:K3');
  worksheet.getCell('H3').value = `แผ่นที่ ..${sheetIndex + 1}../..${totalSheets}..`;
  worksheet.getCell('H3').alignment = { horizontal: 'right' }; // เพิ่มการจัดชิดขวา
  worksheet.getCell('H3').font = { size: 16, bold: true, name: 'Browallia New' };
  worksheet.getCell('H3').border = {
    right: { style: 'thin' }
  };

  // เพิ่มข้อความในแถวที่ 4
  worksheet.mergeCells('A4:K4');
  worksheet.getCell('A4').value = nameCompany ? 'บริษัท ' + nameCompany + ' จำกัด' : '';
  worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell('A4').font = { size: 14, bold: true, name: 'Calibri' };
  worksheet.getCell('A3').border = {
    left: { style: 'thin' }
  };

  // เพิ่มหัวตาราง
  worksheet.getRow(5).values = ['ลำดับ', 'หมาย', 'คิวเดิม', 'เวลา', '', 'ชื่อร้าน', 'ทะเบียนรถ', 'เบอร์โทร', 'ชื่อผู้ขับ', 'คลุมผ้าใบ', ''];
  worksheet.getRow(6).values = ['', 'เลขคิว', '', 'เข้า', 'ออก', '', '', '', '', 'ตัวแม่', 'ตัวลูก'];

  // กำหนดการรวมเซลล์สำหรับหัวตาราง
  worksheet.mergeCells('A5:A6');
  // worksheet.mergeCells('B5:B6');
  worksheet.mergeCells('C5:C6');
  worksheet.mergeCells('D5:E5');
  worksheet.mergeCells('D3:G3');
  worksheet.mergeCells('F5:F6');
  worksheet.mergeCells('G5:G6');
  worksheet.mergeCells('H5:H6');
  worksheet.mergeCells('I5:I6');
  worksheet.mergeCells('J5:K5');

  // จัดรูปแบบหัวตาราง
  [
    'A5',
    'B5',
    'C5',
    'D5',
    'E5',
    'F5',
    'G5',
    'H5',
    'I5',
    'J5',
    'K5',
    'A6',
    'B6',
    'C6',
    'D6',
    'E6',
    'F6',
    'G6',
    'H6',
    'I6',
    'J6',
    'K6'
  ].forEach((cell) => {
    worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(cell).font = { size: 14, bold: true, name: 'Browallia New' };
    worksheet.getCell(cell).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    worksheet.getCell(cell).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' }
    };
  });

  // เพิ่มข้อมูล
  // const maxRowsPerSheet = 40;
  // data.forEach((item, index) => {
  //     // const row = worksheet.addRow(Object.values(item));

  //     worksheet.columns = [
  //         { header: '', key: 'index' },
  //         { header: '', key: 'token' },
  //         { header: '', key: 'product_register' },
  //         { header: '', key: 'start_time' },
  //         { header: '', key: 'end_time' },
  //         { header: '', key: 'company_name' },
  //         { header: '', key: 'registration_no' },
  //         { header: '', key: 'driver_mobile' },
  //         { header: '', key: 'driver_name' },
  //         { header: '', key: 'parent_has_cover' },
  //         { header: '', key: 'trailer_has_cover' },
  //     ];
  //     const row = worksheet.addRow({
  //         index: index + 1,
  //         token: item.token,
  //         product_register: item.reserve_description ? item.reserve_description : '-',
  //         start_time: item.start_time ? moment(item.start_time.slice(0, 10)).format('DD/MM/YYYY') + ' ' + item.start_time.slice(11, 19) : '-',
  //         end_time: item.end_time ? moment(item.end_time.slice(0, 10)).format('DD/MM/YYYY') + ' ' + item.end_time.slice(11, 19) : '-',
  //         company_name: item.company_name,
  //         registration_no: item.registration_no,
  //         driver_mobile: item.driver_mobile,
  //         driver_name: item.driver_name,
  //         parent_has_cover: item.parent_has_cover ? item.parent_has_cover : '-',
  //         trailer_has_cover: item.trailer_has_cover ? item.trailer_has_cover : '-',
  //     });

  //     row.height = 26;
  //     row.font = { name: 'Browallia New' };

  //     row.eachCell((cell, colNumber) => {
  //         cell.border = {
  //             top: { style: 'thin' },
  //             left: { style: 'thin' },
  //             bottom: { style: 'thin' },
  //             right: { style: 'thin' }
  //         };
  //         // cell.font = { size: 14, name: 'Browallia New' };
  //         row.font = { size: 10, name: 'Arial Unicode MS' };
  //         cell.fill = {
  //             type: 'pattern',
  //             pattern: 'solid',
  //             fgColor: { argb: 'FFFFFFFF' }
  //         };
  //         cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

  //         if ((colNumber === 1 || colNumber === 2 || colNumber === 3) && cell.value) {
  //             cell.font = { size: 14, bold: true, name: 'Browallia New' };
  //             cell.alignment = { horizontal: 'center' };
  //         }
  //         // ตั้งค่าสีตามค่า 'Y' หรือ 'N'
  //         if ((colNumber === 10 || colNumber === 11) && cell.value) {
  //             if (cell.value === 'Y') {
  //                 cell.font = { size: 11, color: { argb: 'FF00FF00' }, name: 'Arial Unicode MS' };
  //                 // cell.fill = {
  //                 //     type: 'pattern',
  //                 //     pattern: 'solid',
  //                 //     fgColor: { argb: 'FF00FF00' }  // สีเขียว
  //                 // };
  //             } else if (cell.value === 'N') {
  //                 cell.font = { size: 11, color: { argb: 'FFFF0000' }, name: 'Arial Unicode MS' };
  //             }
  //         }
  //     });

  //     row.height = 26;

  //     // เพิ่มการแบ่งหน้า
  //     if (index === maxRowsPerSheet) {
  //         worksheet.getRow(worksheet.lastRow.number).addPageBreak();
  //     }
  // });
  // เพิ่มข้อมูล
  const maxRowsPerSheet = 40;
  data.forEach((item, index) => {
    worksheet.columns = [
      { header: '', key: 'index' },
      { header: '', key: 'token' },
      { header: '', key: 'product_register' },
      { header: '', key: 'start_time' },
      { header: '', key: 'end_time' },
      { header: '', key: 'company_name' },
      { header: '', key: 'registration_no' },
      { header: '', key: 'driver_mobile' },
      { header: '', key: 'driver_name' },
      { header: '', key: 'parent_has_cover' },
      { header: '', key: 'trailer_has_cover' }
    ];
    const row = worksheet.addRow({
      index: index + 1,
      token: item.token,
      product_register: item.reserve_description ? item.reserve_description : '-',
      start_time: item.start_time ? moment(item.start_time.slice(0, 10)).format('DD/MM/YYYY') + ' ' + item.start_time.slice(11, 19) : '-',
      end_time: item.end_time ? moment(item.end_time.slice(0, 10)).format('DD/MM/YYYY') + ' ' + item.end_time.slice(11, 19) : '-',
      company_name: item.company_name,
      registration_no: item.registration_no,
      driver_mobile: item.driver_mobile,
      driver_name: item.driver_name,
      parent_has_cover: item.parent_has_cover ? item.parent_has_cover : '-',
      trailer_has_cover: item.trailer_has_cover ? item.trailer_has_cover : '-'
    });

    row.height = 40;
    row.font = { name: 'Browallia New' };

    row.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      // cell.font = { size: 14, name: 'Browallia New' };
      row.font = { size: 10, name: 'Arial Unicode MS' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

      if ((colNumber === 4 || colNumber === 5) && cell.value) {
        cell.font = { size: 9, name: 'Arial Unicode MS' };
      }

      if ((colNumber === 1 || colNumber === 2 || colNumber === 3) && cell.value) {
        cell.font = { size: 12, bold: true, name: 'Browallia New' };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
      // ตั้งค่าสีตามค่า 'Y' หรือ 'N'
      // if ((colNumber === 10 || colNumber === 11) && cell.value) {
      //     if (cell.value === 'Y') {
      //         cell.font = { size: 11, color: { argb: 'FF00FF00' }, name: 'Arial Unicode MS' };
      //     } else if (cell.value === 'N') {
      //         cell.font = { size: 11, color: { argb: 'FFFF0000' }, name: 'Arial Unicode MS' };
      //     }
      // }
    });

    // เพิ่มการแบ่งหน้า
    if (index === maxRowsPerSheet - 1) {
      worksheet.getRow(worksheet.lastRow.number).addPageBreak();
    }
  });

  // เพิ่มหัวกระดาษ
  worksheet.mergeCells('D1:K2');
  worksheet.getCell('D1').value = 'รายงานรถเข้า-ออกจากโรงงาน';
  worksheet.getCell('D1').alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell('D1').font = { size: 28, bold: true, name: 'Browallia New' };
  worksheet.getCell('H3').border = {
    top: { style: 'thin' },
    right: { style: 'thin' }
  };
  worksheet.getCell('D1').border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  // เพิ่มแถวว่างเพื่อให้ครบ 47 แถวต่อแผ่น
  const totalRows = worksheet.lastRow.number;
  const remainingRows = 48 - (totalRows % 48);
  if (totalRows % 48 !== 0) {
    for (let i = 0; i < remainingRows; i++) {
      const row = worksheet.addRow([]);
      row.height = 40; // กำหนดความสูงของแถวว่างเป็น 26
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFFFF' }
        };
      });
    }
  }

  // เพิ่มข้อความในแถวที่ H47
  worksheet.getCell('H47').value = 'CHECK BY………………………..…………….';
  worksheet.getCell('H47').font = { size: 12, bold: true, name: 'Browallia New' };

  // เพิ่มข้อความในแถวที่ H48-K48
  worksheet.mergeCells('H48:K48');
  worksheet.getCell('H48').value = 'FM-WH-05 Rev.02 : ' + moment(new Date()).format('DD/MM/YY');
  worksheet.getCell('H48').font = { size: 12, bold: true, name: 'Browallia New' };
  worksheet.getCell('H48').alignment = { horizontal: 'right' };

  // ตั้งค่าความกว้างของคอลัมน์และความสูงของแถว
  // worksheet.getColumn('A').width = 51 / 6.5;
  // worksheet.getColumn('B').width = 61 / 6.5;
  // worksheet.getColumn('C').width = 51 / 6.5;
  // worksheet.getColumn('D').width = 131 / 6.5;
  // worksheet.getColumn('E').width = 131 / 6.5;
  // worksheet.getColumn('F').width = 270 / 6.5;
  // worksheet.getColumn('G').width = 161 / 6.5;
  // worksheet.getColumn('H').width = 118 / 6.5;
  // worksheet.getColumn('I').width = 195 / 6.5;
  // worksheet.getColumn('J').width = 48 / 6.5;
  // worksheet.getColumn('K').width = 48 / 6.5;
  const setColumnWidth = (column, maxWidth) => {
    const width = maxWidth / 6.5;
    if (column.width > width) {
      column.width = width;
    } else {
      column.width = maxWidth / 6.5;
    }
  };

  // ตั้งค่าความกว้างของคอลัมน์และความสูงของแถว
  setColumnWidth(worksheet.getColumn('A'), 51);
  setColumnWidth(worksheet.getColumn('B'), 61);
  setColumnWidth(worksheet.getColumn('C'), 51);
  setColumnWidth(worksheet.getColumn('D'), 131);
  setColumnWidth(worksheet.getColumn('E'), 131);
  setColumnWidth(worksheet.getColumn('F'), 200);
  setColumnWidth(worksheet.getColumn('G'), 141);
  setColumnWidth(worksheet.getColumn('H'), 108);
  setColumnWidth(worksheet.getColumn('I'), 175);
  setColumnWidth(worksheet.getColumn('J'), 48);
  setColumnWidth(worksheet.getColumn('K'), 48);

  worksheet.getRow(3).height = 37.2;
  worksheet.getRow(4).height = 32;
  worksheet.getRow(5).height = 24;
  worksheet.getRow(6).height = 24;
  worksheet.getRow(47).height = 50;
  worksheet.getRow(48).height = 40;

  worksheet.addImage(imageId, {
    tl: { col: 1, row: 0 },
    ext: { width: 62, height: 60 },
    editAs: 'oneCell'
  });
  worksheet.getCell('A1').border = {
    top: { style: 'thin' },
    left: { style: 'thin' }
  };
  worksheet.getCell('B1').border = {
    top: { style: 'thin' }
  };
  worksheet.getCell('C1').border = {
    top: { style: 'thin' }
  };
  worksheet.getCell('A4').border = {
    left: { style: 'thin' },
    right: { style: 'thin' }
  };

  // console.log(`A1:K${totalRows + remainingRows}`)
  // กำหนดรูปแบบการพิมพ์
  worksheet.pageSetup.paperSize = 9; // A4
  worksheet.pageSetup.orientation = 'portrait';
  worksheet.pageSetup.fitToPage = true;
  worksheet.pageSetup.fitToHeight = 1;
  worksheet.pageSetup.fitToWidth = 1;
  worksheet.pageSetup.printArea = `A1:K${totalRows + remainingRows}`;
  worksheet.pageSetup.horizontalCentered = true;
  worksheet.pageSetup.verticalCentered = true;
  worksheet.pageSetup.margins = {
    left: 0.3,
    right: 0.3,
    top: 0.3,
    bottom: 0.3,
    header: 0.3,
    footer: 0.3
  };
  // worksheet.pageSetup = {
  //     paperSize: 9,  // A4
  //     orientation: 'portrait',
  //     fitToPage: true,
  //     fitToHeight: 1,
  //     fitToWidth: 1,
  //     printArea: `A1:K${totalRows + remainingRows}`,
  //     horizontalCentered: true,
  //     margins: {
  //         left: 0.3,
  //         right: 0.3,
  //         top: 0.3,
  //         bottom: 0.3,
  //         header: 0.3,
  //         footer: 0.3
  //     }
  // };
};

const exportToExcel = async (data, nameCompany) => {
  const workbook = new ExcelJS.Workbook();
  const maxRowsPerSheet = 40;
  const totalSheets = Math.ceil(data.length / maxRowsPerSheet);

  for (let i = 0; i < totalSheets; i++) {
    const dataSubset = data.slice(i * maxRowsPerSheet, (i + 1) * maxRowsPerSheet);
    createWorksheet(workbook, dataSubset, i, totalSheets, nameCompany);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), 'FM-WH-05 รายงานรถเข้า-ออกจากโรงงาน-' + nameCompany + '.xlsx');
  // if (data === 9999) {

  // const workbook = new ExcelJS.Workbook();
  // createWorksheet(workbook, data);

  // const buffer = await workbook.xlsx.writeBuffer();
  // saveAs(new Blob([buffer]), 'report.xlsx');
  // // }
  // // const buffer = await workbook.xlsx.writeBuffer();
  // // saveAs(new Blob([buffer]), 'report.xlsx');
};
function ExportCarsTimeInOut({ dataList, nameCompany, onFilter }) {
  return (
    <Button
      color="success"
      variant="contained"
      sx={{ fontSize: '18px', minWidth: '', p: '6px 10px' }}
      onClick={() => exportToExcel(onFilter ? dataList.filter((x) => x.product_company_id === onFilter) : dataList, nameCompany)}
    >
      <FileExcelOutlined />
    </Button>
  );
}

export default ExportCarsTimeInOut;
