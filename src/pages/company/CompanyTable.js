import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import {
  Box,
  ButtonGroup,
  Button,
  Tooltip,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Backdrop,
  CircularProgress
} from '@mui/material';

// Get api company
import * as companyRequest from '_api/companyRequest';

import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import MUIDataTable from 'mui-datatables';

function CompanyTable({ permission }) {
  const { enqueueSnackbar } = useSnackbar();
  const [company, setCompany] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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
          {permission && (permission === 'manage_everything' || permission === 'add_edit_delete_data') && (
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
                disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
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
                disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                sx={{ minWidth: '33px!important', p: '6px 0px' }}
                onClick={() => handleClickOpen(value)}
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
  }, [userId, permission]);

  const getCompany = () => {
    setLoading(true);

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
        setLoading(false);
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
    setLoading(true);
    try {
      companyRequest.deleteCompany(id).then((response) => {
        if (response.status != 'error') {
          enqueueSnackbar('ลบข้อมูลร้านค้า/บริษัทสำเร็จ!', { variant: 'success' });
          setCompany([]);
          getCompany();
        } else {
          enqueueSnackbar('ลบข้อมูลร้านค้า/บริษัทไม่สำเร็จ! เนื่องจากมีการใช้งานอยู่!', { variant: 'error' });
          setLoading(false);
        }
      });
    } catch (e) {
      console.log(e);
      enqueueSnackbar('ลบข้อมูลร้านค้า/บริษัทไม่สำเร็จ! เนื่องจากมีการใช้งานอยู่!', { variant: 'error' });
      setLoading(false);
    }
  };

  const addCompany = () => {
    navigate('/company/add');
  };

  // HadleClick Popup
  const [company_id, setCompany_id] = useState('');
  const [textnotify, setText] = useState('');

  const handleClickOpen = (company_id) => {
    setCompany_id(company_id);
    setText('ลบข้อมูลบริษัท');
    setOpen(true);
  };

  const handleClose = (flag) => {
    if (flag === 1) {
      setLoading(true);
      setOpen(false);

      deleteCompany(company_id);
    } else if (flag === 0) {
      setOpen(false);
    }
  };
  return (
    <Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title" style={{ fontFamily: 'kanit' }} align="center">
          {'แจ้งเตือน'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontFamily: 'kanit' }}>
            ต้องการ{' '}
            <strong>
              <span style={{ color: '#000' }}>{textnotify}</span>
            </strong>{' '}
            หรือไม่?
          </DialogContentText>
        </DialogContent>

        <DialogActions align="center" sx={{ justifyContent: 'center!important', p: 2 }}>
          <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
            ยกเลิก
          </Button>
          <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      <MUIDataTable title={<Typography variant="h5">ข้อมูลร้านค้า/บริษัท</Typography>} data={company} columns={columns} options={options} />
    </Box>
  );
}

export default CompanyTable;
