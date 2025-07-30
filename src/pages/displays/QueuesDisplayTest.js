import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Grid, Typography, Stack, Divider, Button } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import moment from 'moment/min/moment-with-locales';
import IconLogo from 'assets/images/logo.png';
import AuthFooter from 'components/cards/AuthFooter';
import TextSliders from './TextSliders';
import MainCard from 'components/MainCard';
import ClockTime from 'components/@extended/ClockTime';
import AuthBackground from 'assets/images/auth/AuthBackground';
import './style/newStyle.css';

const apiUrlWWS = process.env.REACT_APP_API_URL_WWS;

const provinceMap = {
  กบ: 'กระบี่',
  กท: 'กรุงเทพมหานคร',
  กทม: 'กรุงเทพมหานคร',
  กจ: 'กาญจนบุรี',
  กส: 'กาฬสินธุ์',
  กพ: 'กำแพงเพชร',
  ขก: 'ขอนแก่น',
  จบ: 'จันทบุรี',
  จท: 'ฉะเชิงเทรา',
  ชบ: 'ชลบุรี',
  ชน: 'ชัยนาท',
  ชย: 'ชัยภูมิ',
  ชพ: 'ชุมพร',
  ชม: 'เชียงใหม่',
  ชร: 'เชียงราย',
  ตง: 'ตรัง',
  ตก: 'ตาก',
  ตด: '	ตราด',
  นย: 'นครนายก',
  นฐ: 'นครปฐม',
  นพ: 'นครพนม',
  นม: 'นครราชสีมา',
  นศ: 'นครศรีธรรมราช',
  นว: 'นครสวรรค์',
  นบ: 'นนทบุรี',
  นธ: 'นราธิวาส',
  นน: 'น่าน',
  บก: 'บึงกาฬ',
  บร: 'บุรีรัมย์',
  ปท: 'ปทุมธานี',
  ปข: 'ประจวบคีรีขันธ์',
  ปร: 'ปราจีนบุรี',
  ปน: 'ปัตตานี',
  พย: 'พะเยา',
  พง: 'พังงา',
  อย: 'พระนครศรีอยุธยา',
  พจ: 'พิจิตร',
  พล: 'พิษณุโลก',
  พบ: 'เพชรบุรี',
  พช: 'เพชรบูรณ์',
  พร: 'แพร่',
  ภก: 'ภูเก็ต',
  มค: 'มหาสารคาม',
  มห: 'มุกดาหาร',
  มส: 'แม่ฮ่องสอน',
  ยส: 'ยโสธร',
  ยล: 'ยะลา',
  รอ: 'ร้อยเอ็ด',
  รน: 'ระนอง',
  รย: 'ระยอง',
  รบ: 'ราชบุรี',
  ลบ: 'ลพบุรี',
  ลป: 'ลำปาง',
  ลพ: 'ลำพูน',
  ลย: 'เลย',
  ศก: 'ศรีสะเกษ',
  สน: 'สกลนคร',
  สข: 'สงขลา',
  สต: 'สตูล',
  สป: 'สมุทรปราการ',
  สม: 'สมุทรสงคราม',
  สค: 'สมุทรสาคร',
  สก: 'สระแก้ว',
  สบ: 'สระบุรี',
  สห: 'สิงห์บุรี',
  สท: 'สุโขทัย',
  สพ: 'สุพรรณบุรี',
  สฎ: 'สุราษฎร์ธานี',
  สร: 'สุรินทร์',
  นค: 'หนองคาย',
  นภ: 'หนองบัวลำภู',
  อท: 'อ่างทอง',
  อจ: 'อำนาจเจริญ',
  อด: 'อุดรธานี',
  อต: 'อุตรดิตถ์',
  อน: 'อุทัยธานี',
  อบ: 'อุบลราชธานี'
};

