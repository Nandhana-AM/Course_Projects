import 'bulma/css/bulma.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/Home.css';

export default function Home() {
  const navigate = useNavigate();

  const handleCheckScore = () => {
    navigate('/checkscore');
  };

  const handleGeneratePortfolio = () => {
    navigate('/createportfolio');
  };

  return (
    <div className="hero is-fullheight">
      <div className="hero-body">
        <div className="container has-text-centered">
          {/* Header */}
          <h1 className="title">Resume Optimizer</h1>

          {/* Main Content */}
          <div className="box">
            <div className="has-text-centered mb-5">
              <p className="subtitle">
                Welcome to the Resume Optimizer
              </p>
              <p className="has-text-grey mb-5">
                Upload your resume and either check your score or generate a portfolio
              </p>
            </div>

            {/* Buttons */}
            <div className="buttons is-centered">
              <button
                className="button is-warning"
                onClick={handleCheckScore}
                aria-label="Check Resume Score"
              >
                Resume analysis
              </button>
              <button
                className="button is-danger"
                onClick={handleGeneratePortfolio}
                aria-label="Generate Portfolio"
              >
                Generate Portfolio
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6">
            <a href="#" className="footer-link" aria-label="Privacy Policy">
              Privacy Policy
            </a>
            <a href="#" className="footer-link" aria-label="Terms of Service">
              Terms of Service
            </a>
            <a href="#" className="footer-link" aria-label="Contact">
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}