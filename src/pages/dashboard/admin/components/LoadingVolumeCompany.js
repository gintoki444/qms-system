import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { fetchLoadingVolumeCompany } from '_api/dashboardRequest';
// import CompanyCodeConverter from 'components/CompanyCodeConverter';

const LoadingVolumeCompany = ({ date }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!date) return;

      setLoading(true);
      setError(null);

      try {
        const result = await fetchLoadingVolumeCompany(date);
        console.log('Loading volume company data:', result);

        // Transform the data to match the chart's expected format
        const items = result.items || [];
        const transformedData = items.map((item) => ({
          company: item.product_company_name_th || item.product_company_code,
          companyCode: item.product_company_code,
          volume: item.total_qty || 0
        }));

        setData(transformedData);
      } catch (err) {
        console.error('Error loading loading volume company data:', err);
        setError('ไม่สามารถโหลดข้อมูลได้');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [date]);

  if (error) {
    return (
      <Card sx={{ 
        backgroundColor: 'background.paper', 
        boxShadow: 3, 
        border: 'none',
        height: '100%'
      }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            ปริมาณการบรรทุกรายบริษัท
          </Typography>
          <Typography color="error">ไม่สามารถโหลดข้อมูลได้</Typography>
        </CardContent>
      </Card>
    );
  }

  // Company color mapping
  const companyColorMap = {
    'IF': '#d32f2f',
    'II': '#1976d2',
    'JS': '#2e7d32',
    'SK': '#7b1fa2'
  };

  // Company code mapping
  const companyCodeMap = {
    'IF': 'ICPF',
    'II': 'ICPI',
    'SK': 'SAHAI KASET',
    'JS': 'JS888'
  };

  // Chart options
  const chartOptions = {
    chart: {
      type: 'pie',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '0%'
        },
        offsetY: 0
      }
    },
    // dataLabels: {
    //   enabled: true,
    //   formatter: function (val, opts) {
    //     const item = data[opts.dataPointIndex];
    //     if (item) {
    //       return `${parseFloat(item.volume).toFixed(1)}`;
    //     }
    //     return val.toFixed(1);
    //   },
    //   style: {
    //     fontSize: '12px',
    //     fontWeight: 500,
    //     color: '#ffffff'
    //   }
    // },
    stroke: {
      width: 2,
      colors: ['#ffffff']
    },
    fill: {
      opacity: 1,
      colors: data.map(item => companyColorMap[item.companyCode] || '#607D8B')
    },
    tooltip: {
      y: {
        formatter: function (val, { dataPointIndex }) {
          const item = data[dataPointIndex];
          if (item) {
            const percentage = ((val / data.reduce((sum, d) => sum + d.volume, 0)) * 100).toFixed(1);
            const convertedCode = companyCodeMap[item.companyCode] || item.companyCode;
            return `${convertedCode}: ${val.toLocaleString()} ตัน (${percentage}%)`;
          }
          return val;
        }
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      markers: {
        width: 12,
        height: 12
      },
      formatter: function (seriesName, opts) {
        const item = data[opts.seriesIndex];
        if (item) {
          return companyCodeMap[item.companyCode] || item.companyCode;
        }
        return seriesName;
      }
    },
    labels: data.map((item) => companyCodeMap[item.companyCode] || item.companyCode),
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  const chartSeries = data.map((item) => item.volume);

  return (
    <Card sx={{ 
      backgroundColor: 'background.paper', 
      boxShadow: 3, 
      border: 'none',
      height: '100%'
    }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          ปริมาณการบรรทุกรายบริษัท
        </Typography>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: 350 
          }}>
            <Typography>กำลังโหลดข้อมูล...</Typography>
          </Box>
        ) : data.length > 0 ? (
          <Box>
            <ReactApexChart options={chartOptions} series={chartSeries} type="pie" height={350} />
          </Box>
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
      </CardContent>
    </Card>
  );
};

export default LoadingVolumeCompany;
