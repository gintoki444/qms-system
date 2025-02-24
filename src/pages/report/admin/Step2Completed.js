import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { Grid, Box, TextField, Button, Stack, Alert, Backdrop, CircularProgress } from '@mui/material';
import MainCard from 'components/MainCard';
import moment from 'moment';
import { SearchOutlined, FileExcelOutlined } from '@ant-design/icons';

import StepCompletedForm from './step-forms/StepCompletedForm';
import SelectCompany from 'components/selector/SelectCompany';
import { useDownloadExcel } from 'react-export-table-to-excel';

function Step2Completed() {
  const pageId = 31;
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

  // ฟังก์ชันรับค่า company ที่เลือกจาก SelectCompany
  const [selectedCompanyId, setSelectedCompanyId] = useState(99);
  const handleCompanySelect = (companyId) => {
    setSelectedCompanyId(companyId);
  };
  const [filterName, setFilterName] = useState('ทั้งหมด');
  const handleFilterName = (name) => {
    setFilterName(name);
  };
  useEffect(() => {
    setLoading(true);
    if (Object.keys(userPermission).length > 0) {
      setLoading(false);
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission]);

  // ======= Export file excel =======;
  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `step2-summary-${filterName}`,
    sheet: moment(new Date()).format('DD-MM-YYYY')
  });
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
        <Grid item xs={12} md={12} lg={12}>
          <Stack spacing={2} sx={{ width: '100%' }}>
            <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
              <TextField
                required
                fullWidth
                type="date"
                id="pickup_date1"
                name="pickup_date1"
                value={selectedDate1}
                onChange={handleDateChange1}
                sx={{ flex: 1 }}
              />
              <TextField
                required
                fullWidth
                type="date"
                id="pickup_date2"
                name="pickup_date2"
                value={selectedDate2}
                onChange={handleDateChange2}
                sx={{ flex: 1 }}
              />
              <SelectCompany
                onSelect={handleCompanySelect}
                value={selectedCompanyId}
                filterName={handleFilterName}
                // sx={{ flex: 2 }} // ขยายให้กว้างกว่า date fields
              />
              <Button
                size="medium"
                color="primary"
                variant="contained"
                onClick={handleSearch}
                startIcon={<SearchOutlined />}
                // sx={{ flex: 1, minWidth: 100 }}
              >
                ค้นหา
              </Button>
              <Button color="success" variant="contained" sx={{ fontSize: '18px', minWidth: '', p: '6px 10px' }} onClick={onDownload}>
                <FileExcelOutlined />
              </Button>
            </Stack>
          </Stack>
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
                <MainCard content={false} sx={{ mt: 1.5 }}>
                  <Box sx={{ pt: 1, pr: 2 }}>
                    <StepCompletedForm
                      stepId={2}
                      startDate={selectedDateRange.startDate}
                      endDate={selectedDateRange.endDate}
                      companySelect={selectedCompanyId}
                      clickDownload={tableRef}
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

export default Step2Completed;
