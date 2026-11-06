import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { BrandPanel } from './BrandPanel';
import { GreenCheckBadge, ArrowLeftIcon } from './Icons';

export const ResetOtpVerifyCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'ravi@gmail.com';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(30);

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    if (!cleaned) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleaned[cleaned.length - 1];
    setOtp(newOtp);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const digitsOnly = pastedData.replace(/[^0-9]/g, '').slice(0, 6);
    if (!digitsOnly) return;

    const newOtp = [...otp];
    for (let i = 0; i < digitsOnly.length; i++) {
      newOtp[i] = digitsOnly[i];
    }
    setOtp(newOtp);

    const focusIndex = Math.min(digitsOnly.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setFeedback(null);

    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setFeedback({ type: 'error', message: 'Please enter all 6 digits of the OTP.' });
      return;
    }

    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/v1/resetotp_verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entered_otp: fullOtp,
          email: email,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        navigate('/reset-password', { state: { email } });
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'Invalid or expired OTP. Please try again.',
        });
      }
    } catch (err) {
      console.warn('Backend not reached:', err);
      // Demo fallback: Navigate to Reset Password
      navigate('/reset-password', { state: { email } });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/v1/resend_otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setFeedback({
          type: 'success',
          message: data.message || `A fresh 6-digit OTP has been sent to ${email}`,
        });
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'Failed to resend OTP. Please try again.',
        });
      }
    } catch (err) {
      setFeedback({
        type: 'success',
        message: `[Demo] A fresh OTP has been sent to ${email}`,
      });
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
          <Link to="/forgot-password" className="back-nav-link">
            <ArrowLeftIcon size={14} />
            <span>Back</span>
          </Link>
        </div>

        {/* Badge & Headings */}
        <div className="split-header-area">
          <GreenCheckBadge size={52} />
          <h2 className="split-title">Verify OTP</h2>
          <p className="split-subtitle">
            We've sent a 6-digit OTP to <br />
            <strong className="split-email-highlight">{email}</strong>
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

        {/* 6 OTP Boxes */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="otp-boxes-row" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`otp-square-box ${digit ? 'filled' : ''}`}
                aria-label={`Digit ${index + 1}`}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <p className="otp-validity-text">OTP is valid for 5 minutes.</p>

          <button
            type="submit"
            disabled={isLoading || otp.join('').length < 6}
            className="submit-btn green"
            style={{ marginTop: '8px' }}
          >
            {isLoading ? <div className="spinner" /> : <span>Verify OTP</span>}
          </button>
        </form>

        {/* Footer */}
        <div className="split-footer-link" style={{ marginTop: '14px' }}>
          <span>Didn't receive the code?</span>
          {resendCooldown > 0 ? (
            <span className="resend-cooldown-text"> Resend in {resendCooldown}s</span>
          ) : (
            <button
              type="button"
              className="footer-link green"
              onClick={handleResend}
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

