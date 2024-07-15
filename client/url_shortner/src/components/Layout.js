// src/components/Layout.js
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto mt-4 flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;