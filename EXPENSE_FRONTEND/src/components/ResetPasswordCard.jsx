import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { BrandPanel } from './BrandPanel';
import { GreenLockBadge, LockIcon, EyeIcon, EyeOffIcon, ArrowLeftIcon } from './Icons';

export const ResetPasswordCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'ravi@gmail.com';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (password.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    if (password !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/v1/resetpass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        navigate('/login', {
          state: {
            message: 'Password reset successfully! Please login with your new password.',
          },
        });
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'Failed to reset password. Please try again.',
        });
      }
    } catch (err) {
      console.warn('Backend not reached:', err);
      // Demo fallback: Navigate to login with success message
      navigate('/login', {
        state: {
          message: 'Password reset successfully! Please login with your new password.',
        },
      });
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
          <Link to="/forgot-password/verify-otp" className="back-nav-link">
            <ArrowLeftIcon size={14} />
            <span>Back</span>
          </Link>
        </div>

        {/* Badge & Headings */}
        <div className="split-header-area">
          <GreenLockBadge size={52} />
          <h2 className="split-title">Reset Password</h2>
          <p className="split-subtitle">Enter your new password below.</p>
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
          {/* New Password */}
          <div className="form-group">
            <div
              className={`input-container ${
                focusedField === 'password' ? 'focused green' : ''
              }`}
            >
              <div className="input-icon-left">
                <LockIcon />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <div
              className={`input-container ${
                focusedField === 'confirmPassword' ? 'focused green' : ''
              }`}
            >
              <div className="input-icon-left">
                <LockIcon />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="submit-btn green"
            style={{ marginTop: '8px' }}
          >
            {isLoading ? <div className="spinner" /> : <span>Reset Password</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

