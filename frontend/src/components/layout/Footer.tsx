import React from 'react';

export const Footer: React.FC = React.memo(() => {
  return (
    <footer className="border-t border-gray-800 bg-[#0F1626] py-6 px-6 text-center text-xs text-gray-500 mt-auto">
      <p>
        © 2026 AbuseIPDB Threat Center & Real-time Integration Screen. All
        rights reserved.
      </p>
    </footer>
  );
});
