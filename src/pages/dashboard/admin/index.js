import { useState, useEffect } from 'react';

// material-ui
import { Box, Grid, Typography, Stack, TextField, Button } from '@mui/material';
import Tabs from '@mui/material/Tabs';

// project import
import MainCard from 'components/MainCard';
import AnalyticQueues from 'components/cards/statistics/AnlyticQueue';
// import Step1Processing from './Step1Processing';
// import Step2Processing from './Step2Processing';
// import Step3Processing from './Step3Processing';
// import Step4Processing from './Step4Processing';

// const apiUrl = process.env.REACT_APP_API_URL;
// import * as reportRequest from '_api/reportRequest';
import * as dashboardRequest from '_api/dashboardRequest';
import * as stepRequest from '_api/StepRequest';
// const apiUrl = process.env.REACT_APP_API_URL;

import moment from 'moment/min/moment-with-locales';
import OrderTable from './OrdersTable';
import IncomeAreaChart from './IncomeAreaChart';
import SummaryQueueList from './SummaryQueueList';
import QueueTab from 'components/@extended/QueueTab';

import { SearchOutlined } from '@ant-design/icons';
// ==============================|| DASHBOARD - DEFAULT ||============================== //

const AdminDashboard = () => {
  const currentDate = moment(new Date()).format('YYYY-MM-DD');
  // const getNowDate = moment(new Date()).format('YYYY-MM-DD');

  // const currentDateTH = moment().locale('th').format('LL');
  const [queueSummary, setQueueSummary] = useState({});

  // const [value, setValue] = useState('today');
  // const [slot, setSlot] = useState('week');

  // const [queue_count_completed, setQueueCountCompleted] = useState(0);
  // const [queue_count, setQueueCount] = useState(0);
  // const [queue_average_time, setQueueAgerageTime] = useState(0);

  const [selectedDate1, setSelectedDate1] = useState(currentDate);
  const [selectedDate2, setSelectedDate2] = useState(currentDate);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: selectedDate1,
    endDate: selectedDate2
  });

  useEffect(() => {
    fetchData();
    // const intervalId = setInterval(fetchData, 6000); // เรียกใช้ฟังก์ชันทุก 1 นาที (60000 มิลลิวินาที)

    // return () => clearInterval(intervalId); // ลบตัวจับเวลาเมื่อคอมโพเนนต์ถูกยกเลิก
  }, [selectedDateRange, queueSummary]);

  const fetchData = async () => {
    // getQueuesSummary();
    getQueuesSummTimes();
    getQueuesSummTimeStep2();
  };

  // const getQueuesSummary = () => {
  //   dashboardRequest.getQueuesSummary(selectedDateRange.startDate, selectedDateRange.endDate).then((response) => {
  //     setQueueSummary(response);
  //   });
  // };

  const [queueSumTime, setQueueSumTime] = useState('');
  const getQueuesSummTimes = () => {
    dashboardRequest.getQueuesSummaryTime(selectedDateRange.startDate, selectedDateRange.endDate).then((response) => {
      setQueueSumTime(response);
    });
  };

  const [queueSumTimeStep2, setQueueSumTimeStep2] = useState('');
  const getQueuesSummTimeStep2 = () => {
    dashboardRequest.getQueuesSummaryTimeStep2(selectedDateRange.startDate, selectedDateRange.endDate).then((response) => {
      setQueueSumTimeStep2(response);
    });
  };

  const handleDateChange1 = (event) => {
    setSelectedDate1(event.target.value);
    setSelectedDate2(event.target.value);
    localStorage.setItem('reserve_startDate', event.target.value);
    localStorage.setItem('reserve_endDate', event.target.value);
  };

  // const handleDateChange2 = (event) => {
  //   setSelectedDate2(event.target.value);
  //   localStorage.setItem('reserve_endDate', event.target.value);
  // };

  const handleSearch = () => {
    setSelectedDateRange({
      startDate: selectedDate1,
      endDate: selectedDate2
    });
    fetchData();
  };

  const [items, setItems] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const getProductCompany = (dataList) => {
    stepRequest.getAllProductCompany().then((response) => {

      if (response.length > 0) {
        response.map((x) => {
          let countCompany = dataList.filter(
            (i) => i.product_company_id == x.product_company_id
          ).length;

          setItems((prevState) => ({
            ...prevState,
            [x.product_company_id]: countCompany
          }));
        });
      }
      setCompanyList(response);
    });
  };
  const [valueFilter, setValueFilter] = useState(0);
  const handleChange = (newValue) => {
    setValueFilter(newValue - 1);
  };

  const handleGetData = (data) => {
    getProductCompany(data);
  }

  // const [queueSummary, setQueueSummary] = useState({});
  const handleGetSummary = async (data) => {
    const dataList = data;
    const summaryData = {
      sum_no_order: 0,
      sum_cars_count: 0,
      sum_total_quantity: 0,
      sum_total_order: 0,
    }
    if (dataList.length > 0) {
      await dataList.map((x) => {
        const setnumber = parseFloat(x.step2_total_quantity);
        summaryData.sum_no_order = summaryData.sum_no_order + (x.no_order_queues_count - x.step1_cancel_count_no_order);
        summaryData.sum_cars_count = summaryData.sum_cars_count + x.queues_counts;
        summaryData.sum_total_quantity = (summaryData.sum_total_quantity + setnumber);
        summaryData.sum_total_order = summaryData.sum_total_order + x.queues_counts_orderonly;
      })
    }
    // console.log(summaryData);
    setQueueSummary(summaryData);
  }
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <MainCard sx={{ mt: 2 }} content={true}>
          <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}
            <Grid item xs={12} sx={{ mb: -2.25 }}>
              <Typography variant="h5">แดชบอร์ด : วันที่  {moment(selectedDateRange.startDate).locale('th').format('LL')}</Typography>
            </Grid>

            <Grid item xs={12} >
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={3}>
                  <Stack spacing={1}>
                    <TextField
                      required
                      fullWidth
                      type="date"
                      id="pickup_date"
                      name="pickup_date"
                      value={selectedDate1}
                      onChange={handleDateChange1}
                      inputProps={{
                        max: currentDate
                      }}
                    // inputProps={{
                    //   min: currentDate
                    // }}
                    />
                  </Stack>
                </Grid>
                {/* <Grid item xs={12} md={3}>
                  <Stack spacing={1}>
                    <TextField
                      required
                      fullWidth
                      type="date"
                      id="pickup_date"
                      name="pickup_date"
                      value={selectedDate2}
                      onChange={handleDateChange2}
                    />
                  </Stack>
                </Grid> */}
                <Grid item xs={12} md={3}>
                  <Button size="mediam" color="primary" variant="contained" onClick={() => handleSearch()} startIcon={<SearchOutlined />}>
                    ค้นหา
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ mb: -2.25 }}>
              <Stack justifyContent="row" flexDirection="row">
                <Typography variant="h5" sx={{ p: '0 10px' }}>
                  จำนวนรถทั้งหมด :
                  <span style={{ padding: '5px 20px', margin: '10px', border: 'solid 1px #eee', borderRadius: 5 }}>
                    {queueSummary?.sum_cars_count ? queueSummary.sum_cars_count : '0'}
                  </span>
                  คัน
                </Typography>
                <Typography variant="h5" sx={{ p: '0 10px' }}>รอคำสั่งซื้อทั้งหมด :
                  <span style={{ padding: '5px 20px', margin: '10px', border: 'solid 1px #eee', borderRadius: 5 }}>
                    {queueSummary?.sum_no_order ? parseFloat(queueSummary.sum_no_order) : '0'}
                  </span>
                  คัน
                </Typography>
                <Typography variant="h5" sx={{ p: '0 10px' }}>จำนวนรถที่ได้รับคำสั่งซื้อ :
                  <span style={{ padding: '5px 20px', margin: '10px', border: 'solid 1px #eee', borderRadius: 5 }}>
                    {queueSummary?.sum_total_order ? parseFloat(queueSummary.sum_total_order) : '0'}
                  </span>
                  คัน
                </Typography>
                <Typography variant="h5" sx={{ p: '0 10px' }}> จำนวน
                  <span style={{ padding: '5px 20px', margin: '10px', border: 'solid 1px #eee', borderRadius: 5 }}>
                    {queueSummary?.sum_total_quantity ? parseFloat(queueSummary.sum_total_quantity) : '0'}
                  </span>
                  ตัน
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={7} lg={9}>
              <MainCard content={false}>
                <Box sx={{ pt: 1, pr: 2 }}>
                  {/* <IncomeAreaChart /> */}
                  <IncomeAreaChart startDate={selectedDateRange.startDate} endDate={selectedDateRange.endDate} />
                </Box>
              </MainCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <AnalyticQueues
                    title="เวลารวมทั้งหมด"
                    count={`${queueSumTime && queueSumTime?.total_duration_minutes !== null ?
                      parseFloat(queueSumTime.total_duration_minutes).toFixed(2) : '0'} นาที`}
                    extra={`${queueSumTime ? parseFloat(queueSumTime.average_minutes).toFixed(2) : '0'}`}
                    subtitle="เฉลี่ย "
                    // percentage={`${queueSumTime ? queueSumTime.average_minutes : '0'}`}
                    color="primary"
                    unit=" นาที/คิว"
                  />
                </Grid>
                <Grid item xs={12}>
                  <AnalyticQueues
                    title={`เวลาการขึ้นสินค้า : ${queueSumTimeStep2?.step2_total_duration_minutes && queueSumTimeStep2?.step2_total_duration_minutes !== null ?
                      parseFloat(queueSumTimeStep2.step2_total_duration_minutes).toFixed(2)
                      : '0'} นาที`}
                    count={`เฉลี่ย ${queueSumTimeStep2.step2_average_minutes ? parseFloat(queueSumTimeStep2.step2_average_minutes).toFixed(2) : '0'} นาที/คัน`}
                    extra={`${queueSumTimeStep2?.step2_total_quantity && queueSumTimeStep2?.step2_total_quantity !== null ? parseFloat(queueSumTimeStep2?.step2_total_quantity).toFixed(2) : '0'}`}
                    subtitle="ยอดรวมสินค้าที่จ่าย : "
                    color="warning"
                    unit=" ตัน"
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* row 2 */}
            <Grid item xs={12} md={12} lg={12}>
              <MainCard sx={{ mt: 2 }} content={false}>
                <SummaryQueueList startDate={selectedDateRange.startDate} endDate={selectedDateRange.endDate} dataList={handleGetSummary} />
              </MainCard>
            </Grid>

            {/* row 4 */}
            <Grid item xs={12} md={12} lg={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={12} >
                  <Typography variant="h4">รายการจ่ายสินค้าประจำวัน {moment(selectedDateRange.startDate).locale('th').format('LL')}</Typography>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Tabs value={valueFilter} onChange={handleChange} aria-label="company-tabs" variant="scrollable" scrollButtons="auto">
                    {companyList.length > 0 &&
                      companyList.map((company, index) => (
                        <QueueTab
                          key={index}
                          id={(company.product_company_id)}
                          numQueue={items[company.product_company_id] !== 0 ? items[company.product_company_id] : '0'}
                          txtLabel={company.product_company_name_th2}
                          onSelect={() => handleChange(company.product_company_id)}
                        />
                      ))}
                  </Tabs>
                </Grid>
              </Grid>
              <MainCard sx={{ mt: 2 }} content={false}>
                <OrderTable startDate={selectedDateRange.startDate} endDate={selectedDateRange.endDate} onFilter={valueFilter} dataList={handleGetData} />
              </MainCard>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
