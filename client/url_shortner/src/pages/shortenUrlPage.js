// src/pages/ShortenUrlPage.js
import React from 'react';
import ShortenUrl from '../components/shortenUrl';
import { useAuth } from '../hooks/useAuth'; // You'll need to create this hook

const ShortenUrlPage = () => {
  const userId = useAuth();
  if (!userId) {
    return <div>Please log in to access this page.</div>;
  }

  return (
    <div className="shorten-url-page">
      <h1>Create a Short URL</h1>
      <ShortenUrl/>
    </div>
  );
};

export default ShortenUrlPage;