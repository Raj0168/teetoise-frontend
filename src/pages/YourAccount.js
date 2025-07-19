import React from 'react';
import AccountDetails from '../components/account/AccountDetails';
import AddressManagement from '../components/account/AddressManagement';

const YourAccount = () => {
  return (
    <div>
      <AccountDetails />
      <AddressManagement />
    </div>
  );
};

export default YourAccount;
