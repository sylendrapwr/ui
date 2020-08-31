import React from 'react';
import PropTypes from 'prop-types';
import ScrollContainer from 'react-indiana-drag-scroll';
import styles from './ScrollableComponent.css';

function ScrollableComponent(props) {
  const { data } = props;
  function handleSuffix(x) {
    if (x === 'voltage') {
      return {
        name: 'Voltage',
        suffix: ' V'
      };
    }
    if (x === 'current') {
      return {
        name: 'Current',
        suffix: ' A'
      };
    }
    if (x === 'current1') {
      return {
        name: 'Current PV 1',
        suffix: ' A'
      };
    }
    if (x === 'current2') {
      return {
        name: 'Current PV 2',
        suffix: ' A'
      };
    }
    if (x === 'frequency' || x === 'freq') {
      return {
        name: 'Frequency',
        suffix: ' Hz'
      };
    }
    if (x === 'quality') {
      return {
        name: 'Quality',
        suffix: ''
      };
    }
    if (x === 'power') {
      return {
        name: 'Power',
        suffix: 'W'
      };
    }
    if (
      x === 'converter_temperature' ||
      x === 'temp' ||
      x === 'inverter_temperature'
    ) {
      return {
        name: 'Temperature',
        suffix: <>&deg;C</>
      };
    }
    return {
      name: x,
      suffix: ''
    };
  }

  return (
    <ScrollContainer className={styles.scrollContainer}>
      {data &&
        data.length > 0 &&
        data.map((x, index) => (
          <div key={index} className={styles.scrollContent}>
            <div>
              <p className={styles.title}>{handleSuffix(x.name).name} </p>
            </div>
            <div className="mt-1">
              <p className={styles.subtitle}>
                {x.value} {handleSuffix(x.name).suffix}{' '}
              </p>
            </div>
          </div>
        ))}
    </ScrollContainer>
  );
}

ScrollableComponent.propTypes = {
  data: PropTypes.array
};

ScrollableComponent.defaultProps = {
  data: []
};

export default ScrollableComponent;
