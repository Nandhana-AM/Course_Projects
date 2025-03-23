import React from 'react';

function SummaryResult({ summary, error, loading }) {
  if (loading) {
    return <div className="summary-loading">Processing your request...</div>;
  }
  
  if (error) {
    return <div className="summary-error">Error: {error}</div>;
  }
  
  if (!summary) {
    return null;
  }
  
  return (
    <div className="summary-result">
      <h3>Summary:</h3>
      <div className="summary-content">{summary}</div>
    </div>
  );
}

export default SummaryResult;