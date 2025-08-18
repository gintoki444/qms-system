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
import { provinceMap } from './components/provinceMap';

const apiUrlWWS = process.env.REACT_APP_API_URL_WWS;

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

    // console.log('Processed:', { cleanedEntry, leadingNumber, prefix, mainNumber, suffix, province, number });
    return { province, number };
  });
}

// Component สำหรับสลับระหว่างสองบริษัท
const CompanySlideShow = ({ sahaikaset, js888, latestLoadingQueues }) => {
  const [currentCompany, setCurrentCompany] = useState('sahaikaset'); // 'sahaikaset' หรือ 'js888'
  const [isTransitioning, setIsTransitioning] = useState(false);

  // สลับบริษัททุก 24 วินาที (2 รอบ x 12 วินาที)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      // รอสักครู่ก่อนสลับเพื่อให้ transition ดูนุ่มนวล
      setTimeout(() => {
        setCurrentCompany((prevCompany) => (prevCompany === 'sahaikaset' ? 'js888' : 'sahaikaset'));
        setIsTransitioning(false);
      }, 800);
    }, 24000); // สลับทุก 24 วินาที

    return () => clearInterval(interval);
  }, []);

  const sahaikasetConfig = {
    title: 'Sahaikaset Co., Ltd.',
    color: '#7b1fa2',
    items: sahaikaset,
    height: '44.5vh',
    itemsPerPage: 3,
    latestLoadingQueue: latestLoadingQueues['SK']
  };

  const js888Config = {
    title: 'JS 888 Enterprise Co., Ltd.',
    color: '#2e7d32',
    items: js888,
    height: '44.5vh',
    itemsPerPage: 3,
    latestLoadingQueue: latestLoadingQueues['JS']
  };

  const currentConfig = currentCompany === 'sahaikaset' ? sahaikasetConfig : js888Config;

  return (
    <Box
      sx={{
        opacity: isTransitioning ? 0.7 : 1,
        transition: 'opacity 0.8s ease-in-out',
        height: '100%',
        position: 'relative'
      }}
    >
      <AutoSlidePages {...currentConfig} />
      {/* Indicator แสดงบริษัทปัจจุบัน */}
      <Box
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          gap: '4px',
          zIndex: 1
        }}
      >
        <Box
          sx={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: currentCompany === 'sahaikaset' ? '#7b1fa2' : '#ccc',
            transition: 'background-color 0.3s ease',
            boxShadow: currentCompany === 'sahaikaset' ? '0 0 5px rgba(123, 31, 162, 0.5)' : 'none'
          }}
        />
        <Box
          sx={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: currentCompany === 'js888' ? '#2e7d32' : '#ccc',
            transition: 'background-color 0.3s ease',
            boxShadow: currentCompany === 'js888' ? '0 0 5px rgba(46, 125, 50, 0.5)' : 'none'
          }}
        />
      </Box>
      {/* แสดงข้อความสถานะการสลับ */}
      {isTransitioning && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '14px',
            zIndex: 2
          }}
        >
          กำลังสลับ...
        </Box>
      )}
    </Box>
  );
};

