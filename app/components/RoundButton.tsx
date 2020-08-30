import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { useTransition, animated, useSpring } from 'react-spring';
import styles from './RoundButton.css';

function RoundButton(props) {
  const {
    percentage,
    title,
    isWh,
    isOpenSidebar,
    activeIndex,
    onClick,
    index
  } = props;
  const isActive = index === activeIndex;
  const animatedSizeButton = useSpring({
    height: isOpenSidebar ? '20vh' : '30vh',
    borderRadius: isOpenSidebar ? '10vh' : '15vh',
    width: isOpenSidebar ? '20vh' : '30vh',
    from: {
      height: isOpenSidebar ? '20vh' : '30vh',
      borderRadius: isOpenSidebar ? '10vh' : '15vh',
      width: isOpenSidebar ? '20vh' : '30vh'
    },
    config: { duration: 500 }
  });
  const animatedSizeButtonChild = useSpring({
    height: isOpenSidebar ? '12.5vh' : '20vh',
    borderRadius: isOpenSidebar ? '6.75vh' : '10vh',
    width: isOpenSidebar ? '12.5vh' : '20vh',
    fontSize: isOpenSidebar ? '2.3vh' : '3.5vh',
    padding: isOpenSidebar ? '1vh 1vh' : '3vh 1vh',
    backgroundColor: isActive ? '#fff' : 'white',
    from: {
      height: isOpenSidebar ? '12.5vh' : '20vh',
      borderRadius: isOpenSidebar ? '6.75vh' : '10vh',
      width: isOpenSidebar ? '12.5vh' : '20vh',
      fontSize: isOpenSidebar ? '2.2vh' : '3.5vh',
      padding: isOpenSidebar ? '1vh 1vh' : '3vh 1vh',
      backgroundColor: isActive ? '#fff' : 'white'
    },
    config: { duration: 500 }
  });

  const animatedTitle = useSpring({
    fontSize: isOpenSidebar ? '3vh' : '4vh',
    from: {
      fontSize: isOpenSidebar ? '3vh' : '4vh'
    },
    config: { duration: 500 }
  });
  const animatedRoundBtnText = useSpring({
    height: isOpenSidebar ? '10vh' : '14vh',
    width: isOpenSidebar ? '10vh' : '14vh',
    fontSize: isOpenSidebar ? '2vh' : '3vh',
    padding: isOpenSidebar ? '3vh 0vh' : '4.5vh .25vh',
    from: {
      height: isOpenSidebar ? '10vh' : '14vh',
      width: isOpenSidebar ? '10vh' : '14vh',
      fontSize: isOpenSidebar ? '2vh' : '3vh',
      padding: isOpenSidebar ? '3vh 0vh' : '4.5vh .25vh'
    },
    config: { duration: 500 }
  });

  return (
    <div>
      <animated.p style={animatedTitle} className={styles.titleText}>
        {' '}
        {title}
{' '}
      </animated.p>
      <animated.button
        style={animatedSizeButton}
        type="button"
        className={styles.round}
        onClick={onClick}
      >
        {!isWh ? (
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            background
            styles={{
              background: {
                fill: '#E0E3F2'
              },
              path: {
                stroke: '#1e8bff'
              },
              trail: {
                stroke: '#163259'
              }
            }}
          />
        ) : (
          <animated.div
            style={animatedSizeButtonChild}
            className={styles.shadowRound}
          >
            <animated.div style={animatedRoundBtnText}>
              {percentage} W
            </animated.div>
          </animated.div>
        )}
      </animated.button>
    </div>
  );
}

RoundButton.propTypes = {
  percentage: PropTypes.number,
  title: PropTypes.string,
  isWh: PropTypes.bool,
  isOpenSidebar: PropTypes.bool,
  onClick: PropTypes.func
};

RoundButton.defaultProps = {
  percentage: 66,
  title: 'Production',
  isWh: false,
  isOpenSidebar: false,
  onClick: () => {}
};

export default RoundButton;
