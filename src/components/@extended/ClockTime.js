import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import moment from 'moment/min/moment-with-locales';

function ClockTime() {
  const [timeNow, setTimeNow] = useState();
  useEffect(() => {
    setInterval(() => setTimeNow(moment().locale('th').format('LTS')));
  }, timeNow);
  return (
    <Typography variant="h3" color="error" sx={{ ml: 1 }}>
      เวลา {timeNow} น.
    </Typography>
  );
}

export default ClockTime;
