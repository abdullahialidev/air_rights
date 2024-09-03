import React, { useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const WalletConnection = ({ onConnect }) => {
  const { connect, account, wallets, connected, disconnect } = useWallet();

  useEffect(() => {
    if (connected && account) {
      onConnect(account.address);
    }
  }, [connected, account, onConnect]);

  const handleConnect = async () => {
    if (wallets.length > 0) {
      try {
        await connect(wallets[0].name);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  };

  return (
    <div>
      {!connected ? (
        <button onClick={handleConnect} disabled={wallets.length === 0}>
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>Connected: {account.address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;