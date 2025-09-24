import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';

const QueueTableHead = ({ status }) => {
  const headCells = [
    {
      id: 'queueNo',
      align: 'center',
      disablePadding: false,
      width: '5%',
      label: 'ลำดับ'
    },
    {
      id: 'pickerDate',
      align: 'left',
      disablePadding: false,
      width: '8%',
      label: 'วันที่เข้ารับสินค้า'
    },
    {
      id: 'queueID',
      align: 'center',
      disablePadding: false,
      width: '5%',
      label: 'หมายเลขคิว'
    },
    {
      id: 'remarkQueue',
      align: 'center',
      disablePadding: false,
      label: 'รหัสคิวเดิม'
    },
    {
      id: 'registration_no',
      align: 'center',
      disablePadding: true,
      width: '10%',
      label: 'ทะเบียนรถ'
    },
    {
      id: 'station',
      align: 'left',
      disablePadding: true,
      width: '170px',
      label: 'สถานีบริการ'
    },
    {
      id: 'branName',
      align: 'left',
      disablePadding: false,
      width: '10%',
      label: 'ร้านค้า/บริษัท'
    },
    {
      id: 'totals',
      align: 'right',
      disablePadding: true,
      label: 'จำนวน (ตัน)'
    },
    {
      id: 'driver',
      align: 'left',
      disablePadding: true,
      width: '13%',
      label: 'ชื่อผู้ขับ'
    },
    {
      id: 'tel',
      align: 'left',
      disablePadding: true,
      width: '10%',
      label: 'เบอร์โทรศัพท์'
    },
    {
      id: 'times',
      align: 'left',
      disablePadding: false,
      width: '10%',
      label: 'เวลาเริ่ม'
    },
    {
      id: 'reacallTitle',
      align: 'center',
      disablePadding: false,
      label: 'ทวนสอบ'
    },
    {
      id: 'selectedStation',
      align: 'center',
      disablePadding: false,
      width: '5%',
      label: 'สถานะ'
    },
    {
      id: 'statusTitle',
      align: 'center',
      disablePadding: false,
      label: 'หัวจ่าย'
    },
    {
      id: 'soundCall',
      align: 'center',
      disablePadding: true,
      label: 'เรียกคิว'
    },
    {
      id: 'action',
      align: 'right',
      disablePadding: false,
      width: '120px',
      label: 'Actions'
    }
  ];

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <>
            {(status === 'waiting' && headCell.id === 'soundCall') || (status === 'processing' && headCell.id === 'statusTitle') || (
              <TableCell
                key={headCell.id}
                align={headCell.align}
                width={headCell.width}
                padding={headCell.disablePadding ? 'none' : 'normal'}
              >
                {headCell.label}
              </TableCell>
            )}
          </>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default QueueTableHead;

