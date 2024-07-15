import React, { useState } from 'react';
import { shortenUrl } from '../services/api';
import './registercss.css'; // Assuming you use the same CSS

const ShortenUrl = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const userID = localStorage.getItem('userID'); // Retrieve userID from localStorage
      const response = await shortenUrl(userID, originalUrl, customAlias);
      const shortenedUrl = `http://localhost:9999/shortner/redirect/${response.alias}?id=${userID}`;
      setShortUrl(shortenedUrl);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'An error occurred during URL shortening');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      alert('Short URL copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy the URL: ', err);
    });
  };

  return (
    <div className="register-form">
      <h2>Create Short URL</h2>
      {error && <p className="error">{error}</p>}
      {success && (
        <p className="success">
          Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
          <button onClick={handleCopy} style={{ marginLeft: '8px' }} >Copy</button>
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="originalUrl">Original URL:</label>
          <input
            type="url"
            id="originalUrl"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="customAlias">Custom Alias (optional):</label>
          <input
            type="text"
            id="customAlias"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            placeholder="Leave blank for auto-generation"
          />
        </div>
        <button type="submit">Shorten</button>
      </form>
    </div>
  );
};

export default ShortenUrl;
