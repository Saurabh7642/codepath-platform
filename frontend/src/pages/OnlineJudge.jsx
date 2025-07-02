import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CodeEditor from '../components/CodeEditor';

const OnlineJudge = () => {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [code, setCode] = useState(
  `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(0);\n    cin.tie(0);\n    \n    // Your code here\n    \n    return 0;\n}`
);

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetchProblem();
  }, [slug]);

  const fetchProblem = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/problems/${slug}`);
      if (response.data.success) {
        setProblem(response.data.problem);
      } else {
        setError('Problem not found');
      }
    } catch (error) {
      console.error('Error fetching problem:', error);
      setError(error.response?.status === 404 ? 'Problem not found' : 'Failed to load problem');
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput('');
    try {
      const response = await axios.post('http://localhost:8000/run', {
        language: 'cpp',
        code,
        input,
      });
      console.log('Compiler server response:', response.data);
      if (response.data.success) {
        setOutput(response.data.output);
      } else {
        setOutput(response.data.error || 'Error during execution');
      }
    } catch (err) {
      setOutput(err.response?.data?.error || 'Error connecting to compiler server');
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row max-w-7xl mx-auto p-4 gap-4">
      <div className="lg:w-1/2 bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-screen">
        <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
        <div className="prose max-w-none whitespace-pre-line">{problem.description}</div>
        {problem.constraints && (
          <>
            <h2 className="mt-6 font-semibold">Constraints</h2>
            <pre className="bg-gray-100 p-3 rounded whitespace-pre-line">{problem.constraints}</pre>
          </>
        )}
        {problem.examples && problem.examples.length > 0 && (
          <>
            <h2 className="mt-6 font-semibold">Examples</h2>
            {problem.examples.map((ex, idx) => (
              <div key={idx} className="mb-4 p-3 bg-gray-50 rounded">
                <div><strong>Input:</strong> <pre className="whitespace-pre-wrap">{ex.input}</pre></div>
                <div><strong>Output:</strong> <pre className="whitespace-pre-wrap">{ex.output}</pre></div>
                {ex.explanation && <div><strong>Explanation:</strong> {ex.explanation}</div>}
              </div>
            ))}
          </>
        )}
      </div>
      <div className="lg:w-1/2 flex flex-col">
        <CodeEditor language="cpp" value={code} onChange={setCode} />
        <textarea
          className="mt-4 p-2 border border-gray-300 rounded resize-none h-24 font-mono"
          placeholder="Custom Input (stdin)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleRun}
          disabled={running}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {running ? 'Running...' : 'Compile & Run'}
        </button>
        <pre className="mt-4 p-4 bg-gray-900 text-green-400 rounded whitespace-pre-wrap min-h-[100px]">
          {output}
        </pre>
      </div>
    </div>
  );
};

export default OnlineJudge;
