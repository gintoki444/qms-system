import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
// import WarehouseIcon from '@mui/icons-material/Warehouse';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RemoveIcon from '@mui/icons-material/Remove';
import { fetchProgressTruckLoading } from '_api/dashboardRequest';

const OperationSummary = ({ date }) => {
  const [data, setData] = useState({
    totalTrucks: 0,
    itemsLoaded: 0,
    averageTime: 45,
    successRate: 0,
    companiesCount: 0,
    activeWarehouses: 3
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!date) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchProgressTruckLoading(date);
        console.log('Operation summary data:', result);
        
        // Transform the data to match the component's expected format
        // Aggregate data from all companies
        const items = result.items || [];
        
        const aggregatedData = items.reduce((acc, company) => {
          acc.totalTarget += company.total_target || 0;
          acc.finishedStep2 += company.finished_step2 || 0;
          acc.remaining += company.remaining || 0;
          acc.cancelledCount += company.cancelled_count || 0;
          return acc;
        }, {
          totalTarget: 0,
          finishedStep2: 0,
          remaining: 0,
          cancelledCount: 0
        });

        // Calculate overall progress percentage
        const overallProgressPercent = aggregatedData.totalTarget > 0 
          ? (aggregatedData.finishedStep2 / aggregatedData.totalTarget) * 100 
          : 0;

        // Calculate estimated items loaded (based on completed trucks)
        const estimatedItemsLoaded = aggregatedData.finishedStep2 * 25; // 25 tons per truck average

        const transformedData = {
          totalTrucks: aggregatedData.totalTarget,
          itemsLoaded: estimatedItemsLoaded,
          averageTime: 45, // Default average time
          successRate: Math.round(overallProgressPercent),
          companiesCount: items.length,
          activeWarehouses: 3 // Default value
        };
        
        setData(transformedData);
      } catch (err) {
        console.error('Error loading operation summary data:', err);
        setError('ไม่สามารถโหลดข้อมูลได้');
        // Set default values when error occurs
        setData({
          totalTrucks: 0,
          itemsLoaded: 0,
          averageTime: 45,
          successRate: 0,
          companiesCount: 0,
          activeWarehouses: 3
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [date]);

  if (loading) {
    return (
      <Card sx={{ 
        backgroundColor: 'rgba(173, 216, 230, 0.1)', 
        borderRadius: 2,
        border: '1px solid rgba(173, 216, 230, 0.3)'
      }}>
        <CardContent>
          <Typography>กำลังโหลดข้อมูล...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ 
        backgroundColor: 'rgba(173, 216, 230, 0.1)', 
        borderRadius: 2,
        border: '1px solid rgba(173, 216, 230, 0.3)'
      }}>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  // Helper function to render trend indicator
  const renderTrend = (trend, percentage) => {
    if (trend === 'up') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16 }} />
          <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 500 }}>
            +{percentage}% vs yesterday
          </Typography>
        </Box>
      );
    } else if (trend === 'down') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <TrendingDownIcon sx={{ color: 'error.main', fontSize: 16 }} />
          <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 500 }}>
            -{percentage}% vs yesterday
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <RemoveIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            0% vs yesterday
          </Typography>
        </Box>
      );
    }
  };

  // KPI Card Component
  const KPICard = ({ icon, title, value, unit, trend, trendPercentage, description, iconColor = 'primary.main' }) => (
    <Card sx={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
      borderRadius: 2,
      border: '1px solid rgba(0, 0, 0, 0.1)',
      height: '100%',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 2
      }
    }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Icon */}
          <Box sx={{ mb: 1 }}>
            {React.cloneElement(icon, { sx: { color: iconColor, fontSize: 24 } })}
          </Box>
          
          {/* Title */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
            {title}
          </Typography>
          
          {/* Value */}
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            {value}{unit}
          </Typography>
          
          {/* Trend */}
          <Box sx={{ mb: 1 }}>
            {renderTrend(trend, trendPercentage)}
          </Box>
          
          {/* Description */}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 'auto' }}>
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

     return (
     <Grid container spacing={2}>
       {/* Card 1: Total Trucks Today */}
       <Grid item xs={12} sm={6} md={4} lg={2.4}>
         <KPICard
           icon={<LocalShippingIcon />}
           title="รถทั้งหมดวันนี้"
           value={data.totalTrucks}
           unit=" คัน"
           trend="up"
           trendPercentage="8.5"
           description="เพิ่มขึ้นจากเมื่อวาน"
           iconColor="primary.main"
         />
       </Grid>

       {/* Card 2: Items Loaded */}
       <Grid item xs={12} sm={6} md={4} lg={2.4}>
         <KPICard
           icon={<InventoryIcon />}
           title="สินค้าที่บรรทุก"
           value={data.itemsLoaded.toLocaleString()}
           unit=" ตัน"
           trend="up"
           trendPercentage="5.2"
           description="ปริมาณรวมวันนี้"
           iconColor="primary.main"
         />
       </Grid>

       {/* Card 3: Average Time/Truck */}
       <Grid item xs={12} sm={6} md={4} lg={2.4}>
         <KPICard
           icon={<AccessTimeIcon />}
           title="เวลาเฉลี่ย/คัน"
           value={data.averageTime}
           unit=" นาที"
           trend="down"
           trendPercentage="12.3"
           description="ลดลงจากเป้าหมาย"
           iconColor="success.main"
         />
       </Grid>

       {/* Card 4: Success Rate */}
       <Grid item xs={12} sm={6} md={4} lg={2.4}>
         <KPICard
           icon={<CheckCircleIcon />}
           title="อัตราความสำเร็จ"
           value={data.successRate}
           unit="%"
           trend="up"
           trendPercentage="3.1"
           description="เกินเป้าหมาย 90%"
           iconColor="success.main"
         />
       </Grid>

       {/* Card 5: Companies Using Service */}
       <Grid item xs={12} sm={6} md={4} lg={2.4}>
         <KPICard
           icon={<BusinessIcon />}
           title="บริษัทที่ใช้บริการ"
           value={data.companiesCount}
           unit=" บริษัท"
           trend="stable"
           trendPercentage="0"
           description="คงที่จากเมื่อวาน"
           iconColor="warning.main"
         />
       </Grid>
     </Grid>
   );
};

export default OperationSummary;
