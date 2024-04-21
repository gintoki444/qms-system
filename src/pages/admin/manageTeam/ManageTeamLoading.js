import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';

import {
  Grid,
  Stack,
  InputLabel,
  OutlinedInput,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button,
  CircularProgress,
  ButtonGroup
} from '@mui/material';
import MainCard from 'components/MainCard';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { SelectOutlined, CloseSquareOutlined } from '@ant-design/icons';

import moment from 'moment';

import * as adminRequest from '_api/adminRequest';

function ManageTeamLoading() {
  const [loading, setLoading] = useState(false);
  // =============== useEffect ===============//
  useEffect(() => {
    setLoading(true);
    getManagers();
    reloading();
  }, []);

  const reloading = async () => {
    setLoading(true);
    getTeamloading();
    await getAllWareHouseManagers();
    await getAllCheckers();
    await getAllForklifts();
    setLoading(false);
  };

  // =============== Get Warehouses ===============//
  const [warehouse, setWareHouse] = useState('');
  const [warehousesList, setWarehousesList] = useState([]);
  const getWarehouses = async (selectId) => {
    await adminRequest
      .getAllWareHouse()
      .then((result) => {
        console.log(
          'result filter:',
          result.filter((x) => x.warehouse_id == selectId)
        );

        setWarehousesList(result.filter((x) => x.warehouse_id == selectId));
      })
      .catch((error) => console.log('error', error));
  };

  const handleChangeWarehouse = (e) => {
    setSelectManagerItems([]);
    setSelectCheckerItems([]);
    setSelectForkliftItems([]);
    getStation(e.target.value);
    setWareHouse(e.target.value);
    // setTeamLoadingList([]);
    // getTeamloading(e.target.value);
  };

  // =============== Get TeamLoanding ===============//
  const [team_id, setTeam_id] = useState('');
  const [teamloadingList, setTeamLoadingList] = useState([]);

  const getTeamloading = () => {
    try {
      adminRequest.getAllLoadingTeamByStation().then((result) => {
        setTeamLoadingList(result);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getTeamManagers = async (id) => {
    try {
      const teamManager = await adminRequest.getTeamManager(id);
      const teamChecker = await adminRequest.getTeamChecker(id);
      const teamForklift = await adminRequest.getTeamForklift(id);

      setSelectManagerItems(teamManager);
      setSelectCheckerItems(teamChecker);
      setSelectForkliftItems(teamForklift);
      // adminRequest.getLoadingTeamById(id).then((result) => {
      //   setSelectManagerItems(result.team_managers);
      //   setSelectCheckerItems(result.team_checkers);
      //   setSelectForkliftItems(result.team_forklifts);
      // });
    } catch (error) {
      console.log(error);
    }
  };

  const [managerList, setManagerList] = useState([]);
  const getManagers = async () => {
    try {
      adminRequest.getAllManager().then((result) => {
        setManagerList(result);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeTeam = (e) => {
    const filterTeam = teamloadingList.filter((x) => x.team_id == e);
    if (filterTeam.length > 0) {
      filterTeam.map((data) => {
        getWarehouses(data.warehouse_id);
        getTeamManagers(data.team_id);
        getStation(data.warehouse_id, data.station_id);

        setWareHouse(data.warehouse_id);
        setTeam_id(e);
        setSelectedStation(data.station_id);
      });
    }
  };

  // =============== Get Stations ===============//
  const [selectedStation, setSelectedStation] = useState('');
  const [stationsList, setStationsList] = useState([]);
  const getStation = (id, selectId) => {
    try {
      adminRequest.getStationsByWareHouse(id).then((response) => {
        setStationsList(response.filter((x) => x.station_id == selectId));
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleChangeStation = (e) => {
    setSelectedStation(e.target.value);
  };

  // =============== Get WareHouse Manager ===============//
  const [allManager, setAllManager] = useState([]);
  const [select_manager_items, setSelectManagerItems] = useState([]);
  const getAllWareHouseManagers = async () => {
    try {
      await adminRequest.getAllWareHouseManager().then((response) => {
        setAllManager(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [selectManager, setSelectManager] = useState('');
  const updateWareHouseManager = async () => {
    try {
      const data = {
        manager_id: selectManager
      };

      await adminRequest.putTeamManager(team_id, data).then((response) => {
        if (response.status == 'ok') {
          getTeamManagers(team_id);
          reloading();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeManager = (e) => {
    setSelectManager(e);
  };

  // =============== Get Checker ===============//
  const [checker_items, setCheckerItems] = useState([]);
  const [select_checker_items, setSelectCheckerItems] = useState([]);
  const getAllCheckers = async () => {
    try {
      await adminRequest.getAllCheckers().then((response) => {
        setCheckerItems(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addTeamChecker = async (checker_id) => {
    const currenDate = moment(new Date()).format('YYYY-MM-DD');
    const teamCheckers = {
      team_id: team_id,
      checker_id: checker_id,
      used_date: currenDate,
      status: 'A'
    };
    await adminRequest.addTeamChecker(teamCheckers);
  };

  const deleteTeamChecker = async (checker_id) => {
    try {
      await adminRequest.deleteTeamChecker(checker_id).then((response) => {
        console.log('deleteTeamChecker', response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== Get Forklift ===============//
  const [forklift_items, setForkliftItems] = useState([]);
  const [select_forklift_items, setSelectForkliftItems] = useState([]);
  const getAllForklifts = async () => {
    try {
      await adminRequest.getAllForklifts().then((response) => {
        setForkliftItems(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addTeamForklift = async (forklift_id) => {
    const currenDate = moment(new Date()).format('YYYY-MM-DD');
    try {
      const teamForkLift = {
        team_id: team_id,
        forklift_id: forklift_id,
        used_date: currenDate,
        status: 'A'
      };
      await adminRequest.addTeamForklifts(teamForkLift);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTeamForklift = async (checker_id) => {
    try {
      await adminRequest.deleteTeamForklift(checker_id);
    } catch (error) {
      console.log(error);
    }
  };
  // =============== Handle Click ===============//
  const [open, setOpen] = React.useState(false);
  const [checker_id, setCheckerId] = useState('');
  const [checker_team_name, setCheckerTeamName] = useState('');
  const [textnotify, setTextNotify] = useState('');
  const [fr, setFrom] = useState('');

  const handleClickOpen = (checker_id, fr, team_name, testMassage) => {
    //alert("team_id: " + teamload + " checker_id: " + checker_id)
    if (team_id !== '') {
      setSelectManager('');
      setCheckerId(checker_id);
      setCheckerTeamName(team_name);
      setTextNotify(testMassage);
      setOpen(true);
    }
    setFrom(fr);
  };

  const handleClose = async (flag) => {
    if (flag === 1) {
      if (fr === 'change-manager') {
        if (selectManager) {
          updateWareHouseManager();
        } else {
          alert('กรุณาเลือกหัวหน้าโกดัง');
          return;
        }
      }
      if (fr === 'selected') {
        if (checker_team_name === null) {
          setLoading(true);
          setOpen(false);
          await addTeamChecker(checker_id);
          await getTeamManagers(team_id);
          reloading();
        } else {
          alert('พนักงานจ่ายสินค้านี้ ถูกเลือกแล้ว!');
        }
      }
      if (fr === 'selected_forklift') {
        if (checker_team_name === null) {
          setLoading(true);
          setOpen(false);
          console.log(checker_id);
          await addTeamForklift(checker_id);
          await getTeamManagers(team_id);
          reloading();
        } else {
          alert('พนักงานจ่ายสินค้านี้ ถูกเลือกแล้ว!');
        }
      }

      if (fr === 'removed') {
        setLoading(true);
        setOpen(false);
        //alert("removed")
        await deleteTeamChecker(checker_id);
        await getTeamManagers(team_id);
        reloading();
      }

      if (fr === 'removed_forklift') {
        setLoading(true);
        setOpen(false);
        await deleteTeamForklift(checker_id);
        await getTeamManagers(team_id);
        reloading();
      }
    }
    // await dataGetSelectCheckers(teamload);
    // dataGetCheckers();
    setOpen(false);
  };
  return (
    <Grid alignItems="center" justifyContent="space-between">
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        {fr !== 'change-manager' ? (
          <>
            <DialogTitle id="responsive-dialog-title">{'แจ้งเตือน'}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ต้องการ {textnotify}
                {/* ID:{id_update}  */}
                หรือไม่?
              </DialogContentText>
            </DialogContent>
          </>
        ) : (
          <>
            <DialogTitle id="responsive-dialog-title" align="center">
              <Typography variant="h5">{`เปลี่ยนหัวหน้าโกดัง "${textnotify}"`}</Typography>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={12}>
                    <Stack spacing={1} sx={{ minWidth: '300px' }}>
                      <InputLabel>เปลี่ยนหัวหน้าโกดัง</InputLabel>
                      <FormControl sx={{ width: '100%' }}>
                        <Select
                          id="manager_id"
                          displayEmpty
                          value={selectManager || ''}
                          onChange={(e) => {
                            handleChangeManager(e.target.value);
                          }}
                          input={<OutlinedInput />}
                          inputProps={{ 'aria-label': 'Without label' }}
                          fullWidth
                        >
                          <MenuItem disabled value="">
                            เลือกหัวหน้าโกดัง
                          </MenuItem>
                          {managerList.map((manager, index) => (
                            <MenuItem key={index} value={manager.manager_id}>
                              {manager.manager_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>
                </Grid>
              </DialogContentText>
            </DialogContent>
          </>
        )}
        <DialogActions align="center" sx={{ justifyContent: 'center!important' }}>
          <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
            ยกเลิก
          </Button>
          <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container rowSpacing={1} columnSpacing={1.75}>
        <Grid item xs={12} lg={12}>
          <MainCard>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <InputLabel>ทีมขึ้นสินค้า</InputLabel>
                  <FormControl>
                    <Select
                      id="team_id"
                      displayEmpty
                      value={team_id || ''}
                      onChange={(e) => {
                        handleChangeTeam(e.target.value);
                      }}
                      input={<OutlinedInput />}
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem disabled value="">
                        เลือกทีมขึ้นสินค้า
                      </MenuItem>
                      {teamloadingList.map((teamload) => (
                        <MenuItem key={teamload.team_id} value={teamload.team_id}>
                          {teamload.team_name} (โกดัง: {teamload.warehouse_name}) {teamload.station_description} ({teamload.manager_name})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <InputLabel>โกดังสินค้า</InputLabel>
                  <FormControl>
                    <Select
                      displayEmpty
                      variant="outlined"
                      value={warehouse}
                      onChange={(e) => {
                        handleChangeWarehouse(e);
                      }}
                      placeholder="เลือกโกดังสินค้า"
                      fullWidth
                    >
                      <MenuItem disabled value="">
                        โกดังสินค้า
                      </MenuItem>
                      {warehousesList &&
                        warehousesList.map((warehouses) => (
                          <MenuItem key={warehouses.warehouse_id} value={warehouses.warehouse_id}>
                            {warehouses.description}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <InputLabel>หัวจ่าย</InputLabel>
                  <FormControl>
                    <Select
                      displayEmpty
                      variant="outlined"
                      // name="reserve_station_id"
                      value={selectedStation}
                      onChange={(e) => {
                        handleChangeStation(e);
                      }}
                      placeholder="เลือกคลังสินค้า"
                      fullWidth
                    >
                      <MenuItem disabled value="">
                        เลือกหัวจ่าย
                      </MenuItem>
                      {stationsList.map((station) => (
                        <MenuItem key={station.station_id} value={station.station_id}>
                          {station.station_description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>

      {/* ========== Row Selected Team ==========*/}
      <Grid container rowSpacing={1} columnSpacing={1.75} sx={{ mt: 2 }}>
        <Grid item xs={12} lg={12}>
          <MainCard>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <Grid item sx={{ mb: 1 }}>
                  <Typography variant="h5">เลือกแล้ว: หัวหน้าโกดัง</Typography>
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
                      <WareHouseTableHead status="selected" />
                      {!loading ? (
                        <TableBody>
                          {select_manager_items.map((row, index) => (
                            <TableRow key={row.manager_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell align="left">{row.manager_name}</TableCell>
                              <TableCell align="left">{row.team_name}</TableCell>
                              <TableCell align="left">{row.warehouse_name}</TableCell>
                              <TableCell align="right">
                                <ButtonGroup variant="outlined" aria-label="outlined button group" size="small">
                                  <Button
                                    endIcon={<SelectOutlined />}
                                    onClick={() => handleClickOpen(team_id, 'change-manager', '', row.warehouse_name)}
                                  >
                                    เปลี่ยน
                                  </Button>
                                </ButtonGroup>
                              </TableCell>
                            </TableRow>
                          ))}
                          {select_manager_items.length == 0 && (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
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
                </MainCard>
              </Grid>

              <Grid item xs={12} md={4}>
                <Grid item sx={{ mb: 1 }}>
                  <Typography variant="h5">เลือกแล้ว: พนักงานจ่ายสินค้า</Typography>
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
                      <CheckerTableHead status="selected" />
                      {!loading ? (
                        <TableBody>
                          {select_checker_items.map((row, index) => (
                            <TableRow key={row.team_checker_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell align="left">{row.checker_name}</TableCell>
                              <TableCell align="left">{row.team_name}</TableCell>
                              <TableCell align="right">
                                <ButtonGroup variant="outlined" aria-label="outlined button group" size="small">
                                  <Button
                                    color="error"
                                    endIcon={<CloseSquareOutlined />}
                                    onClick={() => handleClickOpen(row.team_checker_id, 'removed', '', 'ยกเลิกพนักงาน')}
                                  >
                                    ยกเลิก
                                  </Button>
                                </ButtonGroup>
                              </TableCell>
                            </TableRow>
                          ))}
                          {select_checker_items.length == 0 && (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
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
                </MainCard>
              </Grid>

              <Grid item xs={12} md={4}>
                <Grid item sx={{ mb: 1 }}>
                  <Typography variant="h5">เลือกแล้ว: พนักงานโฟล์คลิฟท์</Typography>
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
                      <ForkliftTableHead status="selected" />
                      {!loading ? (
                        <TableBody>
                          {select_forklift_items.map((row, index) => (
                            <TableRow key={row.index}>
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell align="left">{row.forklift_name}</TableCell>
                              <TableCell align="left">{row.team_name}</TableCell>
                              <TableCell align="right">
                                <ButtonGroup variant="outlined" aria-label="outlined button group" size="small">
                                  <Button
                                    color="error"
                                    endIcon={<CloseSquareOutlined />}
                                    onClick={() => handleClickOpen(row.team_forklift_id, 'removed_forklift', '', 'ยกเลิกโฟล์คลิฟท์')}
                                  >
                                    ยกเลิก
                                  </Button>
                                </ButtonGroup>
                              </TableCell>
                            </TableRow>
                          ))}
                          {select_forklift_items.length == 0 && (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
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
                </MainCard>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>

      {/* ========== Row Select Team ==========*/}
      <Grid container rowSpacing={1} columnSpacing={1.75} sx={{ mt: 2 }}>
        <Grid item xs={12} lg={12}>
          <MainCard>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <Grid item sx={{ mb: 1 }}>
                  <Typography variant="h5">เลือก: หัวหน้าโกดัง</Typography>
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
                      <WareHouseTableHead status="select" />

                      {!loading ? (
                        <TableBody>
                          {allManager.map((row, index) => (
                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell align="left">{row.manager_name}</TableCell>
                              <TableCell align="left">{row.team_name}</TableCell>
                              <TableCell align="left">{row.warehouse_name}</TableCell>
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
              </Grid>

              <Grid item xs={12} md={4}>
                <Grid item sx={{ mb: 1 }}>
                  <Typography variant="h5">เลือก: พนักงานจ่ายสินค้า</Typography>
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
                      <CheckerTableHead />
                      {!loading ? (
                        <TableBody>
                          {checker_items.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell align="left">{row.checker_name}</TableCell>
                              <TableCell align="left">{row.team_name}</TableCell>
                              <TableCell align="right">
                                <ButtonGroup variant="outlined" aria-label="outlined button group" size="small">
                                  <Button
                                    endIcon={<SelectOutlined />}
                                    onClick={() => handleClickOpen(row.checker_id, 'selected', row.team_name, 'เลือกพนักงาน')}
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
              </Grid>

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
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </Grid>
  );
}

// ==============================|| WareHouse HEADER CELL ||============================== //
const warehouseHeadCells = [
  {
    id: 'wareHouseNo',
    align: 'center',
    width: '5%',
    disablePadding: false,
    label: 'ลำดับ'
  },
  {
    id: 'wareManagerName',
    align: 'left',
    disablePadding: true,
    label: 'ชื่อพนักงาน'
  },
  {
    id: 'wareTeamName',
    align: 'left',
    disablePadding: false,
    label: 'ชื่อทีม'
  },
  {
    id: 'wareHouseName',
    align: 'left',
    width: '10%',
    disablePadding: false,
    label: 'โกดัง'
  },
  {
    id: 'action',
    align: 'right',
    width: '10%',
    disablePadding: false,
    label: 'Actions'
  }
];

function WareHouseTableHead({ status }) {
  return (
    <TableHead style={{ backgroundColor: status == 'selected' ? 'rgb(79 167 249 / 62%)' : '#e5e5e5' }}>
      <TableRow>
        {warehouseHeadCells.map(
          (headCell) =>
            (status !== 'selected' && headCell.id === 'action') || (
              <TableCell key={headCell.id} align={headCell.align} sx={{ p: 1 }} width={headCell.width}>
                {headCell.label}
              </TableCell>
            )
        )}
      </TableRow>
    </TableHead>
  );
}

// ==============================|| Checker HEADER CELL ||============================== //
const checkerHeadCells = [
  {
    id: 'checkHouseNo',
    align: 'center',
    width: '5%',
    disablePadding: false,
    label: 'ลำดับ'
  },
  {
    id: 'checkerName',
    align: 'left',
    disablePadding: true,
    label: 'ชื่อพนักงาน'
  },
  {
    id: 'checkTeamName',
    align: 'left',
    disablePadding: false,
    label: 'ชื่อทีม'
  },
  // {
  //   id: 'checkHouseName',
  //   align: 'left',
  //   disablePadding: false,
  //   label: 'โกดัง'
  // },
  {
    id: 'action',
    align: 'right',
    width: '10%',
    disablePadding: false,
    label: 'Actions'
  }
];

function CheckerTableHead({ status }) {
  return (
    <TableHead style={{ backgroundColor: status == 'selected' ? 'rgb(79 167 249 / 62%)' : '#e5e5e5' }}>
      <TableRow>
        {checkerHeadCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} sx={{ p: 1 }} width={headCell.width}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// ==============================|| ForkLift HEADER CELL ||============================== //
const forkliftHeadCells = [
  {
    id: 'forkHouseNo',
    align: 'center',
    width: '5%',
    disablePadding: false,
    label: 'ลำดับ'
  },
  {
    id: 'forkerName',
    align: 'left',
    disablePadding: true,
    label: 'ชื่อพนักงาน'
  },
  {
    id: 'forkTeamName',
    align: 'left',
    disablePadding: false,
    label: 'ชื่อทีม'
  },
  // {
  //   id: 'forkHouseName',
  //   align: 'left',
  //   disablePadding: false,
  //   label: 'โกดัง'
  // },
  {
    id: 'action',
    align: 'right',
    width: '10%',
    disablePadding: false,
    label: 'Actions'
  }
];

function ForkliftTableHead({ status }) {
  return (
    <TableHead style={{ backgroundColor: status == 'selected' ? 'rgb(79 167 249 / 62%)' : '#e5e5e5' }}>
      <TableRow>
        {forkliftHeadCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} sx={{ p: 1 }} width={headCell.width}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
export default ManageTeamLoading;
