import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BrandPanel } from './BrandPanel';
import { GreenLockBadge, MailIcon, ArrowRightIcon, ArrowLeftIcon } from './Icons';

export const ForgotPasswordCard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const targetEmail = email.trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      setFeedback({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/v1/password_reset`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        navigate('/forgot-password/otp-sent', { state: { email: targetEmail } });
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'Unable to send OTP. Please check the email and try again.',
        });
      }
    } catch (err) {
      console.warn('Backend not reached:', err);
      // Demo fallback: Navigate to OTP Sent
      navigate('/forgot-password/otp-sent', { state: { email: targetEmail } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="split-auth-card">
      {/* Left Branding Column */}
      <BrandPanel />

      {/* Right Form Column */}
      <div className="split-form-panel">
        {/* Top Back Link */}
        <div className="split-top-nav">
          <Link to="/login" className="back-nav-link">
            <ArrowLeftIcon size={14} />
            <span>Back to Login</span>
          </Link>
        </div>

        {/* Badge & Headings */}
        <div className="split-header-area">
          <GreenLockBadge size={52} />
          <h2 className="split-title">Forgot Password?</h2>
          <p className="split-subtitle">
            Enter your email address and we'll send you an OTP to reset your password.
          </p>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`feedback-banner ${feedback.type}`}>
            <span>{feedback.message}</span>
            <button
              type="button"
              className="banner-close-btn"
              onClick={() => setFeedback(null)}
            >
              ✕
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <div className={`input-container ${isFocused ? 'focused green' : ''}`}>
              <div className="input-icon-left">
                <MailIcon />
              </div>
              <input
                type="email"
                className="input-field"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="submit-btn green"
            style={{ marginTop: '6px' }}
          >
            {isLoading ? (
              <div className="spinner" />
            ) : (
              <>
                <span>Send OTP</span>
                <ArrowRightIcon size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="split-footer-link">
          <span>Remember your password?</span>
          <Link to="/login" className="footer-link green">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

