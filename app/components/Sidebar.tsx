import React, { useState, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import PropTypes from 'prop-types';
import styles from './Sidebar.css';
import SettingImage from '../assets/images/setting.png';
import HelpImage from '../assets/images/help.png';
import SettingActive from '../assets/images/setting-medium icon.png';
import UserActive from '../assets/images/user-medium.png';
import HelpActive from '../assets/images/help-medium.png';
import User from '../assets/images/user.png';
import Setting from '../containers/Dashboard/Setting';
import Account from '../containers/Dashboard/Account';
import Help from '../containers/Dashboard/Help';
import { checkTokenIsValid } from '../helper';

function Sidebar(props) {
  const {
    openLeftBar,
    onClose,
    token,
    onLogout,
    detailDevice,
    powerValue,
    converter,
    setDashboardData
  } = props;
  const [activeMenu, setActiveMenu] = useState(null);

  const sidebarStyles = `col-3 ${styles.sidebar}`;
  const closeIconStyles = `fas fa-chevron-left fa-3x ${styles.closeBtn}`;
  // const modalContainer = openLeftBar
  //   ? styles.transparentContainer
  //   : `${styles.transparentContainer} ${styles.hide}`;
  const modalBackDrop = openLeftBar
    ? styles.modalBackdrop
    : `${styles.modalBackdrop} ${styles.hide}`;
  const animation = useSpring({
    transform: openLeftBar ? 'translateX(0%)' : 'translateX(-100%)',
    from: { transform: openLeftBar ? 'translateX(0%)' : 'translateX(-100%)' },
    config: { duration: 300 }
  });
  const animationPage = useSpring({
    transform: activeMenu !== null ? 'translateX(0%)' : 'translateX(-100%)',
    from: {
      transform: activeMenu !== null ? 'translateX(0%)' : 'translateX(-100%)'
    },
    config: { duration: 300 }
  });

  const sidebarMenu = [
    { name: 'Setting', icon: SettingImage, activeIcon: SettingActive },
  ];

  const handleOnClose = () => {
    onClose();
    setActiveMenu(null);
  };

  const handleComponent = () => {
    if (activeMenu === 0) {
      return (
        <Setting
          setDashboardData={setDashboardData}
          converter={converter}
          powerValue={powerValue}
        />
      );
    }
    /*if (activeMenu === 1) {
      return <Account detailDevice={detailDevice} />;
    }
    if (activeMenu === 2) {
      return <Help />;
    }*/
  };

  const handleIconStyles = index => {
    if (activeMenu === index) {
      return styles.iconActive;
    }
    if (index === 2 && activeMenu !== index) {
      return `${styles.iconNotActive} ${styles.adjustHeight}`;
    }
    return styles.iconNotActive;
  };

  function checkToken() {
    checkTokenIsValid(token)
      .then(res => {
        if (!res.data) {
          return onLogout();
        }
        return null;
      })
      .catch(e => {
        return onLogout();
      });
  }
  useEffect(() => {
    checkToken();
  }, [activeMenu]);

  return (
    <div>
      <animated.div style={animation} className={sidebarStyles}>
        <div className={styles.sidebarButton}>
          <div className="w-25 text-center ml-auto">
            <i onClick={handleOnClose} className={closeIconStyles} />
          </div>
        </div>
        <div className="row pt-5">
          {sidebarMenu.map((x, index) => (
            <div
              onClick={() => setActiveMenu(index)}
              key={index}
              className="col-12 mb-2"
            >
              <div className="row">
                <div className={styles.menuTextContainer}>
                  <p
                    className={
                      activeMenu === index ? styles.activeMenuText : ''
                    }
                  >
                    {x && x.name}
                  </p>
                </div>
                <div
                  className={
                    activeMenu === index
                      ? styles.iconMenuContainerActive
                      : styles.iconMenuContainer
                  }
                >
                  <div>
                    <img
                      className={handleIconStyles(index)}
                      src={activeMenu === index ? x.activeIcon : x.icon}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </animated.div>
      <div className={modalBackDrop} />
      <animated.div style={animationPage} className={styles.modalWhite}>
        <div className="row">
          <div className="col-3" />
          <div className="col-9">
            <div className="container">{handleComponent()}</div>
          </div>
        </div>
      </animated.div>
    </div>
  );
}

Sidebar.propTypes = {
  openLeftBar: PropTypes.bool,
  onClose: PropTypes.func,
  token: PropTypes.string,
  onLogout: PropTypes.func,
  detailDevice: PropTypes.object,
  powerValue: PropTypes.number,
  converter: PropTypes.number,
  setDashboardData: PropTypes.func
};

Sidebar.defaultProps = {
  openLeftBar: false,
  onClose: () => {},
  token: '',
  onLogout: () => {},
  detailDevice: {},
  powerValue: 0,
  converter: 0,
  setDashboardData: () => {}
};

export default Sidebar;
