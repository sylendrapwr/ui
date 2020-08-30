/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import PowerButton from '../../../components/Powerbutton';
import SlideButton from '../../../components/SlideButton';
import { handleButtonSetting } from '../../../helper/index';
import dummy2 from '../../../constants/dummy2.json';
import styles from './setting.css';

function Setting(props) {
  const { powerValue, converter, setDashboardData } = props;
  const containerLeft = `${styles.leftContainer} col-6`;
  const containerLeft2 = `${styles.leftContainer2} col-6 mt-4`;

  function handleButtonPower() {
    let newPower;
    if (powerValue === 0) {
      newPower = 1;
    }
    if (powerValue === 1) {
      newPower = 0;
    }
    const data = {
      inv: newPower,
      cnv: converter
    };
    handleButtonSetting(data)
      .then(response => {
        return setDashboardData(response);
      })
      .catch(e => {
        return alert('Something wrong');
      });
  }

  function handleButtonConverter() {
    let newConverter;
    if (converter === 0) {
      newConverter = 1;
    }
    if (converter === 1) {
      newConverter = 0;
    }
    const data = {
      inv: powerValue,
      cnv: newConverter
    };
    handleButtonSetting(data)
      .then(response => {
        return setDashboardData(response);
      })
      .catch(e => {
        return alert('Something wrong');
      });
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className={containerLeft}>
          <h3>Power</h3>
        </div>
        <div className="col-6 text-right">
          <PowerButton
            onPress={handleButtonPower}
            isActive={powerValue === 1}
          />
        </div>
        <div className={containerLeft2}>
          <h3>Charging Source</h3>
        </div>
        <div className="col-6 mt-4 text-right">
          <SlideButton
            isActive={converter === 1}
            onPress={() => handleButtonConverter()}
            activeText="PV"
            offText="Grid"
          />
        </div>
      </div>
    </div>
  );
}

export default Setting;
