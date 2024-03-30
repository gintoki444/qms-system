import React, { useRef, useEffect, useState } from 'react';

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
  // ========= set Web Socket ========= //
  const [queueData, setQueueData] = useState([]);
  const [step1Data, setStep1Data] = useState([]);
  const [step2Data, setStep2Data] = useState([]);
  const [step3Data, setStep3Data] = useState([]);

  useEffect(() => {
    const wssurl = 'wss://queue-wss-f7e0505c7aa0.herokuapp.com';

    // setWssUrl(wssurl);

    const ws = new WebSocket(wssurl);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStep1Data(data.filter((x) => x.order == 1));
      setStep2Data(data.filter((x) => x.order == 2));
      setStep3Data(data.filter((x) => x.order == 3));
      console.log('Received message from server:', data);
      setQueueData(data);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);
  console.log(queueData);
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
            <Step1Queue queues={step1Data} />
          </Grid>
          <Grid
            xs={12}
            sx={{
              textAlign: 'center'
              // height: { xs: '100%', md: '55.333vh' }
            }}
          >
            <Step2Queue queues={step2Data} />
          </Grid>
          <Grid
            xs={12}
            sx={{
              textAlign: 'center'
              // height: { xs: '100%', md: '18.333vh' }
            }}
          >
            <Step3Queue queues={step3Data} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default QueuesDisplay;
