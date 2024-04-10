import { Grid, Typography, Stack } from '@mui/material';
import { Divider } from '../../../node_modules/@mui/material/index';

// project import
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';

import QueueTag from 'components/@extended/QueueTag';

function Step2Queue({ queues }) {
  const [queuesData, setQueuesData] = useState([]);
  useEffect(() => {
    console.log(queues);
    if (queues.length > 0) {
      queues.map((x) => {
        const stationNum = x.station_name.replace(/.*หัวจ่ายที่/, '');
        const WarhouseName = x.station_name.slice(0, 2);
        x.new_station_num = stationNum;
        x.warehouse_name = WarhouseName;
      });

      setQueuesData(queues);
    } else {
      setQueuesData([]);
    }
  }, [queues]);

  return (
    <Grid container>
      <Grid item xs={12} md={12} sx={{ background: '#abbdee', mb: 1 }}>
        <Stack sx={{ p: '1% 3%', justifyContent: 'center', alignItems: 'left', width: '100%' }}>
          <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1.3vw!important' } }}>
            Step2 - ขึ้นสินค้า : คิวปัจจุบัน
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sx={{ pl: '2%', pr: '2%' }}>
        <Grid
          container
          alignItems="flex-top"
          // justifyContent="center"
          sx={{ minHeight: { xs: '100%', md: '11vh' }, maxHeight: { xs: '100%', md: '48vh' }, pb: '0.7%' }}
        >
          {queuesData.length > 0 &&
            queuesData.map((queue, index) => (
              <Grid item xs={12} md={2} key={index}>
                <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' }, alignContent: 'center' }}>
                  <Grid container sx={{ position: 'relative' }}>
                    <Grid item xs={6} align="center">
                      <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                        หมายเลขคิว
                      </Typography>

                      <QueueTag
                        id={queue.product_company_id}
                        token={queue.Token}
                        sx={{
                          color: 'red',
                          fontSize: { xs: 16, md: '1.8vw!important' },
                          fontWeight: '600',
                          // textShadow: '2px 2px #0044ff',
                          height: 'auto',
                          // backgroundColor: '#628cff',
                          backgroundColor: '#ffffff',
                          borderRadius: '8%'
                        }}
                      />
                      {/* <Typography
                        variant="h4"
                        sx={{ fontSize: { xs: 16, md: '1.4vw!important' }, color: 'red', textShadow: '2px 2px #a3a3a3' }}
                      >
                        {queue.Token}
                      </Typography> */}
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
                      <Stack spacing={1} sx={{ mt: '3%' }}>
                        <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1.2vw!important' } }}>
                          โกดัง : <span style={{ color: 'red', fontWeight: 'bold' }}>{queue.warehouse_name}</span>
                        </Typography>
                        <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1.2vw!important' } }}>
                          หัวจ่ายที่ : <span style={{ color: 'red', fontWeight: 'bold' }}>{queue.new_station_num}</span>
                        </Typography>
                      </Stack>
                    </Grid>
                    {/* <Grid item xs={12} md={8} align="center">
                      <Stack spacing={0.5}>
                        <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                          หัวจ่ายที่ : <span style={{ color: 'red', fontWeight: 'bold' }}>{queue.new_station_num}</span>
                        </Typography>
                      </Stack>
                    </Grid> */}
                  </Grid>
                </MainCard>
              </Grid>
            ))}
          {/* 
          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 1
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>

          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 2
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 2
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 2
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>

          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 1
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 1
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 2
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 2
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 2
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>

          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 1
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 1
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 2
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 2
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 2
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>

          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 1
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 1
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 2
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 2
                </Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หมายเลขคิว :
                </Typography>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                  หัวจ่าย 2
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

export default Step2Queue;
