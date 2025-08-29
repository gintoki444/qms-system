import React, {
  useState,
  useEffect
} from 'react';
import { Grid, Typography, Stack, TextField, Button, Tabs, Box, CircularProgress } from '@mui/material';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
// import AnalyticQueues from 'components/cards/statistics/AnlyticQueue';
import ProgressTruckLoading from './components/ProgressTruckLoading';
import LoadingVolumeByHour from './components/LoadingVolumeByHour';
import TopItems from './components/TopItems';
// import AvgLoadingTime from './components/AvgLoadingTime';
import OperationSummary from './components/OperationSummary';
import LoadingVolumeCompany from './components/LoadingVolumeCompany';
import AvgLoadingTimePerTruck from './components/AvgLoadingTimePerTruck';
import DeliveryLoadingByHour from './components/DeliveryLoadingByHour';
import WarehousePaymentTotal from './components/WarehousePaymentTotal';
import SummaryQueueList from './SummaryQueueList';
import OrderTable from './OrdersTable';
import QueueTab from 'components/@extended/QueueTab';
import * as stepRequest from '_api/StepRequest';
import { filterProductCom } from 'components/Function/FilterProductCompany';
import moment from 'moment/min/moment-with-locales';

const DashboardNew = () => {
  const currentDate = moment(new Date()).format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [valueFilter, setValueFilter] = useState(0);
  const [dataFilter, setDataFilter] = useState(1);
  const [companyList, setCompanyList] = useState([]);
  const [items, setItems] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSearch = () => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    
    // Simulate loading time
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    
    // Simulate loading time
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleChange = (newValue, proId) => {
    setValueFilter(newValue);
    setDataFilter(proId);
  };

  // Function to get product companies and count items
  const getProductCompany = async (dataList) => {
    try {
      const response = await stepRequest.getAllProductCompany(); // รอการดึงข้อมูลจาก API
      console.log('response getAllProductCompany :', response);
      const companyList = await filterProductCom(response); // รอการเรียงลำดับ

      if (response.length > 0) {
        response.map((x) => {
          let countCompany = dataList.filter((i) => i.product_company_id == x.product_company_id).length;

          setItems((prevState) => ({
            ...prevState,
            [x.product_company_id]: countCompany
          }));
        });
      }
      setCompanyList(companyList);
      return companyList;
    } catch (error) {
      console.error('Error fetching product companies:', error);
      return [];
    }
  };

  // Load data when component mounts and when date changes
  useEffect(() => {
    // Initialize with empty data
    setItems({});
    setCompanyList([]);
  }, [selectedDate]);

  
  const handleGetData = (data) => {
    getProductCompany(data);
  };

  // const [queueSummary, setQueueSummary] = useState({});
  const handleGetSummary = async (data) => {
    const dataList = data;
    const summaryData = {
      sum_no_order: 0,
      sum_cars_count: 0,
      sum_total_quantity: 0,
      sum_total_order: 0
    };

    const summaryTime = {
      step2_total_duration_minutes: 0,
      step2_cars_count: 0,
      step2_average_minutes: 0,
      step2_total_quantity: 0
    };
    if (dataList.length > 0) {
      await dataList.map((x) => {
        const setnumber = x.total_quantity_orderonly ? parseFloat(x.total_quantity_orderonly) : 0;
        summaryData.sum_no_order = summaryData.sum_no_order + (x.no_order_queues_count - x.step1_cancel_count_no_order);
        summaryData.sum_cars_count = summaryData.sum_cars_count + (x.queues_counts - x.step1_cancel_count);
        summaryData.sum_total_quantity = summaryData.sum_total_quantity + setnumber;
        summaryData.sum_total_order = summaryData.sum_total_order + x.queues_counts_orderonly;

        summaryTime.step2_total_duration_minutes = summaryTime.step2_total_duration_minutes + x.step2_total_duration_minutes2 * 1;
        summaryTime.step2_cars_count = summaryTime.step2_cars_count + x.step2_cars_count;
        summaryTime.step2_average_minutes = summaryTime.step2_total_duration_minutes / summaryTime.step2_cars_count;
        summaryTime.step2_total_quantity = summaryTime.step2_total_quantity + x.step2_total_quantity * 1;
      });
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Loading Overlay */}
      {isRefreshing && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            borderRadius: 1
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
              กำลังโหลดข้อมูล...
            </Typography>
          </Box>
        </Box>
      )}
      
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <MainCard sx={{ mt: 2 }} content={true}>
          <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* Header */}
            <Grid item xs={12} sx={{ mb: -2.25 }}>
              <Typography variant="h5">แดชบอร์ดใหม่ : วันที่ {moment(selectedDate).locale('th').format('LL')}</Typography>
            </Grid>

            {/* Date Filter */}
            <Grid item xs={12}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={3}>
                  <Stack spacing={1}>
                    <TextField
                      required
                      fullWidth
                      type="date"
                      id="pickup_date"
                      name="pickup_date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      inputProps={{
                        max: currentDate
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={3} sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    size="medium" 
                    color="primary" 
                    variant="contained" 
                    onClick={handleSearch} 
                    startIcon={<SearchOutlined />}
                    disabled={isRefreshing}
                  >
                    ค้นหา
                  </Button>
                  <Button 
                    size="medium" 
                    color="secondary" 
                    variant="outlined" 
                    onClick={handleRefresh} 
                    startIcon={isRefreshing ? <CircularProgress size={16} /> : <ReloadOutlined />}
                    disabled={isRefreshing}
                  >
                    รีเฟรช
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* Operation Summary */}
            <Grid item xs={12}>
              <OperationSummary date={selectedDate} key={`operation-${refreshKey}`} />
            </Grid>
          </Grid>
          <Grid container rowSpacing={4.5} columnSpacing={2.75} sx={{ mt: 0.5 }}>
            {/* Top Row - Main Charts */}
            <Grid item xs={12} md={12} lg={3}>
              <ProgressTruckLoading date={selectedDate} key={`progress-${refreshKey}`} />
            </Grid>

            <Grid item xs={12} md={12} lg={4.5}>
              <LoadingVolumeByHour date={selectedDate} key={`loading-hour-${refreshKey}`} />
            </Grid>

            <Grid item xs={12} md={12} lg={4.5}>
              <DeliveryLoadingByHour date={selectedDate} key={`delivery-hour-${refreshKey}`} />
            </Grid>

            {/* Second Row - Statistics */}
            {/* <Grid item xs={12} md={12} lg={4.5} sx={{ height: '100%' }}>
              <Box sx={{ height: '100%' }}>
                <AvgLoadingTime date={selectedDate} />
              </Box>
            </Grid> */}
          </Grid>

          <Grid container rowSpacing={4.5} columnSpacing={2.75} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TopItems date={selectedDate} key={`top-items-${refreshKey}`} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4.5}>
              <LoadingVolumeCompany date={selectedDate} key={`loading-company-${refreshKey}`} />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4.5}>
              <AvgLoadingTimePerTruck date={selectedDate} key={`avg-loading-${refreshKey}`} />
            </Grid>
          </Grid>

          {/* Warehouse Payment Total */}
          <Grid container rowSpacing={4.5} columnSpacing={2.75} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={12} lg={12}>
              <WarehousePaymentTotal date={selectedDate} key={`warehouse-${refreshKey}`} />
            </Grid>
          </Grid>

          {/* Summary Queue List */}
          <Grid container rowSpacing={4.5} columnSpacing={2.75} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={12} lg={12}>
              <MainCard sx={{ mt: 2 }} content={false}>
                <SummaryQueueList 
                  startDate={selectedDate} 
                  endDate={selectedDate} 
                  dataList={handleGetSummary}
                  key={`summary-${refreshKey}`}
                />
              </MainCard>
            </Grid>
          </Grid>

          {/* Order Table with Company Tabs */}
          <Grid container rowSpacing={4.5} columnSpacing={2.75} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={12} lg={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={12}>
                  <Typography variant="h4">
                    รายการจ่ายสินค้าประจำวัน {moment(selectedDate).locale('th').format('LL')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Tabs 
                    value={valueFilter} 
                    onChange={handleChange} 
                    aria-label="company-tabs" 
                    variant="scrollable" 
                    scrollButtons="auto"
                  >
                    {companyList.length > 0 &&
                      companyList.map((company, index) => (
                        <QueueTab
                          key={index}
                          id={company.product_company_id}
                          numQueue={items[company.product_company_id] !== 0 ? items[company.product_company_id] : '0'}
                          txtLabel={company.product_company_name_th2}
                          onSelect={() => handleChange(index, company.product_company_id)}
                        />
                      ))}
                  </Tabs>
                </Grid>
              </Grid>
              <MainCard sx={{ mt: 2 }} content={false}>
                <OrderTable
                  startDate={selectedDate}
                  endDate={selectedDate}
                  onFilter={dataFilter}
                  dataList={handleGetData}
                  key={`order-table-${refreshKey}`}
                />
              </MainCard>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
    </Box>
  );
};

export default DashboardNew;
