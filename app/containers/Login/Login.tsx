/* eslint-disable promise/catch-or-return */
import React, { PureComponent, useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { connect } from 'react-redux';
import { getSerialNumber } from '../../redux/actions/app';
import styles from './Login.css';
import LOGO from '../../assets/images/logo.png';
import routes from '../../constants/routes.json';
import Serial from '../../constants/serial.json';
import { handleLoginApi, getSerialNum } from '../../helper/index';

const textAreaStyles = `form-control ${styles.textArea}`;
const loginTextRow = `col-10 ${styles.loginText}`;
const arrowIcon = `fas fa-angle-right ${styles.loginText} ${styles.arrowIcon}`;
function Login(props) {
  const [isShowTextArea, showTextArea] = useState(false);
  const [serialNumber, changeSerialNumber] = useState(Serial.SERIAL || '');
  const textAreaAnimated = useSpring({
    opacity: isShowTextArea ? 1 : 0,
    from: { opacity: isShowTextArea ? 1 : 0 }
  });
  const handleSerialNumber = () => {
    const { value } = Serial.SERIAL;
    var fs = require('fs');
    fs.readFile('.sn.txt', 'utf8', function(err, data) {
      if (err) {
        console.log(err);
      }
      var num: number = +data;
      changeSerialNumber(num);
      return console.log(num);
    });
    changeSerialNumber(value);
    // const setValue = value.replace(/\./g, '');
  };

  const handleLogin = () => {
    const { history, saveSerial } = props;
    handleLoginApi(serialNumber).then(res => {
      saveSerial(res.data);
      return history.push(routes.DASHBOARD);
    });
  };

  useEffect(() => {
    handleSerialNumber();
    handleLogin();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.verticalCenter}>
        <div>
          <img src={LOGO} className={styles.imageLogo} />
        </div>
        <div>
          <p className={styles.loginTitle}>ENERGY HARVESTER</p>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  saveSerial: serialNumber => dispatch(getSerialNumber(serialNumber))
});

const mapStateToProps = state => ({
  serial: state.app && state.app.user && state.app.user.serial_number
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
