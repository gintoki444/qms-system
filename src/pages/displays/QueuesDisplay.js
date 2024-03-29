import React, { useRef } from 'react';

import { Grid, Stack } from '@mui/material';

// import Logo from 'components/Logo/Logo';

import IconLogo from 'assets/images/logo.png';

import Step1Queue from './Step1Queue';
import Step2Queue from './Step2Queue';
import Step3Queue from './Step3Queue';

function QueuesDisplay() {
  const fullscreenRef = useRef(null);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      fullscreenRef.current.requestFullscreen().catch((err) => {
        console.error('Failed to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      <Grid alignItems="center" justifyContent="space-between" ref={fullscreenRef} style={{ background: '#ebebeb' }}>
        <Grid container rowSpacing={3}>
          <Grid item xs={12} sx={{ background: '#fff' }}>
            <Stack sx={{ pb: 2, pt: 2, justifyContent: 'center', alignItems: 'center', width: '100%' }} onClick={toggleFullScreen}>
              <img src={IconLogo} width="4%" alt="logo" />
            </Stack>
          </Grid>

          <Grid
            xs={12}
            sx={{
              textAlign: 'center'
              // height: { xs: '100%', md: '18.333vh' }
            }}
          >
            <Step1Queue />
          </Grid>
          <Grid
            xs={12}
            sx={{
              textAlign: 'center'
              // height: { xs: '100%', md: '55.333vh' }
            }}
          >
            <Step2Queue />
          </Grid>
          <Grid
            xs={12}
            sx={{
              textAlign: 'center'
              // height: { xs: '100%', md: '18.333vh' }
            }}
          >
            <Step3Queue />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default QueuesDisplay;
