import React from 'react';

// Green Wallet with Gold Coin ($) and celebratory sparkles matching the new screenshot
export const WalletWithCoinLogo = ({ size = 110 }) => {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size * 0.9 }}>
      <svg
        viewBox="0 0 130 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        {/* Soft shadow under wallet */}
        <ellipse cx="65" cy="85" rx="48" ry="12" fill="#047857" opacity="0.12" />

        {/* 3 Green celebratory sparkles on right */}
        <g stroke="#10b981" strokeWidth="3.2" strokeLinecap="round">
          <line x1="98" y1="22" x2="108" y2="14" />
          <line x1="106" y1="36" x2="117" y2="34" />
          <line x1="100" y1="50" x2="110" y2="56" />
        </g>

        {/* --- BANKNOTES (Teal/Cyan cash sticking out of top) --- */}
        <g id="cash-notes">
          {/* Note 1 (Back) */}
          <rect
            x="36"
            y="14"
            width="40"
            height="22"
            rx="4"
            fill="#0d9488"
            transform="rotate(-10 36 14)"
          />
          {/* Note 2 (Middle) */}
          <rect
            x="42"
            y="17"
            width="40"
            height="22"
            rx="4"
            fill="#14b8a6"
            transform="rotate(4 42 17)"
          />
          {/* Note 3 (Front) */}
          <rect
            x="46"
            y="20"
            width="38"
            height="20"
            rx="4"
            fill="#2dd4bf"
            transform="rotate(12 46 20)"
          />
        </g>

        {/* --- 3D-STYLE GREEN WALLET --- */}
        <g id="wallet-body">
          {/* Main Wallet Shape */}
          <rect
            x="24"
            y="30"
            width="66"
            height="50"
            rx="12"
            fill="url(#lushGreenGrad)"
          />
          {/* Top glossy highlight */}
          <path
            d="M 32 32 C 40 31, 74 31, 82 32 C 86 32.5, 87 35, 85 36 C 75 37, 39 37, 29 36 C 27 35, 28 32.5, 32 32 Z"
            fill="#a7f3d0"
            opacity="0.45"
          />
          {/* Bottom curve depth shadow */}
          <path
            d="M 24 68 C 30 76, 80 76, 90 68 V 70 C 90 76, 84 80, 78 80 H 36 C 30 80, 24 76, 24 70 Z"
            fill="#047857"
            opacity="0.6"
          />
          {/* Wallet Clasp Flap */}
          <path
            d="M 64 45 H 88 C 91.5 45 94 47.5 94 51 V 59 C 94 62.5 91.5 65 88 65 H 64 V 45 Z"
            fill="#065f46"
          />
          {/* Gold Snap Clasp Button on flap */}
          <circle cx="82" cy="55" r="5" fill="url(#goldGradButton)" />
          <circle cx="82" cy="55" r="2.2" fill="#b45309" />
        </g>

        {/* --- GOLD COIN LEANING ON WALLET ($) --- */}
        <g id="gold-coin" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))">
          {/* Outer gold rim */}
          <circle cx="88" cy="74" r="16" fill="url(#goldGradCoin)" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Inner ring */}
          <circle cx="88" cy="74" r="13" fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="3 1.5" />
          {/* Currency Dollar Sign '$' */}
          <text
            x="88"
            y="80"
            textAnchor="middle"
            fill="#92400e"
            fontSize="16"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            $
          </text>
        </g>

        {/* Gradient Defs */}
        <defs>
          <linearGradient id="lushGreenGrad" x1="24" y1="30" x2="90" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10b981" />
            <stop offset="0.6" stopColor="#059669" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="goldGradButton" x1="77" y1="50" x2="87" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef08a" />
            <stop offset="0.5" stopColor="#facc15" />
            <stop offset="1" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="goldGradCoin" x1="72" y1="58" x2="104" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef08a" />
            <stop offset="0.4" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// Original Logo for compact cards
