import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/problems');
      if (response.data.success) {
        setProblems(response.data.problems);
      } else {
        setError('Failed to fetch problems');
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading problems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={fetchProblems}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Problems
            </h1>
            <p className="text-gray-600">
              Solve coding problems to improve your programming skills
            </p>
          </div>
          {user && user.isAdmin && (
            <button
              onClick={() => navigate('/problems/contribute')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Contribute
            </button>
          )}
        </div>

        {/* Problems List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              All Problems ({problems.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {problems.map((problem) => (
              <div 
                key={problem._id} 
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Link 
                        to={`/problems/${problem.slug}`}
                        className="text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {problem.title}
                      </Link>
                      <span 
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.difficulty)}`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    
                    {/* Tags */}
                    {problem.tags && problem.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {problem.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link 
                      to={`/problems/${problem.slug}`}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Solve
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {problems.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No problems available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problems;
