import React, { useState } from 'react';
import axios from 'axios';
import SummaryResult from './SummaryResult';

function ImageSummarizer() {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !imageUrl.trim()) {
      setError('Please upload an image or provide an image URL');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (imageUrl.trim()) {
      formData.append('image_url', imageUrl);
    }

    try {
      const response = await axios.post('http://localhost:5000/summarize_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSummary(response.data.summary);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to summarize image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summarizer">
      <h1>Image Summarization</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        
        <div className="form-group">
          <label>Or Image URL:</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste image URL here"
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

export default ImageSummarizer;