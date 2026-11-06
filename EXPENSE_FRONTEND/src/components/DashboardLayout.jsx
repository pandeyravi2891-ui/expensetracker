import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  PlusCircleIcon,
  ExpensesListIcon,
  UserIcon,
  LogoutIcon,
  TrendUpIcon,
} from './Icons';
import { DashboardHome } from './DashboardHome';
import { ExpensesList } from './ExpensesList';
import { ProfileView } from './ProfileView';
import { EditProfileView } from './EditProfileView';
import { AddExpenseModal } from './AddExpenseModal';

export const DashboardLayout = ({ initialTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab); // 'dashboard' | 'expenses' | 'profile' | 'edit-profile'

  // Sync tab with route if initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'dashboard') navigate('/dashboard');
    else if (tab === 'expenses') navigate('/dashboard/expenses');
    else if (tab === 'profile') navigate('/dashboard/profile');
    else if (tab === 'edit-profile') navigate('/dashboard/edit-profile');
  };

  // User state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('expense_user');
    return saved ? JSON.parse(saved) : {
      name: 'Ravi Pandey',
      email: 'ravi.pandey@example.com',
      bio: 'Web Developer | DSA Enthusiast'
    };
  });

  // Fresh expenses state - no dummy or mock data
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expense_items');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // Clean up previous dummy/mock seed if present
      if (Array.isArray(parsed) && parsed.some((item) => item.id === '1' && item.description === 'Pizza')) {
        localStorage.removeItem('expense_items');
        return [];
      }
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('expense_items', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('expense_user', JSON.stringify(user));
  }, [user]);

  // Fetch user profile from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const emailToFetch = user?.email || '';
        const response = await fetch(`${API_URL}/api/v1/get-profile?email=${encodeURIComponent(emailToFetch)}`);
        const data = await response.json();
        if (response.ok && data.success && data.user) {
          setUser((prev) => {
            const merged = {
              ...prev,
              name: `${data.user.firstName} ${data.user.lastName}`.trim() || prev.name,
              email: data.user.email || prev.email,
              profileImage: data.user.profileImage || prev.profileImage || '',
              bio: data.user.bio || prev.bio || ''
            };
            localStorage.setItem('expense_user', JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.warn('Backend profile fetch failed, using local user:', err);
      }
    };
    fetchProfile();
  }, [user?.email]);

  // Fetch expenses from backend on mount
  useEffect(() => {
    const fetchFromBackend = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/api/v1/fetch_expense?email=${encodeURIComponent(user.email)}`);
        const data = await response.json();
        if (response.ok && data.success && data.expenses?.length > 0) {
          setExpenses(data.expenses);
        }
      } catch (err) {
        console.warn('Backend not reached, using local data:', err);
      }
    };
    fetchFromBackend();
  }, [user.email]);

  // Handle Save (Add or Update)
  const handleSaveExpense = async (expenseData) => {
    const { id, description, amount, category, date } = expenseData;

    if (id) {
      // Edit existing
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        await fetch(`${API_URL}/api/v1/expense/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, category, date, description }),
        });
      } catch (err) {
        console.warn('Backend update failed, updating locally:', err);
      }

      setExpenses((prev) =>
        prev.map((item) =>
          (item._id === id || item.id === id)
            ? { ...item, description, amount, category, date }
            : item
        )
      );
    } else {
      // Add new
      let newId = Date.now().toString();
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/api/v1/expense_add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            amount,
            category,
            date,
            description,
          }),
        });
        const data = await response.json();
        if (data.expense?._id) {
          newId = data.expense._id;
        }
      } catch (err) {
        console.warn('Backend add failed, saving locally:', err);
      }

      const newItem = {
        id: newId,
        _id: newId,
        description,
        amount,
        category,
        date,
      };
      setExpenses((prev) => [newItem, ...prev]);
    }
  };

  // Handle Delete
  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await fetch(`${API_URL}/api/v1/expense/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Backend delete failed, deleting locally:', err);
    }

    setExpenses((prev) => prev.filter((item) => item._id !== id && item.id !== id));
  };

  // Handle Logout
  const handleLogout = () => {
    if (window.confirm('Do you really want to logout?')) {
      localStorage.removeItem('expense_token');
      navigate('/login', {
        state: { message: 'Logged out successfully.' },
      });
    }
  };

  const totalExpensesAmount = expenses.reduce(
    (acc, curr) => acc + (Number(curr.amount) || 0),
    0
  );

  return (
    <div className="dash-app-window">
      {/* 1. Dark Forest Green Sidebar */}
      <aside className="dash-sidebar">
        {/* Top Brand Logo */}
        <div className="dash-sidebar-brand" onClick={() => switchTab('dashboard')}>
          <div className="brand-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="20" height="14" rx="3" />
              <path d="M16 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
              <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
            </svg>
          </div>
          <div className="brand-text-column">
            <span className="brand-title-top">Expense</span>
            <span className="brand-title-sub">Tracker</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="dash-sidebar-nav">
          <button
            type="button"
            className={`nav-item-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => switchTab('dashboard')}
          >
            <HomeIcon size={17} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className="nav-item-btn"
            onClick={() => {
              setEditingExpense(null);
              setIsModalOpen(true);
            }}
          >
            <PlusCircleIcon size={17} />
            <span>Add Expense</span>
          </button>

          <button
            type="button"
            className={`nav-item-btn ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => switchTab('expenses')}
          >
            <ExpensesListIcon size={17} />
            <span>My Expenses</span>
          </button>

          <button
            type="button"
            className={`nav-item-btn ${activeTab === 'profile' || activeTab === 'edit-profile' ? 'active' : ''}`}
            onClick={() => switchTab('profile')}
          >
            <UserIcon className="nav-icon" />
            <span>Profile</span>
          </button>

          <button
            type="button"
            className="nav-item-btn logout"
            onClick={handleLogout}
          >
            <LogoutIcon size={17} />
            <span>Logout</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="dash-sidebar-footer">
          <div className="footer-trend-icon">
            <TrendUpIcon size={18} color="#10b981" />
          </div>
          <div className="footer-tagline-text">
            <span>Track Smart</span>
            <span className="bold-text">Spend Better</span>
          </div>
        </div>
      </aside>

      {/* 2. Main Workspace */}
      <main className="dash-main-workspace">
        {activeTab === 'dashboard' && (
          <DashboardHome
            expenses={expenses}
            user={user}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesList
            expenses={expenses}
            onAddClick={() => {
              setEditingExpense(null);
              setIsModalOpen(true);
            }}
            onEditClick={(exp) => {
              setEditingExpense(exp);
              setIsModalOpen(true);
            }}
            onDeleteClick={handleDeleteExpense}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            expenses={expenses}
            totalExpenses={totalExpensesAmount}
            onEditProfile={() => switchTab('edit-profile')}
          />
        )}

        {activeTab === 'edit-profile' && (
          <EditProfileView
            user={user}
            onBack={() => switchTab('profile')}
            onSave={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
          />
        )}
      </main>

      {/* 3. Add / Edit Expense Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        initialData={editingExpense}
        onSave={handleSaveExpense}
      />
    </div>
  );
};