function extractLicensePairs(license = '') {
  return license.split('/').map((entry) => {
    // ทำความสะอาด entry โดยลบจุด (.) ออกก่อน
    const cleanedEntry = entry.trim().replace(/\./g, '');

    // Regex: จับตัวเลขนำหน้า (ถ้ามี), ตัวอักษรไทยหน้า (ถ้ามี), ตัวเลขหลัก (อาจมีขีด), ตัวอักษรไทยท้าย (ถ้ามี)
    const match = cleanedEntry.match(/^([0-9]*)?([ก-ฮ]{1,3})?([0-9]{1,4}(?:-[0-9]{3,4})?)?([ก-ฮ]{1,3})?$/);
    if (!match) {
      console.log('No match for entry:', cleanedEntry);
      return { province: '', number: '' };
    }

    const leadingNumber = match[1] || ''; // ตัวเลขนำหน้า เช่น "4"
    const prefix = match[2] || ''; // ตัวอักษรไทยหน้า เช่น "ผต" หรือ "สท"
    const mainNumber = match[3] || ''; // ตัวเลขหลัก เช่น "3867" หรือ "70-3287"
    const suffix = match[4] || ''; // ตัวอักษรไทยท้าย เช่น "นฐ"

    let number = '';
    let province = '';

    if (suffix) {
      // กรณีมี suffix: รวม leadingNumber + prefix + mainNumber เป็น number
      number = leadingNumber + prefix + mainNumber;
      // ใช้ suffix เป็น province
      province = provinceMap[suffix] || '';
    } else {
      // กรณีไม่มี suffix: ใช้ mainNumber เป็น number, prefix เป็น province
      number = mainNumber.replace(/[^0-9-]/g, ''); // ทำความสะอาดให้มีเฉพาะตัวเลขและขีด
      province = prefix ? provinceMap[prefix] || '' : '';
    }

    console.log('Processed:', { cleanedEntry, leadingNumber, prefix, mainNumber, suffix, province, number });
    return { province, number };
  });
}

// function extractLicensePairs(license = '') {
//   return license.split('/').map((entry) => {
//     // ปรับ regex ให้ยืดหยุ่นมากขึ้น
//     const match = entry.trim().match(/^([ก-ฮ]{1,3})(?:[\\. ]*[\s]*([0-9]{1,4}(?:-[0-9]{3,4})?))?/);
//     if (!match) return { province: '', number: '' };

//     const prefix = match[1];
//     const number = match[2] || ''; // อาจไม่มีส่วนตัวเลข
//     const province = provinceMap[prefix] || prefix;
//     return { province, number };
//   });
// }

