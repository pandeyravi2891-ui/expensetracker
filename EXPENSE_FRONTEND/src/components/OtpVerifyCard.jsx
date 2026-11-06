import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ExpenseTrackerLogo,
  ArrowLeftIcon,
  MailCheckIcon,
} from './Icons';

export const OtpVerifyCard = ({
  email: propEmail,
  onBack,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || propEmail || 'ravi@example.com';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(30);

  const inputRefs = useRef([]);

  // Auto focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend cooldown timer
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

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/otp-sent', { state: { email } });
    }
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
      const response = await fetch(`${API_URL}/api/v1/otp_verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entered_otp: fullOtp,
          email: email,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Save the verified user in localStorage so Dashboard & Edit Profile always know the user!
        const userObj = {
          name: data.user ? `${data.user.firstName} ${data.user.lastName}`.trim() : 'User',
          email: data.user?.email || email.trim(),
          profileImage: data.user?.profileImage || '',
          bio: data.user?.bio || ''
        };
        localStorage.setItem('expense_user', JSON.stringify(userObj));

        setFeedback({
          type: 'success',
          message: data.message || 'OTP verified successfully! Welcome aboard.',
        });
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            navigate('/dashboard', {
              state: {
                verified: true,
                message: 'Account verified successfully!',
              },
            });
          }
        }, 1000);
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'Invalid or expired OTP. Please check and try again.',
        });
      }
    } catch (err) {
      console.warn('Backend not reached:', err);
      // Demo fallback
      setFeedback({
        type: 'success',
        message: `[Demo Mode] OTP ${fullOtp} verified successfully! Redirecting to login...`,
      });
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/', {
            state: {
              verified: true,
              message: 'Account verified successfully! Please log in.',
            },
          });
        }
      }, 1200);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    setFeedback(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/v1/resend_otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setFeedback({
          type: 'success',
          message: data.message || `A new 6-digit OTP has been sent to ${email}`,
        });
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'Failed to resend OTP. Please try again.',
        });
      }
    } catch (err) {
      console.warn('Backend not reached:', err);
      setFeedback({
        type: 'success',
        message: `[Demo Mode] A new 6-digit OTP has been sent to ${email}`,
      });
    }
  };

  const handleOpenEmail = () => {
    if (email.includes('@gmail.com')) {
      window.open('https://mail.google.com', '_blank');
    } else if (email.includes('@outlook.com') || email.includes('@hotmail.com')) {
      window.open('https://outlook.live.com', '_blank');
    } else if (email.includes('@yahoo.com')) {
      window.open('https://mail.yahoo.com', '_blank');
    } else {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="auth-card otp-card">
      {/* Back button at top-left */}
      <div className="card-top-nav">
        <button
          type="button"
          className="card-back-btn"
          onClick={handleBack}
          aria-label="Go back"
          title="Go back"
        >
          <ArrowLeftIcon size={18} color="#334155" />
        </button>
      </div>

      {/* Header */}
      <div className="auth-card-header" style={{ marginTop: '-4px' }}>
        <div className="auth-logo-wrapper">
          <ExpenseTrackerLogo variant="green" showSparkles={true} size={54} />
        </div>
        <h1 className="auth-title">Expense Tracker</h1>
      </div>

      {/* Heading & Subtitle */}
      <div className="otp-verify-intro">
        <h2 className="otp-verify-title">Verify Your Email</h2>
        <p className="otp-sent-text">Enter the 6-digit OTP sent to</p>
        <p className="otp-email-highlight">{email}</p>
      </div>

      {/* Feedback Banner */}
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

      {/* 6 OTP Input Boxes */}
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="otp-inputs-container" onPaste={handlePaste}>
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
              className={`otp-digit-input ${digit ? 'filled' : ''}`}
              aria-label={`Digit ${index + 1}`}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || otp.join('').length < 6}
          className="submit-btn green"
        >
          {isLoading ? <div className="spinner" /> : <span>Verify OTP</span>}
        </button>

        {/* Resend Link */}
        <div className="otp-resend-row">
          <span>Didn't receive the code?</span>
          {resendCooldown > 0 ? (
            <span className="resend-cooldown"> Resend in {resendCooldown}s</span>
          ) : (
            <button
              type="button"
              className="resend-btn"
              onClick={handleResend}
            >
              Resend OTP
            </button>
          )}
        </div>

        {/* Divider OR */}
        <div className="divider-container" style={{ margin: '8px 0 6px 0' }}>
          <div className="divider-line" />
          <span className="divider-text">OR</span>
          <div className="divider-line" />
        </div>

        {/* Secondary: Check Your Email button */}
        <button
          type="button"
          className="check-email-btn"
          onClick={handleOpenEmail}
        >
          <MailCheckIcon size={17} color="#059669" />
          <span>Check Your Email</span>
        </button>
      </form>
    </div>
  );
};
