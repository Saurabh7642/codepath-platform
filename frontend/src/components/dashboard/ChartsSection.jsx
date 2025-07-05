import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const COLORS = ['#4ade80', '#facc15', '#f87171']; // green, yellow, red

const ChartsSection = ({ pieChartData, barChartData }) => {
  // Transform pieChartData to array for recharts
  const pieData = [
    { name: 'Easy', value: pieChartData.Easy || 0 },
    { name: 'Medium', value: pieChartData.Medium || 0 },
    { name: 'Hard', value: pieChartData.Hard || 0 }
  ];

  // Transform barChartData to recharts format
  const barData = barChartData.map(item => ({
    date: item._id,
    submissions: item.count
  }));

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Solved Problems by Difficulty</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submissions Over Time (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="submissions" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsSection;
