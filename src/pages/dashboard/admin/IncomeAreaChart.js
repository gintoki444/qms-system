// import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import * as reportRequest from '_api/reportRequest';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
// import moment from 'moment';

// chart options
const areaChartOptions = {
  chart: {
    height: 270,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = ({ startDate, endDate }) => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([]);
  const [rawdata, setRawData] = useState([]);
  // const currentDate = moment(new Date()).format('YYYY-MM-DD');

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],

      xaxis: {
        categories: rawdata.map((item) => `${item.hour_created}:00`),
        labels: {
          style: {
            colors: [secondary]
          }
        },
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: 7
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },

      grid: {
        borderColor: line
      },
      tooltip: {
        theme: 'light'
      }
    }));
  }, [primary, secondary, line, theme, rawdata]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000); // เรียกใช้ฟังก์ชันทุก 1 นาที (60000 มิdลลิวินาที)
    return () => clearInterval(intervalId); // ลบตัวจับเวลาเมื่อคอมโพเนนต์ถูกยกเลิก
  }, [startDate, endDate]);

  const fetchData = async () => {
    getDataChart();
  };
  const getDataChart = async () => {
    await reportRequest.getDataChart(startDate, endDate).then((respronse) => {
      setRawData(respronse);
      setSeries([
        {
          name: 'จำนวนคิว',
          data: respronse.map((item) => item.queue_count)
        }
      ]);
    });
  };

  // ==============================|| Get Data ||============================== //

  return <ReactApexChart options={options} series={series} type="area" height={270} />;
};

export default IncomeAreaChart;
