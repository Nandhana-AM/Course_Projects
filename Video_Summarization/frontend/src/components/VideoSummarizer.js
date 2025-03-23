import React, { useState } from 'react';
import axios from 'axios';
import SummaryResult from './SummaryResult';

function VideoSummarizer() {
  const [videoFile, setVideoFile] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile && !youtubeLink.trim()) {
      setError('Please upload a video or provide a YouTube link');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    const formData = new FormData();
    if (videoFile) {
      formData.append('video', videoFile);
    }
    if (youtubeLink.trim()) {
      formData.append('youtube_link', youtubeLink);
    }

    try {
      const response = await axios.post('http://localhost:5000/summarize_video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSummary(response.data.summary);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to summarize video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summarizer">
      <h1>Video Summarization</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Upload Video:</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />
        </div>
        
        <div className="form-group">
          <label>Or YouTube Link:</label>
          <input
            type="text"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            placeholder="Paste YouTube link here"
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Summarize'}
        </button>
      </form>
      
      <SummaryResult summary={summary} error={error} loading={loading} />
    </div>
  );
}

export default VideoSummarizer;