import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ExpenseTrackerLogo,
  UserIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  UserPlusIcon,
  LoginArrowIcon,
  GoogleIcon,
  GithubIcon,
  CheckIcon,
} from './Icons';

export const AuthCard = ({
  mode: initialMode = 'signup',
  theme = 'green', // 'green' or 'blue'
  onModeChange,
  onSignupSuccess,
  hideTabs = false,
  forceSocial = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentMode, setCurrentMode] = useState(initialMode);
  const [focusedField, setFocusedField] = useState(null);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading & feedback
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Sync mode with route if needed or if message passed from verification
  useEffect(() => {
    if (location.state?.message) {
      setFeedback({
        type: 'success',
        message: location.state.message,
      });
      setCurrentMode('login');
    }
  }, [location.state]);

  const isSignup = currentMode === 'signup';
  const activeColorTheme = theme === 'auto' ? (isSignup ? 'green' : 'blue') : theme;

  const handleTabSwitch = (newMode) => {
    setCurrentMode(newMode);
    setFeedback(null);
    if (onModeChange) onModeChange(newMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    // Client-side validations
    if (isSignup) {
      if (!firstName.trim()) {
        setFeedback({ type: 'error', message: 'Please enter your first name.' });
        return;
      }
      if (!lastName.trim()) {
        setFeedback({ type: 'error', message: 'Please enter your last name.' });
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setFeedback({ type: 'error', message: 'Please enter a valid email address.' });
        return;
      }
      if (password.length < 6) {
        setFeedback({ type: 'error', message: 'Password must be at least 6 characters.' });
        return;
      }
      if (password !== confirmPassword) {
        setFeedback({ type: 'error', message: 'Passwords do not match.' });
        return;
      }
    } else {
      if (!email.trim() || !email.includes('@')) {
        setFeedback({ type: 'error', message: 'Please enter a valid email address.' });
        return;
      }
      if (!password) {
        setFeedback({ type: 'error', message: 'Please enter your password.' });
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isSignup) {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/api/v1/user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password,
            confirm_password: confirmPassword,
          }),
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setFeedback({
            type: 'success',
            message: data.message || 'Account created successfully! Check your email.',
          });
          setTimeout(() => {
            if (onSignupSuccess) {
              onSignupSuccess(email.trim());
            } else {
              navigate('/otp-sent', { state: { email: email.trim() } });
            }
          }, 900);
        } else {
          setFeedback({
            type: 'error',
            message: data.message || 'Failed to create account. Please try again.',
          });
        }
      } else {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/api/v1/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await response.json();
        if (response.ok && data.success) {
          const userObj = {
            name: data.user ? `${data.user.firstName} ${data.user.lastName}`.trim() : 'User',
            email: data.user?.email || email.trim(),
            profileImage: data.user?.profileImage || '',
            bio: data.user?.bio || ''
          };
          localStorage.setItem('expense_user', JSON.stringify(userObj));
          setFeedback({
            type: 'success',
            message: data.message || 'Login successful! Welcome back.',
          });
          setTimeout(() => {
            navigate('/dashboard');
          }, 800);
        } else {
          setFeedback({
            type: 'error',
            message: data.message || 'Invalid email or password.',
          });
        }
      }
    } catch (err) {
      console.warn('Backend not reached:', err);
      // Demo Mode fallback
      const targetEmail = email.trim() || 'ravi@example.com';
      setFeedback({
        type: 'success',
        message: `[Demo] ${
          isSignup
            ? 'Account created! Redirecting to OTP confirmation...'
            : 'Login successful! Redirecting to dashboard...'
        }`,
      });
      if (isSignup) {
        setTimeout(() => {
          if (onSignupSuccess) {
            onSignupSuccess(targetEmail);
          } else {
            navigate('/otp-sent', { state: { email: targetEmail } });
          }
        }, 900);
      } else {
        localStorage.setItem('expense_user', JSON.stringify({ email: targetEmail, name: 'Ravi Pandey' }));
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
      {/* Header with Logo, Title, and Subtitle */}
      <div className="auth-card-header">
        <div className="auth-logo-wrapper">
          <ExpenseTrackerLogo showSparkles={activeColorTheme === 'green' || isSignup} size={54} />
        </div>
        <h1 className="auth-title">Expense Tracker</h1>
        <p className="auth-subtitle">
          {isSignup ? 'Create your account to get started' : 'Track your expenses, achieve your goals'}
        </p>
      </div>

      {/* Tabs: [ Login ] [ Signup ] */}
      {!hideTabs && (
        <div className="auth-tabs-container">
          <button
            type="button"
            className={`auth-tab-btn ${!isSignup ? `active ${activeColorTheme}` : ''}`}
            onClick={() => handleTabSwitch('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${isSignup ? `active ${activeColorTheme}` : ''}`}
            onClick={() => handleTabSwitch('signup')}
          >
            Signup
          </button>
        </div>
      )}

      {/* Notification / Feedback Banner */}
      {feedback && (
        <div className={`feedback-banner ${feedback.type}`}>
          <span>{feedback.message}</span>
          <button
            type="button"
            className="banner-close-btn"
            onClick={() => setFeedback(null)}
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Name Fields: First Name and Last Name side by side */}
        {isSignup && (
          <div className="name-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <div
                className={`input-container ${
                  focusedField === 'firstName' ? `focused ${activeColorTheme}` : ''
                }`}
              >
                <div className="input-icon-left">
                  <UserIcon />
                </div>
                <input
                  type="text"
                  className="input-field"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onFocus={() => setFocusedField('firstName')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="given-name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <div
                className={`input-container ${
                  focusedField === 'lastName' ? `focused ${activeColorTheme}` : ''
                }`}
              >
                <div className="input-icon-left">
                  <UserIcon />
                </div>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onFocus={() => setFocusedField('lastName')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Email Address field */}
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div
            className={`input-container ${
              focusedField === 'email' ? `focused ${activeColorTheme}` : ''
            }`}
          >
            <div className="input-icon-left">
              <MailIcon />
            </div>
            <input
              type="email"
              className="input-field"
              placeholder={isSignup ? 'Enter your email address' : 'Enter your email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Password field */}
        <div className="form-group">
          <label className="form-label">Password</label>
          <div
            className={`input-container ${
              focusedField === 'password' ? `focused ${activeColorTheme}` : ''
            }`}
          >
            <div className="input-icon-left">
              <LockIcon />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field"
              placeholder={isSignup ? 'Create a password' : 'Enter your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
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

        {/* Confirm Password field (Signup only) */}
        {isSignup && (
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div
              className={`input-container ${
                focusedField === 'confirmPassword' ? `focused ${activeColorTheme}` : ''
              }`}
            >
              <div className="input-icon-left">
                <LockIcon />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Confirm your password"
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
        )}

        {/* Login extra row: Remember me & Forgot Password */}
        {!isSignup && (
          <div className="options-row">
            <label className="remember-label" onClick={() => setRememberMe(!rememberMe)}>
              <div
                className={`custom-checkbox ${
                  rememberMe ? `checked ${activeColorTheme}` : ''
                }`}
              >
                {rememberMe && <CheckIcon />}
              </div>
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className={`forgot-link ${activeColorTheme}`}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </button>
          </div>
        )}

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`submit-btn ${activeColorTheme}`}
        >
          {isLoading ? (
            <div className="spinner" />
          ) : isSignup ? (
            <>
              <UserPlusIcon />
              <span>Create Account</span>
            </>
          ) : (
            <>
              <LoginArrowIcon />
              <span>Login</span>
            </>
          )}
        </button>

        {/* Divider OR */}
        <div className="divider-container">
          <div className="divider-line" />
          <span className="divider-text">OR</span>
          <div className="divider-line" />
        </div>

        {/* Social Logins: shown on Login card (matching reference image) */}
        {(!isSignup || forceSocial) && (
          <div className="social-buttons">
            <button
              type="button"
              className="social-btn"
              onClick={() => alert('Continue with Google')}
            >
              <GoogleIcon size={16} />
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              className="social-btn"
              onClick={() => alert('Continue with GitHub')}
            >
              <GithubIcon size={16} />
              <span>Continue with GitHub</span>
            </button>
          </div>
        )}

        {/* Footer switch between Login and Signup */}
        <div className="auth-footer">
          {isSignup ? (
            <>
              <span>Already have an account?</span>
              <button
                type="button"
                className={`footer-link ${activeColorTheme}`}
                onClick={() => handleTabSwitch('login')}
              >
                Login
              </button>
            </>
          ) : (
            <>
              <span>Don't have an account?</span>
              <button
                type="button"
                className={`footer-link ${activeColorTheme}`}
                onClick={() => handleTabSwitch('signup')}
              >
                Signup
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};
