import React, { useEffect, useState } from 'react';
import { getUserUrls } from '../services/api';
import './registercss.css'; // Assuming you use the same CSS

const UserUrls = () => {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const userID = localStorage.getItem('userID'); // Retrieve userID from localStorage
        const urls = await getUserUrls(userID);
        setUrls(urls);
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
        {urls.map((url, index) => (
          <li key={index}>
            <a href={url.parentUrl} target="_blank" rel="noopener noreferrer">
              {url.parentUrl} : {url.customAlias || url.parentUrl}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserUrls;