const AutoSlidePages = ({ title, color, items, height, itemsPerPage = 8 }) => {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const paddedItems =
    items.length === 0
      ? Array.from({ length: itemsPerPage }, () => ({}))
      : [...items, ...Array.from({ length: itemsPerPage - (items.length % itemsPerPage || itemsPerPage) }, () => ({}))];

  const pages = [];
  for (let i = 0; i < paddedItems.length; i += itemsPerPage) {
    pages.push(paddedItems.slice(i, i + itemsPerPage));
  }

  useEffect(() => {
    if (pages.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % pages.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [pages.length]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollDirection = 1;
    const scrollStep = 1;
    let pauseTimeout = null;

    const scrollInterval = setInterval(() => {
      if (isPaused) return;

      if (scrollContainer.scrollHeight <= scrollContainer.clientHeight) return;

      scrollContainer.scrollTop += scrollStep * scrollDirection;

      if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
        setIsPaused(true);
        pauseTimeout = setTimeout(() => {
          setIsPaused(false);
          scrollContainer.scrollTop = 0;
        }, 5000);
      }
    }, 50);

    return () => {
      clearInterval(scrollInterval);
      if (pauseTimeout) clearTimeout(pauseTimeout);
    };
  }, [index, items, isPaused]);

  const rowHeightVh = 89 / 10;

  const renderItem = (item, i) => {
    const licensePairs = extractLicensePairs(item.registration_no || '');
    const displayProvince = licensePairs[0]?.province || '-';
    const firstNumber = licensePairs[0]?.number || '-';
    const secondNumber = licensePairs[1]?.number || null;
    // const secondProvince = licensePairs[1]?.province ? licensePairs[1].province : displayProvince; // ใช้ province เดียวกับส่วนแรกถ้าไม่มี
    const now = Date.now();
    const isFlashing = item.displayStatus === 'เรียกเข้าหัวจ่าย' && item.statusTimestamp && now - item.statusTimestamp <= 30000;

    return (
      <Box
        key={i}
        sx={{
          height: `${rowHeightVh}vh`,
          backgroundColor: i % 2 === 0 ? '#f5f5f5' : '#e0e0e0',
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center'
        }}
        className={isFlashing ? 'flash-animate' : ''}
      >
        <Box sx={{ width: '30%' }}>
          <Box sx={{ border: '2px solid #aaa', borderRadius: 2, px: 1.5, py: 0.5, backgroundColor: '#fff' }}>
            <Typography variant="h5" align="center" sx={{ fontSize: '1.3vw' }} fontWeight="bold">
              {firstNumber} {secondNumber && '/'}
            </Typography>
            {secondNumber && (
              <Typography variant="h5" align="center" sx={{ fontSize: '0.8vw', marginTop: '-8px', marginBottom: '-3px' }} fontWeight="bold">
                {secondNumber}
              </Typography>
            )}
            {item.registration_no && (
              <Typography variant="h6" align="center" sx={{ fontSize: '0.8vw', marginTop: '-1%' }}>
                {displayProvince}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ width: '15%', textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontSize: '1.3vw', fontWeight: '800', color: { color } }}>
            {item.Token || '-'}
          </Typography>
        </Box>
        <Box sx={{ width: '33%' }}>
          <Box
            sx={{
              backgroundColor:
                item.displayStatus === 'เรียกเข้าหัวจ่าย' ? '#FFD700' : item.displayStatus === 'กำลังขึ้นสินค้า' ? '#4caf50' : '#ccc',
              color: item.displayStatus === 'เรียกเข้าหัวจ่าย' ? '#000' : '#fff',
              px: 2,
              py: 1,
              borderRadius: 2,
              textAlign: 'center',
              fontSize: '1.2vw',
              fontWeight: 'bold'
            }}
          >
            {item.displayStatus || '-'}
          </Box>
        </Box>
        <Box sx={{ width: '22%', textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="bold" sx={{ color: '#000' }}>
            {item.station_name !== 'รอเรียกคิว' && item.new_station_num ? (
              <p
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: '100%',
                  border: 'solid 2px #000',
                  margin: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 6
                }}
              >
                {item.new_station_num}
              </p>
            ) : (
              '-'
            )}
          </Typography>
        </Box>
      </Box>
    );
  };
  {
    /* ส่วนที่เหลือเหมือนเดิม */
  }
  {
    /* </Box>
    );
  }; */
  }
  // const renderItem = (item, i) => {
  //   const licensePairs = extractLicensePairs(item.registration_no || '');
  //   const displayProvince = licensePairs[0]?.province || '-';
  //   const firstNumber = licensePairs[0]?.number || '-';
  //   const secondNumber = licensePairs[1]?.number || null;
  //   const now = Date.now();
  //   const isFlashing = item.displayStatus === 'เรียกเข้าหัวจ่าย' && item.statusTimestamp && now - item.statusTimestamp <= 30000;

  //   return (
  //     <Box
  //       key={i}
  //       sx={{
  //         height: `${rowHeightVh}vh`,
  //         backgroundColor: i % 2 === 0 ? '#f5f5f5' : '#e0e0e0',
  //         px: 2,
  //         py: 1,
  //         display: 'flex',
  //         alignItems: 'center'
  //       }}
  //       className={isFlashing ? 'flash-animate' : ''}
  //     >
  //       <Box sx={{ width: '30%' }}>
  //         <Box sx={{ border: '2px solid #aaa', borderRadius: 2, px: 1.5, py: 0.5, backgroundColor: '#fff' }}>
  //           <Typography variant="h5" align="center" sx={{ fontSize: '1.3vw' }} fontWeight="bold">
  //             {firstNumber} {secondNumber && '/'}
  //           </Typography>
  //           {secondNumber && (
  //             <Typography variant="h5" align="center" sx={{ fontSize: '0.8vw', marginTop: '-8px', marginBottom: '-3px' }} fontWeight="bold">
  //               {secondNumber}
  //             </Typography>
  //           )}
  //           {item.registration_no && (
  //             <Typography variant="h6" align="center" sx={{ fontSize: '0.8vw', marginTop: '-1%' }}>
  //               {displayProvince}
  //             </Typography>
  //           )}
  //         </Box>
  //       </Box>
  //       <Box sx={{ width: '15%', textAlign: 'center' }}>
  //         <Typography variant="h4" sx={{ fontSize: '1.3vw', fontWeight: '800', color: { color } }}>
  //           {item.Token || '-'}
  //         </Typography>
  //       </Box>
  //       <Box sx={{ width: '33%' }}>
  //         <Box
  //           sx={{
  //             backgroundColor:
  //               item.displayStatus === 'เรียกเข้าหัวจ่าย' ? '#FFD700' : item.displayStatus === 'กำลังขึ้นสินค้า' ? '#4caf50' : '#ccc',
  //             color: item.displayStatus === 'เรียกเข้าหัวจ่าย' ? '#000' : '#fff',
  //             px: 2,
  //             py: 1,
  //             borderRadius: 2,
  //             textAlign: 'center',
  //             fontSize: '1.2vw',
  //             fontWeight: 'bold'
  //           }}
  //         >
  //           {item.displayStatus || '-'}
  //         </Box>
  //       </Box>
  //       <Box sx={{ width: '22%', textAlign: 'center' }}>
  //         <Typography variant="h3" fontWeight="bold" sx={{ color: '#000' }}>
  //           {item.station_name !== 'รอเรียกคิว' && item.new_station_num ? (
  //             <p
  //               style={{
  //                 width: 45,
  //                 height: 45,
  //                 borderRadius: '100%',
  //                 border: 'solid 2px #000',
  //                 margin: 'auto',
  //                 display: 'flex',
  //                 alignItems: 'center',
  //                 justifyContent: 'center'
  //               }}
  //             >
  //               {item.new_station_num}
  //             </p>
  //           ) : (
  //             '-'
  //           )}
  //         </Typography>
  //       </Box>
  //     </Box>
  //   );
  // };

  return (
    <Box sx={{ height: height || '89vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ backgroundColor: color, color: '#fff', textAlign: 'center', py: 1 }}>
        <Typography variant="h4" fontWeight="bold">
          {title}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', backgroundColor: '#fff', py: 1, px: 2 }}>
        <Box sx={{ width: '30%', fontWeight: 'bold', fontSize: '1.3vw', textAlign: 'center' }}>ทะเบียนรถ</Box>
        <Box sx={{ width: '15%', fontWeight: 'bold', fontSize: '1.3vw', textAlign: 'center' }}>คิว</Box>
        <Box sx={{ width: '33%', fontWeight: 'bold', fontSize: '1.3vw', textAlign: 'center' }}>สถานะ</Box>
        <Box sx={{ width: '22%', fontWeight: 'bold', fontSize: '1.3vw', textAlign: 'center' }}>หัวจ่าย</Box>
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <SwipeableViews index={index} onChangeIndex={setIndex} enableMouseEvents>
          {pages.map((pageItems, pageIndex) => (
            <Box
              key={pageIndex}
              ref={scrollRef}
              sx={{
                maxHeight: `calc(${height || '89vh'} - 80px)`,
                overflowY: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' }
              }}
            >
              {pageItems.map((item, i) => renderItem(item, i))}
            </Box>
          ))}
        </SwipeableViews>
        {pages.length > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 1, gap: 1, alignItems: 'center' }}>
            {pages.map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: index === i ? 14 : 10,
                  height: index === i ? 14 : 10,
                  borderRadius: '50%',
                  backgroundColor: index === i ? color : '#fefefe',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: index === i ? `2px solid ${color}` : '2px solid transparent',
                  boxShadow: index === i ? `0 0 8px ${color}40` : 'none',
                  position: 'relative',
                  '&::after':
                    index === i
                      ? {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: '#fff'
                        }
                      : {}
                }}
                onClick={() => setIndex(i)}
              />
            ))}
            {/* แสดงตัวเลขหน้า */}
            {/* <Typography
              variant="caption"
              sx={{
                ml: 2,
                color: '#666',
                fontSize: '0.9vw',
                fontWeight: 'bold',
                backgroundColor: '#f0f0f0',
                px: 1.5,
                py: 0.5,
                borderRadius: 2
              }}
            >
              {index + 1} / {pages.length}
            </Typography> */}
          </Box>
        )}
      </Box>
    </Box>
  );
};

