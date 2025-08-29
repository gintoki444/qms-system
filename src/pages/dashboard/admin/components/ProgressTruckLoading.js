import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
// import ReactApexChart from 'react-apexcharts';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { fetchProgressTruckLoading } from '_api/dashboardRequest';
import DashboardCard from './DashboardCard';
import CompanyCodeConverter from 'components/CompanyCodeConverter';
// import CompanyCodeConverter from '../../../components/CompanyCodeConverter';

const ProgressTruckLoading = ({ date }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!date) return;

      setLoading(true);
      setError(null);

      try {
        const result = await fetchProgressTruckLoading(date);
        const items = result.items || result;

        // Transform the data to match the component's expected format
        const transformedData = items.map((item, index) => ({
          company: item.product_company_code || item.product_company_name_th || `Company ${index + 1}`,
          loaded: item.finished_step2 || 0,
          total: item.total_target || 0,
          percentage: item.total_target > 0 ? Math.round((item.finished_step2 / item.total_target) * 100) : 0,
          avgLoadingMin: item.avg_loading_min || 0
        }));

        setData(transformedData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('ไม่สามารถโหลดข้อมูลได้');
        setData([]); // Set empty array when error occurs
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [date]);

  // ApexCharts configuration for donut chart
  //   const chartOptions = {
  //     chart: {
  //       type: 'donut',
  //       height: 200
  //     },
  //     labels: data && Array.isArray(data) ? data.map((item) => item.company) : [],
  //     colors: ['#2196F3', '#FF9800', '#4CAF50', '#F44336', '#9C27B0', '#607D8B'],
  //     plotOptions: {
  //       pie: {
  //         donut: {
  //           size: '60%'
  //         }
  //       }
  //     },
  //     dataLabels: {
  //       enabled: false
  //     },
  //     legend: {
  //       position: 'bottom',
  //       fontSize: '12px'
  //     },
  //     tooltip: {
  //       y: {
  //         formatter: function (
  //           value,
  //           {
  //             dataPointIndex
  //           }
  //         ) {
  //           const item = data && Array.isArray(data) ? data[dataPointIndex] : null;
  //           if (item) {
  //             const avgTime = item.avgLoadingMin ? ` (${item.avgLoadingMin.toFixed(1)} นาที)` : '';
  //             return `${value}/${item.total} คัน (${item.percentage}%)${avgTime}`;
  //           }
  //           return `${value} คัน`;
  //         }
  //       }
  //     }
  //   };

  //   const chartSeries = data && Array.isArray(data) ? data.map((item) => item.loaded) : [];

  // Show error state
  if (error) {
    return (
      <DashboardCard title="Progress Truck Loading" icon={<LocalShippingIcon sx={{ color: 'primary.main' }} />} fullHeight={true}>
        <Typography color="error">ไม่สามารถโหลดข้อมูลได้</Typography>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Progress Truck Loading"
      icon={<LocalShippingIcon sx={{ color: 'primary.main' }} />}
      isLoading={loading}
      fullHeight={true}
    >
      <Box sx={{ mb: 0 }}>
        {/* Progress Bars */}
        <Box sx={{ mb: 0 }}>
          {data && data.length > 0 ? (
            Array.isArray(data) &&
            data.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: 0.5,
                        backgroundColor: (() => {
                          // Mapping ของสีตาม Code บริษัท
                          const companyColorMap = {
                            IF: '#d32f2f',
                            II: '#1976d2',
                            JS: '#2e7d32',
                            SK: '#7b1fa2'
                          };
                          // ถ้าไม่มีสีสำหรับ Code นี้ ให้ใช้สีเดิม
                          return companyColorMap[item.company] || '#607D8B';
                        })()
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      <CompanyCodeConverter code={item.company} showColor={true} />
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.loaded}/{item.total} คัน ({item.avgLoadingMin?.toFixed(1)} นาที)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={item.percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: (() => {
                        // Mapping ของสีตาม Code บริษัท
                        const companyColorMap = {
                          IF: '#d32f2f',
                          II: '#1976d2',
                          JS: '#2e7d32',
                          SK: '#7b1fa2'
                        };
                        // ถ้าไม่มีสีสำหรับ Code นี้ ให้ใช้สีเดิม
                        return companyColorMap[item.company] || '#607D8B';
                      })()
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right', display: 'block', mt: 0.5 }}>
                  {item.percentage}%
                </Typography>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 350
              }}
            >
              <Typography color="text.secondary">ไม่มีข้อมูล</Typography>
            </Box>
          )}
        </Box>

        {/* Donut Chart */}
        {/* <Box sx={{ height: 200, display: 'flex', justifyContent: 'center' }}>
            <ReactApexChart options={chartOptions} series={chartSeries} type="donut" height={200} />
          </Box> */}
      </Box>
    </DashboardCard>
  );
};

export default ProgressTruckLoading;
