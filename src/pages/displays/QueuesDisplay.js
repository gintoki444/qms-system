import React, { useRef, useEffect, useState } from 'react';

import { Grid, Stack, Typography, Divider, Box } from '@mui/material';

// import Logo from 'components/Logo/Logo';

import IconLogo from 'assets/images/logo.png';

// import Step1Queue from './Step1Queue';
// import Step2Queue from './Step2Queue';
// import WeighQueue from './WeighQueue';
// import ReceiveQueue from './ReceiveQueue';
import AllStations from './AllStations';
import AuthFooter from 'components/cards/AuthFooter';
import TextSliders from './TextSliders';
// import InfiniteLooper from './InfiniteLooper';

import moment from 'moment/min/moment-with-locales';
import MainCard from 'components/MainCard';
import ClockTime from 'components/@extended/ClockTime';

const apiUrlWWS = process.env.REACT_APP_API_URL_WWS;

function QueuesDisplay() {
  const fullscreenRef = useRef(null);
  const [statusDisplay, setStatusDisplay] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      setStatusDisplay(true);
      fullscreenRef.current.requestFullscreen().catch((err) => {
        console.error('Failed to enable fullscreen:', err);
      });
    } else {
      setStatusDisplay(false);
      document.exitFullscreen();
    }
  };
  // ========= set Web Socket ========= //
  // const [queueData, setQueueData] = useState([]);
  // const [step1Data, setStep1Data] = useState([]);
  // const [step2Data, setStep2Data] = useState([]);
  // const [step3Data, setStep3Data] = useState([]);

  const [stations, setStations] = useState([]);
  const [stations2, setStations2] = useState([]);
  const [stations3, setStations3] = useState([]);
  const currentDate = moment().locale('th').format('LL');
  const nameDate = moment().locale('th').format('dddd');

  useEffect(() => {
    // const wssurl = 'wss://queue-wss-f7e0505c7aa0.herokuapp.com';
    const wssurl = apiUrlWWS;

    const ws = new WebSocket(wssurl);

    ws.onopen = () => {
      // console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('data', data)
      // setStep1Data(data.filter((x) => x.order == 1 || x.order == 3));
      // setStep2Data(data.filter((x) => x.order == 2));
      const stationGroup1 = data.filter((x) => x.order == 2 && (
        x.station_id !== 32 &&
        x.station_id !== 33 &&
        x.station_id !== 34 &&
        x.station_id !== 35 &&
        x.station_id !== 36 &&
        x.station_id !== 15 &&
        x.station_id !== 16 &&
        x.station_id !== 17 &&
        x.station_id !== 18 &&
        x.station_id !== 19 &&
        x.station_id !== 20 &&
        x.station_id !== 21 &&
        x.station_id !== 22
      ));
      console.log('stationGroup1', stationGroup1);

      const stationGroup2 = data.filter((x) => x.order == 2 && (x.station_id === 18 || x.station_id === 19 || x.station_id === 20 || x.station_id === 21 || x.station_id === 22));
      console.log('stationGroup2', stationGroup2);

      const stationGroup3 = data.filter((x) => x.order == 2 && (x.station_id === 15 || x.station_id === 16 || x.station_id === 17 || x.station_id === 32 || x.station_id === 33 || x.station_id === 34 || x.station_id === 35 || x.station_id === 36));
      console.log('stationGroup3', stationGroup3);
      setStations(stationGroup1);
      setStations2(stationGroup2);
      setStations3(stationGroup3);
      // setStep3Data(data.filter((x) => x.order == 3));
      // console.log('Received message from server:', data);
      // setQueueData(data);
    };

    ws.onclose = () => {
      // console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);
  // console.log(queueData);

  return (
    <Grid sx={{ background: '#bdbdbd' }}>
      <Grid
        alignItems="center"
        justifyContent="space-between"
        ref={fullscreenRef}
        sx={{
          background: '#bdbdbd',
          height: statusDisplay == false ? 'auto' : '100vh',
          minHeight: '100vh',
          flexDirection: 'column',
          display: 'flex'
        }}
      >
        <Grid container rowSpacing={3} onClick={toggleFullScreen}>
          <Grid item xs={12} sx={{ background: '#fff', pl: '2%', pr: '2%' }}>
            <Grid container alignItems="center">
              <Grid item xs={1}>
                <Stack sx={{ pb: 2, pt: 2, justifyContent: 'center', alignItems: 'left', width: '100%' }}>
                  <img src={IconLogo} width={'50%'} alt="logo" />
                  {/* <img src={IconLogo} width={'30%'} alt="logo" /> */}
                  {/* <Typography variant="h5">บริษัท ไอ ซี พี เฟอทิไลเซอร์ จำกัด</Typography> */}
                </Stack>
              </Grid>
              <Grid item xs={4} sx={{ position: 'relative' }}>
                <Divider
                  absolute
                  orientation="vertical"
                  textAlign="center"
                  sx={{
                    left: '-8%',
                    width: 0
                  }}
                />
                <Stack justifyContent="row" flexDirection="row">
                  <Typography variant="h3">วัน{nameDate + ' ที่ ' + currentDate}</Typography>
                  <ClockTime />
                </Stack>
              </Grid>
              <Grid item xs={7} sx={{ position: 'relative' }}>
                <Divider
                  absolute
                  orientation="vertical"
                  textAlign="center"
                  sx={{
                    left: '-2%',
                    width: 0
                  }}
                />
                <Box sx={{ minHeight: '5vh' }}>
                  <MainCard contentSX={{ p: '1%!important' }} sx={{ background: '#f4f4f4' }}>
                    <TextSliders />
                    {/* <InfiniteLooper speed="4" direction="right">
                      <div className="contentBlock contentBlock--one">Place the stuff you want to loop</div>
                      <div className="contentBlock contentBlock--one">right here</div>
                    </InfiniteLooper> */}
                  </MainCard>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={12} md={6} sx={{ background: '#F9D8C7', minHeight: '89vh' }}>
            <AllStations queues={stations} groupStation={1} />
          </Grid>
          <Grid xs={12} md={3} sx={{ background: '#C1E5F5', minHeight: '89vh' }}>
            <AllStations queues={stations2} groupStation={2} />
          </Grid>
          <Grid xs={12} md={3} sx={{ background: '#D9F3D0', minHeight: '89vh' }}>
            <AllStations queues={stations3} groupStation={3} />
          </Grid>
          <Grid
            xs={12}
            sx={{
              textAlign: 'left'
            }}
          >
            {/* <WeighQueue queues={step1Data} /> */}
            {/* <Step1Queue queues={step1Data} /> */}
          </Grid>
          <Grid
            xs={12}
            sx={{
              textAlign: 'left'
            }}
          >
            {/* <Step2Queue queues={step2Data} /> */}
            {/* <ReceiveQueue queues={step2Data} /> */}
          </Grid>
          {/* <Grid
            xs={12}
            sx={{
              textAlign: 'left'
            }}
          >
            <Step3Queue queues={step3Data} />
          </Grid> */}
        </Grid>
        <Grid sx={{ pt: 1, pb: 1, borderTop: '1px solid #fff', background: '#fff', width: '100%' }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default QueuesDisplay;