function QueueDisplayTest() {
  const fullscreenRef = useRef(null);
  const [statusDisplay, setStatusDisplay] = useState(false);
  const [allData, setAllData] = useState([]);
  const wsRef = useRef(null);
  const [mockQueueCounter, setMockQueueCounter] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected, connecting, connected
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

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

  const addMockQueue = () => {
    const prefixes = ['IF', 'II', 'SK', 'JS'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const provinceKeys = Object.keys(provinceMap);
    const randomProvince = provinceKeys[Math.floor(Math.random() * provinceKeys.length)];
    const newQueue = {
      order: 2,
      station_id: Math.floor(Math.random() * 30) + 1,
      station_name: `A${Math.floor(Math.random() * 6) + 1}/2 หัวจ่ายที่ ${Math.floor(Math.random() * 20) + 1}`,
      status: Math.random() > 0.5 ? 'waiting' : 'processing',
      Token: `${randomPrefix}${mockQueueCounter.toString().padStart(2, '0')}`,
      registration_no: `${randomProvince} ${Math.floor(Math.random() * 99) + 1}-${Math.floor(Math.random() * 10000)}`,
      displayStatus: Math.random() > 0.5 ? 'รอเรียกคิว' : 'เรียกเข้าหัวจ่าย',
      statusTimestamp: Date.now()
    };
    setAllData((prevData) => [newQueue, ...prevData]);
    setMockQueueCounter((prev) => prev + 1);
  };

  const connectWebSocket = useCallback(() => {
    // ป้องกันการเชื่อมต่อซ้ำถ้ากำลังเชื่อมต่ออยู่หรือเชื่อมต่อแล้ว
    if (isConnecting || wsRef.current?.readyState === WebSocket.OPEN) {
      // console.log('WebSocket already connecting or connected');
      return;
    }

    // ล้าง timeout ที่อาจจะเหลืออยู่
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setIsConnecting(true);
    setConnectionStatus('connecting');
    // console.log(`WebSocket connection attempt ${reconnectAttempts.current + 1}`);

    const ws = new WebSocket(apiUrlWWS);
    wsRef.current = ws;

    // ตั้งค่า timeout สำหรับการเชื่อมต่อ
    const connectionTimeout = setTimeout(() => {
      if (ws.readyState === WebSocket.CONNECTING) {
        // console.log('WebSocket connection timeout');
        ws.close();
      }
    }, 10000); // 10 วินาที

    ws.onopen = () => {
      // console.log('WebSocket connected successfully');
      clearTimeout(connectionTimeout);
      setIsConnecting(false);
      setConnectionStatus('connected');
      reconnectAttempts.current = 0; // รีเซ็ตจำนวนครั้งที่พยายาม reconnect
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // console.log('WebSocket message received:', data?.queue);

        if (Array.isArray(data?.queue)) {
          setAllData((prevData) => {
            // สร้าง Map จาก prevData เพื่อค้นหา item เดิม
            const prevDataMap = new Map(prevData.map((item) => [item.Token, item]));

            // กรองและแปลงข้อมูลใหม่จาก WebSocket
            const updatedData = data?.queue
              .filter(
                (x) =>
                  x.order === 2 &&
                  !(
                    x.Token === 'IC06' ||
                    (x.Token === 'IF156' && x.registration_no === 'รอ.70-4497/4498') ||
                    (x.Token === 'SK04' && x.registration_no === 'นฐ.72-9039')
                  )
              )
              .map((item) => {
                const existingItem = prevDataMap.get(item.Token);
                const stationNum = item.station_name.replace(/.*หัวจ่ายที่/, '');
                const WarhouseName = item.station_name.slice(0, 2);

                // ถ้ามี item เดิมและอยู่ในสถานะ "กำลังขึ้นสินค้า" ให้รักษาสถานะและ timestamp
                if (existingItem && existingItem.displayStatus === 'กำลังขึ้นสินค้า') {
                  return {
                    ...item,
                    displayStatus: existingItem.displayStatus,
                    statusTimestamp: existingItem.statusTimestamp,
                    new_station_num: stationNum,
                    warehouse_name: WarhouseName
                  };
                }

                // ถ้ามี item เดิมและอยู่ในสถานะ "เรียกเข้าหัวจ่าย" ให้รักษา timestamp เดิม
                if (existingItem && existingItem.displayStatus === 'เรียกเข้าหัวจ่าย') {
                  return {
                    ...item,
                    displayStatus: 'เรียกเข้าหัวจ่าย',
                    statusTimestamp: existingItem.statusTimestamp, // รักษา timestamp เดิมเพื่อนับต่อ
                    new_station_num: stationNum,
                    warehouse_name: WarhouseName
                  };
                }

                // สำหรับ item ใหม่หรือ item ที่เปลี่ยนจาก 'waiting' เป็น 'processing'
                return {
                  ...item,
                  displayStatus: item.status === 'waiting' ? 'รอเรียกคิว' : 'เรียกเข้าหัวจ่าย',
                  statusTimestamp: item.status === 'processing' ? Date.now() : null,
                  new_station_num: stationNum,
                  warehouse_name: WarhouseName
                };
              });

            // รักษา item ที่มีสถานะ "กำลังขึ้นสินค้า" แต่ไม่อยู่ในข้อมูลใหม่
            const preservedData = prevData.filter(
              (item) => item.displayStatus === 'กำลังขึ้นสินค้า' && !updatedData.some((newItem) => newItem.Token === item.Token)
            );

            return [...updatedData, ...preservedData];
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      clearTimeout(connectionTimeout);
      setIsConnecting(false);
      setConnectionStatus('disconnected');

      // ตรวจสอบว่าปิดเพราะอะไร
      if (event.code !== 1000 && event.code !== 1001) {
        // ไม่ใช่การปิดปกติ
        // พยายาม reconnect ถ้ายังไม่เกินจำนวนครั้งที่กำหนด
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000); // exponential backoff สูงสุด 30 วินาที
          console.log(`Attempting to reconnect in ${delay / 1000} seconds... (${reconnectAttempts.current}/${maxReconnectAttempts})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, delay);
        } else {
          console.log('Max reconnection attempts exceeded');
        }
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      clearTimeout(connectionTimeout);
      setConnectionStatus('disconnected');
      // ไม่ต้องเรียก ws.close() ที่นี่ เพราะ onerror จะตามด้วย onclose เสมอ
    };
  }, [isConnecting, allData]); // เพิ่ม dependencies ที่จำเป็น

  useEffect(() => {
    connectWebSocket();

    return () => {
      // ทำความสะอาดเมื่อ component unmount
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000); // ปิดแบบปกติ
      }
    };
  }, []); // ใช้ empty dependency array เพื่อให้รันแค่ครั้งเดียว

  // ฟังก์ชันสำหรับ manual reconnect
  const manualReconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    reconnectAttempts.current = 0;
    setTimeout(connectWebSocket, 1000);
  }, [connectWebSocket]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setAllData((prevData) =>
        prevData.map((item) => {
          if (item.displayStatus === 'เรียกเข้าหัวจ่าย' && item.statusTimestamp && now - item.statusTimestamp >= 30000) {
            return { ...item, displayStatus: 'กำลังขึ้นสินค้า' };
          }
          return item;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filterQueues = (prefix) =>
    allData.filter(
      (q) => q.Token?.startsWith(prefix) && q.status !== 'processed' // ซ่อนคิวที่ processed
    );

  const icpFertilizer = filterQueues('IF');
  const icpInternational = filterQueues('II');
  const sahaikaset = filterQueues('SK');
  const js888 = allData.filter((q) => !['IF', 'II', 'SK'].some((p) => q.Token?.startsWith(p)) && q.status !== 'processed');

  const now = moment().locale('th').format('dddd ที่ LL');

  return (
    <Grid sx={{ background: '#bdbdbd' }}>
      <AuthBackground />
      <Grid
        alignItems="center"
        justifyContent="space-between"
        ref={fullscreenRef}
        sx={{
          background: '#bdbdbd',
          height: statusDisplay === false ? 'auto' : '100vh',
          minHeight: '100vh',
          flexDirection: 'column',
          display: 'flex'
        }}
      >
        <Grid
          container
          rowSpacing={3}
          onClick={(e) => {
            if (e.target.tagName !== 'BUTTON') {
              toggleFullScreen();
            }
          }}
        >
          <Grid item xs={12} sx={{ background: '#fff', pl: '2%', pr: '2%' }}>
            <Grid container alignItems="center">
              <Grid item xs={1}>
                <Stack sx={{ pb: 2, pt: 2, justifyContent: 'center', alignItems: 'left', width: '100%' }}>
                  <img src={IconLogo} width={'50%'} alt="logo" />
                </Stack>
              </Grid>
              <Grid item xs={4} sx={{ position: 'relative' }}>
                <Divider absolute orientation="vertical" textAlign="center" sx={{ left: '-10%', width: 0 }} />
                <Stack justifyContent="row" flexDirection="row" alignItems="center" spacing={3}>
                  <Typography variant="h3" sx={{ right: 10 }}>
                    วัน{now}
                  </Typography>{' '}
                  <ClockTime />
                  {/* แสดงสถานะการเชื่อมต่อ */}
                  <Box
                    sx={{
                      display: 'none',
                      alignItems: 'center',
                      gap: 1,
                      padding: '4px 8px',
                      borderRadius: 1,
                      backgroundColor:
                        connectionStatus === 'connected' ? '#4caf50' : connectionStatus === 'connecting' ? '#ff9800' : '#f44336',
                      color: 'white',
                      fontSize: '0.75vw'
                    }}
                  >
                    {' '}
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'white'
                      }}
                    />
                    {connectionStatus === 'connected'
                      ? 'เชื่อมต่อแล้ว'
                      : connectionStatus === 'connecting'
                      ? 'กำลังเชื่อมต่อ...'
                      : 'ไม่เชื่อมต่อ'}
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={addMockQueue}
                    sx={{ display: 'none', height: 'fit-content', mt: '0 !important' }}
                  >
                    เพิ่มคิวทดสอบ
                  </Button>
                  {/* ปุ่มสำหรับ manual reconnect */}
                  {connectionStatus === 'disconnected' && (
                    <Button variant="outlined" size="small" onClick={manualReconnect} sx={{ height: 'fit-content', mt: '0 !important' }}>
                      เชื่อมต่อใหม่
                    </Button>
                  )}
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
          <Grid item xs={4} sx={{ paddingTop: '0 !important', borderLeft: '1px solid #959595', borderRight: '1px solid #959595' }}>
            <AutoSlidePages title="ICP Fertilizer Co., Ltd." color="#d32f2f" items={icpFertilizer} />
          </Grid>
          <Grid item xs={4} sx={{ paddingTop: '0 !important', borderLeft: '1px solid #959595', borderRight: '1px solid #959595' }}>
            <AutoSlidePages title="ICP International Co., Ltd." color="#1976d2" items={icpInternational} />
          </Grid>
          <Grid item xs={4} sx={{ paddingTop: '0 !important' }}>
            <Grid container spacing={0}>
              <Grid item xs={12} sx={{ paddingTop: '0 !important', borderLeft: '1px solid #959595', borderRight: '1px solid #959595' }}>
                <AutoSlidePages title="Sahaikaset Co., Ltd." color="#7b1fa2" items={sahaikaset} height={'44.5vh'} itemsPerPage={3} />
              </Grid>
              <Grid item xs={12} sx={{ paddingTop: '0 !important', borderLeft: '1px solid #959595', borderRight: '1px solid #959595' }}>
                <AutoSlidePages title="JS 888 Enterprise Co., Ltd." color="#2e7d32" items={js888} height={'44.5vh'} itemsPerPage={3} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ pt: 1, pb: 1, borderTop: '1px solid #fff', background: '#fff', width: '100%' }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default QueueDisplayTest;
