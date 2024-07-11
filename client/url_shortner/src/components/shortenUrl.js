import React, { useState } from 'react';
import { shortenUrl } from '../services/api';
import './registercss.css'; // Assuming you use the same CSS

const ShortenUrl = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const response = await shortenUrl(originalUrl);
      setShortUrl(response.shortUrl);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'An error occurred during URL shortening');
    }
  };

  return (
    <div className="register-form">
      <h2>Create Short URL</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Short URL: {shortUrl}</p>}
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
        <button type="submit">Shorten</button>
      </form>
    </div>
  );
};

export default ShortenUrl;
