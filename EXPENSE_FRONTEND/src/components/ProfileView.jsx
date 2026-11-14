import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EditIcon,
  LockIcon,
  BellIcon,
  TrashIcon,
  MailIcon,
  CalendarIcon,
  TrophyIcon,
} from './Icons';

export const ProfileView = ({ user = null, expenses = [], totalExpenses = 0, onEditProfile }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const displayName = user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Ravi Pandey');
  const displayEmail = user?.email || 'ravi.pandey@example.com';
  const initial = displayName.charAt(0).toUpperCase() || 'R';

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete your account? All your profile data and recorded expenses will be deleted.'
    );
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/v1/delete_account`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: displayEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.removeItem('expense_token');
        localStorage.removeItem('expense_user');
        localStorage.removeItem('is_logged_in');
        localStorage.removeItem('expense_items');
        alert(data.message || 'Account deleted successfully.');
        navigate('/signup', { replace: true });
      } else {
        if (data.message === 'User not found.') {
          localStorage.removeItem('expense_token');
          localStorage.removeItem('expense_user');
          localStorage.removeItem('is_logged_in');
          localStorage.removeItem('expense_items');
          alert('Local session and data cleared.');
          navigate('/signup', { replace: true });
        } else {
          alert(data.message || 'Failed to delete account. Please try again.');
        }
      }
    } catch (err) {
      console.warn('Backend delete account error:', err);
      localStorage.removeItem('expense_token');
      localStorage.removeItem('expense_user');
      localStorage.removeItem('expense_items');
      alert('Local session and data cleared.');
      navigate('/signup', { replace: true });
    } finally {
      setIsDeleting(false);
    }
  };

  // Dynamic calculations
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const thisMonthTotal = expenses.reduce((acc, curr) => {
    const d = curr.date ? new Date(curr.date) : new Date();
    if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
      return acc + (Number(curr.amount) || 0);
    }
    return acc;
  }, 0);

  // Top category
  const catSums = {};
  expenses.forEach((item) => {
    const cat = item.category || 'Others';
    catSums[cat] = (catSums[cat] || 0) + (Number(item.amount) || 0);
  });
  let topCategory = 'None';
  let maxCatAmount = 0;
  Object.entries(catSums).forEach(([cat, amt]) => {
    if (amt > maxCatAmount) {
      maxCatAmount = amt;
      topCategory = cat;
    }
  });

  return (
    <div className="dash-view-container">
      {/* Header */}
      <div className="dash-view-header">
        <div>
          <h2 className="dash-view-title">My Profile</h2>
          <p className="dash-view-subtitle">Manage your account information</p>
        </div>
      </div>

      {/* Top 2 Cards Grid */}
      <div className="profile-top-grid">
        {/* Left: User Profile Details Card */}
        <div className="profile-main-card">
          <div className="profile-hero-row">
            {/* Avatar with edit circle */}
            <div className="profile-avatar-wrapper">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={displayName}
                  className="profile-avatar-large profile-avatar-img"
                />
              ) : (
                <div className="profile-avatar-large">{initial}</div>
              )}
              <button
                type="button"
                className="avatar-edit-badge"
                onClick={onEditProfile}
                title="Edit Profile"
              >
                <EditIcon size={12} color="#065f46" />
              </button>
            </div>

            {/* Name, email, badge */}
            <div className="profile-title-info">
              <h3 className="profile-name">{displayName}</h3>
              <p className="profile-email-text">{displayEmail}</p>
              <span className="premium-badge">Premium User</span>
            </div>
          </div>

          {/* Details list */}
          <div className="profile-details-list">
            <div className="detail-row">
              <span className="detail-label">
                <MailIcon className="detail-icon" />
                <span>Email Address</span>
              </span>
              <span className="detail-value">{displayEmail}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                <CalendarIcon size={14} color="#64748b" />
                <span>Member Since</span>
              </span>
              <span className="detail-value">Nov 2026</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <span>Total Expenses</span>
              </span>
              <span className="detail-value font-bold text-green">
                ₹{totalExpenses.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions Card */}
        <div className="profile-quick-actions-card">
          <h3 className="quick-actions-title">Quick Actions</h3>

          <div className="quick-actions-list">
            <button
              type="button"
              className="quick-action-btn"
              onClick={onEditProfile}
            >
              <span className="qa-left">
                <span className="qa-icon-wrap mint">
                  <EditIcon size={14} color="#059669" />
                </span>
                <span className="qa-text">Edit Profile</span>
              </span>
            </button>

            <button
              type="button"
              className="quick-action-btn"
              onClick={() => navigate('/forgot-password')}
            >
              <span className="qa-left">
                <span className="qa-icon-wrap teal">
                  <LockIcon className="qa-icon" />
                </span>
                <span className="qa-text">Change Password</span>
              </span>
              <span className="qa-arrow">→</span>
            </button>

            <button
              type="button"
              className="quick-action-btn"
              onClick={() => alert('Notification settings: All alerts are currently enabled.')}
            >
              <span className="qa-left">
                <span className="qa-icon-wrap blue">
                  <BellIcon size={14} color="#2563eb" />
                </span>
                <span className="qa-text">Notification Settings</span>
              </span>
              <span className="qa-arrow">→</span>
            </button>

            <button
              type="button"
              className="quick-action-btn delete-btn"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              <span className="qa-left">
                <span className="qa-icon-wrap red">
                  <TrashIcon size={14} color="#dc2626" />
                </span>
                <span className="qa-text text-red">
                  {isDeleting ? 'Deleting Account...' : 'Delete Account'}
                </span>
              </span>
              <span className="qa-arrow text-red">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom: Your Stats */}
      <div className="your-stats-card">
        <h4 className="stats-header-title">Your Stats</h4>

        <div className="stats-three-cols">
          <div className="single-stat-col">
            <span className="stat-symbol-icon green">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.4">
                <rect x="4" y="10" width="4" height="10" rx="1" />
                <rect x="10" y="4" width="4" height="16" rx="1" />
                <rect x="16" y="13" width="4" height="7" rx="1" />
              </svg>
            </span>
            <span className="stat-big-number">1</span>
            <span className="stat-desc-label">Month Active</span>
          </div>

          <div className="single-stat-col border-center">
            <span className="stat-symbol-icon mint">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.4">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </span>
            <span className="stat-big-number">₹{thisMonthTotal.toLocaleString('en-IN')}</span>
            <span className="stat-desc-label">This Month</span>
          </div>

          <div className="single-stat-col">
            <span className="stat-symbol-icon yellow">
              <TrophyIcon size={16} color="#d97706" />
            </span>
            <span className="stat-big-number">Top Category</span>
            <span className="stat-desc-label font-bold text-dark">{topCategory}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

