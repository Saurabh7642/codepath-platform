import React from 'react';

const SolvedStatsCard = ({ solvedByDifficulty, totalSolved, totalProblems, acceptanceRate }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Problem Stats</h3>
      <p className="text-gray-700 mb-2">Total Problems Solved: {totalSolved}</p>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-green-600 font-bold">{solvedByDifficulty.Easy || 0}</p>
          <p className="text-gray-600">Easy</p>
        </div>
        <div className="text-center">
          <p className="text-yellow-600 font-bold">{solvedByDifficulty.Medium || 0}</p>
          <p className="text-gray-600">Medium</p>
        </div>
        <div className="text-center">
          <p className="text-red-600 font-bold">{solvedByDifficulty.Hard || 0}</p>
          <p className="text-gray-600">Hard</p>
        </div>
      </div>
      <p className="text-gray-700 mb-2">Total Problems Available: {totalProblems}</p>
      <p className="text-gray-700">Acceptance Rate: {acceptanceRate}%</p>
    </div>
  );
};

export default SolvedStatsCard;
