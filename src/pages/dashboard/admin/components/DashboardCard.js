import React from 'react';
import { Box, Typography, Card, CardContent, Skeleton } from '@mui/material';

const DashboardCard = ({ 
  title, 
  icon, 
  children, 
  isLoading = false,
  className = "",
  fullHeight = false
}) => {
  return (
    <Card sx={{ 
      backgroundColor: 'background.paper', 
      boxShadow: 3, 
      border: 'none',
      height: fullHeight ? '100%' : 'auto',
      display: fullHeight ? 'flex' : 'block',
      flexDirection: fullHeight ? 'column' : 'row',
      ...className
    }}>
      <CardContent sx={{ pb: 1, flex: fullHeight ? 1 : 'none', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="75%" height={20} />
            <Skeleton variant="rectangular" width="100%" height={32} />
          </Box>
        ) : (
          <Box sx={{ flex: fullHeight ? 1 : 'none' }}>
            {children}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
