import { useState, useEffect } from 'react';

// material-ui
import { Box, Grid, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import AnalyticQueues from 'components/cards/statistics/AnlyticQueue';
import Step1Processing from './Step1Processing';
import Step2Processing from './Step2Processing';
import Step3Processing from './Step3Processing';
import Step4Processing from './Step4Processing';

// const apiUrl = process.env.REACT_APP_API_URL;
import * as reportRequest from '_api/reportRequest';
const apiUrl = process.env.REACT_APP_API_URL;

import moment from 'moment/min/moment-with-locales';
import OrderTable from './OrdersTable';
import IncomeAreaChart from './IncomeAreaChart';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const AdminDashboard = () => {
  const currentDate = moment().locale('th').format('LL');
  const getNowDate = moment(new Date()).format('YYYY-MM-DD');

  // const [value, setValue] = useState('today');
  // const [slot, setSlot] = useState('week');

  const [queue_count_completed, setQueueCountCompleted] = useState(0);
  const [queue_count, setQueueCount] = useState(0);
  const [queue_average_time, setQueueAgerageTime] = useState(0);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 6000); // เรียกใช้ฟังก์ชันทุก 1 นาที (60000 มิลลิวินาที)

    return () => clearInterval(intervalId); // ลบตัวจับเวลาเมื่อคอมโพเนนต์ถูกยกเลิก
  }, []);

  const fetchData = async () => {
    getQueuesCount();
    getQueuesCompleted();
    getQueuesAverageTime();
    dataGetReserves();
  };

  const getQueuesCount = () => {
    reportRequest.getQueuesCounts(getNowDate).then((response) => {
      setQueueCount(response.queue_count);
    });
  };

  const getQueuesCompleted = () => {
    reportRequest.getQueuesCountCompleted(getNowDate).then((response) => {
      setQueueCountCompleted(response.queue_count);
    });
  };

  const getQueuesAverageTime = () => {
    reportRequest.getQueuesAverageTime(getNowDate).then((response) => {
      setQueueAgerageTime(response['average_minutes']);
    });
  };
  const [items, setItems] = useState([]);

  const dataGetReserves = async () => {
    fetch(apiUrl + '/allreserves')
      .then((res) => res.json())
      .then((result) => {
        setTimeout(() => {
          setItems(result.filter((x) => x.status === 'waiting'));
          //setLoading(false);
        }, 100);
      });
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sm={10} md={10} lg={10}>
        <MainCard sx={{ mt: 2 }} content={true}>
          <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}
            <Grid item xs={12} sx={{ mb: -2.25 }}>
              <Typography variant="h5">แดชบอร์ด : วันที่ {currentDate}</Typography>
            </Grid>

            <Grid item xs={12} md={7} lg={9}>
              <MainCard content={false}>
                <Box sx={{ pt: 1, pr: 2 }}>
                  {/* <IncomeAreaChart /> */}
                  <IncomeAreaChart />
                </Box>
              </MainCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <AnalyticQueues
                    title="จำนวนคิวรับสินค้า"
                    count={`${queue_count_completed}/${queue_count}`}
                    // percentage={59.3}
                    extra={`${parseFloat((queue_average_time * 1).toFixed(0)).toLocaleString('en-US')}`}
                    subtitle="เฉลี่ย "
                    percentage={`${((queue_count_completed / queue_count) * 100).toFixed(0)}`}
                    color="primary"
                    unit=" นาที/คิว"
                  />
                </Grid>
                <Grid item xs={12}>
                  <AnalyticQueues
                    title="จำนวนการจอง"
                    count={`${items.length}`}
                    // percentage={59.3}
                    extra={'ยังไม่ได้ออกคิว'}
                    // subtitle=" "
                    // percentage={((queue_count_completed / queue_count) * 100).toFixed(0)}
                    color="warning"
                    // unit=" นาที/คิว"
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* row 2 */}
            {/* <Grid item xs={12} md={12} lg={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="h5">{moment().locale('th').format('LLLL')}</Typography>
                </Grid>
              </Grid>
              <MainCard content={false} sx={{ mt: 1.5 }}>
                <Box sx={{ pt: 1, pr: 2 }}></Box>
              </MainCard>
            </Grid> */}

            {/* row 3 */}
            <Grid item xs={12} md={12} lg={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="h4">กำลังให้บริการ (ชั่งเบา-Step1)</Typography>
                </Grid>
                <Grid item />
              </Grid>
              <MainCard sx={{ mt: 2 }} content={false}>
                <Step1Processing />
              </MainCard>
            </Grid>

            {/* row 4 */}
            <Grid item xs={12} md={12} lg={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  {' '}
                  <Typography variant="h4">หัวจ่ายที่กำลังขึ้นสินค้า (ขึ้นสินค้า-Step2)</Typography>
                </Grid>
                <Grid item />
              </Grid>
              <MainCard sx={{ mt: 2 }} content={false}>
                <Step2Processing />
              </MainCard>
            </Grid>

            {/* row 5 */}
            <Grid item xs={12} md={12} lg={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  {' '}
                  <Typography variant="h4">กำลังให้บริการ (ชั่งหนัก-Step3)</Typography>
                </Grid>
                <Grid item />
              </Grid>
              <MainCard sx={{ mt: 2 }} content={false}>
                <Step3Processing />
              </MainCard>
            </Grid>

            {/* row 6 */}
            <Grid item xs={12} md={12} lg={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  {' '}
                  <Typography variant="h4">กำลังให้บริการ (เสร็จสิ้น-Step4)</Typography>
                </Grid>
                <Grid item />
              </Grid>
              <MainCard sx={{ mt: 2 }} content={false}>
                <Step4Processing />
              </MainCard>
            </Grid>

            {/* row 4 */}
            <Grid item xs={12} md={12} lg={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="h4">รายการจ่ายสินค้าประจำวัน {moment().locale('th').format('LL')}</Typography>
                </Grid>
                <Grid item />
              </Grid>
              <MainCard sx={{ mt: 2 }} content={false}>
                {/* <OrdersTable /> */}
                <OrderTable startDate={getNowDate} endDate={getNowDate} />
              </MainCard>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
