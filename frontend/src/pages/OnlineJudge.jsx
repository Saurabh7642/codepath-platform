import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CodeEditor from '../components/CodeEditor';
import { useAuth } from '../context/AuthContext';
import RecentSubmissionsTable from '../components/dashboard/RecentSubmissionsTable';
import AiCodeAnalysisBox from '../components/AiCodeAnalysisBox';

const OnlineJudge = () => {
  const { slug } = useParams();
  const { user, refreshUser } = useAuth();
  const [problem, setProblem] = useState(null);
  const [testcases, setTestcases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [code, setCode] = useState(
    `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(0);\n    cin.tie(0);\n    \n    // Your code here\n    \n    return 0;\n}`
  );

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [results, setResults] = useState([]);
  const [running, setRunning] = useState(false);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [loadingAiAnalysis, setLoadingAiAnalysis] = useState(false);

  useEffect(() => {
    fetchProblemAndTestcases();
    fetchRecentSubmissions();
  }, [slug]);

  const fetchProblemAndTestcases = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/problems/${slug}`);
      if (response.data.success) {
        setProblem(response.data.problem);
        setTestcases(response.data.testcases || []);
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

  const fetchRecentSubmissions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/submissions/recent?problemId=${problem?._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('fetchRecentSubmissions response:', response.data);
      if (response.data.success) {
        setRecentSubmissions(response.data.recentSubmissions);
      }
    } catch (error) {
      console.error('Error fetching recent submissions:', error);
    }
  };

  useEffect(() => {
    const handleSubmissionSuccess = () => {
      console.log('submissionSuccess event received');
      fetchRecentSubmissions();
      refreshUser();
      console.log('Submission success event handled, recent submissions updated');
    };

    window.addEventListener('submissionSuccess', handleSubmissionSuccess);

    return () => {
      window.removeEventListener('submissionSuccess', handleSubmissionSuccess);
    };
  }, [refreshUser]);

  const fetchAiCodeAnalysis = async (code) => {
    setLoadingAiAnalysis(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/submissions/ai-analysis`, {
        code,
        language: 'cpp',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setAiAnalysis(response.data.analysis);
      } else {
        setAiAnalysis('Failed to get AI analysis');
      }
    } catch (error) {
      console.error('Error fetching AI code analysis:', error);
      setAiAnalysis('Error fetching AI analysis');
    } finally {
      setLoadingAiAnalysis(false);
    }
  };

  const handleRunAll = async () => {
    setRunning('all');
    setResults([]);
    setAiAnalysis('');
    try {
      const resultsArray = [];
      for (const testcase of testcases) {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}`, {
        language: 'cpp',
          code,
          input: testcase.input,
        });
        if (response.data.success) {
          const output = response.data.output.trim();
          const expected = testcase.expectedOutput.trim();
          const passed = output === expected;
          resultsArray.push({
            input: testcase.input,
            expectedOutput: testcase.expectedOutput,
            output,
            passed,
            isSample: testcase.isSample,
          });
        } else {
          resultsArray.push({
            input: testcase.input,
            expectedOutput: testcase.expectedOutput,
            output: response.data.error || 'Error during execution',
            passed: false,
            isSample: testcase.isSample,
          });
        }
      }
      setResults(resultsArray);
      if (resultsArray.every(r => r.passed)) {
        try {
          console.log('Submitting solved problem for problem ID:', problem._id);
          const token = localStorage.getItem('token');
          await axios.post(`${import.meta.env.VITE_API_URL}/submissions`, {
            problemId: problem._id,
            status: 'Accepted',
            language: 'cpp',
            code: code
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Submission request sent');
          await refreshUser();
          window.dispatchEvent(new Event('submissionSuccess'));
          // Fetch AI code analysis after successful submission
          fetchAiCodeAnalysis(code);
        } catch (error) {
          console.error('Error updating user solved problems:', error);
        }
      }
      console.log('Submission API call completed');
    } catch (err) {
      setError(err.response?.data?.error || 'Error connecting to compiler server');
    } finally {
      setRunning(null);
    }
  };

  const handleRunCustom = async () => {
    setRunning('custom');
    setOutput('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}`, {
        language: 'cpp',
        code,
        input,
      });
      if (response.data.success) {
        setOutput(response.data.output);
      } else {
        setOutput(response.data.error || 'Error during execution');
      }
    } catch (err) {
      setOutput(err.response?.data?.error || 'Error connecting to compiler server');
    } finally {
      setRunning(null);
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
        <h1 className="text-2xl font-bold mb-4 text-black">{problem.title}</h1>
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
          onClick={handleRunCustom}
          disabled={running}
          title="Compile and run with custom input"
          className={`mt-4 px-6 py-3 rounded text-white ${
            running ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {running ? 'Running...' : 'Compile & Run'}
        </button>
        <pre className="mt-4 p-4 bg-gray-900 text-green-400 rounded whitespace-pre-wrap min-h-[100px]">
          {output}
        </pre>
        <button
          onClick={handleRunAll}
          disabled={running}
          title="Submit code"
          className={`mt-4 px-6 py-3 rounded text-white ${
            running ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {running ? 'Submitting...' : 'Submit'}
        </button>
        <div className="mt-4 overflow-y-auto max-h-[300px] bg-white rounded shadow p-4">
          {results.length > 0 && (
            results.every(r => r.passed) ? (
              <div className="mb-3 p-3 rounded bg-green-100 text-green-800 text-center font-semibold">
                <div>All Testcases Passed ✅</div>
              </div>
            ) : (
              results.map((result, idx) => (
                <div
                  key={idx}
                  className={`mb-3 p-3 rounded ${
                    result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {result.isSample && (
                    <>
                      <div><strong>Sample Testcase #{idx + 1}</strong></div>
                      <div><strong>Input:</strong> <pre className="whitespace-pre-wrap">{result.input}</pre></div>
                      <div><strong>Expected Output:</strong> <pre className="whitespace-pre-wrap">{result.expectedOutput}</pre></div>
                      <div><strong>Your Output:</strong> <pre className="whitespace-pre-wrap">{result.output}</pre></div>
                      <div><strong>Result:</strong> {result.passed ? 'Passed ✅' : 'Failed ❌'}</div>
                    </>
                  )}
                  {!result.isSample && !result.passed && (
                    <div><strong>Wrong Answer ❌</strong></div>
                  )}
                </div>
              ))
            )
          )}
        </div>
        <RecentSubmissionsTable recentSubmissions={recentSubmissions} />
        {loadingAiAnalysis ? (
          <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded text-center font-semibold">
            Loading AI Code Analysis...
          </div>
        ) : (
          aiAnalysis && <AiCodeAnalysisBox analysis={aiAnalysis} />
        )}
      </div>
    </div>
  );
};

export default OnlineJudge;