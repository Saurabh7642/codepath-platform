import React, { useState } from 'react';

const RecentSubmissionsTable = ({ recentSubmissions }) => {
  const [selectedCode, setSelectedCode] = useState(null);

  const openModal = (code) => {
    setSelectedCode(code);
  };

  const closeModal = () => {
    setSelectedCode(null);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6 overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Submissions</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {recentSubmissions.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-2 text-center text-gray-500">No recent submissions</td>
            </tr>
          ) : (
            recentSubmissions.map((submission) => (
              <tr key={submission._id}>
                <td className="px-4 py-2 whitespace-nowrap">{submission.problemId?.title || 'Unknown'}</td>
                <td className="px-4 py-2 whitespace-nowrap">{submission.status}</td>
                <td className="px-4 py-2 whitespace-nowrap">{submission.language}</td>
                <td className="px-4 py-2 whitespace-nowrap">{new Date(submission.submissionTime).toLocaleString()}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button
                    onClick={() => openModal(submission.code)}
                    className="text-blue-600 hover:text-blue-900 font-semibold"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
      {selectedCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-auto p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h4 className="text-lg font-semibold mb-4">Submitted Code</h4>
            <pre className="whitespace-pre-wrap font-mono text-sm">{selectedCode}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentSubmissionsTable;
