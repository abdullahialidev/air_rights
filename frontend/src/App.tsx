import React from 'react';
import { AptosWalletAdapterProvider, useWallet } from '@aptos-labs/wallet-adapter-react';
import CreateAirRights from './components/CreateAirRights';
import AirRightsList from './components/AirRightsList';
import TransferAirRights from './components/TransferAirRights';
import './App.css';

const App: React.FC = () => {
  const { account } = useWallet();

  return (
    <AptosWalletAdapterProvider>
      <div className="app">
        <header className="app-header">
          <h1>SkyTrade: Air Rights Management</h1>
          <p className={account ? 'connected' : 'disconnected'}>
            {account ? `Connected as ${account.address}` : 'Please connect your wallet.'}
          </p>
        </header>

        <main className="app-content">
          {account ? (
            <div className="dapp-content">
              <CreateAirRights />
              <AirRightsList />
              <TransferAirRights />
            </div>
          ) : (
            <div className="connect-prompt">
              <p>Please connect your wallet to interact with the SkyTrade DApp.</p>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>SkyTrade © 2024. All rights reserved.</p>
        </footer>
      </div>
    </AptosWalletAdapterProvider>
  );
};

export default App;