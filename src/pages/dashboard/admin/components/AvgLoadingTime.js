import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { fetchAvgLoadingTimeStats } from '_api/dashboardRequest';
import DashboardCard from './DashboardCard';

const AvgLoadingTime = ({ date }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!date) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchAvgLoadingTimeStats(date);
        console.log('fetchAvgLoadingTimeStats data:', result);
        
        // Use result.items if available, otherwise use result directly
        const items = result.items || result;
        
        // Transform the data to match the component's expected format
        // Get current hour to filter data
        const currentHour = new Date().getHours();
        
        // Filter out hours 1-7 (01:00 - 07:00) and hours greater than current time
        const transformedData = items
          .filter((item) => item.hour >= 6 && item.hour <= currentHour) // Only include hours 6 and above, but not exceeding current hour
          .map((item) => ({
            hour: item.hour,
            label: item.label,
            truckCount: item.truck_count || 0,
            totalVolume: item.total_volume || 0
          }));
        
        setData({ items: transformedData });
      } catch (err) {
        console.error('Error loading average loading time stats data:', err);
        setError('ไม่สามารถโหลดข้อมูลได้');
        setData({ items: [] }); // Set empty object with items array when error occurs
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [date]);

  const chartOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: ['#2196F3']
    },
    markers: {
      size: 6,
      colors: ['#2196F3'],
      strokeColors: '#ffffff',
      strokeWidth: 2,
      hover: {
        size: 8
      }
    },
    xaxis: {
      categories: data && data.items && Array.isArray(data.items) ? data.items.map(item => item.label) : [],
      title: {
        text: 'เวลา'
      },
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'ปริมาณการบรรทุก (ตัน)'
      },
      labels: {
        style: {
          fontSize: '12px'
        }
      },
      min: 0
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 3
    },
    tooltip: {
      y: {
        formatter: function (val, { dataPointIndex }) {
          const item = data && data.items && Array.isArray(data.items) ? data.items[dataPointIndex] : null;
          if (item) {
            return `${val} ตัน (${item.truckCount} คัน)`;
          }
          return val;
        }
      }
    },
    dataLabels: {
      enabled: false
    }
  };

  const chartSeries = [
    {
      name: 'ปริมาณการบรรทุก',
      data: data && data.items && Array.isArray(data.items) ? data.items.map(item => item.totalVolume) : []
    }
  ];

  if (error) {
    return (
      <DashboardCard 
        title="Loading Volume By hour"
        icon={<AccessTimeIcon sx={{ color: 'primary.main' }} />}
        fullHeight={true}
      >
        <Typography color="error">ไม่สามารถโหลดข้อมูลได้</Typography>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Loading Volume By hour"
      icon={<AccessTimeIcon sx={{ color: 'primary.main' }} />}
      isLoading={loading}
      fullHeight={true}
    >
        {/* Line Chart */}
        <Box sx={{ height: 300 }}>
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="line"
            height={300}
          />
        </Box>
      </DashboardCard>
    );
  };

export default AvgLoadingTime;
