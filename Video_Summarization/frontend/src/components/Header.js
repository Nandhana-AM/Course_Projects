import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Summarization App</Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/text">Text</Link></li>
          <li><Link to="/video">Video</Link></li>
          <li><Link to="/image">Image</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;