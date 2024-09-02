import React, { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const AirRightsList = () => {
  const [parcels, setParcels] = useState([]);
  const { account, signAndSubmitTransaction } = useWallet();

  useEffect(() => {
    if (account) {
      fetchParcels();
    }
  }, [account]);

  const fetchParcels = async () => {
    // Placeholder: Replace with actual smart contract interaction
    const dummyParcels = [
      { id: 1, cubicFeet: 1000, pricePerCubicFoot: 10, isListed: false },
      { id: 2, cubicFeet: 2000, pricePerCubicFoot: 15, isListed: true },
    ];
    setParcels(dummyParcels);
  };

  const handleListAirRights = async (parcelId, price) => {
    if (!account) return;

    try {
      const transaction = {
        type: "entry_function_payload",
        function: `${account.address}::air_rights::list_air_rights`,
        arguments: [parcelId, price],
        type_arguments: [],
      };

      await signAndSubmitTransaction(transaction);
      alert('Air Rights listed successfully!');
      fetchParcels(); // Refresh the list
    } catch (error) {
      console.error('Error listing Air Rights:', error);
      alert('Failed to list Air Rights. See console for details.');
    }
  };

  const handleDelistAirRights = async (parcelId) => {
    if (!account) return;

    try {
      const transaction = {
        type: "entry_function_payload",
        function: `${account.address}::air_rights::delist_air_rights`,
        arguments: [parcelId],
        type_arguments: [],
      };

      await signAndSubmitTransaction(transaction);
      alert('Air Rights delisted successfully!');
      fetchParcels(); // Refresh the list
    } catch (error) {
      console.error('Error delisting Air Rights:', error);
      alert('Failed to delist Air Rights. See console for details.');
    }
  };

  return (
    <div>
      <h2>Air Rights Parcels</h2>
      <ul>
        {parcels.map((parcel) => (
          <li key={parcel.id}>
            ID: {parcel.id}, Cubic Feet: {parcel.cubicFeet}, Price: {parcel.pricePerCubicFoot} per cubic foot
            {parcel.isListed ? (
              <button onClick={() => handleDelistAirRights(parcel.id)}>Delist</button>
            ) : (
              <button onClick={() => handleListAirRights(parcel.id, parcel.pricePerCubicFoot)}>List</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AirRightsList;