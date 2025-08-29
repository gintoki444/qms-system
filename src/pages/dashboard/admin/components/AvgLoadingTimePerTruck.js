import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { fetchAvgLoadingTime } from '_api/dashboardRequest';
import CompanyCodeConverter from 'components/CompanyCodeConverter';

const AvgLoadingTimePerTruck = ({ date }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!date) return;

      setLoading(true);
      setError(null);

      try {
        const result = await fetchAvgLoadingTime(date);

        // Transform the data to match the component's expected format
        const items = result.items || result;
        const transformedData = items.map((item) => ({
          company: item.product_company_name_th || item.product_company_code,
          companyCode: item.product_company_code,
          avgTime: item.avg_loading_min || 0
        }));

        setData(transformedData);
      } catch (err) {
        console.error('Error loading average loading time data:', err);
        setError('ไม่สามารถโหลดข้อมูลได้');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Card
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.1)',
          height: '100%'
        }}
      >
        <CardContent>
          <Typography>กำลังโหลดข้อมูล...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.1)',
          height: '100%'
        }}
      >
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  // Company color mapping
  // const companyColorMap = {
  //   'IF': '#d32f2f',
  //   'II': '#1976d2',
  //   'JS': '#2e7d32',
  //   'SK': '#7b1fa2'
  // };

  // Company code mapping
  const companyCodeMap = {
    IF: 'ICPF',
    II: 'ICPI',
    SK: 'SAHAI KASET',
    JS: 'JS888'
  };

  // Chart options for area chart
  const chartOptions = {
    chart: {
      type: 'area',
      height: 200,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      area: {
        fillTo: 'end'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: ['#4CAF50']
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      },
      colors: ['#4CAF50']
    },
    xaxis: {
      categories: data.map((item) => companyCodeMap[item.companyCode] || item.companyCode),
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'นาที',
        style: {
          fontSize: '12px'
        }
      },
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val, { dataPointIndex }) {
          const item = data[dataPointIndex];
          if (item) {
            const convertedCode = companyCodeMap[item.companyCode] || item.companyCode;
            return `${convertedCode}: ${val} นาที`;
          }
          return `${val} นาที`;
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 3
    }
  };

  const chartSeries = [
    {
      name: 'เวลาเฉลี่ย',
      data: data.map((item) => item.avgTime)
    }
  ];

  return (
    <Card
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 2,
        border: '1px solid rgba(0, 0, 0, 0.1)',
        height: '100%'
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AccessTimeIcon sx={{ color: 'primary.main', fontSize: 28, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Avg. Time/Truck
          </Typography>
        </Box>

        {data.length > 0 ? (
          <>
            {/* Statistics Cards Grid */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {data.slice(0, 4).map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Card
                    sx={{
                      backgroundColor: 'rgba(173, 216, 230, 0.2)',
                      borderRadius: 2,
                      border: '1px solid rgba(173, 216, 230, 0.3)',
                      height: '100%'
                    }}
                  >
                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                      <Typography
                        variant="h4"
                        sx={{
                          color: 'primary.main',
                          fontWeight: 'bold',
                          mb: 1
                        }}
                      >
                        {item.avgTime}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        นาที
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary', 
                          fontWeight: 'bold',
                          fontSize: '0.875rem' 
                        }}
                      >
                        <CompanyCodeConverter code={item.companyCode} showColor={true} />
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Area Chart */}
            <Box>
              <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={200} />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 300
            }}
          >
            <Typography color="text.secondary">ไม่มีข้อมูล</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AvgLoadingTimePerTruck;
