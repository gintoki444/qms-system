// import React, { useState, } from 'react';

import PropTypes from 'prop-types';

const SoundCall = (textCall) => {
  console.log(textCall);
  const utterance = new SpeechSynthesisUtterance(textCall);
  utterance.lang = 'th-TH';
  utterance.rate = 0.7;
  return window.speechSynthesis.speak(utterance);
};

SoundCall.propTypes = {
  textCall: PropTypes.string
};

export default SoundCall;
