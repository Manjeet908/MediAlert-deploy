import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Server, Coffee, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import './Loader.css'; 

const Loader = ({ isVisible, onRetry }) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const SHOW_DETAILED_THRESHOLD = 5;
  const TIMEOUT_THRESHOLD = 60;

  useEffect(() => {
    let interval;
    if (isVisible) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      setSecondsElapsed(0);
    };
  }, [isVisible]);

  const countdown = Math.max(0, TIMEOUT_THRESHOLD - secondsElapsed);

  if (!isVisible) return null;

  // We use createPortal to ensure this renders outside of any layout constraints
  return createPortal(
    <div className="loader-overlay">
      <div className="loader-bg-decoration" />

      {/* STAGE 1: SIMPLE LOADER (0s - 5s) */}
      {secondsElapsed < SHOW_DETAILED_THRESHOLD && (
        <div className="simple-loader">
          <div className="icon-wrapper-simple">
            <Loader2 className="spin-icon" size={32} color="#4f46e5" />
          </div>
          <p className="pulse-text" style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
            Connecting...
          </p>
        </div>
      )}

      {/* STAGE 2: DETAILED UI (5s - 60s) */}
      {secondsElapsed >= SHOW_DETAILED_THRESHOLD && secondsElapsed < TIMEOUT_THRESHOLD && (
        <div className="loader-card">
          <div className="card-top-accent" />
          
          <div className="card-content">
            <div className="card-icon-area">
              <div className="card-icon-bg" />
              <div className="card-icon-box">
                <Server size={40} strokeWidth={1.5} />
                <div className="coffee-badge">
                  <Coffee size={14} />
                </div>
              </div>
            </div>

            <h2 className="loader-title">Waking up the server</h2>
            <p className="loader-desc">
              Our backend is hosted on a free tier. It goes to sleep when inactive to save energy.
            </p>

            <div className="timer-badge">
              <Loader2 size={12} className="spin-icon" />
              <span>Estimated wait: {countdown}s</span>
            </div>

            <div className="progress-container">
              <div className="progress-labels">
                <span>Spinning up</span>
                <span>Almost there</span>
              </div>
              <div className="progress-track">
                <div className="progress-bar" />
              </div>
            </div>
          </div>

          <div className="loader-footer">
            <p className="footer-text">
              This usually only happens on the first load of the day. Thanks for your patience!
            </p>
          </div>
        </div>
      )}

      {/* STAGE 3: TIMEOUT UI (60s+) */}
      {secondsElapsed >= TIMEOUT_THRESHOLD && (
        <div className="loader-card" style={{ borderColor: '#fecaca' }}>
          <div className="card-content">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '50%', color: '#ef4444' }}>
                <AlertCircle size={32} />
              </div>
            </div>

            <h2 className="loader-title">Taking longer than expected</h2>
            <p className="loader-desc">
              The server might be experiencing heavy traffic or a cold start delay. Please try refreshing.
            </p>

            <button onClick={() => window.location.reload()} className="reload-btn">
              <RefreshCw size={18} />
              Reload Page
            </button>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

export default Loader;