import { Grid, Typography, Stack } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

function Step3Queue() {
  return (
    <Grid container alignItems="center" justifyContent="center">
      <Grid item xs={12} md={12} sx={{ background: '#afd7f6' }}>
        <Stack sx={{ p: '1% 3%', justifyContent: 'center', alignItems: 'left', width: '100%' }}>
          <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>Step3 - ชั่งหนัก : คิวปัจจุบัน</Typography>
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="center" sx={{ height: { xs: 'auto', md: '12vh' } }}>
          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%' }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>ช่องที่  1</Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>หมายเลขคิว :</Typography>
              </Grid>
            </MainCard>
          </Grid>

          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%' }}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>ช่องที่  1</Typography>
              </Stack>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>หมายเลขคิว :</Typography>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Step3Queue;
