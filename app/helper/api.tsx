/* eslint-disable promise/no-nesting */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable promise/always-return */
import dayjs from 'dayjs';
import axios from 'axios';
import _, { reject } from 'lodash';
import Link from '../constants/url.json';
import { promises } from 'fs';

const defaultUrl =
  process.env.NODE_ENV === 'development' ? Link.DEV_URL : Link.PRODUCTION_URL;

const handleLoginApi = serialNumber => {
  return new Promise(resolve => {
    const url = `${defaultUrl}/login`;
    const isNumber = Number(serialNumber);
    const body = {
      serial_number: Number(serialNumber)
    };
    if (!isNumber) {
      return console.log('Please check your serial number');
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(res => {
        if (res.code == 0) {
          return resolve(res);
        }
        return console.log(res.message);
      })
      .catch(e => {
        return console.log(e.message);
      });
  });
};

const getSerialNum = () => {
  return new Promise(resolve => {
    const url = `${Link.LOCAL_URL}/sn`;
    fetch(url, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(res => {
        if (res.code == 0) {
          return resolve(res);
        }
        return console.log('wrong SN');
      })
      .catch(e => {
        return console.log(e.message);
      });
  });
};

const getLocalData = () => {
  return new Promise((resolve, reject) => {
    const url = `${Link.LOCAL_URL}`;
    fetch(url, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(response => {
        return resolve(response);
      })
      .catch(() => {
        return reject();
      });
  });
};

const getDeviceInfo = token => {
  return new Promise((resolve, reject) => {
    const url = `${defaultUrl}/auth/device-information`;
    const headers = {
      Authorization: `Bearer ${token}`
    };
    fetch(url, {
      method: 'GET',
      headers
    })
      .then(res => res.json())
      .then(res => {
        return resolve(res);
      })
      .catch(e => {
        return reject(e);
      });
  });
};

const checkTokenIsValid = token => {
  return new Promise((resolve, reject) => {
    const url = `${defaultUrl}/auth/validate-token`;
    const headers = {
      Authorization: `Bearer ${token}`
    };
    fetch(url, {
      method: 'GET',
      headers
    })
      .then(res => res.json())
      .then(response => {
        return resolve(response);
      })
      .catch(e => {
        return reject(e);
      });
  });
};

const logoutHandler = token => {
  return new Promise((resolve, reject) => {
    const url = `${defaultUrl}/auth/logout`;
    const headers = {
      Authorization: `Bearer ${token}`
    };
    fetch(url, {
      method: 'POST',
      headers
    })
      .then(res => res.json())
      .then(response => {
        if (response.code === 0) {
          return resolve(response);
        }
        reject();
      })
      .catch(e => {
        return reject(e);
      });
  });
};

const relayHandler = (token, data) => {
  return new Promise((resolve, reject) => {
    const url = `${defaultUrl}/device-data/relay-endpoint`;
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const body = JSON.stringify(data);
    fetch(url, {
      method: 'POST',
      headers,
      body
    })
      .then(res => res.json())
      .then(response => {
        if (res.code === 0) {
          return resolve(response);
        }
        return reject();
      })
      .catch(e => {
        return reject(e);
      });
  });
};

const getChartData = (type, token, start, end) => {
  const url = `${defaultUrl}/device-data/energy-${type}`;
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const body = {
    start,
    end
  };
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(async response => {
        if (response.code === 0) {
          const usedData = [];
          const today = dayjs().unix();
          const pickData = _.pick(response.data, [
            'current',
            'frequency',
            'inverter_temperature',
            'quality',
            'voltage',
            'converter_temperature'
          ]);
          Object.keys(pickData).forEach(key => {
            usedData.push({
              name: key,
              value: pickData[key]
            });
          });
          if (response.data && response.data.data_log) {
            const sorting =
              response.data &&
              response.data.data_log.sort((a, b) => {
                const dateA = new Date(a.time);
                const dateB = new Date(b.time);
                return dateA - dateB;
              });
            const filterTime = sorting.filter(
              x => dayjs(x.time).unix() <= today
            );
            let time = filterTime.map(x =>
              dayjs(x.time).format('DD MMM YYYY HH:mm')
            );
            const value = filterTime.map(x => x.value);
            const a = dayjs(sorting[sorting.length - 1].time)
              .add(1, 'hour')
              .format('DD MMM YYYY HH:mm');
            time = time.concat(a);
            return resolve({ time, value, dataScrollNew: usedData });
          }
          return resolve({ time: [], value: [], dataScrollNew: usedData });
        }
        return reject();
      })
      .catch(e => {
        return reject(e);
      });
  });
};

const handleButtonSetting = data => {
  return new Promise((resolve, reject) => {
    const url = `${Link.LOCAL_URL}`;
    const headers = {
      'Content-Type': 'multipart/form-data'
    };
    if (data) {
      const formSend = new FormData();
      for (const name in data) {
        formSend.set(name, data[name]);
      }
      axios({
        method: 'post',
        url,
        headers,
        data: formSend
      })
        .then(() => {
          getLocalData()
            .then(doc => {
              return resolve(doc);
            })
            .catch(e => {
              return reject(e);
            });
        })
        .catch(() => {
          getLocalData()
            .then(doc => {
              return resolve(doc);
            })
            .catch(e => {
              return reject(e);
            });
        });
    } else {
      return reject();
    }
  });
};

export {
  handleLoginApi,
  getLocalData,
  getDeviceInfo,
  checkTokenIsValid,
  getSerialNum,
  logoutHandler,
  relayHandler,
  getChartData,
  handleButtonSetting
};
