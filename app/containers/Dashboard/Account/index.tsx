import React from 'react';

function Account(props) {
  const {detailDevice} = props
  return (
    <div className="p-3" >
      <p>Name: {detailDevice && detailDevice.name} </p>
      <p>Description: {detailDevice && detailDevice.description} </p>
      <p>Serial Number: {detailDevice && detailDevice.serial_number} </p>
      <p>Battery Pack: {detailDevice && detailDevice.battery_pack} </p>
    </div>
  );
}

export default Account;
