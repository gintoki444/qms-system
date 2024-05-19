import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Link api url
import * as adminRequest from '_api/adminRequest';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'forkliftNo',
    align: 'center',
    width: '15%',
    disablePadding: false,
    label: 'ลำดับ'
  },
  {
    id: 'contractor_name',
    align: 'left',
    disablePadding: true,
    label: 'ชื่อสังกัด'
  },
  {
    id: 'action',
    align: 'right',
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
function CompanyContracTable({ dataList, permission }) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyConList, setCompanyCon] = useState([]);

  useEffect(() => {
    getContractorCon();
  }, [permission]);

  const getContractorCon = async () => {
    setLoading(true);
    try {
      adminRequest.getAllCompanyContractors().then((response) => {
        setCompanyCon(response);
        dataList(response);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // ลบข้อมูล Forklift
  const [contract_company_id, setcontract_company_id] = useState(false);
  const [textnotify, setText] = useState('');

  const handleClickOpen = (contract_company_id) => {
    setcontract_company_id(contract_company_id);
    setText('ลบข้อมูล');
    setOpen(true);
  };

  const handleClose = (flag) => {
    if (flag === 1) {
      setLoading(true);
      deteteContractorCon(contract_company_id);
    } else if (flag === 0) {
      setOpen(false);
    }
  };

  const deteteContractorCon = (id) => {
    try {
      adminRequest.deleteCompanyContractors(id).then(() => {
        enqueueSnackbar('ลบข้อมูลสังกัดสำเร็จ!', { variant: 'success' });
        getContractorCon();
        setOpen(false);
      });
    } catch (error) {
      enqueueSnackbar('ลบข้อมูลสังกัดไม่สำเร็จ!', { variant: 'error' });
      console.log(error);
    }
  };

  const navigate = useNavigate();
  const updateContractorCon = (id) => {
    navigate('/admin/company-contractors/update/' + id, { state: { companyList: companyConList } });
  };

  return (
    <Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title" style={{ fontFamily: 'kanit' }}>
          {'แจ้งเตือน'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontFamily: 'kanit' }}>ต้องการ {textnotify} หรือไม่?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleClose(0)} style={{ fontFamily: 'kanit' }}>
            ยกเลิก
          </Button>
          <Button onClick={() => handleClose(1)} autoFocus style={{ fontFamily: 'kanit' }}>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
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
          <CompantTableHead />
          {!loading ? (
            <TableBody>
              {companyConList.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{row.contract_company_name}</TableCell>
                    <TableCell align="center">
                      <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Tooltip title="แก้ไข">
                          <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                            sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            onClick={() => updateContractorCon(row.contract_company_id)}
                          >
                            <EditOutlined />
                          </Button>
                        </Tooltip>
                        <Tooltip title="ลบ">
                          <Button
                            variant="contained"
                            size="medium"
                            color="error"
                            disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                            sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            onClick={() => handleClickOpen(row.contract_company_id)}
                          >
                            <DeleteOutlined />
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
                    </TableCell>
                    {/* } */}
                  </TableRow>
                );
              })}
              {companyConList.length == 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} align="center">
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

export default CompanyContracTable;
