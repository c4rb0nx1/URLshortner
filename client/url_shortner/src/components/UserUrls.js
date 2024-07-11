import React, { useEffect, useState } from 'react';
import { getUserUrls } from '../services/api';
import './registercss.css'; // Assuming you use the same CSS

const UserUrls = () => {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await getUserUrls();
        setUrls(response.urls);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching URLs');
      }
    };

    fetchUrls();
  }, []);

  return (
    <div className="register-form">
      <h2>Your URLs</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {urls.map((url) => (
          <li key={url.shortUrl}>
            <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
              {url.shortUrl}
            </a>{' '}
            - {url.originalUrl}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserUrls;
