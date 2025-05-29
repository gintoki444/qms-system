import React from 'react';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';

function TextSliders() {
  const slides = [
    'ยินดีต้อนรับเข้าสู่โกดังรับสินค้า บริษัท ไอ ซี พี เฟอทิไลเซอร์ จำกัด จังหวัดพระนครศรีอยุธยา','กรุณาตรวจสอบสถานะการเข้ารับสินค้าได้ผ่านหน้าจอนี้'
  ];

  // รวมข้อความเป็นเส้นยาวเพื่อให้ loop ได้ลื่นไหล
  const combinedText = slides.join(' • ') + ' • ';

  return (
    <div style={{ width: '100%', overflow: 'hidden', whiteSpace: 'nowrap' }}>
      <motion.div
        style={{
          display: 'inline-block',
          whiteSpace: 'nowrap'
        }}
        animate={{
          x: ['0%', '-100%']
        }}
        transition={{
          ease: 'linear',
          duration: 150,
          repeat: Infinity
        }}
      >
        <Typography
          variant="h5"
          sx={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: '#000'
          }}
        >
          {combinedText.repeat(10)}
        </Typography>
      </motion.div>
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import Typography from '@mui/material/Typography';
// import { motion } from 'framer-motion';

// function TextSliders({ duration }) {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const slides = [
//     { text: 'ยินดีต้อนรับเข้าสู่โกดังรับสินค้า บริษัท ไอ ซี พี เฟอทิไลเซอร์ จำกัด จังหวัดพระนครศรีอยุธยา' },
//     // { text: 'ขอขอบคุณสำหรับการใช้บริการของเรา' }
//   ];

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
//     }, duration);

//     return () => clearInterval(intervalId);
//   }, [slides, duration]);

//   return (
//     <div className="relative w-full overflow-hidden">
//       {/* Wrapping div for seamless looping */}
//       <motion.div
//         // className="flex"
//         style={{ display: 'flex', width: '100%' }}
//         animate={{
//           x: ['100%', '-70%'],
//           transition: {
//             ease: 'linear',
//             duration: 20,
//             repeat: Infinity
//           }
//         }}
//       >
//         {/* Render duplicated slides */}

//         {slides.map((slide, index) => (
//           <div
//             key={index}
//             className={`flex-shrink-0`}
//             style={{ width: `${(slides.length * 100) / slides.length}%`, opacity: index === currentIndex ? 1 : '' }}
//           >
//             <div className="flex flex-col items-center justify-center h-full text-6xl">
//               <Typography variant="h3">
//                 {slide.text}
//               </Typography>
//               {/* <Typography key={index} className={`${classes.slideText} ${index === currentIndex ? classes.active : ''}`} variant="body1">
//                 {slide.text}
//               </Typography> */}
//             </div>
//           </div>
//         ))}
//         {/* {duplicatedSlides.map((slide, index) => (
//           <div key={index} className="flex-shrink-0" style={{ width: `${100 / slides.length}%` }}>
//             <div className="flex flex-col items-center justify-center h-full text-6xl">
//               <Typography variant="h5">{slide.text}</Typography>
//             </div>
//           </div>
//         ))} */}
//       </motion.div>
//     </div>
//   );
// }
// ===============================================================================================================================
// import React, { useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Typography } from '../../../node_modules/@mui/material/index';

// // Define the array of slides with texts
// const slides = [
//   { text: 'ยินดีต้อนรับเข้าสู่โกดังรับสินค้า บริษัท ไอ.ซี.พี.เคมิคอลส์ จำกัด จังหวัดพระนครศรีอยุธยา ' },
//   { text: 'ขอขอบคุณสำหรับการใช้บริการของเรา' }
// ];

// function TextSliders() {
//   // Duplicate the slides array to ensure seamless looping
//   const duplicatedSlides = [...slides, ...slides];
//   useEffect(() => {
//     // const intervalId = setInterval(() => {
//     //   setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
//     // }, duration);
//     // return () => clearInterval(intervalId);
//   }, []);
//   return (
//     <div className="relative w-full overflow-hidden">
//       {/* Wrapping div for seamless looping */}
//       <motion.div
//         // className="flex"
//         style={{ display: 'flex', width: '100%' }}
//         animate={{
//           x: ['100%', '-100%'],
//           transition: {
//             ease: 'linear',
//             duration: 20,
//             repeat: Infinity
//           }
//         }}
//       >
//         {/* Render duplicated slides */}
//         {duplicatedSlides.map((slide, index) => (
//           <div key={index} className="flex-shrink-0" style={{ width: `${100 / slides.length}%` }}>
//             <div className="flex flex-col items-center justify-center h-full text-6xl">
//               <Typography variant="h5">{slide.text}</Typography>
//             </div>
//           </div>
//         ))}
//       </motion.div>
//     </div>
//   );
// }

export default TextSliders;
