import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

import { Grid, Stack, Button, Box, InputLabel, OutlinedInput } from '@mui/material';
import MainCard from 'components/MainCard';
import { SearchOutlined } from '@ant-design/icons';

function QueueCheck() {
  const [searchTxt, setSearchTxt] = useState('');

  const handleCheck = () => {
    window.location.href = searchTxt;
  };
  return (
    <Grid alignItems="center" justifyContent="space-between">
      <Grid container rowSpacing={1} columnSpacing={1.75}>
        <Grid item xs={12} md={6} lg={6}>
          <Grid item>
            <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
              <Box>
                <Grid container rowSpacing={3}>
                  <Grid item xs={12} md={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="registration_no-car">ข้อมูล Scan QR Code</InputLabel>
                      <OutlinedInput
                        value={searchTxt}
                        onChange={(e) => {
                          setSearchTxt(e.target.value);
                        }}
                        placeholder="ค้นหา"
                        fullWidth
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Button size="mediam" color="primary" variant="contained" onClick={() => handleCheck()} startIcon={<SearchOutlined />}>
                      ค้นหาข้อมูลคิว
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </MainCard>
          </Grid>

          {/* } */}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default QueueCheck;
