import React, { useRef, useEffect, useState } from 'react';
import { Grid, Stack, Typography, Divider, Box } from '@mui/material';
import IconLogo from 'assets/images/logo.png';
import AllStations from './AllStations';
import AuthFooter from 'components/cards/AuthFooter';
import TextSliders from './TextSliders';
import MainCard from 'components/MainCard';
import ClockTime from 'components/@extended/ClockTime';
import moment from 'moment/min/moment-with-locales';

const apiUrlWWS = process.env.REACT_APP_API_URL_WWS;

function QueuesDisplay() {
  const fullscreenRef = useRef(null);
  const [statusDisplay, setStatusDisplay] = useState(false);
  const [stations, setStations] = useState([]);
  const [stations2, setStations2] = useState([]);
  const [stations3, setStations3] = useState([]);
  const [currentQueue, setCurrentQueue] = useState(null); // คิวที่กำลังเรียก
  const [prevQueueToken, setPrevQueueToken] = useState(null); // เก็บ Token ล่าสุดที่เรียกไปแล้ว

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

  // ฟังก์ชันเรียกคิวด้วยเสียง
  const speakQueue = (text, callback) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH'; // ภาษาไทย
    utterance.onend = callback;
    window.speechSynthesis.speak(utterance);
  };

  // ฟังก์ชันเรียกคิว 3 ครั้ง
  const announceQueue = (queue) => {
    if (!queue) return;
    const text = `ขอเชิญคิวหมายเลข ${queue.Token} เข้าสถานีโกดัง ${queue.warehouse_name} หัวจ่ายที่ ${queue.new_station_num}`;
    console.log('Announcing:', text); // Debug
    let count = 0;
    const repeat = () => {
      if (count < 3) {
        speakQueue(text, () => {
          count++;
          if (count < 3) {
            setTimeout(repeat, 500); // รอ 0.5 วินาทีก่อนเรียกครั้งถัดไป
          } else {
            setCurrentQueue(null); // ล้างคิวปัจจุบันเมื่อเรียกครบ
            setPrevQueueToken(queue.Token); // อัปเดต Token ล่าสุดที่เรียกแล้ว
          }
        });
      }
    };
    repeat();
  };

  useEffect(() => {
    const wssurl = apiUrlWWS;
    const ws = new WebSocket(wssurl);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received data:', data);

      // กรองข้อมูลตามกลุ่มสถานี
      const stationGroup1 = data.filter(
        (x) =>
          x.status === 'processing' &&
          x.order == 2 &&
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
      );
      const stationGroup2 = data.filter(
        (x) =>
          x.status === 'processing' &&
          x.order == 2 &&
          (x.station_id === 18 || x.station_id === 19 || x.station_id === 20 || x.station_id === 21 || x.station_id === 22)
      );
      const stationGroup3 = data.filter(
        (x) =>
          x.status === 'processing' &&
          x.order == 2 &&
          (x.station_id === 15 ||
            x.station_id === 16 ||
            x.station_id === 17 ||
            x.station_id === 32 ||
            x.station_id === 33 ||
            x.station_id === 34 ||
            x.station_id === 35 ||
            x.station_id === 36)
      );

      // อัปเดตข้อมูลสถานีพร้อมคำนวณ warehouse_name และ new_station_num
      const updateStationData = (stations) =>
        stations.map((x) => ({
          ...x,
          new_station_num: x.station_name.replace(/.*หัวจ่ายที่/, ''),
          warehouse_name: x.station_name.slice(0, 2)
        }));

      const updatedStations = updateStationData(stationGroup1);
      const updatedStations2 = updateStationData(stationGroup2);
      const updatedStations3 = updateStationData(stationGroup3);

      setStations(updatedStations);
      setStations2(updatedStations2);
      setStations3(updatedStations3);

      // รวมคิวทั้งหมด
      const allQueues = [...updatedStations, ...updatedStations2, ...updatedStations3];
      if (allQueues.length > 0) {
        const latestQueue = allQueues[0]; // คิวล่าสุด
        console.log('Latest Queue:', latestQueue);
        console.log('Previous Queue Token:', prevQueueToken);
        console.log('Current Queue:', currentQueue);

        // ตรวจสอบว่าคิวใหม่แตกต่างจากคิวที่เรียกไปแล้ว และไม่มีคิวที่กำลังเรียกอยู่
        if (latestQueue.Token !== prevQueueToken && !currentQueue) {
          setCurrentQueue(latestQueue);
        }
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, [prevQueueToken, currentQueue]); // ใช้ prevQueueToken และ currentQueue เป็น dependency

  // เรียกคิวเมื่อ currentQueue เปลี่ยน
  useEffect(() => {
    if (currentQueue) {
      announceQueue(currentQueue);
    }
  }, [currentQueue]);

  const currentDate = moment().locale('th').format('LL');
  const nameDate = moment().locale('th').format('dddd');

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
                </Stack>
              </Grid>
              <Grid item xs={4} sx={{ position: 'relative' }}>
                <Divider absolute orientation="vertical" textAlign="center" sx={{ left: '-8%', width: 0 }} />
                <Stack justifyContent="row" flexDirection="row">
                  <Typography variant="h3">วัน{nameDate + ' ที่ ' + currentDate}</Typography>
                  <ClockTime />
                </Stack>
              </Grid>
              <Grid item xs={7} sx={{ position: 'relative' }}>
                <Divider absolute orientation="vertical" textAlign="center" sx={{ left: '-2%', width: 0 }} />
                <Box sx={{ minHeight: '5vh' }}>
                  <MainCard contentSX={{ p: '1%!important' }} sx={{ background: '#f4f4f4' }}>
                    <TextSliders />
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
        </Grid>
        <Grid sx={{ pt: 1, pb: 1, borderTop: '1px solid #fff', background: '#fff', width: '100%' }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default QueuesDisplay;
