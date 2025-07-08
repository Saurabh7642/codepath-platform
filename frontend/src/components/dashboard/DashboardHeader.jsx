import React from 'react';

const DashboardHeader = ({ user }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user.username}!</h2>
      <p className="text-gray-600">Email: {user.email}</p>
    </div>
  );
};

export default DashboardHeader;
