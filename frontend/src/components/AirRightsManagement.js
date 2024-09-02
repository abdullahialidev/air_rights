import React, { useState, useEffect } from 'react';
import WalletConnection from './WalletConnection';
import AirRightsList from './AirRightsList';
import CreateAirRights from './CreateAirRights';
import TransferAirRights from './TransferAirRights';
import AirRightsDetail from './AirRightsDetail';

const AirRightsManagement = () => {
  const [airRightsParcels, setAirRightsParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    if (walletAddress) {
      fetchAirRightsParcels();
    }
  }, [walletAddress]);

  const fetchAirRightsParcels = async () => {
    try {
      // TODO: Fetch parcels from the blockchain using walletAddress
      const fetchedParcels = [
        { id: 1, cubicFeet: 1000, pricePerCubicFoot: 10, isListed: false },
        { id: 2, cubicFeet: 2000, pricePerCubicFoot: 15, isListed: true },
      ]; // Replace with actual blockchain data
      setAirRightsParcels(fetchedParcels);
    } catch (error) {
      console.error('Error fetching air rights parcels:', error);
    }
  };

  const handleCreateAirRights = async (cubicFeet, pricePerCubicFoot) => {
    try {
      const newParcel = { cubicFeet, pricePerCubicFoot, id: airRightsParcels.length + 1, isListed: false };
      // Call smart contract to create the parcel
      setAirRightsParcels([...airRightsParcels, newParcel]);
      alert('Air Rights Parcel Created!');
    } catch (error) {
      console.error('Error creating air rights:', error);
      alert('Failed to create air rights.');
    }
  };

  const handleTransferAirRights = async (parcelId, toAddress) => {
    try {
      // TODO: Call smart contract to transfer air rights
      const updatedParcels = airRightsParcels.filter(parcel => parcel.id !== parcelId);
      setAirRightsParcels(updatedParcels);
      alert('Air Rights transferred successfully!');
    } catch (error) {
      console.error('Error transferring air rights:', error);
      alert('Failed to transfer air rights.');
    }
  };

  const handleListAirRights = async (parcelId, price) => {
    try {
      // TODO: Call smart contract to list air rights
      const updatedParcels = airRightsParcels.map(parcel =>
        parcel.id === parcelId ? { ...parcel, isListed: true, pricePerCubicFoot: price } : parcel
      );
      setAirRightsParcels(updatedParcels);
      alert('Air Rights listed successfully!');
    } catch (error) {
      console.error('Error listing air rights:', error);
      alert('Failed to list air rights.');
    }
  };

  const handleDelistAirRights = async (parcelId) => {
    try {
      // TODO: Call smart contract to delist air rights
      const updatedParcels = airRightsParcels.map(parcel =>
        parcel.id === parcelId ? { ...parcel, isListed: false } : parcel
      );
      setAirRightsParcels(updatedParcels);
      alert('Air Rights delisted successfully!');
    } catch (error) {
      console.error('Error delisting air rights:', error);
      alert('Failed to delist air rights.');
    }
  };

  const handleSelectParcel = (parcel) => {
    setSelectedParcel(parcel);
  };

  return (
    <div>
      <h1>Air Rights Management</h1>
      <WalletConnection onConnect={setWalletAddress} />
      {walletAddress && (
        <>
          <CreateAirRights onCreateAirRights={handleCreateAirRights} />
          <AirRightsList
            parcels={airRightsParcels}
            onSelectParcel={handleSelectParcel}
            onListAirRights={handleListAirRights}
            onDelistAirRights={handleDelistAirRights}
          />
          <TransferAirRights airRightsParcels={airRightsParcels} onTransferAirRights={handleTransferAirRights} />
          {selectedParcel && <AirRightsDetail parcel={selectedParcel} />}
        </>
      )}
    </div>
  );
};

export default AirRightsManagement;