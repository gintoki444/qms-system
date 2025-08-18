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
        const currentHour = new Date().getHours();

        // Transform the data to match the component's expected format
        const transformedData = items
          .filter((item) => item.hour >= 6 && item.hour <= currentHour)
          .map((item) => ({
            hour: item.hour,
            label: item.label,
            volume: item.total_volume || 0,
            truckCount: item.truck_count || 0
          }));

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
        text: 'ปริมาณการบรรทุก (คัน)',
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
      name: 'ปริมาณการบรรทุก',
      data: data && Array.isArray(data) ? data.map((item) => item.volume) : []
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
