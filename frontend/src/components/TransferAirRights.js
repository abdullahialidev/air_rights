import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const TransferAirRights = () => {
  const [parcelId, setParcelId] = useState('');
  const [toAddress, setToAddress] = useState('');
  const { account, signAndSubmitTransaction } = useWallet();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) return;

    try {
      const transaction = {
        type: "entry_function_payload",
        function: `${account.address}::air_rights::transfer_air_rights`,
        arguments: [toAddress, parcelId],
        type_arguments: [],
      };

      await signAndSubmitTransaction(transaction);
      alert('Air Rights transferred successfully!');
      setParcelId('');
      setToAddress('');
    } catch (error) {
      console.error('Error transferring Air Rights:', error);
      alert('Failed to transfer Air Rights. See console for details.');
    }
  };

  return (
    <div>
      <h2>Transfer Air Rights</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={parcelId}
          onChange={(e) => setParcelId(e.target.value)}
          placeholder="Parcel ID"
          required
        />
        <input
          type="text"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          placeholder="Recipient Address"
          required
        />
        <button type="submit">Transfer</button>
      </form>
    </div>
  );
};

export default TransferAirRights;