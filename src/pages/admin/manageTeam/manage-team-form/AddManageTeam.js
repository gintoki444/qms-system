import React, { useState, useEffect } from 'react';
// import {
//   useNavigate
//   // , useParams
// } from 'react-router-dom';

// third party
// import * as Yup from 'yup';
import { Formik } from 'formik';

// Link api url
import * as adminRequest from '_api/adminRequest';

// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Divider,
  Autocomplete,
  TextField,
  Backdrop,
  CircularProgress,
  Tooltip,
  Dialog,
  // DialogActions,
  DialogContent,
  DialogContentText
  // DialogTitle,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// import Chip from '@mui/material/Chip';
// import Box from '@mui/material/Box';

import MainCard from 'components/MainCard';
import { SaveOutlined, RollbackOutlined, EditOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function AddManageTeam({ id, handleClickReset }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialValue, setInitialValue] = useState({
    warehouse_id: '',
    team_id: '',
    manager_id: '',
    checkerData: '',
    forkLiftData: ''
  });
  // const navigate = useNavigate();
  // const { id } = useParams();

  // =============== Get Ware House Manager ===============//
  const [wareHouseManagerList, setWareHouseManagerList] = useState([]);
  // =============== Get Select Checker ===============//
  const [checkerList, setCheckerList] = useState([]);
  // =============== Get Select Foklifts ===============//
  const [forkliftList, setForkliftList] = useState([]);

  useEffect(() => {
    //   setOpen(true);
    //   getAllTeamCheckers();
    //   getAllTeamForklifts();
    //   getTeamLoading();
  }, [id]);
  // =============== Get TeamLoading by id ===============//
  const getTeamLoading = async (teamId) => {
    try {
      const getChecker = await adminRequest.getAllCheckers();
      const getManagers = await adminRequest.getAllManager();
      const getForklifts = await adminRequest.getAllForklifts();
      // const getWareHouse = await adminRequest.getAllWareHouse();
      const teamData = await adminRequest.getLoadingTeamById(teamId);

      setCheckers(() => {
        const data = [];
        if (getChecker.length > 0) {
          teamData.team_checkers.map((x) => {
            const setData = getChecker.find((item) => item.checker_id === x.checker_id);
            if (setData) {
              data.push(setData);
            }
          });
        }
        return data;
      });
      setForkLift(() => {
        const data = [];
        if (getForklifts.length > 0) {
          teamData.team_forklifts.map((x) => {
            const setData = getForklifts.find((item) => item.forklift_id === x.forklift_id);
            if (setData) {
              data.push(setData);
            }
          });
        }
        return data;
      });
      setCheckerList(getChecker);
      setForkliftList(getForklifts);
      setWareHouseManagerList(getManagers);
      setInitialValue(teamData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [selectManager, setSelectManager] = useState([]);
  const handleChangeManager = (e) => {
    console.log(e.target.value);
    const selectWareHouse = wareHouseManagerList.filter((x) => x.warehouse_id == e.target.value);
    setSelectManager(selectWareHouse);
  };

  const [checkers, setCheckers] = useState([]);
  const handleChangeCheckers = (event) => {
    setCheckers(event);
  };

  const [forkLift, setForkLift] = useState([]);
  const handleChangeForklift = (event) => {
    setForkLift(event);
  };
  const retryOperation = (operation, retries = 3) => {
    return new Promise((resolve, reject) => {
      const attempt = async (n) => {
        try {
          const result = await operation();
          resolve(result);
        } catch (err) {
          if (n === 1) {
            reject(err);
          } else {
            setTimeout(() => attempt(n - 1), 1000);
          }
        }
      };
      attempt(retries);
    });
  };

  const updateWareHouseManager = async (managerId, team_id) => {
    try {
      const data = {
        manager_id: managerId
      };

      await adminRequest.putTeamManager(team_id, data);
      // .then((response) => {
      //   if (response.status == 'ok') {
      //     getTeamManagers(team_id);
      //     // getTeamManagers(team_id, 'team-manager');
      //     reloading();
      //   }
      // });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== บันทึกข้อมูล ===============//
  // const handleSubmits = async (values) => {
  //   values.checkerData = checkers;
  //   values.forkLiftData = forkLift;
  //   setOpen(true);
  //   console.log(values);
  //   // const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  //   try {

  //     // Checker data processing
  //     const teamCheckerIds = values.team_checkers.map(tcx => tcx.checker_id);
  //     const checkerDataIds = values.checkerData.map(cd => cd.checker_id);

  //     const deletedCheckers = values.team_checkers.filter(tcx => !checkerDataIds.includes(tcx.checker_id));
  //     const addedCheckers = values.checkerData.filter(cd => !teamCheckerIds.includes(cd.checker_id));

  //     if (deletedCheckers.length > 0) {
  //       await Promise.all(deletedCheckers.map(tcx => retryOperation(() => deleteTeamChecker(tcx.team_checker_id))));
  //     }

  //     if (addedCheckers.length > 0) {
  //       await Promise.all(addedCheckers.map(cd => retryOperation(() => addTeamChecker(values.team_id, cd.checker_id))));
  //     }

  //     // Forklift data processing
  //     const teamForkliftIds = values.team_forklifts.map(tfx => tfx.forklift_id);
  //     const forkLiftDataIds = values.forkLiftData.map(fd => fd.forklift_id);

  //     const deletedForklifts = values.team_forklifts.filter(tfx => !forkLiftDataIds.includes(tfx.forklift_id));
  //     const addedForklifts = values.forkLiftData.filter(fd => !teamForkliftIds.includes(fd.forklift_id));

  //     if (deletedForklifts.length > 0) {
  //       await Promise.all(deletedForklifts.map(tfx => retryOperation(() => deleteTeamForklift(tfx.team_forklift_id))));
  //     }

  //     if (addedForklifts.length > 0) {
  //       await Promise.all(addedForklifts.map(fd => retryOperation(() => addTeamForklift(values.team_id, fd.forklift_id))));
  //     }

  //     if (values.checkerData && values.checkerData.length > 0) {
  //       const promises = values.checkerData.map(async (x) => {
  //         const checkData = values.team_checkers.filter((item) => item.checker_id === x.checker_id);
  //         await Promise.all(values.team_checkers.map((tcx) => {
  //           return retryOperation(() => deleteTeamChecker(tcx.team_checker_id));
  //         }));

  //         if (checkData.length === 0) {
  //           const CheckTeamChecker = allTeamCheckers.filter((ft) => ft.checker_id == x.checker_id);
  //           if (CheckTeamChecker.length > 0) {
  //             await Promise.all(CheckTeamChecker.map((tcx) => {
  //               return retryOperation(() => deleteTeamChecker(tcx.team_checker_id));
  //             }));
  //           }
  //           await retryOperation(() => addTeamChecker(values.team_id, x.checker_id));
  //         }

  //         if (checkData.length === 0) {
  //           const CheckTeamChecker = allTeamCheckers.filter((ft) => ft.checker_id == x.checker_id);
  //           if (CheckTeamChecker.length > 0) {
  //             await Promise.all(CheckTeamChecker.map((tcx) => {
  //               return retryOperation(() => deleteTeamChecker(tcx.team_checker_id));
  //             }));
  //           }
  //           await retryOperation(() => addTeamChecker(values.team_id, x.checker_id));
  //         }
  //       });

  //       try {
  //         await Promise.all(promises);
  //       } catch (error) {
  //         console.error("Error saving data:", error);
  //       }
  //       // values.checkerData.map((x) => {
  //       //   const checkData = values.team_checkers.filter((item) => item.checker_id === x.checker_id);

  //       //   console.log('checkerData checkData :', checkData)
  //       //   if (checkData.length === 0) {
  //       //     console.log(allTeamCheckers)

  //       //     const CheckTeamChecker = allTeamCheckers.filter((ft) => ft.checker_id == x.checker_id);
  //       //     console.log('CheckTeamChecker :', CheckTeamChecker)
  //       //     if (CheckTeamChecker.length > 0) {
  //       //       CheckTeamChecker.map((tcx) => {
  //       //         console.log(tcx.team_checker_id)
  //       //         deleteTeamChecker(tcx.team_checker_id);
  //       //       });
  //       //     }
  //       //     console.log('add')
  //       //     // if (values === 99999) {
  //       //     addTeamChecker(values.team_id, x.checker_id)
  //       //     // }
  //       //   }

  //       // });
  //     }
  //     if (values.forkLiftData && values.forkLiftData.length > 0) {
  //       const promises = values.forkLiftData.map(async (x) => {
  //         const forkData = values.team_forklifts.filter((item) => item.forklift_id === x.forklift_id);

  //         if (forkData.length === 0) {
  //           const CheckTeamForklifts = allTeamForklifts.filter((ft) => ft.forklift_id == x.forklift_id);
  //           if (CheckTeamForklifts.length > 0) {
  //             await Promise.all(CheckTeamForklifts.map((tcx) => {
  //               return retryOperation(() => deleteTeamForklift(tcx.team_forklift_id));
  //             }));
  //           }
  //           await retryOperation(() => addTeamForklift(values.team_id, x.forklift_id));
  //         }
  //       });

  //       try {
  //         await Promise.all(promises);
  //       } catch (error) {
  //         console.error("Error saving data:", error);
  //       }
  //       // values.forkLiftData.map((x) => {
  //       //   const checkData = values.team_forklifts.filter((item) => item.forklift_id === x.forklift_id);
  //       //   console.log('forkLiftData checkData :', checkData)
  //       //   if (checkData.length === 0) {
  //       //     const CheckTeamForklift = allTeamForklifts.filter((ft) => ft.forklift_id == x.forklift_id);
  //       //     console.log('CheckTeamForklift :', CheckTeamForklift)

  //       //     if (CheckTeamForklift.length > 0) {
  //       //       CheckTeamForklift.map((tfx) => {
  //       //         deleteTeamForklift(tfx.team_forklift_id);
  //       //       });
  //       //     }
  //       //     console.log('add')
  //       //     values.forkLiftData.map((x) => addTeamForklift(values.team_id, x.forklift_id));
  //       //   }
  //       // });
  //     }

  //     setOpen(false);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const handleSubmits = async (values) => {
    values.checkerData = checkers;
    values.forkLiftData = forkLift;
    setLoading(true);

    try {
      // Checker data processing
      if (values.manager_id) {
        await updateWareHouseManager(values.manager_id, values.team_id);
      }
      const teamCheckerIds = values.team_checkers.map((tcx) => tcx.checker_id);
      const checkerDataIds = values.checkerData.map((cd) => cd.checker_id);

      const deletedCheckers = values.team_checkers.filter((tcx) => !checkerDataIds.includes(tcx.checker_id));
      const addedCheckers = values.checkerData.filter((cd) => !teamCheckerIds.includes(cd.checker_id));

      // Delete checkers from previous teams
      if (addedCheckers.length > 0) {
        await Promise.all(
          addedCheckers.map(async (x) => {
            const CheckTeamChecker = allTeamCheckers.filter((ft) => ft.checker_id == x.checker_id);
            if (CheckTeamChecker.length > 0) {
              await Promise.all(
                CheckTeamChecker.map((tcx) => {
                  return retryOperation(() => deleteTeamChecker(tcx.team_checker_id));
                })
              );
            }
            await retryOperation(() => addTeamChecker(values.team_id, x.checker_id));
          })
        );
      }

      if (deletedCheckers.length > 0) {
        await Promise.all(deletedCheckers.map((tcx) => retryOperation(() => deleteTeamChecker(tcx.team_checker_id))));
      }

      // Forklift data processing
      const teamForkliftIds = values.team_forklifts.map((tfx) => tfx.forklift_id);
      const forkLiftDataIds = values.forkLiftData.map((fd) => fd.forklift_id);

      const deletedForklifts = values.team_forklifts.filter((tfx) => !forkLiftDataIds.includes(tfx.forklift_id));
      const addedForklifts = values.forkLiftData.filter((fd) => !teamForkliftIds.includes(fd.forklift_id));

      // Delete forklifts from previous teams
      if (addedForklifts.length > 0) {
        await Promise.all(
          addedForklifts.map(async (x) => {
            const CheckTeamForklift = allTeamForklifts.filter((ft) => ft.forklift_id == x.forklift_id);
            if (CheckTeamForklift.length > 0) {
              await Promise.all(
                CheckTeamForklift.map((tfx) => {
                  return retryOperation(() => deleteTeamForklift(tfx.team_forklift_id));
                })
              );
            }
            await retryOperation(() => addTeamForklift(values.team_id, x.forklift_id));
          })
        );
      }

      if (deletedForklifts.length > 0) {
        await Promise.all(deletedForklifts.map((tfx) => retryOperation(() => deleteTeamForklift(tfx.team_forklift_id))));
      }

      setLoading(false);
      setOpen(false);
      handleClickReset(true);
    } catch (error) {
      console.error('Error saving data:', error);
      setLoading(false);
    }
  };
  // =============== Get Checkers ===============//

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

  const addTeamChecker = async (teamId, checkerId) => {
    const currenDate = moment(new Date()).format('YYYY-MM-DD');
    const teamCheckers = {
      team_id: teamId,
      checker_id: checkerId,
      used_date: currenDate,
      status: 'A'
    };
    await adminRequest.addTeamChecker(teamCheckers).then((response) => console.log('addTeamChecker', response));
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
  const addTeamForklift = async (teamId, forkliftId) => {
    const currenDate = moment(new Date()).format('YYYY-MM-DD');
    try {
      const teamForkLift = {
        team_id: teamId,
        forklift_id: forkliftId,
        used_date: currenDate,
        status: 'A'
      };
      await adminRequest.addTeamForklifts(teamForkLift).then((response) => console.log('addTeamForklifts', response));
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

  // const backToPage = () => {
  //   navigate('/admin/manage-team-loading/');
  // };

  // const [teamData, setTeamData] = useState({});
  // const [textnotify, setText] = useState('');
  const handleClickOpen = (teamId) => {
    setOpen(true);
    setLoading(true);
    //   setOpen(true);
    // setTeamData()
    if (teamId) {
      getAllTeamCheckers();
      getAllTeamForklifts();
      getTeamLoading(teamId);
    }
  };

  const handleClose = async (flag) => {
    if (flag === 0) {
      setOpen(false);
    }
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogContent>
          <DialogContentText style={{ fontFamily: 'kanit' }}>
            {loading && (
              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
                open={loading}
              >
                <CircularProgress color="primary" />
              </Backdrop>
            )}
            <Grid justifyContent="space-between">
              <Grid container rowSpacing={0} columnSpacing={0}>
                <Grid item xs={12}>
                  <MainCard content={false} sx={{ p: 3 }}>
                    <Formik
                      initialValues={initialValue}
                      // lidations}
                      onSubmit={handleSubmits}
                      enableReinitialize={true}
                    >
                      {({
                        errors,
                        handleSubmit,
                        isSubmitting,
                        touched,
                        values,
                        setFieldValue
                        // , handleChange
                      }) => (
                        <form noValidate onSubmit={handleSubmit}>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Typography variant="h5">จัดการทีมจ่ายสินค้า</Typography>
                              <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <Stack spacing={1}>
                                <InputLabel htmlFor="departmentr">ทีมรับสินค้า :</InputLabel>
                                <FormControl>
                                  <OutlinedInput
                                    id="contractor_name"
                                    type="text"
                                    name="team_name"
                                    // onBlur={handleBlur}
                                    placeholder="ชื่อสายแรงงาน"
                                    // disabled
                                    value={values.team_name}
                                    error={Boolean(touched.contractor_name && errors.contractor_name)}
                                  />
                                </FormControl>
                                {touched.team_id && errors.team_id && (
                                  <FormHelperText error id="helper-text-team_id">
                                    {errors.team_id}
                                  </FormHelperText>
                                )}
                              </Stack>
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <Stack spacing={1}>
                                <InputLabel htmlFor="departmentr">โกดัง</InputLabel>
                                <FormControl>
                                  <OutlinedInput
                                    id="description"
                                    type="text"
                                    name="warehouse_id"
                                    // onBlur={handleBlur}
                                    placeholder="ชื่อโกดัง"
                                    // disabled
                                    value={values.team_warehouse_name}
                                    error={Boolean(touched.description && errors.description)}
                                  />
                                </FormControl>
                                {touched.warehouse_id && errors.warehouse_id && (
                                  <FormHelperText error id="helper-text-warehouse_id">
                                    {errors.warehouse_id}
                                  </FormHelperText>
                                )}
                              </Stack>
                            </Grid>

                            <Grid item xs={12} md={12}>
                              <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                  <Stack spacing={1}>
                                    <InputLabel htmlFor="departmentr">หัวหน้าโกดัง</InputLabel>
                                    <FormControl>
                                      <Select
                                        id="manager_id"
                                        name="manager_id"
                                        displayEmpty
                                        value={
                                          values.manager_id ||
                                          (selectManager.length > 0 && selectManager[0].manager_id) ||
                                          (values.team_managers ? values.team_managers[values.team_managers.length - 1]?.manager_id : null)
                                        }
                                        input={<OutlinedInput />}
                                        onChange={(e) => {
                                          handleChangeManager(e);
                                          setFieldValue('manager_id', e.target.value);
                                        }}
                                        error={Boolean(touched.manager_id && errors.manager_id)}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                      >
                                        <MenuItem disabled value="">
                                          เลือกหัวหน้าโกดัง
                                        </MenuItem>
                                        {wareHouseManagerList.map((warehouse) => (
                                          <MenuItem key={warehouse.manager_id} value={warehouse.manager_id}>
                                            {warehouse.manager_name}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                    {touched.manager_id && errors.manager_id && (
                                      <FormHelperText error id="helper-text-manager_id">
                                        {errors.manager_id}
                                      </FormHelperText>
                                    )}
                                  </Stack>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                  <Stack spacing={1}>
                                    <InputLabel id="demo-multiple-chip-label">พนักงานจ่ายสินค้า</InputLabel>
                                    <FormControl>
                                      <Autocomplete
                                        multiple
                                        id="tags-outlined"
                                        options={checkerList}
                                        getOptionLabel={(option) => option.checker_name}
                                        defaultValue={checkers}
                                        value={checkers}
                                        filterSelectedOptions
                                        name="checkerData"
                                        sx={{
                                          width: '100%',
                                          '& .MuiOutlinedInput-root': {
                                            padding: '3px 8px!important'
                                          },
                                          '& .MuiOutlinedInput-root .MuiAutocomplete-endAdornment': {
                                            right: '7px!important',
                                            top: 'calc(50% - 18px)'
                                          }
                                        }}
                                        onChange={(e, value) => {
                                          setFieldValue('checkerData', [...checkers, ...value]);
                                          handleChangeCheckers(value);
                                        }}
                                        filterOptions={(options, { inputValue }) => {
                                          const filtered = options.filter(
                                            (option) => !checkers.some((checker) => checker.checker_id === option.checker_id)
                                          );

                                          if (!inputValue) {
                                            return filtered;
                                          }

                                          return filtered.filter((option) =>
                                            option.checker_name.toLowerCase().includes(inputValue.toLowerCase())
                                          );
                                        }}
                                        renderInput={(params) => <TextField {...params} placeholder="เลือกพนักงานจ่ายสินค้า" />}
                                      />
                                      {/* <Select
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                name="checkerData"
                                value={checkers}
                                onChange={(e) => {
                                  handleChangeCheckers(e);
                                  setFieldValue('checkerData', checkers);
                                }}
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                error={Boolean(touched.checkerData && errors.checkerData)}
                                renderValue={(select) => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {select.map((value) => (
                                      <Chip key={value.checker_id} label={value.checker_name} />
                                    ))}
                                  </Box>
                                )}
                              >
                                <MenuItem disabled value="">
                                  เลือกพนักงานจ่ายสินค้า
                                </MenuItem>
                                {checkerList.map((checker) => (
                                  <MenuItem
                                    key={checker.checker_id}
                                    // value={{ id: checker.checker_id, checkerName: checker.checker_id }}
                                    value={checker}
                                  // style={getStyles(name, checkers, theme)}
                                  >
                                    {checker.checker_name}
                                  </MenuItem>
                                ))}
                              </Select> */}
                                    </FormControl>
                                    {touched.checkerData && errors.checkerData && (
                                      <FormHelperText error id="helper-text-checkerData">
                                        {errors.checkerData}
                                      </FormHelperText>
                                    )}
                                  </Stack>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                  <Stack spacing={1}>
                                    <InputLabel id="demo-multiple-chip-label">โฟล์ลิฟท์</InputLabel>
                                    <FormControl>
                                      <Autocomplete
                                        multiple
                                        id="tags-outlined"
                                        options={forkliftList}
                                        getOptionLabel={(option) => option.forklift_name}
                                        defaultValue={forkLift}
                                        value={forkLift}
                                        filterSelectedOptions
                                        name="forkLiftData"
                                        sx={{
                                          width: '100%',
                                          '& .MuiOutlinedInput-root': {
                                            padding: '3px 8px!important'
                                          },
                                          '& .MuiOutlinedInput-root .MuiAutocomplete-endAdornment': {
                                            right: '7px!important',
                                            top: 'calc(50% - 18px)'
                                          }
                                        }}
                                        onChange={(e, value) => {
                                          // setFieldValue('forkLiftData', value);
                                          handleChangeForklift(value);
                                        }}
                                        filterOptions={(options, { inputValue }) => {
                                          const filtered = options.filter(
                                            (option) => !forkLift.some((x) => x.forklift_id === option.forklift_id)
                                          );

                                          if (!inputValue) {
                                            return filtered;
                                          }

                                          return filtered.filter((option) =>
                                            option.forklift_name.toLowerCase().includes(inputValue.toLowerCase())
                                          );
                                        }}
                                        renderInput={(params) => <TextField {...params} placeholder="เลือกพนักงานจ่ายสินค้า" />}
                                        _
                                      />
                                      {/* <Select
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                name="forkLiftData"
                                value={forkLift}
                                // onChange={handleChangeForklift}
                                error={Boolean(touched.forkLiftData && errors.forkLiftData)}
                                onChange={(e) => {
                                  handleChangeForklift(e);
                                  setFieldValue('forkLiftData', forkLift);
                                }}
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                renderValue={(select) => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {select.map((value) => (
                                      <Chip key={value.forklift_id} label={value.forklift_name} />
                                    ))}
                                  </Box>
                                )}
                              >
                                <MenuItem disabled value="">
                                  เลือกโฟล์ลิฟท์
                                </MenuItem>
                                {forkliftList.map((forklift) => (
                                  <MenuItem
                                    key={forklift.forklift_id}
                                    // value={{ id: checker.checker_id, checkerName: checker.checker_id }}
                                    value={forklift}
                                  // style={getStyles(name, checkers, theme)}
                                  >
                                    {forklift.forklift_name}
                                  </MenuItem>
                                ))}
                              </Select> */}
                                    </FormControl>
                                    {touched.forkLiftData && errors.forkLiftData && (
                                      <FormHelperText error id="helper-text-forkLiftData">
                                        {errors.forkLiftData}
                                      </FormHelperText>
                                    )}
                                  </Stack>
                                </Grid>
                              </Grid>
                            </Grid>

                            {/* {permission.length > 0 && permission.add_data && ( */}
                            <Grid item xs={12} sx={{ '& button': { m: 1 } }} alignItem="center">
                              <Button
                                size="mediam"
                                variant="contained"
                                color="error"
                                onClick={() => {
                                  handleClose(0);
                                }}
                                startIcon={<RollbackOutlined />}
                              >
                                ยกเลิก
                              </Button>
                              {/* <Button color="primary" variant="contained" onClick={() => handleClose(0)} autoFocus>
                                ยกเลิก
                              </Button> */}
                              <Button
                                disableElevation
                                disabled={isSubmitting}
                                size="mediam"
                                type="submit"
                                variant="contained"
                                color="success"
                                startIcon={<SaveOutlined />}
                              >
                                บันทึกข้อมูล
                              </Button>
                            </Grid>
                            {/* )} */}
                          </Grid>
                        </form>
                      )}
                    </Formik>
                  </MainCard>
                </Grid>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>

        {/* <DialogActions align="center" sx={{ justifyContent: 'center!important', p: 2 }}>
          <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
            ยกเลิก
          </Button>
          <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
            ยืนยัน
          </Button>
        </DialogActions> */}
      </Dialog>

      <Tooltip title="แก้ไข">
        <Button
          variant="contained"
          size="medium"
          color="primary"
          sx={{ minWidth: '33px!important', p: '6px 0px' }}
          onClick={() => handleClickOpen(id)}
        >
          <EditOutlined />
        </Button>
      </Tooltip>
    </>
  );
}

export default AddManageTeam;
