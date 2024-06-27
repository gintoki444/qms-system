import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// third party
// import * as Yup from 'yup';
import { Formik } from 'formik';

// Link api url
import * as adminRequest from '_api/adminRequest';

// material-ui
import {
  Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography, Divider, Autocomplete, TextField,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// import Chip from '@mui/material/Chip';
// import Box from '@mui/material/Box';

import MainCard from 'components/MainCard';
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function AddManageTeam() {
  const [open, setOpen] = useState(false);
  const [initialValue, setInitialValue] = useState({
    warehouse_id: '',
    team_id: '',
    manager_id: '',
    checkerData: '',
    forkLiftData: ''
  });
  const navigate = useNavigate();
  const { id } = useParams();

  // =============== Get Ware House Manager ===============//
  const [wareHouseManagerList, setWareHouseManagerList] = useState([]);
  // =============== Get Select Checker ===============//
  const [checkerList, setCheckerList] = useState([]);
  // =============== Get Select Foklifts ===============//
  const [forkliftList, setForkliftList] = useState([]);

  useEffect(() => {
    setOpen(true);
    getAllTeamCheckers();
    getAllTeamForklifts();
    getTeamLoading();
  }, []);
  // =============== Get TeamLoading by id ===============//
  const getTeamLoading = async () => {
    try {
      const getChecker = await adminRequest.getAllCheckers();
      const getManagers = await adminRequest.getAllManager();
      const getForklifts = await adminRequest.getAllForklifts();
      // const getWareHouse = await adminRequest.getAllWareHouse();
      const teamData = await adminRequest.getLoadingTeamById(id);

      setCheckers(() => {
        const data = [];
        if (getChecker.length > 0) {
          teamData.team_checkers.map((x) => {
            const setData = getChecker.find((item) => item.checker_id === x.checker_id);
            if (setData) {
              data.push(setData);
            }
          })
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
          })
        }
        return data;
      })

      setCheckerList(getChecker);
      setForkliftList(getForklifts);
      setWareHouseManagerList(getManagers);
      setInitialValue(teamData)
      setOpen(false);
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


  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values) => {
    values.checkerData = checkers;
    values.forkLiftData = forkLift;
    setOpen(true);
    console.log(values);
    // const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {
      if (values.checkerData && values.checkerData.length > 0) {
        values.checkerData.map((x) => {
          const checkData = values.team_checkers.filter((item) => item.checker_id === x.checker_id);

          console.log('checkerData checkData :', checkData)
          if (checkData.length === 0) {
            console.log(allTeamCheckers)

            const CheckTeamChecker = allTeamCheckers.filter((ft) => ft.checker_id == x.checker_id);
            console.log('CheckTeamChecker :', CheckTeamChecker)
            if (CheckTeamChecker.length > 0) {
              CheckTeamChecker.map((tcx) => {
                console.log(tcx.team_checker_id)
                deleteTeamChecker(tcx.team_checker_id);
              });
            }
            console.log('add')
            // if (values === 99999) {
            addTeamChecker(values.team_id, x.checker_id)
            // }
          }

        });
      }
      if (values.forkLiftData && values.forkLiftData.length > 0) {
        values.forkLiftData.map((x) => {
          const checkData = values.team_forklifts.filter((item) => item.forklift_id === x.forklift_id);
          console.log('forkLiftData checkData :', checkData)
          if (checkData.length === 0) {
            const CheckTeamForklift = allTeamForklifts.filter((ft) => ft.forklift_id == x.forklift_id);
            console.log('CheckTeamForklift :', CheckTeamForklift)

            if (CheckTeamForklift.length > 0) {
              CheckTeamForklift.map((tfx) => {
                deleteTeamForklift(tfx.team_forklift_id);
              });
            }
            console.log('add')
            values.forkLiftData.map((x) => addTeamForklift(values.team_id, x.forklift_id));
          }
        });
      }

      setOpen(false);
    } catch (err) {
      console.error(err);
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

  const backToPage = () => {
    navigate('/admin/manage-team-loading/');
  };
  return (
    <Grid justifyContent="space-between">
      {open && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={open}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      <Grid container rowSpacing={1} columnSpacing={1.75}>
        <Grid item xs={12} lg={9}>
          <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
            <Formik initialValues={initialValue}
              // validationSchema={validations}
              onSubmit={handleSubmits} enableReinitialize={true} >
              {({ errors, handleSubmit, isSubmitting, touched, values, setFieldValue
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
                          {/* <Select
                            id="team_id"
                            name="team_id"
                            displayEmpty
                            value={values.team_id}
                            onChange={handleChange}
                            input={<OutlinedInput />}
                            error={Boolean(touched.team_id && errors.team_id)}
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
                          </Select> */}
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
                            value={values.description}
                            error={Boolean(touched.description && errors.description)}
                          />
                          {/* <Select
                            id="warehouse_id"
                            name="warehouse_id"
                            displayEmpty
                            value={values.warehouse_id}
                            onChange={(e) => {
                              handleChangeWarhouse(e);
                              setFieldValue('warehouse_id', e.target.value);
                            }}
                            input={<OutlinedInput />}
                            error={Boolean(touched.warehouse_id && errors.warehouse_id)}
                            inputProps={{ 'aria-label': 'Without label' }}
                          >
                            <MenuItem disabled value="">
                              เลือกโกดัง
                            </MenuItem>
                            {wareHouseList.map((warehouse) => (
                              <MenuItem key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                                {warehouse.description}
                              </MenuItem>
                            ))}
                          </Select> */}
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
                                value={(selectManager.length > 0 && selectManager[0].manager_id) ||
                                  (values.team_managers ? values.team_managers[(values.team_managers.length - 1)]?.manager_id : null)}
                                input={<OutlinedInput />}
                                onChange={(e) => {
                                  handleChangeManager(e);
                                  setFieldValue('manager_id', e);
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
                                {/* wareHouseManagerList
                                <MenuItem disabled value={(selectManager.length > 0 && selectManager[0].manager_id) || ''}>
                                  {(selectManager.length > 0 && selectManager[0].manager_name) || 'เลือกหัวหน้าโกดัง'}
                                </MenuItem> */}
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
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="เลือกพนักงานจ่ายสินค้า"
                                  />
                                )}
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
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="เลือกพนักงานจ่ายสินค้า"
                                  />
                                )} _
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
                    <Grid item xs={12}>
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
                      <Button
                        size="mediam"
                        variant="contained"
                        color="error"
                        onClick={() => {
                          backToPage();
                        }}
                        startIcon={<RollbackOutlined />}
                      >
                        ยกเลิก
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
    </Grid >
  );
}

export default AddManageTeam;
