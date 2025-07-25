import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import SolvedStatsCard from '../components/dashboard/SolvedStatsCard';
import RecentSubmissionsTable from '../components/dashboard/RecentSubmissionsTable';
import ChartsSection from '../components/dashboard/ChartsSection';

const Profile = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalSolved: 0,
    totalProblems: 0,
    solvedByDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
    acceptanceRate: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [chartsData, setChartsData] = useState({
    pieChartData: { Easy: 0, Medium: 0, Hard: 0 },
    barChartData: []
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.success) {
          setStats({
            totalSolved: response.data.totalSolved,
            totalProblems: response.data.totalProblems,
            solvedByDifficulty: response.data.solvedByDifficulty,
            acceptanceRate: response.data.acceptanceRate
          });
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    const fetchRecentSubmissions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/submissions/recent`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.success) {
          setRecentSubmissions(response.data.recentSubmissions);
        }
      } catch (error) {
        console.error('Error fetching recent submissions:', error);
      }
    };

    const fetchChartsData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/charts`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.success) {
          setChartsData({
            pieChartData: response.data.pieChartData,
            barChartData: response.data.barChartData
          });
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchUserStats();
    fetchRecentSubmissions();
    fetchChartsData();

    const handleSubmissionSuccess = () => {
      fetchUserStats();
      fetchRecentSubmissions();
      fetchChartsData();
    };

    window.addEventListener('submissionSuccess', handleSubmissionSuccess);

    const intervalId = setInterval(() => {
      fetchUserStats();
      fetchRecentSubmissions();
      fetchChartsData();
    }, 30000); // Poll every 30 seconds

    return () => {
      window.removeEventListener('submissionSuccess', handleSubmissionSuccess);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to CodePath</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <DashboardHeader user={user} />

        <SolvedStatsCard
          solvedByDifficulty={stats.solvedByDifficulty}
          totalSolved={stats.totalSolved}
          totalProblems={stats.totalProblems}
          acceptanceRate={stats.acceptanceRate}
        />

        <RecentSubmissionsTable recentSubmissions={recentSubmissions} />

        <ChartsSection
          pieChartData={chartsData.pieChartData}
          barChartData={chartsData.barChartData}
        />
      </main>
    </div>
  );
};

export default Profile;
