import React from 'react';
import { animated, useSpring } from 'react-spring';
import PropTypes from 'prop-types';
import styles from './BatteryComponent.css';

function BatteryComponent(props) {
  const { value } = props;
  let color;
  let barValue;
  const intValue = Number(value);
  if (intValue <= 0) {
    color = '#Ff0000';
    barValue = 100;
  } else if (intValue < 3.5) {
    color = '#Ff0000';
    barValue = 80;
  } else if (intValue >= 3.5 && intValue < 3.64) {
    color = '#FFFF00';
    barValue = 60;
  } else if (intValue >= 3.64 && intValue < 3.78) {
    color = '#FFFF00';
    barValue = 40;
  } else if (intValue >= 3.78 && intValue < 3.92) {
    color = '#00FF00';
    barValue = 20;
  } else {
    color = '#00FF00';
    barValue = 0;
  }
  const batteryAnimation = useSpring({
    background: `linear-gradient(180deg, #FFF ${barValue}%, ${color} 0%)`,
    from: {
      background: `linear-gradient(180deg, #FFF 100%, ${color} 0%)`
    },
    config: { duration: 500 }
  });

  return (
    <div className={styles.battery}>
      <div className={styles.smallBox} />
      <animated.div
        style={batteryAnimation}
        className={styles.batteryContainer}
      />
      <p className="text-center mt-1">{value}
        {' '}
        V
        {' '}
      </p>
    </div>
  );
}

BatteryComponent.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

BatteryComponent.defaultProps = {
  value: ''
};

export default BatteryComponent;
