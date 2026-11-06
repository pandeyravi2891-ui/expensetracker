import React from 'react';
import { WalletWithCoinLogo } from './Icons';

export const BrandPanel = () => {
  return (
    <div className="brand-panel">
      <div className="brand-logo-container">
        <WalletWithCoinLogo size={115} />
      </div>
      <h2 className="brand-name">
        <span className="brand-name-dark">Expense</span>
        <span className="brand-name-green">Tracker</span>
      </h2>
      <p className="brand-tagline">Track • Manage • Save</p>
    </div>
  );
};

