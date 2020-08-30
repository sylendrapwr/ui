import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { animated, useSpring } from 'react-spring';
import styles from './ModalBottom.css';

function ModalBottom(props) {
  const { isVisible, hideModal, children } = props;
  const modalContentAnimation = useSpring({
    transform: isVisible ? 'translateY(0%)' : 'translateY(100%)',
    from: {
      transform: isVisible ? 'translateY(0%)' : 'translateY(100%)'
    },
    config: { duration: 300 }
  });

  return (
    <>
      <animated.div
        style={modalContentAnimation}
        className={styles.modalBottomContainer}
      >
        <animated.div
          style={modalContentAnimation}
          className={styles.modalBottomContent}
        >
          <div className="row">
            <div className="col-12 text-center pt-0 pb-3">
              <div onClick={() => hideModal()} className="p-3 w-25 m-auto">
                <button
                  onClick={() => hideModal()}
                  className={styles.buttonMinimize}
                />
              </div>
            </div>
            <div className="w-100">{children}</div>
          </div>
        </animated.div>
      </animated.div>
      <animated.div
        style={modalContentAnimation}
        className={styles.modalBackDrop}
      />
    </>
  );
}

ModalBottom.propTypes = {
  isVisible: PropTypes.bool,
  hideModal: PropTypes.func,
  children: PropTypes.node
};

ModalBottom.defaultProps = {
  isVisible: false,
  hideModal: () => {},
  children: null
};

export default ModalBottom;