export const ExpenseTrackerLogo = ({
  showSparkles = true,
  size = 54,
  variant = 'green',
}) => {
  const isGreen = variant === 'green';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size * 0.8 }}>
      <svg
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        {showSparkles && (
          <g className="sparkles" stroke="#22c55e" strokeWidth="3" strokeLinecap="round">
            <line x1="82" y1="12" x2="90" y2="4" />
            <line x1="92" y1="24" x2="101" y2="22" />
            <line x1="91" y1="36" x2="99" y2="42" />
          </g>
        )}

        <g id="cash-notes">
          <rect
            x="24"
            y="6"
            width="28"
            height="18"
            rx="3"
            fill={isGreen ? "#059669" : "#16a34a"}
            transform="rotate(-8 24 6)"
          />
          <circle cx="34" cy="12" r="3" fill="#22c55e" opacity="0.6" />
          <rect
            x="28"
            y="9"
            width="26"
            height="16"
            rx="3"
            fill="#22c55e"
            transform="rotate(6 28 9)"
          />
          <circle cx="43" cy="15" r="3" fill="#15803d" opacity="0.5" />
        </g>

        <g id="wallet">
          <rect
            x="14"
            y="20"
            width="46"
            height="34"
            rx="7"
            fill={isGreen ? "url(#greenWalletGradient)" : "url(#blueWalletGradient)"}
          />
          <rect
            x="17"
            y="23"
            width="40"
            height="2"
            rx="1"
            fill={isGreen ? "#a7f3d0" : "#93c5fd"}
            opacity="0.4"
          />
          <path
            d="M 44 31 H 59 C 61.2 31 63 32.8 63 35 V 41 C 63 43.2 61.2 45 59 45 H 44 V 31 Z"
            fill={isGreen ? "#047857" : "#1d4ed8"}
          />
          <circle cx="54" cy="38" r="3.2" fill={isGreen ? "#6ee7b7" : "#bfdbfe"} />
          <circle cx="54" cy="38" r="1.5" fill={isGreen ? "#064e3b" : "#1e40af"} />
        </g>

        <g id="bar-chart">
          <rect x="65" y="38" width="6.5" height="16" rx="2" fill="#22c55e" />
          <rect x="73.5" y="30" width="6.5" height="24" rx="2" fill="#22c55e" />
          <rect x="82" y="20" width="6.5" height="34" rx="2" fill="#16a34a" />

          <path
            d="M 64 34 L 80 18 L 86 12"
            stroke={isGreen ? "#0d9488" : "#0284c7"}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 77 12 H 86 V 21"
            stroke={isGreen ? "#0d9488" : "#0284c7"}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        <defs>
          <linearGradient id="blueWalletGradient" x1="14" y1="20" x2="60" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563eb" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="greenWalletGradient" x1="14" y1="20" x2="60" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10b981" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// Circular Green Lock Badge (Used in Forgot Password & Reset Password)
export const GreenLockBadge = ({ size = 48 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: '#dcfce7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 10px auto',
    }}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="#059669" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#059669" fill="none" />
      <circle cx="12" cy="16" r="1.5" fill="#ffffff" />
    </svg>
  </div>
);

