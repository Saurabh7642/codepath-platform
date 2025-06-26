
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to CodePath
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* User Profile Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Your Profile
              </h3>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Username:</span> {user?.username}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Member since:</span> Just now
                </p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Your Stats
              </h3>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Problems Solved:</span> {user?.problemsSolved}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Submissions:</span> 0
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Acceptance Rate:</span> 0%
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Welcome Message */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              🎉 Welcome to CodePath, {user?.username}!
            </h3>
            <p className="text-gray-600 mb-4">
              You've successfully created your account and logged in. Here's what you can do next:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Explore our problem set and start solving coding challenges</li>
              <li>Follow structured learning paths to improve your skills</li>
              <li>Participate in contests and compete with other programmers</li>
              <li>Track your progress and see your improvement over time</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
