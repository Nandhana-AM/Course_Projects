import React, { useState } from 'react';
import axios from 'axios';
import SummaryResult from './SummaryResult';

function TextSummarizer() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter some text to summarize');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    const formData = new FormData();
    formData.append('text', text);

    try {
      const response = await axios.post('http://localhost:5000/summarize_text', formData);
      setSummary(response.data.summary);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to summarize text');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summarizer">
      <h1>Text Summarization</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to summarize"
          rows={6}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Summarizing...' : 'Summarize'}
        </button>
      </form>
      
      <SummaryResult summary={summary} error={error} loading={loading} />
    </div>
  );
}

export default TextSummarizer;