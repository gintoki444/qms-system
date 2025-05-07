import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';

function AllStations({ queues, groupStation }) {
  const [queuesData, setQueuesData] = useState([]);

  useEffect(() => {
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
    <>
      {groupStation === 1 && (
        <Grid container justifyContent="left" alignItems="center" sx={{ pt: '2%', width: '89%', m: 'auto' }}>
          {queuesData.length > 0 &&
            queuesData.map((queue, index) => (
              <Grid xs={12} md={6} key={index} sx={{ ml: '2%', mr: '2%', maxWidth: '20vw!important' }}>
                <Grid item xs={12} sx={{ minWidth: { xs: 12, md: '20%!important' }, mt: '2%' }}>
                  <MainCard
                    contentSX={{ p: '4%!important', pb: '1%!important', pt: '2%!important' }}
                    sx={{ m: '1% 1%', alignContent: 'center', height: '16vh', maxHeight: '13vh' }}
                  >
                    <Grid container sx={{ position: 'relative' }}>
                      <Grid item xs={6} align="center">
                        <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '2.5vh!important' } }}>
                          โกดัง : <span style={{ color: 'red', fontWeight: 'bold' }}>{queue.warehouse_name}</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={6} align="center">
                        <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '2.5vh!important' } }}>
                          หัวจ่ายที่ : <span style={{ color: 'red', fontWeight: 'bold' }}>{queue.new_station_num}</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} align="center">
                        <Typography
                          variant="h4"
                          sx={{
                            color: 'red',
                            fontSize: { xs: 16, md: '6vh!important' },
                            fontWeight: '600',
                            height: 'auto',
                            backgroundColor: '#ffffff',
                            borderRadius: '8%'
                          }}
                        >
                          {queue.Token}
                        </Typography>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>
              </Grid>
            ))}
        </Grid>
      )}
      {groupStation === 2 && (
        <Grid container justifyContent="center" alignItems="center" sx={{ pt: '2%' }}>
          {queuesData.length > 0 &&
            queuesData.map((queue, index) => (
              <Grid xs={12} key={index} sx={{ ml: '2%', mr: '2%', maxWidth: '20vw!important' }}>
                <Grid item xs={12} sx={{ minWidth: { xs: 12, md: '20%!important' }, mt: '2%' }}>
                  <MainCard
                    contentSX={{ p: '4%!important', pb: '1%!important', pt: '2%!important' }}
                    sx={{ m: '1% 1%', alignContent: 'center', height: '16vh', maxHeight: '13vh' }}
                  >
                    <Grid container sx={{ position: 'relative' }}>
                      <Grid item xs={6} align="center">
                        <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '2.5vh!important' } }}>
                          โกดัง : <span style={{ color: 'red', fontWeight: 'bold' }}>{queue.warehouse_name}</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={6} align="center">
                        <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '2.5vh!important' } }}>
                          หัวจ่ายที่ : <span style={{ color: 'red', fontWeight: 'bold' }}>{queue.new_station_num}</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} align="center">
                        <Typography
                          variant="h4"
                          sx={{
                            color: '#0865B1',
                            fontSize: { xs: 16, md: '6vh!important' },
                            fontWeight: '600',
                            height: 'auto',
                            backgroundColor: '#ffffff',
                            borderRadius: '8%'
                          }}
                        >
                          {queue.Token}
                        </Typography>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>
              </Grid>
            ))}
        </Grid>
      )}
      {groupStation === 3 && (
        <Grid container justifyContent="center" alignItems="center" sx={{ pt: '2%' }}>
          {queuesData.length > 0 &&
            queuesData.map((queue, index) => (
              <>
                {queue.station_id !== 32 &&
                queue.station_id !== 33 &&
                queue.station_id !== 34 &&
                queue.station_id !== 35 &&
                queue.station_id !== 36 ? (
                  <Grid xs={12} key={index} sx={{ ml: '2%', mr: '2%', maxWidth: '20vw!important' }}>
                    <Grid item xs={12} sx={{ minWidth: { xs: 12, md: '20%!important' }, mt: '2%' }}>
                      <MainCard
                        contentSX={{ p: '4%!important', pb: '1%!important', pt: '2%!important' }}
                        sx={{ m: '1% 1%', alignContent: 'center', height: '16vh', maxHeight: '13vh' }}
                      >
                        <Grid container sx={{ position: 'relative' }}>
                          <Grid item xs={6} align="center">
                            <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '2.5vh!important' } }}>
                              โกดัง : <span style={{ color: 'red', fontWeight: 'bold' }}>{queue.warehouse_name}</span>
                            </Typography>
                          </Grid>
                          <Grid item xs={6} align="center">
                            <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '2.5vh!important' } }}>
                              หัวจ่ายที่ : <span style={{ color: 'red', fontWeight: 'bold' }}>{queue.new_station_num}</span>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} align="center">
                            <Typography
                              variant="h4"
                              sx={{
                                color: '#005103',
                                fontSize: { xs: 16, md: '6vh!important' },
                                fontWeight: '600',
                                height: 'auto',
                                backgroundColor: '#ffffff',
                                borderRadius: '8%'
                              }}
                            >
                              {queue.Token}
                            </Typography>
                          </Grid>
                        </Grid>
                      </MainCard>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid xs={12} key={index} sx={{ ml: '2%', mr: '2%', maxWidth: '15vw!important' }}>
                    <Grid item xs={12} sx={{ minWidth: { xs: 12, md: '20%!important' }, mt: '2%' }}>
                      <MainCard
                        contentSX={{ p: '4%!important', pb: '1%!important', pt: '2%!important' }}
                        sx={{ m: '1% 1%', alignContent: 'center', height: '16vh', maxHeight: '8vh' }}
                      >
                        <Grid container sx={{ position: 'relative' }}>
                          <Grid item xs={12} align="center">
                            <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '2vh!important' } }}>
                              หัวจ่ายพิเศษ : {queue.new_station_num}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} align="center">
                            <Typography
                              variant="h4"
                              sx={{
                                color: '#005103',
                                fontSize: { xs: 16, md: '3vh!important' },
                                fontWeight: '600',
                                height: 'auto',
                                backgroundColor: '#ffffff',
                                borderRadius: '8%'
                              }}
                            >
                              {queue.Token}
                            </Typography>
                          </Grid>
                        </Grid>
                      </MainCard>
                    </Grid>
                  </Grid>
                )}
              </>
            ))}
        </Grid>
      )}
    </>
  );
}

export default AllStations;
