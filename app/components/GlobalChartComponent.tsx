/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js';
import PropTypes from 'prop-types';
import styles from './GlobalChartComponent.css';
import SlideLeft from '../assets/images/slideleft.png';
import SlideRight from '../assets/images/slideright.png';

let myChart;

const GlobalChart = ({
  data,
  type,
  labelData,
  handleRightSwipe,
  handleLeftSwipe,
  title
  // maxRange
}) => {
  function handleMaxData() {
    if (data && data.length) {
      const maxData = Math.max(...data);
      if (maxData < 0) {
        return Math.max(...data) * -1;
      }
      return Math.max(...data) + Math.max(...data) * 0.5;
    }
    return 0;
  }

  async function handleData() {
    if (myChart) await myChart.destroy();
    const ctx = document.getElementById('myChart');
    myChart = new Chart(ctx, {
      type,
      data: {
        labels: labelData || [],
        datasets: [
          {
            data,
            borderWidth: 4,
            fill: false,
            borderColor: '#28c9b9'
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          mode: 'point'
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                max: handleMaxData(),
                maxTicksLimit: 7
              },
              scaleLabel: {
                display: true,
                labelString: 'Watt'
              },
              gridLines: {
                zeroLineColor: '#1E8BFF',
                color: 'rgba(0, 0, 0, 0)',
                zeroLineWidth: 2
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: true
                // maxTicksLimit: 16
              },
              scaleLabel: {
                display: true,
                labelString: 'Time'
              },
              gridLines: {
                zeroLineColor: '#1E8BFF',
                color: '#1E8BFF',
                zeroLineWidth: 2
              },
              type: 'time',
              time: {
                unit: 'hour',
                stepSize: 3, // I'm using 3 hour intervals here
                tooltipFormat: 'HH:mm',
                displayFormats: {
                  hour: 'HH:mm'
                }
              }
            }
          ]
        }
      }
    });
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      handleData();
    });
    return function cleanup() {
      myChart.destroy();
    };
  }, [data, labelData]);

  return (
    <div className={styles.chartParent}>
      <div className="row">
        <div
          onClick={() => {
            handleLeftSwipe();
            myChart.destroy();
          }}
          className="col-2 text-right"
        >
          <img className={styles.iconSlide} src={SlideLeft} alt="left" />
        </div>
        <div className="col-8 text-center">
          <p> {title} </p>
        </div>
        <div
          onClick={() => {
            handleRightSwipe();
            myChart.destroy();
          }}
          className="col-2"
        >
          <img className={styles.iconSlide} src={SlideRight} alt="right" />
        </div>
      </div>
      <canvas id="myChart" />
    </div>
  );
};

GlobalChart.propTypes = {
  data: PropTypes.array,
  type: PropTypes.string,
  handleRightSwipe: PropTypes.func,
  handleLeftSwipe: PropTypes.func,
  labelData: PropTypes.array,
  title: PropTypes.string
  // maxRange: PropTypes.number
};

GlobalChart.defaultProps = {
  data: [],
  type: 'line',
  handleRightSwipe: () => {},
  handleLeftSwipe: () => {},
  labelData: [],
  title: ''
  // maxRange: 1000
};

export default GlobalChart;
