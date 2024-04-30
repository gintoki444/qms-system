import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Box, ButtonGroup, Button, Tooltip, Typography, Backdrop, CircularProgress } from '@mui/material';

// Get api company
import * as companyRequest from '_api/companyRequest';

import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import MUIDataTable from 'mui-datatables';

function CompanyTable() {
  const [company, setCompany] = useState([]);
  const [open, setOpen] = useState(false);
  const userRole = useSelector((state) => state.auth?.roles);

  // const userId = useSelector((state) => state.auth.user_id);
  const userId = localStorage.getItem('user_id');

  // =============== Get Company DataTable ===============//
  const options = {
    viewColumns: false,
    print: false,
    download: false,
    selectableRows: 'none',
    elevation: 0,
    rowsPerPage: 25,
    responsive: 'standard',
    sort: false,
    rowsPerPageOptions: [25, 50, 75, 100],
    customToolbar: () => {
      return (
        <>
          {userRole && userRole !== 5 && (
            <Button size="mediam" color="success" variant="outlined" onClick={() => addCompany()} startIcon={<PlusCircleOutlined />}>
              เพิ่มข้อมูล
            </Button>
          )}
        </>
      );
    }
  };

  const columns = [
    {
      name: 'No',
      label: 'ลำดับ',
      options: {
        setCellHeaderProps: () => ({
          style: { textAlign: 'center' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'center' }
        })
      }
    },
    {
      name: 'name',
      label: 'ชื่อบริษัท'
    },
    {
      name: 'tax_no',
      label: 'เลขที่ผู้เสียภาษี',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
        // setCellProps: () => ({ style: { color: 'red', textAlign: 'center' } }),
        // setCellHeaderProps: () => ({ style: { color: 'red', textAlign: 'center' } })
      }
    },
    {
      name: 'phone',
      label: 'เบอร์โทร',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'contact_person',
      label: 'ชื่อผู้ติดต่อ',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'contact_number',
      label: 'เบอร์โทรผู้ติดต่อ',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'company_id',
      label: 'Actions',
      options: {
        customBodyRender: (value) => (
          <ButtonGroup variant="contained" aria-label="Basic button group">
            <Tooltip title="แก้ไข">
              <Button
                variant="contained"
                size="medium"
                color="primary"
                sx={{ minWidth: '33px!important', p: '6px 0px' }}
                onClick={() => updateCompany(value)}
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
                onClick={() => deleteCompany(value)}
              >
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </ButtonGroup>
        ),

        setCellHeaderProps: () => ({
          style: { textAlign: 'center' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'center' }
        })
      }
    }
  ];

  useEffect(() => {
    getCompany();
  }, [userId]);

  const getCompany = () => {
    setOpen(true);

    companyRequest
      .getAllCompanyByuserId(userId)
      .then((response) => {
        const newData = response.map((item, index) => {
          return {
            ...item,
            No: index + 1
          };
        });
        setCompany(newData);
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

  const addCompany = () => {
    // window.location = '/company/add';
    navigate('/company/add');
  };
  return (
    <Box>
      {open && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={open}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      {/* {!open && userId ? ( */}
      <MUIDataTable title={<Typography variant="h5">ข้อมูลร้านค้า/บริษัท</Typography>} data={company} columns={columns} options={options} />
      {/* ) : (
        <CircularProgress />
      )} */}
      {/* <TableContainer
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
                    <TableCell align="left">{row.tax_no ? row.tax_no : '-'}</TableCell>
                    <TableCell align="left">{row.phone ? row.phone : '-'}</TableCell>
                    <TableCell align="left">{row.contact_person ? row.contact_person : '-'}</TableCell>
                    <TableCell align="left">{row.contact_number ? row.contact_number : '-'}</TableCell>
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
      </TableContainer> */}
    </Box>
  );
}

export default CompanyTable;
