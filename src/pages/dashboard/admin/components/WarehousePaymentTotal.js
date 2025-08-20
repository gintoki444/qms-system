import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { fetchLoadingVolumeWarehouse } from '_api/dashboardRequest';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DashboardCard from './DashboardCard';

const WarehousePaymentTotal = ({ date }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!date) return;

      setLoading(true);
      setError(null);

      try {
        const result = await fetchLoadingVolumeWarehouse(date);

        // Store the full API response
        setApiResponse(result);

        // Transform the data to match the chart's expected format
        const items = result.items || result || [];
        const transformedData = items.map((item) => ({
          warehouse: item.warehouse_name || 'Unknown Warehouse',
          warehouseId: item.warehouse_id,
          totalQuantity: parseFloat(item.total_qty || 0)
        }));

        setData(transformedData);
      } catch (err) {
        console.error('Error loading warehouse payment data:', err);
        setError('ไม่สามารถโหลดข้อมูลได้');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [date]);

  // Warehouse color mapping based on warehouse_id
  const warehouseColorMap = {
    1: '#607D8B', // ไม่ระบุ
    2: '#2196F3', // A1
    3: '#4CAF50', // A2
    4: '#FF9800', // A3
    5: '#F44336', // A4
    6: '#9C27B0', // A5
    7: '#795548', // A5
    8: '#FF5722'  // A6
  };

  // Chart options for bar chart
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        borderRadius: 4
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
    fill: {
      opacity: 1,
      colors: data.map((item) => warehouseColorMap[item.warehouseId] || '#607D8B')
    },
    tooltip: {
      y: {
        formatter: function (val, { dataPointIndex }) {
          const item = data[dataPointIndex];
          if (item) {
            return `${item.warehouse}: ${val.toLocaleString()} ตัน`;
          }
          return val.toLocaleString() + ' ตัน';
        }
      }
    },
    legend: {
      show: false
    },
    xaxis: {
      categories: data.map((item) => item.warehouse),
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'ปริมาณรวม (ตัน)',
        style: {
          fontSize: '14px'
        }
      },
      labels: {
        formatter: function (val) {
          return val.toLocaleString();
        }
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '10px'
              }
            }
          }
        }
      }
    ]
  };

  const chartSeries = [
    {
      name: 'ปริมาณรวม',
      data: data.map((item) => item.totalQuantity)
    }
  ];

  // Calculate summary statistics
  const totalQuantity = data.reduce((sum, item) => sum + item.totalQuantity, 0);
  const warehouseCount = data.length;
  const grandTotal = apiResponse?.grand_total || totalQuantity;

  return (
    <DashboardCard
      title="ปริมาณสินค้าแต่ละโกดัง"
      icon={<LocalShippingIcon sx={{ color: 'primary.main' }} />}
      isLoading={loading}
      fullHeight={true}
    >
      {error ? (
        <Typography color="error">ไม่สามารถโหลดข้อมูลได้</Typography>
      ) : data.length > 0 ? (
        <Box>
                     {/* Summary Statistics */}
           <Grid container spacing={2} sx={{ mb: 3 }}>
             <Grid item xs={6}>
               <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'primary.light', borderRadius: 1 }}>
                 <Typography variant="h6" color="white" sx={{ fontWeight: 600 }}>
                   {grandTotal.toLocaleString()}
                 </Typography>
                 <Typography variant="caption" color="white">
                   ยอดรวมทั้งหมด (ตัน)
                 </Typography>
               </Box>
             </Grid>
             <Grid item xs={6}>
               <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                 <Typography variant="h6" color="white" sx={{ fontWeight: 600 }}>
                   {warehouseCount}
                 </Typography>
                 <Typography variant="caption" color="white">
                   จำนวนโกดัง
                 </Typography>
               </Box>
             </Grid>
           </Grid>

          {/* Chart */}
          <ReactApexChart 
            options={chartOptions} 
            series={chartSeries} 
            type="bar" 
            height={350} 
          />
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
    </DashboardCard>
  );
};

export default WarehousePaymentTotal;
