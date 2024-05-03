import React, { useState, useRef } from 'react';

import { Grid, Box, TextField, Button, Stack, Divider, Tooltip } from '@mui/material';
import MainCard from 'components/MainCard';
// import OrderSumQtyTable from './OrderSumQtyTable';

import moment from 'moment';
import { SearchOutlined, FileExcelOutlined } from '@ant-design/icons';

import { useDownloadExcel } from 'react-export-table-to-excel';

// import CarsTimeInOutTable from './CarsTimeInOutTable';
import StepRecallsTable from './StepRecallsTable';
// import { Tooltip } from '../../../../node_modules/@mui/material/index';

function StepRecalls() {
  // ======= Export file excel =======;
  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'report-step-recall',
    sheet: moment(new Date()).format('DD-MM-YYYY')
  });

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
  return (
    <Grid alignItems="center" justifyContent="space-between">
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
            <MainCard
              title={'ตารางข้อมูลการทวนสอบ'}
              content={false}
              sx={{ mt: 1.5 }}
              secondary={
                <Tooltip title="Export Excel">
                  <Button color="success" variant="contained" sx={{ fontSize: '18px', minWidth: '', p: '6px 10px' }} onClick={onDownload}>
                    <FileExcelOutlined />
                  </Button>
                </Tooltip>
              }
            >
              <Divider></Divider>
              <Box sx={{ pt: 1, pr: 2 }}>
                <StepRecallsTable startDate={selectedDateRange.startDate} endDate={selectedDateRange.endDate} clickDownload={tableRef} />
              </Box>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default StepRecalls;