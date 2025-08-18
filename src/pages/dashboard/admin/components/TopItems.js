import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { fetchTopItems } from '_api/dashboardRequest';
import DashboardCard from './DashboardCard';
import CompanyCodeConverter from 'components/CompanyCodeConverter';

const TopItems = ({ date }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!date) return;

      setLoading(true);
      setError(null);

      try {
        const result = await fetchTopItems(date);
        console.log('Top items data received:', result);

        // Use result.data if available, otherwise use result directly
        const data = result.data || result;

        // Group data by company
        const groupedData = {};
        if (Array.isArray(data)) {
          data.forEach((company) => {
            if (company.items && Array.isArray(company.items)) {
              const companyCode = company.product_company_code;
              const companyName = company.product_company_name_th || company.product_company_code;

              if (!groupedData[companyCode]) {
                groupedData[companyCode] = {
                  companyCode: companyCode,
                  companyName: companyName,
                  items: []
                };
              }

              company.items.forEach((item) => {
                groupedData[companyCode].items.push({
                  item: item.item_name,
                  quantity: item.total_ton || 0,
                  unit: 'ตัน'
                });
              });
            }
          });
        }

        // Sort items within each company by quantity and take top 5
        Object.keys(groupedData).forEach((companyCode) => {
          groupedData[companyCode].items = groupedData[companyCode].items.sort((a, b) => b.quantity - a.quantity).slice(0, 5);
        });

        setData(groupedData);
      } catch (err) {
        console.error('Error loading top items data:', err);
        setError('ไม่สามารถโหลดข้อมูลได้');
        setData({}); // Set empty object when error occurs
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [date]);

  if (error) {
    return (
      <DashboardCard title="Top 5 Item" icon={<EmojiEventsIcon sx={{ color: 'primary.main' }} />} fullHeight={true}>
        <Typography color="error">ไม่สามารถโหลดข้อมูลได้</Typography>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Top 5 Item" icon={<EmojiEventsIcon sx={{ color: 'primary.main' }} />} isLoading={loading} fullHeight={true}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Company Groups */}
        {Object.keys(data).map((companyCode, companyIndex) => {
          const companyData = data[companyCode];
          return (
            <Box
              key={companyCode + companyIndex}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                p: 2,
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderRadius: 1,
                border: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              {/* Company Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                 <Box
                   sx={{
                     width: 12,
                     height: 12,
                     borderRadius: 0.5,
                     backgroundColor: (() => {
                       const companyColorMap = {
                         'IF': '#d32f2f',
                         'II': '#1976d2',
                         'JS': '#2e7d32',
                         'SK': '#7b1fa2'
                       };
                       return companyColorMap[companyCode] || '#607D8B';
                     })()
                   }}
                 />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0 }}>
                  <CompanyCodeConverter code={companyCode} showColor={true} />
                </Typography>
              </Box>

              {/* Items List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {companyData.items.map((item, itemIndex) => (
                  <Box
                    key={itemIndex}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 0
                      //   backgroundColor: 'rgba(0,0,0,0.02)',
                      //   borderRadius: 1,
                      //   border: '1px solid rgba(0,0,0,0.05)'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 40 }}>
                        {itemIndex + 1}.
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.item}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.quantity.toLocaleString()} {item.unit}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </DashboardCard>
  );
};

export default TopItems;
