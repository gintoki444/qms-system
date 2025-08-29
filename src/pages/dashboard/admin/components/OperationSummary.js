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
import { fetchProgressTruckLoading, fetchAvgLoadingTime, fetchLoadingVolumeWarehouse } from '_api/dashboardRequest';

const OperationSummary = ({ date }) => {
  const [data, setData] = useState({
    totalTrucks: 0,
    itemsLoaded: 0,
    averageTime: 0,
    successRate: 0,
    companiesCount: 0,
    activeWarehouses: 3
  });
  const [previousData, setPreviousData] = useState({
    totalTrucks: 0,
    itemsLoaded: 0,
    averageTime: 0,
    successRate: 0,
    companiesCount: 0,
    activeWarehouses: 3
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get previous day date
  const getPreviousDay = (currentDate) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  };

  // Helper function to calculate weighted average loading time
  const calculateWeightedAverage = (items) => {
    if (!items || items.length === 0) return 0;
    
    let totalWeightedTime = 0;
    let totalTrucks = 0;
    
    items.forEach(item => {
      const trucksDone = item.trucks_done || 0;
      const avgLoadingMin = item.avg_loading_min || 0;
      
      totalWeightedTime += trucksDone * avgLoadingMin;
      totalTrucks += trucksDone;
    });
    
    if (totalTrucks === 0) return 0;
    
    return Math.round(totalWeightedTime / totalTrucks);
  };

  // Helper function to transform API data
  const transformApiData = (result, avgTime = 0, warehouseData = null) => {
    const items = result.items || [];
    
    const aggregatedData = items.reduce((acc, company) => {
      const totalTarget = company.total_target || 0;
      const finishedStep2 = company.finished_step2 || 0;
      const remaining = company.remaining || 0;
      const cancelledCount = company.cancelled_count || 0;
      
      acc.totalTarget += totalTarget;
      acc.finishedStep2 += finishedStep2;
      acc.remaining += remaining;
      acc.cancelledCount += cancelledCount;
      
      return acc;
    }, {
      totalTarget: 0,
      finishedStep2: 0,
      remaining: 0,
      cancelledCount: 0
    });
    const overallProgressPercent = aggregatedData.totalTarget > 0 
      ? (aggregatedData.finishedStep2 / aggregatedData.totalTarget) * 100 
      : 0;

    // Calculate total items loaded from warehouse data
    let totalItemsLoaded = 0;
    
    if (warehouseData && warehouseData.items) {
      
      totalItemsLoaded = warehouseData.items.reduce((sum, warehouse) => {
        const warehouseVolume = warehouse.total_qty || 0;
        return sum + warehouseVolume;
      }, 0);
    } else {
      // Fallback to estimated calculation
      totalItemsLoaded = aggregatedData.finishedStep2 * 25;
    }

    const transformedData = {
      totalTrucks: aggregatedData.totalTarget,
      itemsLoaded: totalItemsLoaded,
      averageTime: avgTime, // Use the average time from API
      successRate: Math.round(overallProgressPercent),
      companiesCount: items.length,
      activeWarehouses: 3 // Default value
    };

    return transformedData;
  };

  // Helper function to calculate trend percentage
  const calculateTrendPercentage = (currentValue, previousValue) => {
    if (previousValue === 0) {
      return currentValue > 0 ? 100 : 0;
    }
    return Math.round(((currentValue - previousValue) / previousValue) * 100);
  };

  // Helper function to determine trend direction for average time (less is better)
  const getAverageTimeTrendDirection = (currentValue, previousValue) => {
    if (currentValue === 0 && previousValue === 0) return 'stable';
    if (currentValue === 0) return 'up'; // No time is best
    if (previousValue === 0) return 'down'; // Any time is worse than no time
    if (currentValue < previousValue) return 'up'; // Less time is better
    if (currentValue > previousValue) return 'down'; // More time is worse
    return 'stable';
  };

  // Helper function to calculate trend percentage for average time (less is better)
  const calculateAverageTimeTrendPercentage = (currentValue, previousValue) => {
    if (previousValue === 0) {
      return currentValue > 0 ? -100 : 0; // Any time is 100% worse than no time
    }
    if (currentValue === 0) {
      return 100; // No time is 100% better
    }
    return Math.round(((previousValue - currentValue) / previousValue) * 100);
  };

  // Helper function to determine trend direction (for other KPIs where more is better)
  const getTrendDirection = (currentValue, previousValue) => {
    if (currentValue > previousValue) return 'up';
    if (currentValue < previousValue) return 'down';
    return 'stable';
  };

  useEffect(() => {
    const loadData = async () => {
      if (!date) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch current day data
        const currentResult = await fetchProgressTruckLoading(date);
        
        // Fetch previous day data
        const previousDay = getPreviousDay(date);
        const previousResult = await fetchProgressTruckLoading(previousDay);
        
        // Fetch warehouse data for current day
        const currentWarehouseResult = await fetchLoadingVolumeWarehouse(date);
        
        // Fetch warehouse data for previous day
        const previousWarehouseResult = await fetchLoadingVolumeWarehouse(previousDay);
        
        // Fetch average loading time for current day
        const avgLoadingTimeResult = await fetchAvgLoadingTime(date);
        
        // Transform both datasets
        const currentAvgTime = avgLoadingTimeResult && avgLoadingTimeResult.items 
          ? calculateWeightedAverage(avgLoadingTimeResult.items)
          : 0;
        
        // Fetch average loading time for previous day
        const previousAvgLoadingTimeResult = await fetchAvgLoadingTime(previousDay);
        const previousAvgTime = previousAvgLoadingTimeResult && previousAvgLoadingTimeResult.items 
          ? calculateWeightedAverage(previousAvgLoadingTimeResult.items)
          : 0;
        const currentData = transformApiData(currentResult, currentAvgTime, currentWarehouseResult);
        
        const previousData = transformApiData(previousResult, previousAvgTime, previousWarehouseResult);
        
        setData(currentData);
        setPreviousData(previousData);
      } catch (err) {
        console.error('Error loading operation summary data:', err);
        setError('ไม่สามารถโหลดข้อมูลได้');
        // Set default values when error occurs
        setData({
          totalTrucks: 0,
          itemsLoaded: 0,
          averageTime: 0,
          successRate: 0,
          companiesCount: 0,
          activeWarehouses: 3
        });
        setPreviousData({
          totalTrucks: 0,
          itemsLoaded: 0,
          averageTime: 0,
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
  
  const totalTrucksTrend = getTrendDirection(data.totalTrucks, previousData.totalTrucks);
  const totalTrucksPercentage = calculateTrendPercentage(data.totalTrucks, previousData.totalTrucks);
  
  const itemsLoadedTrend = getTrendDirection(data.itemsLoaded, previousData.itemsLoaded);
  const itemsLoadedPercentage = calculateTrendPercentage(data.itemsLoaded, previousData.itemsLoaded);
  
  const averageTimeTrend = getAverageTimeTrendDirection(data.averageTime, previousData.averageTime);
  const averageTimePercentage = calculateAverageTimeTrendPercentage(data.averageTime, previousData.averageTime);
  
  const successRateTrend = getTrendDirection(data.successRate, previousData.successRate);
  const successRatePercentage = calculateTrendPercentage(data.successRate, previousData.successRate);
  
  const companiesCountTrend = getTrendDirection(data.companiesCount, previousData.companiesCount);
  const companiesCountPercentage = calculateTrendPercentage(data.companiesCount, previousData.companiesCount);

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
            {percentage}% vs yesterday
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
  const KPICard = ({ icon, title, value, unit, trend, trendPercentage, description, iconColor = 'primary.main' }) => {
    // Log for totalTrucks specifically
    return (
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
  };

     return (
     <Grid container spacing={2}>
       {/* Card 1: Total Trucks Today */}
       <Grid item xs={12} sm={6} md={4} lg={2.4}>
         {(() => {
           return (
             <KPICard
               icon={<LocalShippingIcon />}
               title="รถทั้งหมดวันนี้"
               value={data.totalTrucks}
               unit=" คัน"
               trend={totalTrucksTrend}
               trendPercentage={totalTrucksPercentage}
               description={totalTrucksTrend === 'up' ? 'เพิ่มขึ้นจากเมื่อวาน' : totalTrucksTrend === 'down' ? 'ลดลงจากเมื่อวาน' : 'คงที่จากเมื่อวาน'}
               iconColor="primary.main"
             />
           );
         })()}
       </Grid>

               {/* Card 2: Items Loaded */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          {(() => {
            return (
              <KPICard
                icon={<InventoryIcon />}
                title="สินค้าที่บรรทุก"
                value={data.itemsLoaded.toLocaleString()}
                unit=" ตัน"
                trend={itemsLoadedTrend}
                trendPercentage={itemsLoadedPercentage}
                description={itemsLoadedTrend === 'up' ? 'เพิ่มขึ้นจากเมื่อวาน' : itemsLoadedTrend === 'down' ? 'ลดลงจากเมื่อวาน' : 'คงที่จากเมื่อวาน'}
                iconColor="primary.main"
              />
            );
          })()}
        </Grid>

       {/* Card 3: Average Time/Truck */}
       <Grid item xs={12} sm={6} md={4} lg={2.4}>
         <KPICard
           icon={<AccessTimeIcon />}
           title="เวลาเฉลี่ย/คัน"
           value={data.averageTime}
           unit=" นาที"
           trend={averageTimeTrend}
           trendPercentage={averageTimePercentage}
           description={averageTimeTrend === 'down' ? 'ลดลงจากเมื่อวาน' : averageTimeTrend === 'up' ? 'เพิ่มขึ้นจากเมื่อวาน' : 'คงที่จากเมื่อวาน'}
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
           trend={successRateTrend}
           trendPercentage={successRatePercentage}
           description={successRateTrend === 'up' ? 'เพิ่มขึ้นจากเมื่อวาน' : successRateTrend === 'down' ? 'ลดลงจากเมื่อวาน' : 'คงที่จากเมื่อวาน'}
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
           trend={companiesCountTrend}
           trendPercentage={companiesCountPercentage}
           description={companiesCountTrend === 'up' ? 'เพิ่มขึ้นจากเมื่อวาน' : companiesCountTrend === 'down' ? 'ลดลงจากเมื่อวาน' : 'คงที่จากเมื่อวาน'}
           iconColor="warning.main"
         />
       </Grid>
     </Grid>
   );
};

export default OperationSummary;
