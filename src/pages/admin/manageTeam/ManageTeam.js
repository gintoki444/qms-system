import React, { useState, useEffect } from 'react';

import MUIDataTable from 'mui-datatables';

import { Grid, Typography, ButtonGroup, Button, Tooltip, CircularProgress } from '@mui/material';
import MainCard from 'components/MainCard';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { SelectOutlined, CloseSquareOutlined } from '@ant-design/icons';
import * as adminRequest from '_api/adminRequest';
import moment from 'moment';

function ManageTeam({ teamId, onHandleChange, permission }) {
  const [loading, setLoading] = useState(false);
  // =============== useEffect ===============//
  useEffect(() => {
    getAllTeamCheckers();
    getAllTeamForklifts();
    reloading();
  }, [teamId, onHandleChange, permission]);

  const getMuiTheme = () =>
    createTheme({
      components: {
        MUIDataTableToolbar: {
          styleOverrides: {
            root: {
              backgroundColor: '#FF0000'
            }
          }
        }
      }
    });
  const reloading = async () => {
    setLoading(true);
    getAllWareHouseManagers();
    getAllCheckers();
    getAllForklifts();
    setLoading(false);
  };
  // =============== Get WareHouse Manager ===============//
  const managerOptions = {
    viewColumns: false,
    print: false,
    download: false,
    selectableRows: 'none',
    elevation: 0,
    rowsPerPage: 30,
    responsive: 'standard',
    rowsPerPageOptions: [10, 20, 30, 40, 50],
    customHeader: {
      background: 'linear-gradient(to right, #4b6cb7, #182848)',
      color: '#fff'
    }
  };

  const managerColumns = [
    {
      name: 'No',
      label: 'ลำดับ'
    },
    {
      name: 'manager_name',
      label: 'ชื่อพนักงาน'
    },
    {
      name: 'team_name',
      label: 'ชื่อทีม'
    },
    {
      name: 'warehouse_name',
      label: 'โกดัง'
    }
  ];

  const [allManager, setAllManager] = useState([]);
  const getAllWareHouseManagers = async () => {
    try {
      await adminRequest.getAllWareHouseManager().then((response) => {
        const newData = response.map((item, index) => {
          return {
            ...item,
            No: index + 1
          };
        });
        setAllManager(newData);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== Get Checker ===============//
  const [selectedRowsChecker, setSelectedRowsChecker] = useState([]);
  const handleRowSelecChecker = (currentRowsSelected, allRowsSelected) => {
    setSelectedRowsChecker(allRowsSelected.map((row) => row.dataIndex));
  };
  const checkerOptions = {
    viewColumns: false,
    print: false,
    download: false,
    elevation: 0,
    rowsPerPage: 30,
    responsive: 'standard',
    rowsPerPageOptions: [10, 20, 30, 40, 50],
    customHeader: {
      background: 'linear-gradient(to right, #4b6cb7, #182848)',
      color: '#fff'
    },
    onRowSelectionChange: handleRowSelecChecker,
    customToolbarSelect: () => {
      return (
        <Grid align="center" sx={{ pr: '20px' }}>
          <ButtonGroup variant="outlined" aria-label="outlined button group" size="small" align="center">
            <Tooltip title="เลือกพนักงาน">
              <Button
                sx={{ fontSize: 18 }}
                disabled={!teamId || (permission !== 'manage_everything' && permission !== 'add_edit_delete_data')}
                onClick={() => handleClickOpen(selectedRowsChecker, 'selected', 'เลือกพนักงานจ่ายสินค้า')}
              >
                <SelectOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="ยกเลิกพนักงาน">
              <Button
                align="center"
                color="error"
                sx={{ fontSize: 18 }}
                disabled={!teamId || (permission !== 'manage_everything' && permission !== 'add_edit_delete_data')}
                onClick={() => handleClickOpen(selectedRowsChecker, 'removed', 'ยกเลิกพนักงาน')}
              >
                <CloseSquareOutlined />
              </Button>
            </Tooltip>
            ยกเลิก
          </ButtonGroup>
        </Grid>
      );
    }
  };

  const checkerColumns = [
    {
      name: 'No',
      label: 'ลำดับ'
    },
    {
      name: 'checker_name',
      label: 'ชื่อพนักงาน'
    },
    {
      name: 'team_name',
      label: 'ชื่อทีม',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    }
  ];

  const [allCheckers, setAllCheckers] = useState([]);
  const getAllCheckers = async () => {
    try {
      await adminRequest.getAllCheckers().then((response) => {
        const newData = response.map((item, index) => {
          return {
            ...item,
            No: index + 1
          };
        });
        setAllCheckers(newData);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [allTeamCheckers, setAllTeamCheckers] = useState([]);
  const getAllTeamCheckers = async () => {
    try {
      await adminRequest.getAllTeamCheckers().then((response) => {
        setAllTeamCheckers(response);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const addTeamChecker = async (teamCheckers) => {
    await adminRequest.addTeamChecker(teamCheckers);
    // .then((response) => {
    //   console.log('addTeamChecker :', response);
    // });
  };

  const deleteTeamChecker = async (checker_id) => {
    try {
      await adminRequest.deleteTeamChecker(checker_id);
      // .then((response) => {
      //   console.log('deleteTeamChecker', response);
      // });
    } catch (error) {
      console.log(error);
    }
  };
  // =============== Get Forklift ===============//
  const [selectedRowsForklift, setSelectedRowsForklift] = useState([]);
  const handleRowSelecForklift = (currentRowsSelected, allRowsSelected) => {
    setSelectedRowsForklift(allRowsSelected.map((row) => row.dataIndex));
  };
  const forkliftOptions = {
    viewColumns: false,
    print: false,
    download: false,
    elevation: 0,
    rowsPerPage: 30,
    responsive: 'standard',
    rowsPerPageOptions: [10, 20, 30, 40, 50],
    customHeader: {
      background: 'linear-gradient(to right, #4b6cb7, #182848)',
      color: '#fff'
    },
    onRowSelectionChange: handleRowSelecForklift,
    customToolbarSelect: () => {
      return (
        <Grid align="center" sx={{ pr: '20px' }}>
          <ButtonGroup variant="outlined" aria-label="outlined button group" size="small" align="center">
            <Tooltip title="เลือก">
              <Button
                disabled={!teamId}
                sx={{ fontSize: 18 }}
                onClick={() => handleClickOpen(selectedRowsForklift, 'selected_forklift', 'เลือกพนักงานโฟล์คลิฟท์')}
              >
                <SelectOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="ยกเลิก">
              <Button
                align="center"
                color="error"
                sx={{ fontSize: 18 }}
                onClick={() => handleClickOpen(selectedRowsForklift, 'removed_forklift', 'ยกเลิกพนักงานโฟล์คลิฟท์')}
              >
                <CloseSquareOutlined />
              </Button>
            </Tooltip>
            ยกเลิก
          </ButtonGroup>
        </Grid>
      );
    }
  };
  const forkliftColumns = [
    {
      name: 'No',
      label: 'ลำดับ'
    },
    {
      name: 'forklift_name',
      label: 'ชื่อพนักงาน'
    },
    {
      name: 'team_name',
      label: 'ชื่อทีม',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    }
  ];
  const [allForklift, setAllForklift] = useState([]);
  const getAllForklifts = async () => {
    try {
      await adminRequest.getAllForklifts().then((response) => {
        const newData = response.map((item, index) => {
          return {
            ...item,
            No: index + 1
          };
        });
        setAllForklift(newData);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [allTeamForklifts, setAllTeamForklifts] = useState([]);
  const getAllTeamForklifts = async () => {
    try {
      await adminRequest.getAllTeamForklifts().then((response) => {
        setAllTeamForklifts(response);
        // console.log(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addTeamForklift = async (teamForklifts) => {
    try {
      await adminRequest.addTeamForklifts(teamForklifts);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTeamForklift = async (forklift_id) => {
    try {
      await adminRequest.deleteTeamForklift(forklift_id);
    } catch (error) {
      console.log(error);
    }
  };
  // =============== handle Click ===============//
  const [open, setOpen] = useState(false);
  const [selectData, setSelectData] = useState('');
  const [textnotify, setTextNotify] = useState('');
  const [fr, setFrom] = useState('');

  const handleClickOpen = (data, fr, massage) => {
    // console.log(data);
    setSelectData(data);
    setTextNotify(massage);
    setOpen(true);
    setFrom(fr);
  };

  const [onSaves, setOnSaves] = useState(false);
  const handleClose = async (flag) => {
    const currenDate = moment(new Date()).format('YYYY-MM-DD');
    if (flag === 1) {
      if (fr === 'selected') {
        setOpen(true);
        setOnSaves(true);
        await selectData.map((x) => {
          const CheckTeamChecker = allTeamCheckers.filter((ft) => ft.checker_id == allCheckers[x].checker_id);
          if (CheckTeamChecker.length > 0) {
            CheckTeamChecker.map((x) => {
              deleteTeamChecker(x.team_checker_id);
            });
          }

          const teamCheckers = {
            team_id: teamId,
            checker_id: allCheckers[x].checker_id,
            used_date: currenDate,
            status: 'A'
          };
          addTeamChecker(teamCheckers);
        });

        onHandleChange(true);
        await reloading();
        setOpen(false);
        setOnSaves(false);
      }

      if (fr === 'removed') {
        setOpen(true);
        setOnSaves(true);
        await selectData.map((x) => {
          const CheckTeamChecker = allTeamCheckers.filter((ft) => ft.checker_id == allCheckers[x].checker_id);
          if (CheckTeamChecker.length > 0) {
            CheckTeamChecker.map((x) => {
              deleteTeamChecker(x.team_checker_id);
            });
          }
        });
        onHandleChange(true);
        await reloading();
        setOpen(false);
        setOnSaves(false);
      }

      if (fr === 'selected_forklift') {
        setOpen(true);
        setOnSaves(true);
        await selectData.map((x) => {
          const CheckTeamForklift = allTeamForklifts.filter((ft) => ft.forklift_id == allForklift[x].forklift_id);
          if (CheckTeamForklift.length > 0) {
            CheckTeamForklift.map((x) => {
              deleteTeamForklift(x.team_forklift_id);
            });
          }

          const teamForkLift = {
            team_id: teamId,
            forklift_id: allForklift[x].forklift_id,
            used_date: currenDate,
            status: 'A'
          };
          addTeamForklift(teamForkLift);
        });

        onHandleChange(true);
        await reloading();
        setOpen(false);
        setOnSaves(false);
      }

      if (fr === 'removed_forklift') {
        setOpen(true);
        setOnSaves(true);
        await selectData.map((x) => {
          const CheckTeamForklift = allTeamForklifts.filter((ft) => ft.forklift_id == allForklift[x].forklift_id);

          if (CheckTeamForklift.length > 0) {
            CheckTeamForklift.map((x) => {
              deleteTeamForklift(x.team_forklift_id);
            });
          }
        });
        onHandleChange(true);
        await reloading();
        setOpen(false);
        setOnSaves(false);
      }
    } else if (flag === 0) {
      setOpen(false);
    }
    // await dataGetSelectCheckers(teamload);
    // dataGetCheckers();
    // setOpen(false);
  };
  return (
    <Grid alignItems="center" justifyContent="space-between">
      <Dialog open={open} onClose={handleClose} sx={{ minWidth: '300px', minHeight: '200px' }} aria-labelledby="responsive-dialog-title">
        {!onSaves ? (
          <>
            <DialogTitle id="responsive-dialog-title">
              <Typography variant="h5" color="initial">
                แจ้งเตือน
              </Typography>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                ต้องการ
                {textnotify}
                {/* ID:{id_update}  */}
                หรือไม่?
              </DialogContentText>
            </DialogContent>
            <DialogActions align="center" sx={{ justifyContent: 'center!important' }}>
              <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
                ยกเลิก
              </Button>
              <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
                ยืนยัน
              </Button>
            </DialogActions>
          </>
        ) : (
          <DialogContent>
            <DialogContentText>
              <CircularProgress color="primary" />
            </DialogContentText>
          </DialogContent>
        )}
      </Dialog>
      {/* ========== Row Select Team ==========*/}

      <Grid container rowSpacing={1} columnSpacing={1.75} sx={{ mt: 2 }}>
        <Grid item xs={12} lg={12} alignItems="center">
          {!loading ? (
            <MainCard>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={4}>
                  <MainCard boxShadow={true} contentSX={{ p: 0 }}>
                    <ThemeProvider theme={getMuiTheme()}></ThemeProvider>
                    <MUIDataTable
                      title={<Typography variant="h5">ข้อมูลหัวหน้าโกดัง</Typography>}
                      data={allManager}
                      columns={managerColumns}
                      options={managerOptions}
                    />
                  </MainCard>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <MainCard boxShadow={true} contentSX={{ p: 0 }}>
                    <MUIDataTable
                      title={<Typography variant="h5">ข้อมูลพนักงานจ่ายสินค้า</Typography>}
                      data={allCheckers}
                      columns={checkerColumns}
                      options={checkerOptions}
                    />
                  </MainCard>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <MainCard boxShadow={true} contentSX={{ p: 0 }}>
                    <MUIDataTable
                      title={<Typography variant="h5">ข้อมูลพนักงานโฟล์คลิฟท์</Typography>}
                      data={allForklift}
                      columns={forkliftColumns}
                      options={forkliftOptions}
                    />
                  </MainCard>
                </Grid>

                {/*
              <Grid item xs={12} md={4}>
                <Grid item sx={{ mb: 1 }}>
                  <Typography variant="h5">เลือก: พนักงานโฟล์คลิฟท์</Typography>
                </Grid>
                <MainCard boxShadow={true} contentSX={{ p: 0 }}>
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
                      <ForkliftTableHead />
                      {!loading ? (
                        <TableBody>
                          {forklift_items.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell align="left">{row.forklift_name}</TableCell>
                              <TableCell align="left">{row.team_name}</TableCell>
                              <TableCell align="right">
                                <ButtonGroup variant="outlined" aria-label="outlined button group" size="small">
                                  <Button
                                    endIcon={<SelectOutlined />}
                                    onClick={() => handleClickOpen(row.forklift_id, 'selected_forklift', row.team_name, 'เลือกโฟล์คลิฟท์')}
                                  >
                                    เลือก
                                  </Button>
                                </ButtonGroup>
                              </TableCell>
                            </TableRow>
                          ))}
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
                </MainCard>
              </Grid> */}
              </Grid>
            </MainCard>
          ) : (
            <CircularProgress color="primary" />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ManageTeam;
