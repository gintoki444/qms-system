import React, {
  useState,
  useEffect
  // , useRef
} from 'react';
import { useSelector } from 'react-redux';

import { Grid, Box, TextField, Button, Stack, Divider, Tooltip, Alert, Backdrop, CircularProgress } from '@mui/material';
import MainCard from 'components/MainCard';
// import OrderSumQtyTable from './OrderSumQtyTable';

import moment from 'moment';
import { SearchOutlined, FileExcelOutlined } from '@ant-design/icons';

// import { useDownloadExcel } from 'react-export-table-to-excel';
import ExportStepRecall from '../export/ExportStepRecall';

// import CarsTimeInOutTable from './CarsTimeInOutTable';
import StepRecallsTable from './StepRecallsTable';
// import { Tooltip } from '../../../../node_modules/@mui/material/index';

function StepRecalls() {
  const pageId = 28;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  const [loading, setLoading] = useState(false);
  const [pageDetail, setPageDetail] = useState([]);

  const currentDate = moment(new Date()).format('YYYY-MM-DD');

  const [selectedDate1, setSelectedDate1] = useState(currentDate);
  const [selectedDate2, setSelectedDate2] = useState(currentDate);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: currentDate,
    endDate: currentDate
  });
  const handleDateChange1 = (event) => {
    setSelectedDate1(event.target.value);
  };

  const handleDateChange2 = (event) => {
    setSelectedDate2(event.target.value);
  };

  const handleSearch = () => {
    setSelectedDateRange({
      startDate: selectedDate1,
      endDate: selectedDate2
    });
  };

  useEffect(() => {
    setLoading(true);
    if (Object.keys(userPermission).length > 0) {
      setLoading(false);
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission]);

  // ======= Export file excel =======;
  const [itemList, setItemList] = useState([]);
  const handleDataList = (data) => {
    if (data.length > 0) {
      setItemList(data);
    }
  };
  // const tableRef = useRef(null);
  // const { onDownload } = useDownloadExcel({
  //   currentTableRef: tableRef.current,
  //   filename: 'report-step-recall',
  //   sheet: moment(new Date()).format('DD-MM-YYYY')
  // });
  const handleExport = (data) => {
    ExportStepRecall(data);
  };
  return (
    <Grid alignItems="center" justifyContent="space-between">
      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      <Grid container rowSpacing={1} columnSpacing={1.75}>
        <Grid item xs={12} md={12}>
          <Grid container rowSpacing={1} columnSpacing={1.75}>
            <Grid item xs={3}>
              <Stack spacing={1}>
                <TextField
                  required
                  fullWidth
                  type="date"
                  id="pickup_date"
                  name="pickup_date"
                  value={selectedDate1}
                  onChange={handleDateChange1}
                  // inputProps={{
                  //   min: currentDate
                  // }}
                />
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Stack spacing={1}>
                <TextField
                  required
                  fullWidth
                  type="date"
                  id="pickup_date"
                  name="pickup_date"
                  value={selectedDate2}
                  onChange={handleDateChange2}
                  // inputProps={{
                  //   min: currentDate
                  // }}
                />
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Button size="mediam" color="primary" variant="contained" onClick={() => handleSearch()} startIcon={<SearchOutlined />}>
                ค้นหา
              </Button>
            </Grid>
          </Grid>
          <Grid item>
            {Object.keys(userPermission).length > 0 &&
              (pageDetail.length === 0 || (pageDetail.length !== 0 && pageDetail[0].permission_name === 'no_access_to_view_data')) && (
                <Grid item xs={12}>
                  <MainCard content={false}>
                    <Stack sx={{ width: '100%' }} spacing={2}>
                      <Alert severity="warning">คุณไม่มีสิทธิ์ใช้เข้าถึงข้อมูลนี้</Alert>
                    </Stack>
                  </MainCard>
                </Grid>
              )}
            {pageDetail.length !== 0 &&
              (pageDetail[0].permission_name !== 'view_data' ||
                pageDetail[0].permission_name !== 'manage_everything' ||
                pageDetail[0].permission_name !== 'add_edit_delete_data') && (
                <MainCard
                  title={'ตารางข้อมูลการทวนสอบ'}
                  content={false}
                  sx={{ mt: 1.5 }}
                  secondary={
                    <Tooltip title="Export Excel">
                      <Button
                        color="success"
                        variant="contained"
                        disabled={itemList.length <= 0}
                        sx={{ fontSize: '18px', minWidth: '', p: '6px 10px' }}
                        // onClick={onDownload}
                        onClick={() => handleExport(itemList)}
                      >
                        <FileExcelOutlined />
                      </Button>
                    </Tooltip>
                  }
                >
                  <Divider></Divider>
                  <Box sx={{ pt: 1, pr: 2 }}>
                    <StepRecallsTable
                      startDate={selectedDateRange.startDate}
                      endDate={selectedDateRange.endDate}
                      dataList={handleDataList}
                      // clickDownload={tableRef}
                    />
                  </Box>
                </MainCard>
              )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default StepRecalls;
