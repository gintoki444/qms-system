import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

import { EditOutlined, DeleteOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

// Link api url
import * as adminRequest from '_api/adminRequest';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'forkliftNo',
    align: 'center',
    width: '5%',
    disablePadding: false,
    label: 'ลำดับ'
  },
  {
    id: 'contractor_name',
    align: 'left',
    disablePadding: true,
    label: 'ชื่อสายแรงงาน'
  },
  {
    id: 'contract_company_name',
    align: 'left',
    disablePadding: false,
    label: 'สังกัด'
  },
  {
    id: 'stetus',
    align: 'center',
    disablePadding: false,
    label: 'สถานะ'
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
function ContractorsTable({ permission }) {
  //   const [car, setCar] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contractorList, setContractorList] = useState([]);

  useEffect(() => {
    getContractor();
  }, [permission]);

  const getContractor = async () => {
    setLoading(true);
    try {
      adminRequest.getAllContractors().then((response) => {
        setContractorList(response);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // ลบข้อมูล Forklift
  const [contractor, setcontractor] = useState(false);
  const [textnotify, setText] = useState('');
  const [selected, setSelected] = useState('');
  // const [changeStatus, setChangeStatus] = useState('');

  const handleClickOpen = (data, onSelect) => {
    if (onSelect === 'delete') {
      setText('ลบข้อมูล');
    } else if (onSelect === 'status') {
      if (data.status === 'A') {
        setText('ปิดการใช้งาน');
      } else {
        setText('เปิดการใช้งาน');
      }
    }
    setSelected(onSelect);
    // setChangeStatus(data.status)
    setcontractor(data);
    setOpen(true);
  };

  const handleClose = (flag) => {
    if (flag === 1) {
      if (selected === 'delete') {
        setLoading(true);
        deteteContractor(contractor.contractor_id);
      } else if (selected === 'status') {
        setLoading(true);
        ChangeStatusContractor(contractor.contractor_id);
      }
      setOpen(false);
    } else if (flag === 0) {
      setOpen(false);
    }
  };

  const ChangeStatusContractor = (id) => {
    try {
      if (contractor.status === 'A') {
        contractor.status = 'I';
      } else {
        contractor.status = 'A';
      }
      console.log(contractor)
      adminRequest.putContractor(id, contractor).then(() => {
        getContractor();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deteteContractor = (id) => {
    try {
      adminRequest.deleteContractorById(id).then(() => {
        getContractor();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  const updateContractor = (id) => {
    navigate('/admin/contractors/update/' + id);
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
              {contractorList.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{row.contractor_name}</TableCell>
                    <TableCell align="left">{row.contract_company_name}</TableCell>
                    <TableCell align="center">
                      {row.status == 'A' ? (
                        <Typography color="success" variant="body1" sx={{ color: 'green' }}>
                          <strong>ใช้งาน</strong>
                        </Typography>
                      ) : (
                        <Typography variant="body1" color="error">
                          <strong>ไม่ใช้งาน</strong>
                        </Typography>
                      )}
                    </TableCell>
                    {/* {permission.length > 0 &&  */}
                    <TableCell align="center">
                      <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Tooltip title="แก้ไข">
                          <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                            sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            onClick={() => updateContractor(row.contractor_id)}
                          >
                            <EditOutlined />
                          </Button>
                        </Tooltip>
                        <Tooltip title={row.status == 'A' ? 'ปิดการใช้งาน' : 'เปิดการใช้งาน'}>
                          <Button
                            variant="contained"
                            size="medium"
                            color={row.status === 'A' ? 'warning' : 'success'}
                            disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                            sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            onClick={() => handleClickOpen(row, 'status')}
                          >
                            {row.status == 'A' ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                            {/* <DeleteOutlined /> */}
                          </Button>
                        </Tooltip>
                        <Tooltip title="ลบ">
                          <Button
                            variant="contained"
                            size="medium"
                            color="error"
                            disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                            sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            onClick={() => handleClickOpen(row, 'delete')}
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
              {contractorList.length == 0 && (
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

export default ContractorsTable;
