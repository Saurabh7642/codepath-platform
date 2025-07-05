
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/profile', { replace: true });
  }, [navigate]);

  return null;
};

export default Dashboard;
