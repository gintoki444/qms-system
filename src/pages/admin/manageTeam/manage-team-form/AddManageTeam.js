import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// Link api url
import * as adminRequest from '_api/adminRequest';

// material-ui
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography, Divider, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

import MainCard from 'components/MainCard';
import { SaveOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function AddManageTeam() {
  // const lastDate = moment().endOf('year').format('YYYY-MM-DD');
  const currentDate = moment(new Date()).format('YYYY-MM-DD');
  const navigate = useNavigate();

  const initialValue = {
    used_date: currentDate,
    warehouse_id: '',
    team_id: '',
    manager_id: '',
    checkerData: '',
    forkLiftData: ''
  };

  const validations = Yup.object().shape({
    warehouse_id: Yup.string().max(255).required('กรุณาเลือกชื่อโกดัง'),
    team_id: Yup.string().max(255).required('กรุณาเลือกทีมรับสินค้า'),
    used_date: Yup.string().max(255).required('กรุณาเลือกวันที่ใช้ทีม'),
    // checkerData: Yup.array().min(1, 'Select at least one option').of(Yup.string().required('Option is required')),
    checkerData: Yup.array().required('กรุณาเลือกพนักงานจ่ายสินค้า'),
    forkLiftData: Yup.array().max(255).required('กรุณาเลือกโฟล์ลิฟท์')
  });

  useEffect(() => {
    getWareHouses();
    getTeamloading();
    getWareHousesManager();
    getChecker();
    getForklifts();
  }, []);

  // =============== Get Ware House ===============//
  const [wareHouseList, setWareHouseList] = useState([]);
  const getWareHouses = () => {
    try {
      adminRequest.getAllWareHouse().then((response) => {
        setWareHouseList(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [selectManager, setSelectManager] = useState([]);
  const handleChangeWarhouse = (e) => {
    console.log(e.target.value);
    const selectWareHouse = wareHouseManagerList.filter((x) => x.warehouse_id == e.target.value);
    setSelectManager(selectWareHouse);
  };

  // =============== Get Ware House Manager ===============//
  const [wareHouseManagerList, setWareHouseManagerList] = useState([]);
  const getWareHousesManager = () => {
    try {
      adminRequest.getAllWareHouseManager().then((response) => {
        setWareHouseManagerList(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== Get TeamLoanding ===============//
  // const [team_id, setTeamId] = useState([]);
  const [teamloadingList, setTeamLoadingList] = useState([]);
  const getTeamloading = () => {
    try {
      adminRequest.getAllLoadingTeam().then((result) => {
        setTeamLoadingList(result);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== Get Select Checker ===============//
  const [checkerList, setCheckerList] = useState([]);
  const getChecker = () => {
    try {
      adminRequest.getAllCheckers().then((result) => {
        setCheckerList(result);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [personName, setPersonName] = useState([]);
  const handleChangeChip = (event) => {
    setPersonName(event.target.value);
  };

  // =============== Get Select Foklifts ===============//
  const [forkliftList, setForkliftList] = useState([]);
  const getForklifts = () => {
    try {
      adminRequest.getAllForklifts().then((result) => {
        setForkliftList(result);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [forkLift, setForkLift] = useState([]);
  const handleChangeForklift = (event) => {
    setForkLift(event.target.value);
  };

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {
      values.start_date = currentDate;
      values.checker = personName;
      values.manager_id = selectManager[0].manager_id;

      const teamManager = {
        team_id: values.team_id,
        manager_id: values.manager_id,
        used_date: values.used_date,
        status: 'A'
      };

      // personName.map((checker) => {
      //   const teamCheckers = {
      //     team_id: values.team_id,
      //     checker_id: checker.checker_id,
      //     used_date: values.used_date,
      //     status: 'A'
      //   };
      //   console.log('teamCheckers', teamCheckers);
      // });

      // forkLift.map((forkLifts) => {
      //   const teamForkLift = {
      //     team_id: values.team_id,
      //     forklift_id: forkLifts.forklift_id,
      //     used_date: values.used_date,
      //     status: 'A'
      //   };
      //   console.log('teamForkLift', teamForkLift);
      // });

      // console.log('Submit', values);

      await adminRequest
        .addTeamManager(teamManager)
        .then(() => {
          personName.map((checker) => {
            const teamCheckers = {
              team_id: values.team_id,
              checker_id: checker.checker_id,
              used_date: values.used_date,
              status: 'A'
            };
            adminRequest.addTeamChecker(teamCheckers);
          });

          forkLift.map((forkLifts) => {
            const teamForkLift = {
              team_id: values.team_id,
              forklift_id: forkLifts.forklift_id,
              used_date: values.used_date,
              status: 'A'
            };

            adminRequest.addTeamForklift(teamForkLift);
          });

          navigate('/admin/manage-team-loading/');
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Grid justifyContent="space-between">
      <Grid container rowSpacing={1} columnSpacing={1.75}>
        <Grid item xs={12} lg={9}>
          <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
            <Formik initialValues={initialValue} validationSchema={validations} onSubmit={handleSubmits}>
              {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h5">จัดการทีมจ่ายสินค้า</Typography>
                      <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="departmentr">โกดัง</InputLabel>
                        <FormControl>
                          <Select
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
                          </Select>
                        </FormControl>
                        {touched.warehouse_id && errors.warehouse_id && (
                          <FormHelperText error id="helper-text-warehouse_id">
                            {errors.warehouse_id}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    {/* <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="departmentr">หัวจ่าย</InputLabel>
                        <FormControl>
                          <Select
                            id="warehouse_id"
                            name="warehouse_id"
                            displayEmpty
                            value={values.warehouse_id}
                            onChange={handleChange}
                            // onChange={(e) => {
                            //   handleChangeWareHouse(e);
                            //   setFieldValue('warehouse_id', e.target.value);
                            // }}
                            input={<OutlinedInput />}
                            error={Boolean(touched.warehouse_id && errors.warehouse_id)}
                            inputProps={{ 'aria-label': 'Without label' }}
                          >
                            <MenuItem disabled value="">
                              เลือกหัวจ่าย
                            </MenuItem>
                            {wareHouseList.map((warehouse) => (
                              <MenuItem key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                                {warehouse.description}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.warehouse_id && errors.warehouse_id && (
                          <FormHelperText error id="helper-text-warehouse_id">
                            {errors.warehouse_id}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid> */}

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="departmentr">ทีมรับสินค้า</InputLabel>
                        <FormControl>
                          <Select
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
                          </Select>
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
                        <InputLabel>วันที่เข้ารับสินค้า*</InputLabel>
                        <TextField
                          required
                          fullWidth
                          type="date"
                          id="used_date"
                          name="used_date"
                          onBlur={handleBlur}
                          value={values.used_date}
                          onChange={handleChange}
                          inputProps={{
                            min: currentDate
                          }}
                        />
                        {touched.used_date && errors.used_date && (
                          <FormHelperText error id="helper-text-used_date">
                            {errors.used_date}
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
                                value={(selectManager.length > 0 && selectManager[0].manager_id) || values.manager_id}
                                input={<OutlinedInput />}
                                error={Boolean(touched.manager_id && errors.manager_id)}
                                inputProps={{ 'aria-label': 'Without label' }}
                              >
                                <MenuItem disabled value={(selectManager.length > 0 && selectManager[0].manager_id) || ''}>
                                  {(selectManager.length > 0 && selectManager[0].manager_name) || 'เลือกหัวหน้าโกดัง'}
                                </MenuItem>
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
                              <Select
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                name="checkerData"
                                value={personName}
                                onChange={(e) => {
                                  handleChangeChip(e);
                                  setFieldValue('checkerData', personName);
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
                                    // style={getStyles(name, personName, theme)}
                                  >
                                    {checker.checker_name}
                                  </MenuItem>
                                ))}
                              </Select>
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
                              <Select
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
                                    // style={getStyles(name, personName, theme)}
                                  >
                                    {forklift.forklift_name}
                                  </MenuItem>
                                ))}
                              </Select>
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
  );
}

export default AddManageTeam;
