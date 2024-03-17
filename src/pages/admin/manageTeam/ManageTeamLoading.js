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
    getWarehouses();
    reloading();
  }, []);

  const reloading = async () => {
    setLoading(true);
    await getAllWareHouseManagers();
    await getAllCheckers();
    await getAllForklifts();
    setLoading(false);
  };

  // =============== Get Warehouses ===============//
  const [warehouse, setWareHouse] = useState('');
  const [warehousesList, setWarehousesList] = useState([]);
  const getWarehouses = async () => {
    await adminRequest
      .getAllWareHouse()
      .then((result) => {
        setWarehousesList(result);
      })
      .catch((error) => console.log('error', error));
  };

  const handleChangeWarehouse = (e) => {
    setTeamLoadingList([]);
    setSelectManagerItems([]);
    setSelectCheckerItems([]);
    setSelectForkliftItems([]);
    getStation(e.target.value);
    setWareHouse(e.target.value);
    getTeamloading(e.target.value);
  };

  // =============== Get TeamLoanding ===============//
  const [team_id, setTeam_id] = useState('');
  const [teamloadingList, setTeamLoadingList] = useState([]);
  const getTeamloading = (id) => {
    try {
      adminRequest.getLoadingTeamByIdwh(id).then((result) => {
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeTeam = (e) => {
    getTeamManagers(e);
    setTeam_id(e);
  };

  // =============== Get Stations ===============//
  const [selectedStation, setSelectedStation] = useState('');
  const [stationsList, setStationsList] = useState([]);
  const getStation = (id) => {
    try {
      adminRequest.getStationsByWareHouse(id).then((response) => {
        setStationsList(response);
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
      await adminRequest.deleteChecker(checker_id);
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
      setCheckerId(checker_id);
      setCheckerTeamName(team_name);
      setTextNotify(testMassage);
      setOpen(true);
    }
    setFrom(fr);
  };

  const handleClose = async (flag) => {
    if (flag === 1) {
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
        <DialogTitle id="responsive-dialog-title" style={{ fontFamily: 'kanit' }}>
          {'แจ้งเตือน'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontFamily: 'kanit' }}>
            ต้องการ {textnotify}
            {/* ID:{id_update}  */}
            หรือไม่?
          </DialogContentText>
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
      <Grid container rowSpacing={1} columnSpacing={1.75}>
        <Grid item xs={12} lg={12}>
          <MainCard>
            <Grid container spacing={1}>
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

              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <InputLabel>ทีมรับสินค้า</InputLabel>
                  <FormControl>
                    <Select
                      id="team_id"
                      displayEmpty
                      value={team_id}
                      onChange={(e) => {
                        handleChangeTeam(e.target.value);
                      }}
                      input={<OutlinedInput />}
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem disabled value="">
                        เลือกทีมรับสินค้า
                      </MenuItem>
                      {teamloadingList.map((teamload) => (
                        <MenuItem key={teamload.team_id} value={teamload.team_id}>
                          {teamload.team_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
            </Grid>

            {/* ========== Row Selected Team ==========*/}
            <Grid container spacing={1} sx={{ mt: 3 }}>
              <Grid item xs={4} md={4}>
                <Grid item sx={{ mb: 1 }}>
                  <Typography variant="h5">เลือกแล้ว: หัวหน้าโกดัง</Typography>
                </Grid>
                <MainCard>
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
                      <WareHouseTableHead />
                      {!loading ? (
                        <TableBody>
                          {select_manager_items.map((row, index) => (
                            <TableRow key={row.manager_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell align="left">{row.manager_name}</TableCell>
                              <TableCell align="left">{row.team_name}</TableCell>
                              <TableCell align="left">{row.warehouse_name}</TableCell>
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

              <Grid item xs={4} md={4}>
                <Grid item sx={{ mb: 1 }}>
                  <Typography variant="h5">เลือกแล้ว: พนักงานจ่ายสินค้า</Typography>
                </Grid>
                <MainCard>
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

              <Grid item xs={4} md={4}>
                <Grid item sx={{ mb: 1 }}>
                  <Typography variant="h5">เลือกแล้ว: พนักงานโฟล์คลิฟท์</Typography>
                </Grid>
                <MainCard>
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

            {/* ========== Row Select Team ==========*/}
            <Grid container spacing={1} sx={{ mt: 3 }}>
              <Grid item xs={4} md={4}>
                <Grid item sx={{ mb: 1 }}>
                  <Typography variant="h5">เลือก: หัวหน้าโกดัง</Typography>
                </Grid>
                <MainCard>
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
                      <WareHouseTableHead />

                      {!loading ? (
                        <TableBody>
                          {allManager.map((row) => (
                            <TableRow key={row.manager_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell align="center">{row.manager_id}</TableCell>
                              <TableCell align="left">{row.manager_name}</TableCell>
                              <TableCell align="left">{row.team_name}</TableCell>
                              <TableCell align="left">{row.warehouse_name}</TableCell>
                              {/* <TableCell align="right">
                            <ButtonGroup variant="outlined" aria-label="outlined button group" size="small">
                              <Button endIcon={<SelectOutlined />}>เลือก</Button>
                            </ButtonGroup>
                          </TableCell> */}
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

              <Grid item xs={4} md={4}>
                <Grid item sx={{ mb: 1 }}>
                  <Typography variant="h5">เลือก: พนักงานจ่ายสินค้า</Typography>
                </Grid>
                <MainCard>
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

              <Grid item xs={4} md={4}>
                <Grid item sx={{ mb: 1 }}>
                  <Typography variant="h5">เลือก: พนักงานโฟล์คลิฟท์</Typography>
                </Grid>
                <MainCard>
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
    label: 'ชื่อผู้จัดการ'
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
  }
  // {
  //   id: 'action',
  //   align: 'right',
  //   width: '10%',
  //   disablePadding: false,
  //   label: 'Actions'
  // }
];

function WareHouseTableHead() {
  return (
    <TableHead>
      <TableRow>
        {warehouseHeadCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} sx={{ p: 1 }} width={headCell.width}>
            {headCell.label}
          </TableCell>
        ))}
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

function CheckerTableHead() {
  return (
    <TableHead>
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
    label: 'ชื่อพนักงานโฟล์คลิฟท์'
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

function ForkliftTableHead() {
  return (
    <TableHead>
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
