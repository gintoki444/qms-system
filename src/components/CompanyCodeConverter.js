import React from 'react';

const CompanyCodeConverter = ({ code, showColor = false }) => {
  // Mapping ของ Code บริษัท
  const companyCodeMap = {
    'IF': 'ICPF',
    'II': 'ICPI',
    'SK': 'SAHAI KASET',
    'JS': 'JS888'
  };

  // Mapping ของสีตาม Code บริษัท
  const companyColorMap = {
    'IF': '#d32f2f',
    'II': '#1976d2',
    'JS': '#2e7d32',
    'SK': '#7b1fa2'
  };

  // ถ้าไม่มี code หรือ code ไม่ตรงกับที่กำหนดไว้ ให้ส่งคืน code เดิม
  const convertedCode = companyCodeMap[code] || code;
  const color = companyColorMap[code];

  return (
    <span style={{ color: showColor && color ? color : 'inherit' }}>
      {convertedCode}
    </span>
  );
};

export default CompanyCodeConverter;
