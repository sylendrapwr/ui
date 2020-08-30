import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './PowerButton.css';

function PowerButton(props) {
  const { isActive, onPress } = props;
  let iconClass;
  if (isActive) {
    iconClass = `fas fa-power-off fa-3x ${styles.activeIcon}`;
  } else {
    iconClass = `fas fa-power-off fa-3x ${styles.inactiveIcon}`;
  }

  return (
    <button type="button" onClick={onPress} className={styles.buttonContainer}>
      <div >
        <div>
          <i className={iconClass} />
        </div>
      </div>
    </button>
  );
}

PowerButton.propTypes = {
  isActive: PropTypes.bool,
  onPress: PropTypes.func
};

PowerButton.defaultProps = {
  isActive: false,
  onPress: () => {}
};

export default PowerButton;
