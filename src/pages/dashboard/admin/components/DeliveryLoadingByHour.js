import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import BarChartIcon from '@mui/icons-material/BarChart';
import { fetchLoadingVolumeByHour } from '_api/dashboardRequest';
import DashboardCard from './DashboardCard';

const DeliveryLoadingByHour = ({ date }) => {
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

        // Use result.items if available, otherwise use result directly
        const items = result.items || result;

        // Check if the date is today
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
        const isCurrentDay = date === today;

        let filteredData;

        if (isCurrentDay) {
          // For current day: filter from 6 AM to current hour
          const currentHour = new Date().getHours();
          filteredData = items.filter((item) => item.hour >= 6 && item.hour <= currentHour);
        } else {
          // For historical days: filter from first hour with data to last hour with data
          const hoursWithData = items.filter((item) => item.total_volume > 0 || item.truck_count > 0);

          if (hoursWithData.length > 0) {
            const firstHour = Math.min(...hoursWithData.map((item) => item.hour));
            const lastHour = Math.max(...hoursWithData.map((item) => item.hour));

            // Include all hours from first to last, even if some have zero data
            filteredData = items.filter((item) => item.hour >= firstHour && item.hour <= lastHour);
          } else {
            // If no data, show from 6 AM to 18 PM (6 PM) as default
            filteredData = items.filter((item) => item.hour >= 6 && item.hour <= 18);
          }
        }

        // Transform the data to match the component's expected format with English time labels
        const transformedData = filteredData.map((item) => ({
          hour: item.hour,
          label: formatHourToEnglish(item.hour),
          volume: item.total_volume || 0,
          truckCount: item.truck_count || 0
        }));

        setData(transformedData);
      } catch (err) {
        console.error('Error loading delivery loading by hour data:', err);
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
              color: '#FF9800'
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
        text: 'ปริมาณการส่งมอบ (ตัน)',
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
      colors: ['#FF9800']
    },
    tooltip: {
      y: {
        formatter: function (val, { dataPointIndex }) {
          const item = data && Array.isArray(data) ? data[dataPointIndex] : null;
          if (item) {
            return `${val} ตัน (${item.truckCount} คัน)`;
          }
          return val + ' ตัน';
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1'
    }
  };

  const chartSeries = [
    {
      name: 'ปริมาณการส่งมอบ',
      data: data && Array.isArray(data) ? data.map((item) => item.volume) : []
    }
  ];

  if (error) {
    return (
      <DashboardCard title="Delivery Loading By Hour" icon={<BarChartIcon sx={{ color: 'primary.main' }} />} fullHeight={true}>
        <Typography color="error">ไม่สามารถโหลดข้อมูลได้</Typography>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Delivery Loading By Hour"
      icon={<BarChartIcon sx={{ color: 'primary.main' }} />}
      isLoading={loading}
      fullHeight={true}
    >
      <Box sx={{ height: 300 }}>
        <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={300} />
      </Box>
    </DashboardCard>
  );
};

export default DeliveryLoadingByHour;
