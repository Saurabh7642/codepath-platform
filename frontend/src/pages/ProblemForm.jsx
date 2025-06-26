import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProblemForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [slugField, setSlugField] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [tags, setTags] = useState('');
  const [constraints, setConstraints] = useState('');
  const [examples, setExamples] = useState([{ input: '', output: '', explanation: '' }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/problems');
    }
    const queryParams = new URLSearchParams(location.search);
    const editSlug = slug || queryParams.get('edit');
    if (editSlug) {
      axios.get(`http://localhost:5000/api/problems/${editSlug}`)
        .then(res => {
          if (res.data.success) {
            const p = res.data.problem;
            setTitle(p.title);
            setSlugField(p.slug);
            setDescription(p.description);
            setDifficulty(p.difficulty);
            setTags(p.tags.join(', '));
            setConstraints(p.constraints);
            setExamples(p.examples.length > 0 ? p.examples : [{ input: '', output: '', explanation: '' }]);
          } else {
            setError('Failed to load problem');
          }
        })
        .catch(() => setError('Failed to load problem'));
    }
  }, [slug, user, navigate, location]);

  const handleExampleChange = (index, field, value) => {
    const newExamples = [...examples];
    newExamples[index][field] = value;
    setExamples(newExamples);
  };

  const addExample = () => {
    setExamples([...examples, { input: '', output: '', explanation: '' }]);
  };

  const removeExample = (index) => {
    const newExamples = examples.filter((_, i) => i !== index);
    setExamples(newExamples);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const problemData = {
      title,
      description,
      difficulty,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      constraints,
      examples
    };

    // Include slug only for create (not for edit) very important
    if (!slug && !new URLSearchParams(location.search).get('edit')) {
      problemData.slug = slugField;
    }

    try {
      const editSlug = slug || new URLSearchParams(location.search).get('edit');
      if (editSlug) {
        await axios.put(`http://localhost:5000/api/problems/${editSlug}`, problemData);
      } else {
        await axios.post('http://localhost:5000/api/problems', problemData);
      }
      navigate('/problems');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save problem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">{slug ? 'Edit Problem' : 'Create Problem'}</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Slug</label>
          <input
            type="text"
            value={slugField}
            onChange={e => setSlugField(e.target.value)}
            required
            disabled={!!slug}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
          />
          <p className="text-sm text-gray-500 mt-1">Unique identifier for the problem URL</p>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            rows={5}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Difficulty</label>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Constraints</label>
          <textarea
            value={constraints}
            onChange={e => setConstraints(e.target.value)}
            required
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Examples</label>
          {examples.map((example, index) => (
            <div key={index} className="mb-3 border p-3 rounded">
              <div className="mb-2">
                <label className="block font-medium mb-1">Input</label>
                <textarea
                  value={example.input}
                  onChange={e => handleExampleChange(index, 'input', e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mb-2">
                <label className="block font-medium mb-1">Output</label>
                <textarea
                  value={example.output}
                  onChange={e => handleExampleChange(index, 'output', e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mb-2">
                <label className="block font-medium mb-1">Explanation</label>
                <textarea
                  value={example.explanation}
                  onChange={e => handleExampleChange(index, 'explanation', e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <button
                type="button"
                onClick={() => removeExample(index)}
                className="text-red-600 hover:underline"
              >
                Remove Example
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addExample}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Example
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {loading ? 'Saving...' : 'Save Problem'}
        </button>
      </form>
    </div>
  );
};

export default ProblemForm;
