import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './StoragePage.css';
import dummy from '../../../constants/dummy.json';
import CardComponent from '../../../components/CardComponent';
import BatteryComponent from '../../../components/BatteryComponent';
import SlideLeft from '../../../assets/images/slideleft.png';
import SlideRight from '../../../assets/images/slideright.png';
import ScrollableComponent from '../../../components/ScrollableComponent';

const StoragePage = props => {
  const { data } = props;
  const [activeBattery, setActiveBattery] = useState(0);
  let useData;
  let lengthData;
  if (data) {
    useData = data && data['e-harvester'][activeBattery];
    lengthData = data && data['e-harvester'] && data['e-harvester'].length;
  } else {
    useData = dummy['e-harvester'][activeBattery];
    lengthData = dummy && dummy['e-harvester'].length;
  }

  function average(arr) {
    if (arr.length > 0) {
      return arr.reduce((a, b) => a + b).toFixed(2);
    }
    return 0;
  }

  function handlePrevButton() {
    if (activeBattery <= 0) {
      return null;
    }
    return setActiveBattery(activeBattery - 1);
  }

  function handleNextButton() {
    if (activeBattery < lengthData - 1) {
      return setActiveBattery(activeBattery + 1);
    }
    return null;
  }

  function scrollComponentValue() {
    return [
      { name: 'Capacity', value: useData && `${useData.cap}Ah` },
      { name: 'Cycle', value: useData && useData.cycle },
      { name: 'Voltage', value: `${average(useData && useData.data)}V` },
      { name: 'Temperature', value: <>{useData && useData.temp1} &deg;C </> }
    ];
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mb-1">
          <p className={styles.title}>ENERGY STORAGE</p>
        </div>
        <div className="col-8">
          <CardComponent>
            <div className="row">
              <div onClick={handlePrevButton} className="col-2 text-center">
                <img alt="left" className={styles.iconSlide} src={SlideLeft} />
              </div>
              <div className="col-8">
                <p className={styles.subtitleText}>
                  {`BATTERY PACK ${activeBattery + 1}`}
                </p>
              </div>
              <div onClick={handleNextButton} className="col-2 text-center">
                <img
                  alt="right"
                  className={styles.iconSlide}
                  src={SlideRight}
                />
              </div>
            </div>
            <div className="row">
              {useData &&
                useData.data &&
                useData.data.length > 0 &&
                useData.data.map(x => <BatteryComponent value={x} />)}
            </div>
          </CardComponent>
        </div>
        <div className="col-4">
          <ScrollableComponent data={scrollComponentValue()} />
        </div>
      </div>
    </div>
  );
};

export default StoragePage;
