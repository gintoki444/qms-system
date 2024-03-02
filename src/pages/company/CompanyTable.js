import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Box,
  ButtonGroup,
  Button,
  Tooltip,
  Typography,
  CircularProgress
} from '@mui/material';

// Get api company
import * as companyRequest from '_api/companyRequest';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'companyNo',
    align: 'center',
    width: '5%',
    disablePadding: false,
    label: 'ลำดับ'
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
    align: 'left',
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
    width: '10%',
    disablePadding: false,
    label: 'Actions'
  }
];

function CompantTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'} width={headCell.width}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function CompanyTable() {
  const [company, setCompany] = useState([]);
  const [open, setOpen] = useState(false);

  // const userId = useSelector((state) => state.auth.user_id);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    getCompany();
  }, [userId]);

  const getCompany = () => {
    setOpen(true);

    companyRequest
      .getAllCompanyByuserId(userId)
      .then((response) => {
        setCompany(response);
        setOpen(false);
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
    setOpen(true);
    try {
      companyRequest.deleteCompany(id).then(() => {
        getCompany();
        setOpen(false);
      });
    } catch (e) {
      console.log(e);
      setOpen(false);
    }
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
          size="small"
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

          {!open && userId ? (
            <TableBody>
              {company.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.tax_no}</TableCell>
                    <TableCell align="left">{row.phone}</TableCell>
                    <TableCell align="left">{row.contact_person}</TableCell>
                    <TableCell align="left">{row.contact_number}</TableCell>
                    <TableCell align="center">
                      <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Tooltip title="แก้ไข">
                          <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            onClick={() => updateCompany(row.company_id)}
                          >
                            <EditOutlined />
                          </Button>
                        </Tooltip>
                        <Tooltip title="ลบ">
                          <Button
                            variant="contained"
                            size="medium"
                            color="error"
                            sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            onClick={() => deleteCompany(row.company_id)}
                          >
                            <DeleteOutlined />
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
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
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                  <Typography variant="body1">Loading....</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CompanyTable;
