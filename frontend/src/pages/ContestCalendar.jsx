import React from 'react';
import ContestList from '../components/ContestList';

const ContestCalendar = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-sans">
      <div className="text-center mb-8">
        <h2 className="text-6xl font-bold" style={{ color: '#0d15b5cc' }}>Upcoming Contests</h2>
        <p className="text-2xl mt-2" style={{ color: '#131883aa' }}>Stay updated with coding competitions</p>
      </div>
      <ContestList />
    </div>
  );
};

export default ContestCalendar;
