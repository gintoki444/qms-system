import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import BarChartIcon from '@mui/icons-material/BarChart';
import { fetchLoadingVolumeByHour } from '_api/dashboardRequest';
import DashboardCard from './DashboardCard';

const LoadingVolumeByHour = ({ date }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to convert hour to English time format
  const formatHourToEnglish = (hour) => {
    if (hour === 0) return '12:00 AM';
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return '12:00 PM';
    return `${hour - 12}:00 PM`;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!date) return;

      setLoading(true);
      setError(null);

      try {
        const result = await fetchLoadingVolumeByHour(date);
        console.log('Loading volume by hour data received:', result);

        // Use result.items if available, otherwise use result directly
        const items = result.items || result;
        
        // Check if the date is today
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
        const isCurrentDay = date === today;
        
        console.log('Selected date:', date, 'Today (Thailand):', today, 'Is current day:', isCurrentDay);
        
        let filteredData;
        
        if (isCurrentDay) {
          // For current day: filter from 6 AM to current hour
          const currentHour = new Date().getHours();
          filteredData = items.filter((item) => item.hour >= 6 && item.hour <= currentHour);
          console.log('Current day filtering: 6 AM to', currentHour, 'Filtered data count:', filteredData.length);
        } else {
          // For historical days: filter from first hour with data to last hour with data
          const hoursWithData = items.filter((item) => item.total_volume > 0 || item.truck_count > 0);
          console.log('Hours with data:', hoursWithData.map(h => h.hour));
          
          if (hoursWithData.length > 0) {
            const firstHour = Math.min(...hoursWithData.map(item => item.hour));
            const lastHour = Math.max(...hoursWithData.map(item => item.hour));
            
            console.log('Historical filtering: from hour', firstHour, 'to hour', lastHour);
            
            // Include all hours from first to last, even if some have zero data
            filteredData = items.filter((item) => item.hour >= firstHour && item.hour <= lastHour);
            console.log('Historical filtered data count:', filteredData.length);
          } else {
            // If no data, show from 6 AM to 18 PM (6 PM) as default
            filteredData = items.filter((item) => item.hour >= 6 && item.hour <= 18);
            console.log('No data found, using default range 6-18. Filtered data count:', filteredData.length);
          }
        }

        // Transform the data to match the component's expected format with English time labels
        const transformedData = filteredData.map((item) => ({
          hour: item.hour,
          label: formatHourToEnglish(item.hour),
          volume: item.total_volume || 0,
          truckCount: item.truck_count || 0
        }));

        console.log('Final transformed data:', transformedData);
        setData(transformedData);
      } catch (err) {
        console.error('Error loading loading volume by hour data:', err);
        setError('ไม่สามารถโหลดข้อมูลได้');
        setData([]); // Set empty array when error occurs
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [date]);

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: 4,
        colors: {
          ranges: [
            {
              from: 0,
              to: 1000,
              color: '#2196F3'
            }
          ]
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: data && Array.isArray(data) ? data.map((item) => item.label) : [],
      title: {
        text: 'เวลา'
      }
    },
    yaxis: {
      title: {
        text: 'จำนวนรถ (คัน)',
        style: {
          fontFamily: 'Noto Sans Thai',
          fontSize: '14px',
          fontWeight: '600'
        }
      },
      min: 0,
      tickAmount: 6
    },
    fill: {
      opacity: 1,
      colors: ['#2196F3']
    },
    tooltip: {
      y: {
        formatter: function (val, { dataPointIndex }) {
          const item = data && Array.isArray(data) ? data[dataPointIndex] : null;
          if (item) {
            return `${val} คัน (${item.volume} ตัน)`;
          }
          return val + ' คัน';
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1'
    }
  };

  const chartSeries = [
    {
      name: 'จำนวนรถ',
      data: data && Array.isArray(data) ? data.map((item) => item.truckCount) : []
    }
  ];

  if (error) {
    return (
      <DashboardCard title="Loading Volume By hour" icon={<BarChartIcon sx={{ color: 'primary.main' }} />} fullHeight={true}>
        <Typography color="error">ไม่สามารถโหลดข้อมูลได้</Typography>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Loading Volume By hour" icon={<BarChartIcon sx={{ color: 'primary.main' }} />} isLoading={loading} fullHeight={true}>
      <Box sx={{ height: 300 }}>
        <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={300} />
      </Box>
    </DashboardCard>
  );
};

export default LoadingVolumeByHour;