const AutoSlidePages = ({ title, color, items, height, itemsPerPage = 7, latestLoadingQueue }) => {
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

  const renderItem = (item, i, contractors = []) => {
    console.log('contractors :', contractors);
    const licensePairs = extractLicensePairs(item.registration_no || '');
    const displayProvince = licensePairs[0]?.province || '-';
    const firstNumber = licensePairs[0]?.number || '-';
    const secondNumber = licensePairs[1]?.number || null;
    const now = Date.now();
    const isFlashing =
      (item.displayStatus === 'เรียกชั่งเบา' || item.displayStatus === 'เรียกขึ้นสินค้า') &&
      item.statusTimestamp &&
      now - item.statusTimestamp <= 30000;

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
          <Box sx={{ border: '2px solid #aaa', borderRadius: 2, px: 1.5, py: 0.5, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h5" align="center" sx={{ fontSize: '1.1vw' }} fontWeight="bold">
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
          <Typography variant="h4" sx={{ fontSize: '1.1vw', fontWeight: '800', color: '#d32f2f' }}>
            {item.Token || '-'}
          </Typography>
        </Box>
        <Box sx={{ width: '30%' }}>
          <Box
            sx={{
              px: 0,
              py: 1,
              borderRadius: 2,
              fontSize: '1vw',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            {/* ไอคอนตามสถานะ */}
            {(() => {
              switch (item.displayStatus) {
                case 'รอคำสั่งซื้อ':
                  return '🔴'; // ไอคอนแดง diamond
                case 'รอเรียกชั่งเบา':
                  return '🔵'; // ไอคอนน้ำเงิน circle
                case 'เรียกชั่งเบา':
                  return '🟡'; // ไอคอนเหลือง
                case 'รอเรียกขึ้นสินค้า':
                  return '🟠'; // ไอคอนส้ม
                case 'เรียกขึ้นสินค้า':
                  return '🟡'; // ไอคอนเหลือง
                case 'กำลังขึ้นสินค้า':
                  return '🟢'; // ไอคอนเขียว
                default:
                  return '';
              }
            })()}
            {item.displayStatus ? (
              item.displayStatus
            ) : (
              <Typography variant="h4" sx={{ fontSize: '1.1vw', fontWeight: 'bold', color: '#666', marginLeft: '25px' }}>
                -
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ width: '20%', textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontSize: '1.1vw', fontWeight: 'bold', color: '#666' }}>
            {item.contractors && item.contractors.length > 0 ? item.contractors[0].contractor_name : '-'}
          </Typography>
        </Box>
        <Box sx={{ width: '15%', textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="bold" sx={{ color: '#000' }}>
            <Box
              sx={{
                width: 45,
                height: 45,
                borderRadius: '100%',
                border: 'solid 2px #000',
                margin: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2vw',
                fontWeight: 'bold'
              }}
            >
              {item.station_name !== 'รอเรียกคิว' && item.new_station_num ? item.new_station_num : '-'}
            </Box>
          </Typography>
        </Box>
      </Box>
    );
  };
  return (
    <Box sx={{ height: height || '80vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ backgroundColor: color, color: '#fff', textAlign: 'center', py: 1 }}>
        <Typography variant="h4" fontWeight="bold">
          {title}
        </Typography>
      </Box>

      <Grid container>
        <Grid
          item
          xs={6}
          sx={{ backgroundColor: '#ffeb00', height: '5vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            คิวขึ้นสินค้าล่าสุด
          </Typography>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{ backgroundColor: '#ffeb00', height: '5vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
            {latestLoadingQueue || '-'}
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', backgroundColor: '#fff', py: 1, px: 2 }}>
        <Box sx={{ width: '30%', fontWeight: 'bold', fontSize: '1.1vw', textAlign: 'center' }}>ทะเบียนรถ</Box>
        <Box sx={{ width: '15%', fontWeight: 'bold', fontSize: '1.1vw', textAlign: 'center' }}>คิว</Box>
        <Box sx={{ width: '30%', fontWeight: 'bold', fontSize: '1.1vw', paddingLeft: '25px' }}>สถานะ</Box>
        <Box sx={{ width: '20%', fontWeight: 'bold', fontSize: '1vw', textAlign: 'center', marginTop: '2px' }}>สายแรงงาน</Box>
        <Box sx={{ width: '15%', fontWeight: 'bold', fontSize: '1.1vw', textAlign: 'center' }}>หัวจ่าย</Box>
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <SwipeableViews index={index} onChangeIndex={setIndex} enableMouseEvents>
          {pages.map((pageItems, pageIndex) => (
            <Box
              key={pageIndex}
              ref={scrollRef}
              sx={{
                maxHeight: `calc(${height || '80vh'} - 80px)`,
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

function QueueDisplayTest2() {
  const fullscreenRef = useRef(null);
  const [statusDisplay, setStatusDisplay] = useState(false);
  const [allData, setAllData] = useState([]);
  const [allContractor, setAllContractor] = useState([]);
  const [latestLoadingQueues, setLatestLoadingQueues] = useState({}); // เก็บคิวขึ้นสินค้าล่าสุดตาม prefix
  const wsRef = useRef(null);
  // const [mockQueueCounter, setMockQueueCounter] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected, connecting, connected
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  console.log('allContractor', allContractor);

  // function sortContracts(data) {
  //   return data.sort((a, b) => {
  //     // เงื่อนไข 1: contract_status เป็น "working" จะอยู่ด้านบน
  //     if (a.contract_status === 'working' && b.contract_status !== 'working') {
  //       return -1;
  //     } else if (a.contract_status !== 'working' && b.contract_status === 'working') {
  //       return 1;
  //     }

  //     // เงื่อนไข 2: ถ้า contract_status เป็น "working" ทั้งคู่ ให้เรียงตามวันที่และเวลาของ contract_update จากน้อยไปมาก
  //     if (a.contract_status === 'working' && b.contract_status === 'working') {
  //       return new Date(a.contract_update) - new Date(b.contract_update);
  //     }

  //     // เงื่อนไข 3: ถ้า contract_status เป็น "waiting" ให้เรียงตามวันที่และเวลาของ contract_update จากน้อยไปมาก
  //     if (a.contract_status === 'waiting' && b.contract_status === 'waiting') {
  //       return new Date(a.contract_update) - new Date(b.contract_update);
  //     }

  //     // เงื่อนไขสุดท้าย: เรียงตาม contractor_id ถ้าไม่เข้าเงื่อนไขอื่นๆ
  //     return a.contractor_id - b.contractor_id;
  //   });
  // }

  // ==============================|| SORTING FUNCTION ||============================== //
  // ฟังก์ชันสำหรับเรียงลำดับข้อมูลตามเงื่อนไขที่กำหนด
  const sortQueueData = useCallback((data) => {
    // ตรวจสอบและกรองข้อมูลที่ซ้ำกันของ Token ก่อนเรียงลำดับ
    const filterDuplicateTokens = (data) => {
      const tokenGroups = {};

      // จัดกลุ่มข้อมูลตาม Token
      data.forEach((item) => {
        if (!tokenGroups[item.Token]) {
          tokenGroups[item.Token] = [];
        }
        tokenGroups[item.Token].push(item);
      });

      // กรองข้อมูลที่ซ้ำกัน - เก็บเฉพาะ order ที่น้อยที่สุด
      const filteredData = [];
      Object.keys(tokenGroups).forEach((token) => {
        const items = tokenGroups[token];
        if (items.length === 1) {
          // ถ้ามีแค่ 1 รายการ ให้เก็บไว้
          filteredData.push(items[0]);
        } else {
          // ถ้ามีหลายรายการ ให้เรียงตาม order และเก็บแค่ตัวแรก (order น้อยที่สุด)
          const sortedItems = items.sort((a, b) => a.order - b.order);
          filteredData.push(sortedItems[0]);

          // Log เพื่อตรวจสอบการกรองข้อมูล
          if (items.length > 1) {
            console.log(
              `Token ${token} มี ${items.length} รายการ:`,
              items.map((item) => `order: ${item.order}`)
            );
            console.log(`เลือก order: ${sortedItems[0].order}`);
          }
        }
      });

      return filteredData;
    };

    // กรองข้อมูลที่ซ้ำกันก่อนเรียงลำดับ
    const filteredData = filterDuplicateTokens(data);

    return filteredData.sort((a, b) => {
      // 1. เรียงตาม order และ status ก่อน
      const getOrderPriority = (item) => {
        if (item.order === 1 && (!item.orders || item.orders.length === 0)) {
          return 1; // order: 1 ไม่มีข้อมูล orders
        } else if (item.order === 1 && item.orders && item.orders.length > 0) {
          return 2; // order: 1 มีข้อมูล orders
        } else if (item.order === 2 && item.status === 'waiting') {
          return 3; // order: 2 status: waiting
        } else if (item.order === 2 && item.status === 'processing') {
          return 4; // order: 2 status: processing
        }
        return 5; // กรณีอื่นๆ
      };

      const priorityA = getOrderPriority(a);
      const priorityB = getOrderPriority(b);

      // ถ้า priority ต่างกัน ให้เรียงตาม priority
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // 2. ถ้า priority เหมือนกัน ให้เรียงตาม Token จากน้อยไปมาก
      const tokenA = parseInt(a.Token?.substring(2)) || 0;
      const tokenB = parseInt(b.Token?.substring(2)) || 0;
      return tokenA - tokenB;
    });
  }, []);

  // ==============================|| LATEST LOADING QUEUE TRACKING ||============================== //
  // ฟังก์ชันสำหรับติดตามคิวขึ้นสินค้าล่าสุดตาม prefix ของ Token
  const updateLatestLoadingQueue = useCallback((newData) => {
    setLatestLoadingQueues((prevLatest) => {
      const updated = { ...prevLatest };

      // กรองข้อมูลที่มี order: 2 และ status: processing
      const processingQueues = newData.filter((item) => item.order === 2 && item.status === 'processing');

      // จัดกลุ่มตาม prefix ของ Token
      const queuesByPrefix = {};
      processingQueues.forEach((queue) => {
        const prefix = queue.Token?.substring(0, 2); // เอา 2 ตัวแรกของ Token เป็น prefix
        if (prefix) {
          if (!queuesByPrefix[prefix]) {
            queuesByPrefix[prefix] = [];
          }
          queuesByPrefix[prefix].push(queue);
        }
      });

      // หา Token ที่มากที่สุดในแต่ละ prefix
      Object.keys(queuesByPrefix).forEach((prefix) => {
        const queues = queuesByPrefix[prefix];
        // เรียงลำดับตาม Token จากมากไปน้อย
        queues.sort((a, b) => {
          const aNumber = parseInt(a.Token.substring(2)) || 0;
          const bNumber = parseInt(b.Token.substring(2)) || 0;
          return bNumber - aNumber;
        });

        // เก็บ Token ที่มากที่สุด
        if (queues.length > 0) {
          const latestToken = queues[0].Token;
          const currentLatest = prevLatest[prefix];

          // อัพเดทเฉพาะเมื่อ Token ใหม่มากกว่า Token เดิม
          if (!currentLatest || parseInt(latestToken.substring(2)) > parseInt(currentLatest.substring(2))) {
            updated[prefix] = latestToken;
          }
        }
      });

      return updated;
    });
  }, []);

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

  // ฟังก์ชันสำหรับเพิ่มคิวทดสอบแบบสุ่ม
  // สร้างข้อมูลคิวใหม่ด้วยข้อมูลสุ่มเพื่อทดสอบการแสดงผล
  // const addMockQueue = () => {
  //   const prefixes = ['IF', 'II', 'SK', 'JS'];
  //   const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  //   const provinceKeys = Object.keys(provinceMap);
  //   const randomProvince = provinceKeys[Math.floor(Math.random() * provinceKeys.length)];
  //   const newQueue = {
  //     order: 2,
  //     station_id: Math.floor(Math.random() * 30) + 1,
  //     station_name: `A${Math.floor(Math.random() * 6) + 1}/2 หัวจ่ายที่ ${Math.floor(Math.random() * 20) + 1}`,
  //     status: Math.random() > 0.5 ? 'waiting' : 'processing',
  //     Token: `${randomPrefix}${mockQueueCounter.toString().padStart(2, '0')}`,
  //     registration_no: `${randomProvince} ${Math.floor(Math.random() * 99) + 1}-${Math.floor(Math.random() * 10000)}`,
  //     displayStatus: Math.random() > 0.5 ? 'รอเรียกคิว' : 'เรียกเข้าหัวจ่าย',
  //     statusTimestamp: Date.now()
  //   };
  //   setAllData((prevData) => {
  //     const updatedData = [newQueue, ...prevData];
  //     const sortedData = sortQueueData(updatedData);
  //     updateLatestLoadingQueue(sortedData);
  //     return sortedData;
  //   });
  //   setMockQueueCounter((prev) => prev + 1);
  // };

  // ==============================|| MOCK DATA FUNCTIONS ||============================== //
  // ฟังก์ชันสำหรับโหลดข้อมูลตัวอย่างจาก mock data
  // ใช้สำหรับการทดสอบการแสดงผลโดยไม่ต้องเชื่อมต่อ WebSocket
  // const loadMockData = () => {
  //   console.log('Loading mock data for testing...');
  //   const sortedData = sortQueueData(mockQueueData);
  //   setAllData(sortedData);
  //   updateLatestLoadingQueue(sortedData);
  //   setAllContractor(mockContractorData);
  // };

  // // ฟังก์ชันสำหรับล้างข้อมูลทั้งหมด
  // // ใช้สำหรับรีเซ็ตข้อมูลเพื่อเริ่มต้นใหม่
  // const clearAllData = () => {
  //   console.log('Clearing all data...');
  //   setAllData([]);
  //   setLatestLoadingQueues({});
  //   setAllContractor([]);
  // };

  // ==============================|| WEB SOCKET CONNECTION ||============================== //
  // ฟังก์ชันสำหรับเชื่อมต่อ WebSocket เพื่อรับข้อมูล real-time
  // URL: process.env.REACT_APP_API_URL_WWS + '/queue-contractor-mix'
  // ข้อมูลที่ได้รับ: queue และ contractors
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

    const ws = new WebSocket(apiUrlWWS + '/queue-contractor-mix');
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
        console.log('WebSocket message received:', data);

        if (Array.isArray(data?.queue)) {
          setAllData((prevData) => {
            // สร้าง Map จาก prevData เพื่อค้นหา item เดิม
            const prevDataMap = new Map(prevData.map((item) => [item.Token, item]));

            // กรองและแปลงข้อมูลใหม่จาก WebSocket
            const updatedData = data?.queue
              .filter(
                (x) =>
                  (x.order === 1 || x.order === 2) && // แสดงเฉพาะ order 1 และ 2
                  x.status !== 'cancle' &&
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

                // ถ้ามี item เดิมและอยู่ในสถานะ "เรียกขึ้นสินค้า" ให้รักษา timestamp เดิม
                if (existingItem && existingItem.displayStatus === 'เรียกขึ้นสินค้า') {
                  return {
                    ...item,
                    displayStatus: 'เรียกขึ้นสินค้า',
                    statusTimestamp: existingItem.statusTimestamp, // รักษา timestamp เดิมเพื่อนับต่อ
                    new_station_num: stationNum,
                    warehouse_name: WarhouseName
                  };
                }

                // ถ้ามี item เดิมและอยู่ในสถานะ "เรียกชั่งเบา" ให้รักษา timestamp เดิม
                if (existingItem && existingItem.displayStatus === 'เรียกชั่งเบา') {
                  return {
                    ...item,
                    displayStatus: 'เรียกชั่งเบา',
                    statusTimestamp: existingItem.statusTimestamp, // รักษา timestamp เดิมเพื่อนับต่อ
                    new_station_num: stationNum,
                    warehouse_name: WarhouseName
                  };
                }

                // สำหรับ item ใหม่ - กำหนดสถานะตามเงื่อนไข
                let displayStatus = 'รอเรียกคิว';
                let statusTimestamp = null;

                if (item.order === 1) {
                  if (item.orders && item.orders.length === 0) {
                    displayStatus = 'รอคำสั่งซื้อ';
                  } else if (item.status === 'waiting' && item.orders && item.orders.length > 0) {
                    displayStatus = 'รอเรียกชั่งเบา';
                  } else if (item.status === 'processing' && item.orders && item.orders.length > 0) {
                    displayStatus = 'เรียกชั่งเบา';
                    statusTimestamp = Date.now();
                  }
                } else if (item.order === 2) {
                  if (item.status === 'waiting') {
                    displayStatus = 'รอเรียกขึ้นสินค้า';
                  } else if (item.status === 'processing') {
                    displayStatus = 'เรียกขึ้นสินค้า';
                    statusTimestamp = Date.now();
                  }
                }

                return {
                  ...item,
                  displayStatus: displayStatus,
                  statusTimestamp: statusTimestamp,
                  new_station_num: stationNum,
                  warehouse_name: WarhouseName
                };
              });

            // รักษา item ที่มีสถานะ "กำลังขึ้นสินค้า" หรือ "เรียกขึ้นสินค้า" หรือ "เรียกชั่งเบา" แต่ไม่อยู่ในข้อมูลใหม่
            const preservedData = prevData.filter(
              (item) =>
                (item.displayStatus === 'กำลังขึ้นสินค้า' ||
                  item.displayStatus === 'เรียกขึ้นสินค้า' ||
                  item.displayStatus === 'เรียกชั่งเบา') &&
                !updatedData.some((newItem) => newItem.Token === item.Token)
            );

            const finalData = [...updatedData, ...preservedData];

            // ใช้ sortQueueData ที่มีฟังก์ชันกรองข้อมูลซ้ำกันอยู่แล้ว
            const sortedData = sortQueueData(finalData);
            updateLatestLoadingQueue(sortedData);
            return sortedData;
          });
        }

        setAllContractor(data?.contractors);
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
  }, [isConnecting, allData]);

  useEffect(() => {
    // เชื่อมต่อ WebSocket เพื่อรับข้อมูล real-time
    connectWebSocket();

    // Comment การโหลด mock data เพื่อใช้ข้อมูลจริงจาก WebSocket
    // loadMockData();

    return () => {
      // ทำความสะอาดเมื่อ component unmount
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000); // ปิดแบบปกติ
      }
    };
  }, []);

  // Debug: Log latest loading queues
  useEffect(() => {
    console.log('Latest loading queues:', latestLoadingQueues);
  }, [latestLoadingQueues]);

  // Debug: Log sorted data
  useEffect(() => {
    console.log(
      'Sorted queue data:',
      allData.map((item) => ({
        Token: item.Token,
        order: item.order,
        status: item.status,
        hasOrders: item.orders && item.orders.length > 0
      }))
    );
  }, [allData]);

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
          // เปลี่ยนสถานะจาก "เรียกขึ้นสินค้า" เป็น "กำลังขึ้นสินค้า" หลัง 30 วินาที
          if (item.displayStatus === 'เรียกขึ้นสินค้า' && item.statusTimestamp && now - item.statusTimestamp >= 30000) {
            return { ...item, displayStatus: 'กำลังขึ้นสินค้า' };
          }
          return item;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ฟังก์ชันกรองคิวตาม prefix
  const filterQueues = (prefix) =>
    allData.filter(
      (q) =>
        q.Token?.startsWith(prefix) &&
        (q.order === 1 || q.order === 2) && // แสดงเฉพาะ order 1 และ 2
        q.status !== 'processed' // ซ่อนคิวที่ processed
    );

  // ฟังก์ชันกรอง contractors ตามบริษัท
  // const filterContractors = (companyId) =>
  //   allContractor.filter(
  //     (c) => c.contract_company_id === companyId && c.status === 'A' // แสดงเฉพาะ contractors ที่ active
  //   );

  // แบ่งคิวตามบริษัท
  const icpFertilizer = filterQueues('IF');
  const icpInternational = filterQueues('II');
  const sahaikaset = filterQueues('SK');
  const js888 = allData.filter(
    (q) =>
      !['IF', 'II', 'SK'].some((p) => q.Token?.startsWith(p)) &&
      (q.order === 1 || q.order === 2) && // แสดงเฉพาะ order 1 และ 2
      q.status !== 'processed'
  );

  // แบ่ง contractors ตามบริษัท
  // const yodChaoprayaContractors = filterContractors(1); // ยอดเจ้าพระยา
  // const jsPropertyContractors = filterContractors(2); // เจเอสพี ทรัพย์ทวี
  // const nadinContractors = filterContractors(3); // ณัฎฐินิช

  const now = moment().locale('th').format('dddd ที่ LL');

  // console.log('contractorList', contractorList);
  // console.log('contractorList2', contractorList2);
  // console.log('contracOtherList', contracOtherList);

  // Component สำหรับแสดงข้อมูลตัวอย่าง contractors
  const AllContractorDisplay = () => {
    // ฟังก์ชันสำหรับกำหนดสีตาม contract_status และวันที่
    const getContractorColor = (contractor) => {
      if (contractor.contract_status === 'working') {
        return '#FFCC33'; // สีเหลืองสำหรับ working
      } else if (
        contractor.contract_status === 'waiting' &&
        moment(contractor.contract_update?.slice(0, 10)).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY')
      ) {
        return '#D9D9D9'; // สีเทาสำหรับ waiting ที่เป็นวันนี้
      } else {
        return '#33C072'; // สีเขียวสำหรับ waiting อื่นๆ
      }
    };

    // ฟังก์ชันสำหรับเรียงลำดับข้อมูลตาม sortContracts function
    const sortContracts = (data) => {
      return data.sort((a, b) => {
        // เงื่อนไข 1: contract_status เป็น "working" จะอยู่ด้านบน
        if (a.contract_status === 'working' && b.contract_status !== 'working') {
          return -1;
        } else if (a.contract_status !== 'working' && b.contract_status === 'working') {
          return 1;
        }

        // เงื่อนไข 2: ถ้า contract_status เป็น "working" ทั้งคู่ ให้เรียงตามวันที่และเวลาของ contract_update จากน้อยไปมาก
        if (a.contract_status === 'working' && b.contract_status === 'working') {
          return new Date(a.contract_update) - new Date(b.contract_update);
        }

        // เงื่อนไข 3: ถ้า contract_status เป็น "waiting" ให้เรียงตามวันที่และเวลาของ contract_update จากน้อยไปมาก
        if (a.contract_status === 'waiting' && b.contract_status === 'waiting') {
          return new Date(a.contract_update) - new Date(b.contract_update);
        }

        // เงื่อนไขสุดท้าย: เรียงตาม contractor_id ถ้าไม่เข้าเงื่อนไขอื่นๆ
        return a.contractor_id - b.contractor_id;
      });
    };

    // ฟังก์ชันสำหรับแสดงเวลาจาก contract_update
    const getTimeDisplay = (contractor) => {
      if (
        contractor.contract_update &&
        moment(contractor.contract_update?.slice(0, 10)).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY')
      ) {
        return contractor.contract_update.slice(11, 16) + ' น.';
      }
      return '--:--';
    };

    // กรองและเรียงลำดับข้อมูล contractors
    const filteredContractors = allContractor?.filter((x) => x.status !== 'I' && x.contract_company_id !== 11) || [];
    const sortedContractors = sortContracts(filteredContractors);

    return (
      <Box sx={{ p: 1, background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
        {/* <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#000' }}>
          สายแรงงานทั้งหมด
        </Typography> */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: '120px', overflowY: 'auto' }}>
          {sortedContractors.map((contractor, index) => (
            <Box
              key={`contractor-${contractor.contractor_id}-${index}`}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              {/* แสดงเวลา */}
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: 10, md: '0.7vw!important' },
                  color: '#000',
                  fontWeight: 'normal',
                  display: 'none'
                }}
              >
                {getTimeDisplay(contractor)}
              </Typography>
              {/* แสดงชื่อ contractor */}
              <Box
                sx={{
                  backgroundColor: getContractorColor(contractor),
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: { xs: 12, md: '0.9vw!important' },
                  fontWeight: 'bold',
                  border: '1px solid #ccc',
                  minWidth: 'fit-content',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Box
                  sx={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: contractor.contract_status === 'working' ? '#FF6B35' : '#4CAF50',
                    flexShrink: 0
                  }}
                />
                {contractor.contractor_name}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

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
                      // display: 'flex',
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
                        backgroundColor: 'white',
                        display: 'none'
                      }}
                    />
                    {connectionStatus === 'connected'
                      ? 'เชื่อมต่อแล้ว'
                      : connectionStatus === 'connecting'
                      ? 'กำลังเชื่อมต่อ...'
                      : 'ไม่เชื่อมต่อ'}
                  </Box>
                  {/* Comment ปุ่ม mock data เพื่อใช้ข้อมูลจริงจาก WebSocket */}
                  {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={addMockQueue}
                    sx={{
                      // display: 'none',
                      height: 'fit-content',
                      mt: '0 !important',
                      mr: 1
                    }}
                  >
                    เพิ่มคิวทดสอบ
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={loadMockData}
                    sx={{
                      height: 'fit-content',
                      mt: '0 !important',
                      mr: 1
                    }}
                  >
                    โหลดข้อมูลตัวอย่าง
                  </Button> */}
                  {/* <Button
                    variant="outlined"
                    color="error"
                    onClick={clearAllData}
                    sx={{
                      height: 'fit-content',
                      mt: '0 !important',
                      mr: 1
                    }}
                  >
                    ล้างข้อมูล
                  </Button> */}
                  <Button
                    variant="outlined"
                    color="info"
                    onClick={connectWebSocket}
                    sx={{
                      display: 'none',
                      height: 'fit-content',
                      mt: '0 !important',
                      mr: 1
                    }}
                  >
                    เชื่อมต่อ WebSocket
                  </Button>
                  {/* แสดงข้อมูล contractors สำหรับการทดสอบ */}
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
            <AutoSlidePages
              title="ICP Fertilizer Co., Ltd."
              color="#d32f2f"
              items={icpFertilizer}
              latestLoadingQueue={latestLoadingQueues['IF']}
            />
          </Grid>
          <Grid item xs={4} sx={{ paddingTop: '0 !important', borderLeft: '1px solid #959595', borderRight: '1px solid #959595' }}>
            <AutoSlidePages
              title="ICP International Co., Ltd."
              color="#1976d2"
              items={icpInternational}
              latestLoadingQueue={latestLoadingQueues['II']}
            />
          </Grid>
          <Grid item xs={4} sx={{ paddingTop: '0 !important', borderLeft: '1px solid #959595', borderRight: '1px solid #959595' }}>
            <CompanySlideShow sahaikaset={sahaikaset} js888={js888} latestLoadingQueues={latestLoadingQueues} />
          </Grid>
        </Grid>
        {/* Contractor List */}
        <Grid sx={{ pt: 1, pb: 1, borderTop: '1px solid #fff', background: '#fff', width: '100%' }}>
          <AllContractorDisplay />
        </Grid>
        <Grid sx={{ pt: 1, pb: 1, borderTop: '1px solid #fff', background: '#fff', width: '100%' }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default QueueDisplayTest2;
