import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OtpEnvelopeWithCheck, CheckIcon } from './Icons';

export const ResetOtpSentCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'ravi@gmail.com';

  const handleContinue = () => {
    navigate('/forgot-password/verify-otp', { state: { email } });
  };

  return (
    <div className="auth-card reset-otp-sent-card">
      {/* Hero Envelope with Check badge */}
      <div className="otp-sent-hero">
        <OtpEnvelopeWithCheck size={130} />
      </div>

      {/* Headings */}
      <div className="otp-sent-info">
        <h2 className="otp-sent-title" style={{ fontSize: '24px', marginBottom: '6px' }}>
          OTP Sent!
        </h2>
        <p className="otp-sent-text" style={{ fontSize: '13.5px' }}>
          A new OTP has been sent to
        </p>
        <p className="otp-email-bold">{email}</p>
      </div>

      {/* Info Notice Box */}
      <div className="otp-notice-box">
        <div className="notice-icon-circle">
          <CheckIcon />
        </div>
        <p className="notice-text">
          Please check your inbox and verify the OTP within 5 minutes.
        </p>
      </div>

      {/* Action Button */}
      <button
        type="button"
        className="submit-btn green"
        onClick={handleContinue}
        style={{ marginTop: '14px', height: '44px' }}
      >
        <span>Back to Verify OTP</span>
      </button>
    </div>
  );
};

