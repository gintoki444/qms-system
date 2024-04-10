import { Grid, Typography, Stack } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { Divider } from '../../../node_modules/@mui/material/index';

import QueueTag from 'components/@extended/QueueTag';

function Step3Queue({ queues }) {
  return (
    <Grid container alignItems="center" justifyContent="center">
      <Grid item xs={12} md={12} sx={{ background: '#c6e0e0' }}>
        <Stack sx={{ p: '1% 3%', justifyContent: 'center', alignItems: 'left', width: '100%' }}>
          <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1.3vw!important' } }}>
            Step3 - ชั่งหนัก : คิวปัจจุบัน
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sx={{ pl: '2%', pr: '2%' }}>
        <Grid container alignItems="center" sx={{ height: { xs: 'auto', md: '12vh' } }}>
          {queues.map((queue, index) => (
            <Grid item xs={12} md={2} key={index}>
              <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%' }}>
                <Grid container sx={{ position: 'relative' }}>
                  <Grid item xs={6} align="center">
                    <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                      หมายเลขคิว
                    </Typography>
                    <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1.4vw!important' }, color: 'red' }}>
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
                          // backgroundColor: '#75caca',
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

                  <Grid item xs={6} align="center">
                    <Stack spacing={0.5}>
                      <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                        ช่องที่
                      </Typography>
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1.8vw!important' }, color: 'red' }}>
                        {queue.station_name == 'ชั่งหนักที่ 1' ? ' 1' : ' 2'}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
          ))}

          {/* <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%' }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>ช่องที่  1</Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>หมายเลขคิว :</Typography>
              </Grid>
            </MainCard>
          </Grid> */}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Step3Queue;
