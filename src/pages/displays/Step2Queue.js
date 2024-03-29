import { Grid, Typography, Stack } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

function Step2Queue() {
  return (
    <Grid container alignItems="center" justifyContent="center">
      <Grid item xs={12} md={12} sx={{ background: '#afd7f6' }}>
        <Stack sx={{ p: '1% 3%', justifyContent: 'center', alignItems: 'left', width: '100%' }}>
          <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
            Step2 - ขึ้นสินค้า : คิวปัจจุบัน
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <Grid container alignItems="flex-end" justifyContent="center" sx={{ p: '0 4%', height: { xs: '100%', md: '48vh' }, pb: '0.7%' }}>
          <Grid item xs={12} md={2}>
            <MainCard contentSX={{ p: '5%!important' }} sx={{ m: '1% 1%', height: { xs: '100%', md: '10vh' } }}>
              <Grid container>
                <Grid item xs={12} md={6} align="left">
                  <Stack spacing={0.5}>
                    <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                      โกดัง : -
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6} align="left">
                  <Stack spacing={0.5}>
                    <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                      หัวจ่าย: -
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }} align="left">
                  <Typography variant="h4" sx={{ fontSize: { xs: 16, md: '1vw!important' } }}>
                    หมายเลขคิว :
                  </Typography>
                </Grid>
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
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Step2Queue;
