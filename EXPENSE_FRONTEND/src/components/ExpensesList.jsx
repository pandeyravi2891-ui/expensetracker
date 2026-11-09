import React, { useState } from 'react';
import {
  SearchIcon,
  PlusCircleIcon,
  FoodIcon,
  TravelIcon,
  ShoppingIcon,
  OthersIcon,
  EditIcon,
  TrashIcon,
} from './Icons';

export const ExpensesList = ({
  expenses = [],
  userEmail = '',
  onAddClick,
  onEditClick,
  onDeleteClick,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filterCategories = ['All', 'Food', 'Travel', 'Shopping', 'Others'];

  // Helper icon by category
  const getCategoryIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'food':
        return <FoodIcon size={16} color="#ea580c" />;
      case 'travel':
        return <TravelIcon size={16} color="#2563eb" />;
      case 'shopping':
        return <ShoppingIcon size={16} color="#16a34a" />;
      default:
        return <OthersIcon size={16} color="#9333ea" />;
    }
  };

  const getCategoryClass = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'food':
        return 'cat-food';
      case 'travel':
        return 'cat-travel';
      case 'shopping':
        return 'cat-shopping';
      default:
        return 'cat-others';
    }
  };

  // Filter expenses:
  // 1. Only show expenses where email matches current logged-in user
  // 2. Filter by category and search query
  const filteredExpenses = expenses
    .filter((item) => {
      if (item.email && userEmail) {
        return item.email.trim().toLowerCase() === userEmail.trim().toLowerCase();
      }
      return true;
    })
    .filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  return (
    <div className="dash-view-container">
      {/* Header with Title and Search / Add Button */}
      <div className="dash-view-header">
        <div>
          <h2 className="dash-view-title">My Expenses</h2>
          <p className="dash-view-subtitle">View and manage all your expenses</p>
        </div>

        <div className="expenses-top-actions">
          {/* Search bar */}
          <div className="search-bar-wrapper">
            <SearchIcon size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* + Add Expense button */}
          <button type="button" className="btn-add-expense" onClick={onAddClick}>
            <PlusCircleIcon size={15} color="#ffffff" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="category-filter-pills">
        {filterCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`cat-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expense List Items */}
      <div className="expenses-list-card">
        {filteredExpenses.length === 0 ? (
          <div className="no-expenses-view">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            <p style={{ margin: 0, fontWeight: 600, color: '#475569' }}>No expenses recorded yet</p>
            <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>Click "+ Add Expense" above to add your first expense.</span>
          </div>
        ) : (
          filteredExpenses.map((exp, index) => (
            <div key={exp._id || exp.id || index} className="expense-row-item">
              {/* Left icon badge */}
              <div className={`exp-icon-circle ${getCategoryClass(exp.category)}`}>
                {getCategoryIcon(exp.category)}
              </div>

              {/* Title & Date */}
              <div className="exp-info">
                <span className="exp-title">{exp.description}</span>
                <span className="exp-date">
                  {exp.date
                    ? new Date(exp.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Oct 28, 2026'}
                </span>
              </div>

              {/* Category Pill */}
              <div className="exp-category-col">
                <span className={`exp-cat-badge ${getCategoryClass(exp.category)}`}>
                  {exp.category}
                </span>
              </div>

              {/* Amount */}
              <div className="exp-amount">
                ₹{Number(exp.amount).toLocaleString('en-IN')}
              </div>

              {/* Action buttons (Edit & Delete) */}
              <div className="exp-actions">
                <button
                  type="button"
                  className="btn-action edit"
                  onClick={() => onEditClick(exp)}
                  title="Edit expense"
                >
                  <EditIcon size={14} color="#475569" />
                </button>
                <button
                  type="button"
                  className="btn-action delete"
                  onClick={() => onDeleteClick(exp._id || exp.id)}
                  title="Delete expense"
                >
                  <TrashIcon size={14} color="#ef4444" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

