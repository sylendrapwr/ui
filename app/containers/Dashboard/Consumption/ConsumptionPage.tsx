import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Settings from '../../../constants/settings.json';
import GlobalChart from '../../../components/GlobalChartComponent';
import styles from './ConsumptionPage.css';
import dummy from '../../../constants/dummy.json';
import ScrollableComponent from '../../../components/ScrollableComponent';
import CardComponent from '../../../components/CardComponent';
import { getChartData } from '../../../helper/api';
import { checkConstantAdjustTime } from '../../../helper/common';

const ConsumptionPage = props => {
  const now = dayjs().format('DD');
  const { data, token, isVisible } = props;
  let useData;
  if (data) {
    useData = data;
  } else {
    useData = dummy;
  }
  const [dataScroll, setDataScroll] = useState([]);
  const [today, setToday] = useState(now);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [constantStart, setConstantStart] = useState(null);
  const [constantEnd, setConstantEnd] = useState(null);
  const [dataTime, setDataTime] = useState([]);
  const [dataValue, setDataValue] = useState([]);
  let intervalId;

  function handleValueQuality(key, value) {
    if (key === 'quality') {
      if (value === 1) {
        return 'Very Bad';
      }
      if (value === 2) {
        return 'Bad';
      }
      if (value === 3) {
        return 'Good';
      }
      if (value >= 4) {
        return 'Very Good';
      }
      if (value === 0) {
        return 'Off ';
      }
    } else {
      return value;
    }
    return value;
  }

  function getCardData() {
    const consumption = useData && useData['e-consumption'];
    const getKey = Object.getOwnPropertyNames(consumption);
    const notInclude = ['pf'];
    notInclude.forEach(x => getKey.splice(getKey.indexOf(x), 1));
    const scrollData = [];
    for (let i = 0; i < getKey.length; i++) {
      scrollData.push({
        name: getKey[i],
        value: handleValueQuality(getKey[i], consumption[getKey[i]])
      });
    }
    setDataScroll(scrollData);
  }

  async function updateChart(startTime, endTime) {
    let sendStart;
    let sendEnd;
    if (checkConstantAdjustTime(Settings.ADJUST_TIME).isAdd) {
      sendStart = dayjs(startTime)
        .add(checkConstantAdjustTime(Settings.ADJUST_TIME).addTime, 'hour')
        .format('YYYY-MM-DD HH:mm:ss');
      sendEnd = dayjs(endTime)
        .add(checkConstantAdjustTime(Settings.ADJUST_TIME).addTime, 'hour')
        .format('YYYY-MM-DD HH:mm:ss');
    } else {
      sendStart = dayjs(startTime)
        .subtract(checkConstantAdjustTime(Settings.ADJUST_TIME).addTime, 'hour')
        .format('YYYY-MM-DD HH:mm:ss');
      sendEnd = dayjs(endTime)
        .subtract(checkConstantAdjustTime(Settings.ADJUST_TIME).addTime, 'hour')
        .format('YYYY-MM-DD HH:mm:ss');
    }
    await getChartData('consumption', token, sendStart, sendEnd)
      .then(({ time, value, dataScrollNew }) => {
        setDataTime(time);
        return setDataValue(value);
      })
      .catch(e => {
        return e;
      });
  }

  async function getChart() {
    const todayDate = dayjs().format('YYYY-MM-DD 00:00:00');
    const tomorrow = dayjs(todayDate)
      .add(1, 'day')
      .format('YYYY-MM-DD HH:mm:ss');
    await setStart(todayDate);
    await setEnd(tomorrow);
    await setConstantStart(todayDate);
    await setConstantEnd(tomorrow);
    updateChart(todayDate, tomorrow);
  }

  async function handleLeftButton() {
    const newStartDate = await dayjs(start)
      .subtract(1, 'day')
      .format('YYYY-MM-DD HH:mm:ss');
    const newEndDate = await dayjs(end)
      .subtract(1, 'day')
      .format('YYYY-MM-DD HH:mm:ss');
    await setStart(newStartDate);
    await setEnd(newEndDate);
    updateChart(newStartDate, newEndDate);
  }

  async function handleRightButton(valueStart, valueEnd, isConstant) {
    const newStartDate = await dayjs(valueStart)
      .add(1, 'day')
      .format('YYYY-MM-DD HH:mm:ss');
    const newEndDate = await dayjs(valueEnd)
      .add(1, 'day')
      .format('YYYY-MM-DD HH:mm:ss');
    if (isConstant) {
      await setStart(newStartDate);
      await setEnd(newEndDate);
      await setConstantStart(newStartDate);
      await setConstantEnd(newEndDate);
      updateChart(newStartDate, newEndDate);
    } else {
      await setStart(newStartDate);
      await setEnd(newEndDate);
      updateChart(newStartDate, newEndDate);
    }
  }

  async function getIntervalChart() {
    const todaydate = await dayjs().format('DD');
    const newStartDate = await dayjs(start).format('YYYY-MM-DD HH:mm:ss');
    const newEndDate = await dayjs(end).format('YYYY-MM-DD HH:mm:ss');
    if (todaydate !== today) {
      setToday(todaydate);
      handleRightButton(constantStart, constantEnd, true);
    } else {
      updateChart(newStartDate, newEndDate);
    }
  }

  function handleInterval() {
    intervalId = setInterval(() => {
      getIntervalChart();
    }, Settings.INTERVAL_RANGE);
  }

  useEffect(() => {
    getChart();
    getCardData();
  }, [isVisible]);

  useEffect(() => {
    handleInterval();
    return function removeInterval() {
      clearInterval(intervalId);
    };
  }, [end]);
  const title = dayjs(start).format('DD MMM');

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mb-1">
          <p className={styles.title}>ENERGY CONSUMPTION</p>
        </div>
        <div className="col-8">
          <CardComponent>
            <GlobalChart
              labelData={dataTime}
              data={dataValue}
              handleLeftSwipe={handleLeftButton}
              title={title}
              handleRightSwipe={() => handleRightButton(start, end)}
              maxRange={10000}
            />
          </CardComponent>
        </div>
        <div className="col-4">
          <ScrollableComponent data={dataScroll} />
        </div>
      </div>
    </div>
  );
};

ConsumptionPage.propTypes = {
  history: PropTypes.object
};

export default ConsumptionPage;
