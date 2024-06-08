import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';

async function ExportDailyProductout(itemList) {
  console.log('dataList :', itemList);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  // เพิ่มคอลัมน์
  worksheet.columns = [
    { header: 'ลำดับ', key: 'index', width: 10 },
    { header: 'สินค้า', key: 'name', width: 20 },
    { header: 'ทะเบียน', key: 'product_register', width: 20 },
    { header: 'วันที่ตั้งกอง', key: 'setup_pile_date', width: 20 },
    { header: 'ยอดตั้งต้น (ตัน)', key: 'stock_quantity', width: 15 },
    { header: 'ยอดยกมา (ตัน)', key: 'begin_day_stock', width: 15 },
    { header: 'ยอดรับ (ตัน)	', key: 'total_receive', width: 15 },
    { header: 'ยอดเบิก (ตัน)', key: 'total_cutoff', width: 15 },
    { header: 'จ่าย (ตัน)', key: 'items', width: 15 },
    { header: 'รวมจ่าย (กระสอบ)	', key: 'total_sold20', width: 15 },
    { header: 'รวมจ่าย (ตัน)', key: 'total_sold1', width: 15 },
    { header: 'คงเหลือ (ตัน)', key: 'remaining_quantity', width: 15 }
  ];

  // เพิ่มข้อมูลในแถว
  //   const data = [
  //     {
  //       index: 1,
  //       transferNumber: 'SO17090002',
  //       vehicleNumber: '90-กน-1756',
  //       formula: '0-0-60',
  //       load: 3.2,
  //       crush: 0.2,
  //       noonSling: 0.2,
  //       stackSling: 0.2,
  //       noonGo: 0.2
  //     },
  //     {
  //       index: 2,
  //       transferNumber: 'SO2403002',
  //       vehicleNumber: '90-กน-1756',
  //       formula: '0-0-60',
  //       load: 2,
  //       crush: 0.1,
  //       noonSling: 0.1,
  //       stackSling: 0.1,
  //       noonGo: 0.1
  //     }
  //     // เพิ่มข้อมูลอื่นๆ ตามต้องการ
  //   ];

  //   data.forEach((item) => {
  //     worksheet.addRow(item);
  //   });

  // Title Row
  //   worksheet.push([`สรุปยอดจ่ายประจำวันที่ ${thaiDateTime}`]);
  // เพิ่มข้อมูลในแถวจาก array ของ objects
  //   itemList.forEach((item) => {
  //     // worksheet.addRow({
  //     //   ...item,
  //     //   items: item.items.map((p) => `คิว ${p.token} \n ${p.total_products} ตัน`).join('\n'),
  //     //   total_sold20: parseFloat((item.total_sold * 20).toFixed(0)).toLocaleString('en-US'),
  //     //   total_sold1: parseFloat((item.total_sold * 1).toFixed(3)).toLocaleString('en-US'),
  //     //   remaining_quantity: parseFloat((item.remaining_quantity * 1).toFixed(3)).toLocaleString('en-US')
  //     // });
  //     const rowStart = worksheet.rowCount + 1;

  //     item.items.forEach((paidItem, paidIndex) => {
  //       worksheet.addRow({
  //         index: paidIndex + 1,
  //         name:  item.name,
  //         product_register:  item.product_register,
  //         setup_pile_date:   moment(item.setup_pile_date ).format('DD/MM/yyyy'): '',
  //         stock_quantity:  item.stock_quantity,
  //         begin_day_stock:  item.begin_day_stock,
  //         total_receive:  item.total_receive,
  //         total_cutoff:  item.total_cutoff,
  //         items: `คิว ${paidItem.token}\nตัน ${paidItem.total_products} `,
  //         total_sold20: parseFloat((item.total_sold * 20).toFixed(0)).toLocaleString('en-US'),
  //         total_sold1: parseFloat((item.total_sold * 1).toFixed(3)).toLocaleString('en-US'),
  //         remaining_quantity: parseFloat((item.remaining_quantity * 1).toFixed(3)).toLocaleString('en-US')
  //       });
  //     });

  //     const rowEnd = rowStart + item.items.length - 1;

  //     // Merge cells สำหรับคอลัมน์ที่ต้องการ
  //     if (item.items.length > 1) {
  //       worksheet.mergeCells(`A${rowStart}:A${rowEnd}`);
  //       worksheet.mergeCells(`B${rowStart}:B${rowEnd}`);
  //       worksheet.mergeCells(`C${rowStart}:C${rowEnd}`);
  //       worksheet.mergeCells(`D${rowStart}:D${rowEnd}`);
  //       worksheet.mergeCells(`E${rowStart}:E${rowEnd}`);
  //       worksheet.mergeCells(`F${rowStart}:F${rowEnd}`);
  //       worksheet.mergeCells(`G${rowStart}:G${rowEnd}`);
  //       worksheet.mergeCells(`H${rowStart}:H${rowEnd}`);
  //       worksheet.mergeCells(`J${rowStart}:J${rowEnd}`);
  //       worksheet.mergeCells(`K${rowStart}:K${rowEnd}`);
  //       worksheet.mergeCells(`L${rowStart}:L${rowEnd}`);
  //     }
  //   });
  itemList.forEach((item, index) => {
    const rowStart = worksheet.rowCount + 1;

    let paidText = item.items.map((paidItem) => `${paidItem.token}`).join(' ');
    let amountText = item.items.map((paidItem) => `${paidItem.total_products}`).join(' ');

    // แยกบรรทัดสำหรับ "คิว" และ "ตัน"
    const queueRow = worksheet.addRow({
      index: index + 1,
      name: item.name,
      product_register: item.product_register,
      setup_pile_date: moment(item.setup_pile_date).format('DD/MM/yyyy'),
      stock_quantity: item.stock_quantity,
      begin_day_stock: item.begin_day_stock,
      total_receive: item.total_receive,
      total_cutoff: item.total_cutoff,
      items: `คิว ${paidText}`,
      total_sold20: parseFloat((item.total_sold * 20).toFixed(0)).toLocaleString('en-US'),
      total_sold1: parseFloat((item.total_sold * 1).toFixed(3)).toLocaleString('en-US'),
      remaining_quantity: parseFloat((item.remaining_quantity * 1).toFixed(3)).toLocaleString('en-US')
    });

    const amountRow = worksheet.addRow({
      index: '',
      name: '',
      product_register: '',
      setup_pile_date: '',
      stock_quantity: '',
      begin_day_stock: '',
      total_receive: '',
      total_cutoff: '',
      items: `ตัน ${amountText}`,
      total_sold20: '',
      total_sold1: '',
      remaining_quantity: ''
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

    amountRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    const rowEnd = rowStart + 1;
    // Merge cells สำหรับคอลัมน์ที่ต้องการ
    // if (item.items.length > 1) {
    worksheet.mergeCells(`A${rowStart}:A${rowEnd}`);
    worksheet.mergeCells(`B${rowStart}:B${rowEnd}`);
    worksheet.mergeCells(`C${rowStart}:C${rowEnd}`);
    worksheet.mergeCells(`D${rowStart}:D${rowEnd}`);
    worksheet.mergeCells(`E${rowStart}:E${rowEnd}`);
    worksheet.mergeCells(`F${rowStart}:F${rowEnd}`);
    worksheet.mergeCells(`G${rowStart}:G${rowEnd}`);
    worksheet.mergeCells(`H${rowStart}:H${rowEnd}`);
    worksheet.mergeCells(`J${rowStart}:J${rowEnd}`);
    worksheet.mergeCells(`K${rowStart}:K${rowEnd}`);
    worksheet.mergeCells(`L${rowStart}:L${rowEnd}`);
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
  saveAs(blob, 'daily-product-out.xlsx');
}

export default ExportDailyProductout;
