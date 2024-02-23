import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Box, Button } from '@mui/material';

import axios from '../../../node_modules/axios/index';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'companyNo',
    align: 'left',
    disablePadding: false,
    label: 'ID.'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'ชื่อบริษัท'
  },
  {
    id: 'taxpayer',
    align: 'left',
    disablePadding: false,
    label: 'เลขที่ผู้เสียภาษี'
  },
  {
    id: 'tel',
    align: 'left',
    disablePadding: false,
    label: 'เบอร์โทร'
  },
  {
    id: 'customerName',
    align: 'center',
    disablePadding: false,
    label: 'ชื่อผู้ติดต่อ'
  },
  {
    id: 'customerTel',
    align: 'left',
    disablePadding: false,
    label: 'เบอร์โทรผู้ติดต่อ'
  },
  {
    id: 'action',
    align: 'center',
    disablePadding: false,
    label: 'Actions'
  }
];

function CompantTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function CompanyTable() {
  const [company, setCompany] = useState([]);

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    getCompany();
  }, []);

  const getCompany = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: apiUrl + '/allcompany/' + userId,
      headers: {}
    };

    axios
      .request(config)
      .then((response) => {
        setCompany(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const navigate = useNavigate();

  const updateCompany = (id) => {
    navigate('/company/update/' + id);
  };

  const deleteCompany = (id) => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: apiUrl + '/deletecompany/' + id,
      headers: {}
    };

    axios
      .request(config)
      .then((result) => {
        if (result.data.status === 'ok') {
          alert(result.data.message);
          getCompany();
        } else {
          alert(result.data['message']['sqlMessage']);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          sx={{
            '& .MuiTableCell-root:first-of-type': {
              pl: 2
            },
            '& .MuiTableCell-root:last-of-type': {
              pr: 3
            }
          }}
        >
          <CompantTableHead company={company} companyBy={company} />

          <TableBody>
            {company.map((row, index) => {
              return (
                <TableRow key={index}>
                  <TableCell align="left">{row.company_id}</TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.tax_no}</TableCell>
                  <TableCell align="left">{row.phone}</TableCell>
                  <TableCell align="center">{row.contact_person}</TableCell>
                  <TableCell align="left">{row.contact_number}</TableCell>
                  <TableCell align="center" sx={{ '& button': { m: 1 } }}>
                    <Button variant="contained" size="medium" color="primary" onClick={() => updateCompany(row.company_id)}>
                      <EditOutlined />
                    </Button>
                    <Button variant="contained" size="medium" color="error" onClick={() => deleteCompany(row.company_id)}>
                      <DeleteOutlined />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {company.length == 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CompanyTable;
