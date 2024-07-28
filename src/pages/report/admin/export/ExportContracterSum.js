import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';

async function ExportContracterSum(itemList) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(moment(new Date()).format('DD-MM-YYYY'));

  // เพิ่มคอลัมน์
  worksheet.columns = [
    { header: 'ลำดับ', key: 'index', width: 10 },
    { header: 'วันที่ทวนสอบ', key: 'created_date', width: 20 },
    { header: 'หมายเลขคิว', key: 'token', width: 10 },
    { header: 'สถานี', key: 'station_description', width: 15 },
    { header: 'ทะเบียนรถ', key: 'registration_no', width: 15 },
    { header: 'บริษัท/ร้านค้า', key: 'company_name', width: 15 },
    { header: 'ชื่อผู้ขับ', key: 'driver_name', width: 15 },
    { header: 'เบอร์โทร', key: 'driver_mobile', width: 15 },
    { header: 'เวลาเริ่ม', key: 'start_time', width: 15 },
    { header: 'สถานะ', key: 'status', width: 10 },
    { header: 'สาเหตุ', key: 'remark', width: 15 }
  ];

  itemList.forEach((item, index) => {
    // แยกบรรทัดสำหรับ "คิว" และ "ตัน"
    const queueRow = worksheet.addRow({
      index: index + 1,
      created_date: item.created_date ? moment(item.created_date.slice(0, 10)).format('DD/MM/YYYY') : '',
      token: item.recall_data.token,
      station_description: item.recall_data.station_description,
      registration_no: item.recall_data.registration_no,
      company_name: item.recall_data.company_name,
      driver_name: item.recall_data.driver_name,
      driver_mobile: item.recall_data.driver_mobile,
      start_time: item.recall_data.start_time ? item.recall_data.start_time.slice(11, 19) : '-',
      status: item.recall_data.status == 'completed' ? 'สำเร็จ' : 'รอตรวจสอบ',
      remark: item.remark
    });

    // ใส่สไตล์ให้กับแถว
    queueRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // amountRow.eachCell((cell) => {
    //   cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    //   cell.border = {
    //     top: { style: 'thin' },
    //     left: { style: 'thin' },
    //     bottom: { style: 'thin' },
    //     right: { style: 'thin' }
    //   };
    // });
    // }
  });

  // ใส่สไตล์ให้กับแถวหัวตาราง
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9EAD3' }
    };
  });

  // ใส่สไตล์ให้กับแถวข้อมูล
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber !== 1) {
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }
  });

  // เพิ่มแถวสรุปท้ายตาราง
  //   const summaryRow = worksheet.addRow({
  //     index: '',
  //     product: 'ยอดรวมจ่าย:',
  //     product_register: '',
  //     date: '',
  //     initialAmount: '',
  //     carryForward: '',
  //     received: '',
  //     issued: '',
  //     paid: '',
  //     totalBags: itemList.reduce((sum, item) => sum + item.totalBags, 0) + ' กระสอบ',
  //     totalPaid: itemList.reduce((sum, item) => sum + item.totalPaid, 0) + ' ตัน',
  //     remaining: itemList.reduce((sum, item) => sum + item.remaining, 0) + ' ตัน'
  //   });
  //   summaryRow.eachCell((cell, colNumber) => {
  //     if (colNumber >= 10) {
  //       cell.font = { bold: true, color: { argb: 'FFFF0000' } };
  //     }
  //     cell.alignment = { vertical: 'middle' };
  //   });

  // สร้าง buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // บันทึกไฟล์
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'report-step-recall.xlsx');
}

export default ExportContracterSum;
