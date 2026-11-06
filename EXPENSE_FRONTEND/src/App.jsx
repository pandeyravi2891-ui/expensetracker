import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthCard } from './components/AuthCard';
import { OtpSentCard } from './components/OtpSentCard';
import { OtpVerifyCard } from './components/OtpVerifyCard';
import { ForgotPasswordCard } from './components/ForgotPasswordCard';
import { ResetOtpSentCard } from './components/ResetOtpSentCard';
import { ResetOtpVerifyCard } from './components/ResetOtpVerifyCard';
import { ResetPasswordCard } from './components/ResetPasswordCard';
import { DashboardLayout } from './components/DashboardLayout';
import './App.css';

// Background Waves
function BackgroundWaves() {
  return (
    <>
      <svg className="bg-wave-left" viewBox="0 0 700 900" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M-100 0 C150 150, 50 450, -80 700 C-150 820, -50 950, -100 1000 L-200 1000 L-200 0 Z"
          fill="url(#blueWaveGrad)"
        />
        <path
          d="M-50 200 C200 350, 100 650, -30 900 L-200 900 L-200 200 Z"
          fill="url(#lightSkyGrad)"
          opacity="0.4"
        />
        <defs>
          <linearGradient id="blueWaveGrad" x1="0" y1="0" x2="300" y2="700" gradientUnits="userSpaceOnUse">
            <stop stopColor="#dbeafe" stopOpacity="0.8" />
            <stop offset="1" stopColor="#eff6ff" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="lightSkyGrad" x1="0" y1="200" x2="250" y2="900" gradientUnits="userSpaceOnUse">
            <stop stopColor="#bfdbfe" stopOpacity="0.5" />
            <stop offset="1" stopColor="#e0f2fe" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      <svg className="bg-wave-right" viewBox="0 0 700 900" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M800 100 C500 200, 600 550, 750 800 C800 880, 850 950, 900 1000 L900 0 L800 0 Z"
          fill="url(#greenWaveGrad)"
        />
        <path
          d="M750 300 C480 450, 550 750, 720 950 L900 950 L900 300 Z"
          fill="url(#mintWaveGrad)"
          opacity="0.5"
        />
        <defs>
          <linearGradient id="greenWaveGrad" x1="800" y1="100" x2="500" y2="800" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a7f3d0" stopOpacity="0.65" />
            <stop offset="1" stopColor="#d1fae5" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="mintWaveGrad" x1="750" y1="300" x2="520" y2="950" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6ee7b7" stopOpacity="0.35" />
            <stop offset="1" stopColor="#ecfdf5" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="auth-page-wrapper">
        <BackgroundWaves />

        <div className="auth-content-container">
          <Routes>
            {/* 1. Main Auth: Login & Signup */}
            <Route path="/" element={<AuthCard mode="signup" theme="green" forceSocial={true} />} />
            <Route path="/signup" element={<AuthCard mode="signup" theme="green" forceSocial={true} />} />
            <Route path="/login" element={<AuthCard mode="login" theme="green" forceSocial={true} />} />

            {/* 2. Signup OTP Flow */}
            <Route path="/otp-sent" element={<OtpSentCard />} />
            <Route path="/otp-verify" element={<OtpVerifyCard />} />

            {/* 3. Forgot Password Flow */}
            <Route path="/forgot-password" element={<ForgotPasswordCard />} />
            <Route path="/forgot-password/otp-sent" element={<ResetOtpSentCard />} />
            <Route path="/forgot-password/verify-otp" element={<ResetOtpVerifyCard />} />
            <Route path="/reset-password" element={<ResetPasswordCard />} />

            {/* 4. Complete Dashboard Flow (Matching the new 4 screens!) */}
            <Route path="/dashboard" element={<DashboardLayout initialTab="dashboard" />} />
            <Route path="/dashboard/expenses" element={<DashboardLayout initialTab="expenses" />} />
            <Route path="/dashboard/profile" element={<DashboardLayout initialTab="profile" />} />
            <Route path="/dashboard/edit-profile" element={<DashboardLayout initialTab="edit-profile" />} />

            {/* Catch-all: Redirect to Home / Login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
