import React, { useState, useEffect } from 'react';

interface LogEntry {
  type: 'log' | 'error' | 'warn';
  message: string;
  timestamp: Date;
}

const MobileDebugger: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development mode
    if (!import.meta.env.DEV) return;

    // Store original console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    // Override console methods
    console.log = (...args) => {
      originalLog(...args);
      setLogs(prev => [...prev.slice(-50), {
        type: 'log',
        message: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '),
        timestamp: new Date()
      }]);
    };

    console.error = (...args) => {
      originalError(...args);
      setLogs(prev => [...prev.slice(-50), {
        type: 'error',
        message: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '),
        timestamp: new Date()
      }]);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      setLogs(prev => [...prev.slice(-50), {
        type: 'warn',
        message: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '),
        timestamp: new Date()
      }]);
    };

    // Cleanup
    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  // Don't render in production
  if (!import.meta.env.DEV) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 text-white px-3 py-2 rounded-full text-xs font-mono shadow-lg"
      >
        {isVisible ? 'Hide' : 'Logs'} ({logs.length})
      </button>

      {/* Log Panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 w-80 max-h-96 bg-black text-green-400 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 bg-gray-900 flex justify-between items-center">
            <span className="text-xs font-mono">Console Output</span>
            <button
              onClick={() => setLogs([])}
              className="text-xs bg-red-600 text-white px-2 py-1 rounded"
            >
              Clear
            </button>
          </div>
          <div className="overflow-y-auto max-h-80 p-2 text-xs font-mono">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet...</div>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className={`mb-2 p-1 rounded ${
                    log.type === 'error' ? 'bg-red-900/30 text-red-400' :
                    log.type === 'warn' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-gray-900/30'
                  }`}
                >
                  <div className="text-gray-500 text-[10px]">
                    [{log.type}] {log.timestamp.toLocaleTimeString()}
                  </div>
                  <div className="whitespace-pre-wrap break-all">
                    {log.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileDebugger;