'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    window.location.replace('/index.html');
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyCenter: 'center', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <p>Loading SmartWallet AI...</p>
    </div>
  );
}
