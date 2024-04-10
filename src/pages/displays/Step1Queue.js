import { Grid, Typography, Stack } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { Divider } from '../../../node_modules/@mui/material/index';

import QueueTag from 'components/@extended/QueueTag';

function Step1Queue({ queues }) {
  return (
    <Grid container>
      <Grid item xs={12} md={12} sx={{ background: '#afd7f6' }}>
        <Stack sx={{ p: '1% 3%', justifyContent: 'left', alignItems: 'left', width: '100%' }}>
          <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1.3vw!important' } }}>
            Step1 - ชั่งเบา : คิวปัจจุบัน
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sx={{ pl: '2%', pr: '2%' }}>
        <Grid container alignContent="center" sx={{ height: { xs: 'auto', md: '12vh' } }}>
          {queues.map((queue, index) => (
            <Grid item xs={12} md={2} key={index}>
              <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%' }}>
                <Grid container sx={{ position: 'relative' }} align="center">
                  <Grid item xs={6}>
                    <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                      หมายเลขคิว
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontSize: { xs: 16, md: '1.6vw!important' }, color: 'red', textShadow: '2px 2px #a3a3a3' }}
                    >
                      <QueueTag
                        id={queue.product_company_id}
                        token={queue.Token}
                        sx={{
                          color: 'red',
                          fontSize: { xs: 16, md: '1.8vw!important' },
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
                    <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                      ช่องที่
                    </Typography>
                    <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1.8vw!important' }, color: 'red' }}>
                      {queue.station_name == 'ชั่งเบาที่ 1' ? ' 1' : ' 2'}
                    </Typography>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
          ))}
          {/* <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%' }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  ช่องที่ 1
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid> */}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Step1Queue;
