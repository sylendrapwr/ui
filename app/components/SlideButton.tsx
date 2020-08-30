import React from 'react';
import PropTypes from 'prop-types';

import { animated, useSpring } from 'react-spring';
import styles from './SlideButton.css';

function SlideButton(props) {
  const { isActive, onPress, offText, activeText } = props;
  let btnContainerStyles;

  const containerBtnStyles = isActive
    ? `row ${styles.insideBtnContainer} m-0 ${styles.activeColor}`
    : `row ${styles.insideBtnContainer} m-0`;
  const animatedCircle = useSpring({
    transform: isActive ? 'translate(190%)' : 'translate(0%)',
    from: {
      transform: isActive ? 'translate(190%)' : 'translate(0%)'
    },
    config: { duration: 500 }
  });
  const textAnimated = useSpring({
    transform: isActive ? 'translate(-100%)' : 'translate(20%)',
    from: {
      transform: isActive ? 'translate(-100%)' : 'translate(20%)'
    },
    config: { duration: 500 }
  });

  return (
    <button onClick={onPress} type="button" className={styles.buttonContainer}>
      <div className={containerBtnStyles}>
        <div className={styles.leftRow}>
          <animated.div style={animatedCircle} className={styles.circle} />
        </div>
        <animated.div style={textAnimated} className={styles.textContainer}>
          <p className={styles.textStyle}> {isActive ? activeText : offText} </p>
        </animated.div>
      </div>
    </button>
  );
}

SlideButton.propTypes = {
  isActive: PropTypes.bool,
  onPress: PropTypes.func,
  offText: PropTypes.string,
  activeText: PropTypes.string
};

SlideButton.defaultProps = {
  isActive: false,
  onPress: () => {},
  offText: 'test',
  activeText: 'paha'
};

export default SlideButton;
