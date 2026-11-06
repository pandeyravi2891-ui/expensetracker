import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ExpenseTrackerLogo,
  OtpEnvelopeIllustration,
  ClockIcon,
} from './Icons';

export const OtpSentCard = ({
  email: propEmail,
  onContinue,
  onBack,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || propEmail || 'ravi@example.com';

  // 5-minute countdown timer (300 seconds)
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue(email);
    } else {
      navigate('/otp-verify', { state: { email } });
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="auth-card otp-card">
      {/* Header */}
      <div className="auth-card-header">
        <div className="auth-logo-wrapper">
          <ExpenseTrackerLogo variant="green" showSparkles={true} size={54} />
        </div>
        <h1 className="auth-title">Expense Tracker</h1>
        <p className="auth-subtitle">Track your expenses, achieve your goals</p>
      </div>

      {/* Hero: Envelope with checkmark */}
      <div className="otp-hero-section">
        <div className="otp-envelope-wrapper">
          <OtpEnvelopeIllustration size={105} />
        </div>
        <h2 className="otp-sent-title">OTP Sent!</h2>
        <p className="otp-sent-text">
          We have sent a 6-digit OTP to your email
        </p>
        <p className="otp-email-highlight">{email}</p>
      </div>

      {/* Expiry Pill Box */}
      <div className="otp-expiry-box">
        <div className="otp-clock-icon">
          <ClockIcon size={22} color="#10b981" />
        </div>
        <div className="otp-expiry-text">
          <span className="otp-expiry-label">This OTP will expire in</span>
          <span className="otp-expiry-time">
            {timeLeft > 0 ? (
              <>
                <strong>{formatTime(timeLeft)}</strong> (5 minutes)
              </>
            ) : (
              <strong style={{ color: '#ef4444' }}>Expired</strong>
            )}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        className="submit-btn green"
        onClick={handleContinue}
      >
        <span>Continue</span>
      </button>

      {/* Back link */}
      <div className="auth-footer" style={{ marginTop: '10px' }}>
        <button
          type="button"
          className="footer-link green"
          onClick={handleBack}
        >
          ← Back to Signup
        </button>
      </div>
    </div>
  );
};
