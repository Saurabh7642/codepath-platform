import React from 'react';

const AiCodeAnalysisBox = ({ analysis }) => {
  return (
    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded shadow max-h-64 overflow-y-auto whitespace-pre-wrap font-mono text-sm text-yellow-900">
      <h3 className="font-semibold mb-2">AI Code Analysis</h3>
      <pre>{analysis}</pre>
    </div>
  );
};

export default AiCodeAnalysisBox;
