import React from 'react';

const AirRightsDetail = ({ parcel }) => {
  return (
    <div>
      <h3>Parcel Details</h3>
      <p>ID: {parcel.id}</p>
      <p>Cubic Feet: {parcel.cubicFeet}</p>
      <p>Price: {parcel.pricePerCubicFoot}</p>
      <p>Listed: {parcel.isListed ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default AirRightsDetail;