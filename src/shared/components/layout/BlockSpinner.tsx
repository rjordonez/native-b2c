import React from 'react';

// Animated block spinner: 4 blocks rotating in a circle
const BlockSpinner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative w-12 h-12 ${className}`} aria-label="Loading">
    {[0, 1, 2, 3].map((i) => (
      <span
        key={i}
        className="absolute left-1/2 top-1/2 w-2.5 h-2.5 bg-primary rounded-md"
        style={{
          transform: `rotate(${i * 90}deg) translate(18px) rotate(-${i * 90}deg)`,
          animation: `block-rotate 1.2s cubic-bezier(.68,-0.55,.27,1.55) infinite`,
          animationDelay: `${i * 0.15}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes block-rotate {
        0% { opacity: 1; }
        20% { opacity: 0.7; }
        50% { opacity: 0.4; }
        80% { opacity: 0.7; }
        100% { opacity: 1; }
      }
    `}</style>
  </div>
);

export default BlockSpinner; 