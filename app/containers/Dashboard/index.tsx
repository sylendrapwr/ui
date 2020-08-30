import React, { PureComponent, useState, useEffect } from 'react';
import { useTransition, animated, useSpring } from 'react-spring';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Collapse, Navbar, Nav } from 'reactstrap';
import {
  getLocalData,
  getDeviceInfo,
  checkTokenIsValid,
  handleLoginApi
} from '../../helper';
import Settings from '../../constants/settings.json';
import User from '../../assets/images/user.png';
import styles from './Dashboard.css';
import Sidebar from '../../components/Sidebar';
import routes from '../../constants/routes.json';
import RoundButton from '../../components/RoundButton';
import dummy from '../../constants/dummy.json';
import ModalBottom from '../../components/ModalBottom';
import { getSerialNumber } from '../../redux/actions/app';
import ConsumptionPage from './Consumption/ConsumptionPage';
import StoragePage from './Storage/StoragePage';
import ProductionPage from './Production/ProductionPage';
import { logoutHandler, relayHandler, getChartData } from '../../helper/api';

function Dashboard(props) {
  const [openLeftBar, setOpenLeftBar] = useState(false);
  const [isOpenUserMenu, setOpenUserMenu] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailDevice, setDetailDevice] = useState(null);
  const [isErrorLocal, setErrorLocal] = useState(false);
  const { token, history, removeSerial, serialNumber, saveSerial } = props;
  let counter = 0;
  let intervalId;
  const animatedBox = useSpring({
    width: openLeftBar ? '75%' : '100%',
    from: { transform: openLeftBar ? '75%' : '100%' },
    config: { duration: 300 }
  });
  const animatedUser = useSpring({
    opacity: isOpenUserMenu ? 1 : 0,
    from: {
      opacity: isOpenUserMenu ? 1 : 0
    },
    config: { duration: 300 }
  });

  const hamburgerStyles = `fas fa-bars fa-3x ${styles.hamburgerColor}`;
  const userStyles = `${styles.hamburgerColor} ${styles.userIcon}`;
  const userTextStyles = `p-3  ${styles.hamburgerColor}`;
  const detailUserStyles = `${styles.userDetail} p-3`;

  function handleRelay(data) {
    relayHandler(token, data)
      .then(res => {
        return res;
      })
      .catch(e => {
        return e;
      });
  }

  function handleLocalData() {
    getLocalData()
      .then(res => {
        setErrorLocal(false);
        counter++;
        if (counter === 15) {
          handleRelay(res);
          counter = 0;
        }
        return setDashboardData(res);
      })
      .catch(e => {
        setErrorLocal(true);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        confirmWindow();
      });
  }

  function confirmWindow() {
    const win = window.confirm(
      'Cannot get data from API local, start connect to local API again'
    );
    if (win === true) {
      return handleLocalData();
    }
    return null;
  }

  function deviceInfo() {
    getDeviceInfo(token)
      .then(res => {
        if (res.code === 0) {
          return setDetailDevice(res.data);
        }
        return null; // alert('Cannot get device name');
      })
      .catch(e => {
        return null; // alert(e.message);
      });
  }

  useEffect(() => {
    handleLocalData();
    deviceInfo();
  }, []);

  useEffect(() => {
    intervalId = setInterval(() => {
      if (!isErrorLocal) {
        handleLocalData();
      }
    }, Settings.RELAY_TIME);
    return function removeInterval() {
      clearInterval(intervalId);
    };
  }, [isErrorLocal]);

  function onLogout() {
    logoutHandler(token)
      .then(res => {
        history.replace(routes.LOGIN);
        return removeSerial();
      })
      .catch(e => {
        return null; // alert('Wrong token');
      });
  }

  function handleLogin() {
    handleLoginApi(serialNumber).then(res => {
      saveSerial(res.data);
    });
  }

  function checkToken() {
    checkTokenIsValid(token)
      .then(res => {
        if (!res.data) {
          return onLogout();
        }
        return null;
      })
      .catch(e => {
        return handleLogin();
      });
  }

  useEffect(() => {
    checkToken();
  }, [openLeftBar, modalVisible, isOpenUserMenu]);

  const listButton = [
    {
      title: 'CONSUMPTION',
      percentage:
        (dashboardData && dashboardData.consumption) || dummy.consumption,
      isWh: true
    },
    {
      title: 'STORAGE',
      percentage: (dashboardData && dashboardData.storage) || dummy.storage,
      isWh: false
    },
    {
      title: 'PRODUCTION',
      percentage:
        (dashboardData && dashboardData.production) || dummy.production,
      isWh: true
    }
  ];

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleRoundButton = index => {
    setActiveIndex(index);
    setModalVisible(true);
  };

  const handleActiveModalComponent = () => {
    if (activeIndex === 0) {
      return (
        <ConsumptionPage
          isVisible={modalVisible}
          token={token}
          data={dashboardData}
        />
      );
    }
    if (activeIndex === 1) {
      return <StoragePage data={dashboardData} />;
    }
    if (activeIndex === 2) {
      return (
        <ProductionPage
          isVisible={modalVisible}
          token={token}
          data={dashboardData}
        />
      );
    }
  };

  const renderDashboard = () => (
    <>
      {listButton.map((x, index) => (
        <div key={index} className="col-4">
          <RoundButton
            onClick={() => handleRoundButton(index)}
            isOpenSidebar={openLeftBar}
            isWh={x.isWh}
            percentage={x.percentage}
            title={x.title}
            activeIndex={activeIndex}
            index={index}
          />
        </div>
      ))}
    </>
  );
  return (
    <div>
      <Navbar color="light" light expand="sm">
        <Collapse navbar>
          <Nav className="ml-auto" navbar>
            <p className={detailUserStyles}>
              Hi, {(detailDevice && detailDevice.name) || ''}!
            </p>
            <img
              src={User}
              className={userStyles}
            />
          </Nav>
        </Collapse>
      </Navbar>
      <ModalBottom hideModal={hideModal} isVisible={modalVisible}>
        {handleActiveModalComponent()}
      </ModalBottom>
      <div className="row">
        <animated.div style={animatedBox} className="ml-auto">
          <div className={styles.mainContainer}>
            <div className={styles.verticalCenter}>
              <div className={styles.rowContainer}>
                <div className="row">{renderDashboard()}</div>
              </div>
            </div>
          </div>
        </animated.div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  token: state.app && state.app.user && state.app.user.token,
  serialNumber: state.app && state.app.user && state.app.user.serialNumber
});

const mapDispatchToProps = dispatch => ({
  removeSerial: () => dispatch(getSerialNumber(null)),
  saveSerial: serialNumber => dispatch(getSerialNumber(serialNumber))
});

Dashboard.propTypes = {
  token: PropTypes.string,
  history: PropTypes.object,
  removeSerial: PropTypes.func,
  saveSerial: PropTypes.func,
  serialNumber: PropTypes.number
};

Dashboard.defaultProps = {
  token: '',
  history: {},
  removeSerial: () => {},
  saveSerial: () => {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
