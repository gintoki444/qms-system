import { Grid, Typography, Stack } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { Divider } from '../../../node_modules/@mui/material/index';

import QueueTag from 'components/@extended/QueueTag';

function WeighQueue({ queues }) {
  return (
    <Grid container>
      <Grid item xs={12} md={12} sx={{ background: '#afd7f6' }}>
        <Stack sx={{ p: '1% 3%', justifyContent: 'left', alignItems: 'left', width: '100%' }}>
          <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1.3vw!important' } }}>
            สถานีชั่งน้ำหนัก : คิวปัจจุบัน
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sx={{ pl: '2%', pr: '2%' }}>
        <Grid container alignContent="center" sx={{ minHeight: { xs: 'auto', md: '14vh' }, pt: 1, pb: 1 }}>
          {queues.map((queue, index) => (
            <Grid item xs={12} md={2} sx={{ minWidth: { xs: 12, md: '20%!important' } }} key={index}>
              <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%' }}>
                <Grid container sx={{ position: 'relative' }} align="center">
                  <Grid item xs={6}>
                    <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1.2vw!important' } }}>
                      หมายเลขคิว
                    </Typography>
                    <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1.6vw!important' }, color: 'red' }}>
                      <QueueTag
                        id={queue.product_company_id}
                        token={queue.Token}
                        sx={{
                          color: 'red',
                          fontSize: { xs: 16, md: '2vw!important' },
                          fontWeight: '600',
                          // textShadow: '2px 2px #0064b2',
                          height: 'auto',
                          backgroundColor: '#ffffff',
                          // backgroundColor: '#5bb5fb',
                          borderRadius: '8%'
                        }}
                      />
                    </Typography>
                  </Grid>

                  <Divider
                    absolute
                    orientation="vertical"
                    textAlign="center"
                    sx={{
                      left: '50%',
                      right: '50%',
                      width: 0
                    }}
                  />

                  <Grid item xs={6}>
                    <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1.2vw!important' } }}>
                      ช่องที่
                    </Typography>
                    <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '2vw!important' }, color: 'red' }}>
                      {queue.station_name == 'ชั่งเบาที่ 1' ? ' 1' : ' 2'}
                    </Typography>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default WeighQueue;
