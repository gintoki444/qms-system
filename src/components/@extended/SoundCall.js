// import React, { useState, } from 'react';

import PropTypes from 'prop-types';

const SoundCall = (textCall) => {
  // แปลงตัวเลขและตัวอักษรภาษาอังกฤษเป็นคำอ่านภาษาไทย
  const words = textCall.split(' ').map((word) => {
    if (!isNaN(parseInt(word))) {
      return convertNumberToThai(parseInt(word));
    } else if (isThaiCharacter(word[0])) {
      return word;
    } else {
      return convertWordToThai(word);
    }
  });

  const txtCover = words.join(' ');

  const utterance = new SpeechSynthesisUtterance(txtCover);
  utterance.lang = 'th-TH';
  utterance.rate = 0.7;
  return window.speechSynthesis.speak(utterance);
};

function isThaiCharacter(char) {
  // ตรวจสอบว่าเป็นตัวอักษรภาษาไทยหรือไม่
  const thaiRegex = /[\u0E00-\u0E7F]/;
  return thaiRegex.test(char);
}

const thaiNumberWords = [
  'ศูนย์',
  'หนึ่ง',
  'สอง',
  'สาม',
  'สี่',
  'ห้า',
  'หก',
  'เจ็ด',
  'แปด',
  'เก้า',
  'สิบ',
  'สิบเอ็ด',
  'สิบสอง',
  'สิบสาม',
  'สิบสี่',
  'สิบห้า',
  'สิบหก',
  'สิบเจ็ด',
  'สิบแปด',
  'สิบเก้า',
  'ยี่สิบ',
  'ยี่สิบเอ็ด',
  'ยี่สิบสอง',
  'ยี่สิบสาม',
  'ยี่สิบสี่',
  'ยี่สิบห้า',
  'ยี่สิบหก',
  'ยี่สิบเจ็ด',
  'ยี่สิบแปด',
  'ยี่สิบเก้า',
  'สามสิบ'
];

const thaiEnglishWords = {
  a: 'เอ',
  b: 'บี',
  c: 'ซี',
  d: 'ดี',
  e: 'อี',
  f: 'เอฟ',
  g: 'จี',
  h: 'เอช',
  i: 'ไอ',
  j: 'เจ',
  k: 'เค',
  l: 'แอล',
  m: 'เอ็ม',
  n: 'เอ็น',
  o: 'โอ',
  p: 'พี',
  q: 'คิว',
  r: 'อาร์',
  s: 'เอส',
  t: 'ที',
  u: 'ยู',
  v: 'วี',
  w: 'ดับเบิลยู',
  x: 'เอ็กซ์',
  y: 'วาย',
  z: 'แซด'
};

function convertNumberToThai(num) {
  if (num === 0) {
    return 'ศูนย์';
  }

  let result = '';
  const numStr = num.toString();
  if (numStr > 9) {
    const digit = parseInt(numStr);
    result += thaiNumberWords[digit];
  } else {
    for (let i = 0; i < numStr.length; i++) {
      const digit = parseInt(numStr[i]);
      result += thaiNumberWords[digit];

      if (i !== numStr.length - 1) {
        result += ' ';
      }
    }
  }
  return result;
}

function convertWordToThai(word) {
  let result = '';
  for (let i = 0; i < word.length; i++) {
    const char = word[i].toLowerCase();
    if (!isNaN(parseInt(char))) {
      result += convertNumberToThai(parseInt(char));
    } else if (thaiEnglishWords[char]) {
      result += thaiEnglishWords[char];
    } else {
      result += char;
    }
    if (i !== word.length - 1) {
      result += ' ';
    }
  }
  return result;
}

SoundCall.propTypes = {
  textCall: PropTypes.string
};

export default SoundCall;