// Circular Green Check Badge (Used in Verify OTP)
export const GreenCheckBadge = ({ size = 48 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: '#dcfce7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 10px auto',
    }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#059669" />
      <path d="M8 12.5L10.5 15L16 9.5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

// OTP Envelope with Checkmark Illustration (Screen 4: OTP Sent!)
export const OtpEnvelopeWithCheck = ({ size = 120 }) => (
  <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size * 0.85 }}>
    <svg viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      {/* Glow */}
      <ellipse cx="65" cy="55" rx="50" ry="26" fill="#dcfce7" opacity="0.6" />

      {/* Sparkles */}
      <g stroke="#10b981" strokeWidth="3" strokeLinecap="round">
        <line x1="45" y1="14" x2="49" y2="6" />
        <line x1="33" y1="24" x2="24" y2="20" />
        <line x1="40" y1="36" x2="32" y2="40" />
      </g>

      {/* Envelope Body */}
      <path
        d="M 30 38 L 70 65 L 110 38 V 78 C 110 82 106 86 102 86 H 38 C 34 86 30 82 30 78 Z"
        fill="#ffffff"
        stroke="#10b981"
        strokeWidth="2.5"
      />
      {/* Top Flap */}
      <path
        d="M 30 38 L 70 65 L 110 38 L 70 18 Z"
        fill="#f0fdf4"
        stroke="#10b981"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Checkmark Badge on bottom-right of envelope */}
      <g filter="drop-shadow(0 3px 6px rgba(16,185,129,0.3))">
        <circle cx="104" cy="68" r="16" fill="#10b981" />
        <path d="M 97 68.5 L 102 73.5 L 111 63.5" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  </div>
);

// User Profile Icon
export const UserIcon = ({ className = "icon" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// Mail Icon
export const MailIcon = ({ className = "icon" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

// Lock Icon
export const LockIcon = ({ className = "icon" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="11" width="16" height="11" rx="2.5" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// Eye Icon (Visible)
export const EyeIcon = ({ className = "icon" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Eye Off Icon (Hidden)
export const EyeOffIcon = ({ className = "icon" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

// User Plus Icon
export const UserPlusIcon = ({ className = "icon" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

// Login Arrow Icon
export const LoginArrowIcon = ({ className = "icon" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

// Arrow Right (Used in "Send OTP →")
export const ArrowRightIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// Arrow Left (Back Button)
export const ArrowLeftIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

// Check Icon
export const CheckIcon = ({ className = "icon" }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Clock Icon
export const ClockIcon = ({ size = 20, color = "#10b981" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// Google Icon
export const GoogleIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

// GitHub Icon
export const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);


// Aliases and extra exports for backwards compatibility
export const OtpEnvelopeIllustration = ({ size = 110 }) => (
  <OtpEnvelopeWithCheck size={size} />
);

export const MailCheckIcon = ({ size = 18, color = "#059669" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);


// ============================================================
// DASHBOARD ICONS
// ============================================================

// Home / Dashboard Icon
export const HomeIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// Plus Circle Icon (Add Expense)
export const PlusCircleIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

// My Expenses List / Card Icon
export const ExpensesListIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

// Logout Icon
export const LogoutIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// Trending Upward Arrow Icon
export const TrendUpIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

// Search Icon
export const SearchIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// Calendar Icon
export const CalendarIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// Pencil / Edit Icon
export const EditIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

// Trash / Delete Icon
export const TrashIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// Food Icon (Fork & Spoon)
export const FoodIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2v20M14 2v6a4 4 0 0 0 4 4v10M6 2v8a3 3 0 0 0 3 3v9M6 2c0 2 3 2 3 0M9 2c0 2 3 2 3 0" />
  </svg>
);

// Travel Icon (Car)
export const TravelIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="8" rx="2" />
    <path d="M5 11l2-6h10l2 6" />
    <circle cx="7.5" cy="15.5" r="1.5" />
    <circle cx="16.5" cy="15.5" r="1.5" />
  </svg>
);

// Shopping Icon (Bag)
export const ShoppingIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

// Others Icon (Film/Ticket)
export const OthersIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <line x1="2" y1="8" x2="22" y2="8" />
    <line x1="6" y1="4" x2="6" y2="8" />
    <line x1="10" y1="4" x2="10" y2="8" />
    <line x1="14" y1="4" x2="14" y2="8" />
    <line x1="18" y1="4" x2="18" y2="8" />
  </svg>
);

// Trophy Icon
export const TrophyIcon = ({ size = 20, color = "#10b981" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34" />
    <path d="M6 2v7a6 6 0 0 0 12 0V2H6z" />
  </svg>
);

// Camera Icon
export const CameraIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

// Bell Icon
export const BellIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
