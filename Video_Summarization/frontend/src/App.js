import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../../frontend/components/Header';
import TextSummarizer from './components/TextSummarizer';
import VideoSummarizer from './components/VideoSummarizer';
import ImageSummarizer from './components/ImageSummarizer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/text" element={<TextSummarizer />} />
            <Route path="/video" element={<VideoSummarizer />} />
            <Route path="/image" element={<ImageSummarizer />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

function Home() {
  return (
    <div className="home">
      <h1>Welcome to Summarization App</h1>
      <div className="options">
        <div className="option" onClick={() => window.location.href='/video'}>
          <h2>Video Summarization</h2>
        </div>
        <div className="option" onClick={() => window.location.href='/text'}>
          <h2>Text Summarization</h2>
        </div>
        <div className="option" onClick={() => window.location.href='/image'}>
          <h2>Image Summarization</h2>
        </div>
      </div>
    </div>
  );
}

export default App;