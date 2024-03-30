import { Grid, Typography, Stack } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';

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
    <Grid container alignItems="center" justifyContent="center">
      <Grid item xs={12} md={12} sx={{ background: '#abbdee', mb: 1 }}>
        <Stack sx={{ p: '1% 3%', justifyContent: 'center', alignItems: 'left', width: '100%' }}>
          <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
            Step2 - ขึ้นสินค้า : คิวปัจจุบัน
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <Grid container alignItems="flex-top" justifyContent="center" sx={{ p: '0 4%', height: { xs: '100%', md: '48vh' }, pb: '0.7%' }}>
          {queuesData.length > 0 &&
            queuesData.map((queue, index) => (
              <Grid item xs={12} md={2} key={index}>
                <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' }, alignContent: 'center' }}>
                  <Grid container>
                    <Grid item xs={12} md={4} align="ceter">
                      <Stack spacing={0.5}>
                        <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                          โกดัง : <span style={{ color: 'red', fontWeight: 'bold' }}>{queue.warehouse_name}</span>
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={8} align="center">
                      <Stack spacing={0.5}>
                        <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                          หัวจ่ายที่ : <span style={{ color: 'red', fontWeight: 'bold' }}>{queue.new_station_num}</span>
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }} align="center">
                      <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                        หมายเลขคิว : {queue.Token}
                      </Typography>
                    </Grid>
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
