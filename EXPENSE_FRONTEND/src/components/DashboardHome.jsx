import React, { useState } from 'react';
import { TrendUpIcon, CalendarIcon } from './Icons';

export const DashboardHome = ({ expenses = [], user = null }) => {
  const [timeRange, setTimeRange] = useState('Last 6 Months');

  // 1. Dynamic Calculations from user's actual expenses
  const totalAmount = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0 to 11

  const prevMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  let thisMonthTotal = 0;
  let lastMonthTotal = 0;

  const categoryTotals = {
    Food: 0,
    Travel: 0,
    Shopping: 0,
    Others: 0,
  };

  expenses.forEach((item) => {
    const amt = Number(item.amount) || 0;
    const d = item.date ? new Date(item.date) : new Date();
    const itemYear = d.getFullYear();
    const itemMonth = d.getMonth();

    if (itemYear === currentYear && itemMonth === currentMonth) {
      thisMonthTotal += amt;
    } else if (itemYear === prevMonthYear && itemMonth === prevMonthIndex) {
      lastMonthTotal += amt;
    }

    const cat = item.category || 'Others';
    if (categoryTotals[cat] !== undefined) {
      categoryTotals[cat] += amt;
    } else {
      categoryTotals['Others'] += amt;
    }
  });

  // Calculate vs Last Month %
  let growthRate = '0%';
  let isIncrease = false;
  if (lastMonthTotal === 0 && thisMonthTotal === 0) {
    growthRate = '0%';
  } else if (lastMonthTotal === 0 && thisMonthTotal > 0) {
    growthRate = '+100%';
    isIncrease = true;
  } else if (lastMonthTotal > 0) {
    const diff = thisMonthTotal - lastMonthTotal;
    const pct = Math.round((diff / lastMonthTotal) * 100);
    growthRate = pct > 0 ? `+${pct}%` : `${pct}%`;
    isIncrease = pct > 0;
  }

  // 2. Dynamic Categories for Donut Chart
  const categoryConfig = [
    { label: 'Food', amount: categoryTotals.Food, color: '#f97316' },
    { label: 'Travel', amount: categoryTotals.Travel, color: '#3b82f6' },
    { label: 'Shopping', amount: categoryTotals.Shopping, color: '#10b981' },
    { label: 'Others', amount: categoryTotals.Others, color: '#a855f7' },
  ];

  const categories = categoryConfig.map((cat) => ({
    ...cat,
    percent: totalAmount > 0 ? Math.round((cat.amount / totalAmount) * 100) : 0,
  }));

  // Radius 37 => Circumference = 2 * PI * 37 = 232.48
  const radius = 37;
  const circumference = 2 * Math.PI * radius;

  // Build SVG arc segments
  let accumulatedOffset = 0;
  const donutSegments = categories.map((cat) => {
    const dashLength = totalAmount > 0 ? (cat.amount / totalAmount) * circumference : 0;
    const segment = {
      ...cat,
      dashLength,
      dashOffset: -accumulatedOffset,
    };
    accumulatedOffset += dashLength;
    return segment;
  });

  // 3. Dynamic Monthly Trend for the last 6 months
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(currentYear, currentMonth - i, 1);
    const mYear = targetDate.getFullYear();
    const mMonth = targetDate.getMonth();

    const mTotal = expenses
      .filter((exp) => {
        const expD = exp.date ? new Date(exp.date) : new Date();
        return expD.getFullYear() === mYear && expD.getMonth() === mMonth;
      })
      .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

    last6Months.push({
      month: monthNames[mMonth],
      amount: mTotal,
    });
  }

  const maxMonthVal = Math.max(...last6Months.map((m) => m.amount), 0);
  const baselineY = 92;
  const topY = 24;
  const chartHeight = baselineY - topY; // 68px
  const topScale = maxMonthVal > 0 ? Math.ceil(maxMonthVal * 1.25) : 10000;

  const points = last6Months.map((m, i) => {
    const x = 25 + i * 40; // 25, 65, 105, 145, 185, 225
    const y = maxMonthVal > 0
      ? baselineY - (m.amount / topScale) * chartHeight
      : baselineY;
    const displayVal = m.amount >= 1000 ? `${(m.amount / 1000).toFixed(1)}k` : `${m.amount}`;
    return { ...m, x, y, displayVal };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L 225 92 L 25 92 Z`;

  return (
    <div className="dash-view-container">
      {/* View Header */}
      <div className="dash-view-header">
        <div>
          <h2 className="dash-view-title">My Expenses</h2>
          <p className="dash-view-subtitle">Track and manage your spending</p>
        </div>

        {/* Dropdown filter */}
        <div className="dash-header-actions">
          <select
            className="dash-dropdown-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="This Year">This Year</option>
            <option value="All Time">All Time</option>
          </select>
        </div>
      </div>

      {/* 4 Summary Stats Cards Grid */}
      <div className="summary-cards-grid">
        {/* Card 1: Total Expenses */}
        <div className="stat-card green-tint">
          <div className="stat-card-header">
            <span className="stat-icon-badge green">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.4">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </span>
          </div>
          <span className="stat-card-label">Total Expenses</span>
          <span className="stat-card-value text-green">₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>

        {/* Card 2: This Month */}
        <div className="stat-card mint-tint">
          <div className="stat-card-header">
            <span className="stat-icon-badge mint">
              <TrendUpIcon size={14} color="#059669" />
            </span>
          </div>
          <span className="stat-card-label">This Month</span>
          <span className="stat-card-value text-dark">₹{thisMonthTotal.toLocaleString('en-IN')}</span>
        </div>

        {/* Card 3: Last Month */}
        <div className="stat-card blue-tint">
          <div className="stat-card-header">
            <span className="stat-icon-badge blue">
              <CalendarIcon size={14} color="#2563eb" />
            </span>
          </div>
          <span className="stat-card-label">Last Month</span>
          <span className="stat-card-value text-dark">₹{lastMonthTotal.toLocaleString('en-IN')}</span>
        </div>

        {/* Card 4: vs Last Month % */}
        <div className="stat-card pink-tint">
          <div className="stat-card-header">
            <span className="stat-icon-badge pink">
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#e11d48' }}>%</span>
            </span>
          </div>
          <span className={`stat-card-value ${isIncrease ? 'text-pink' : 'text-dark'}`} style={{ marginTop: '2px' }}>
            {growthRate}
          </span>
          <span className="stat-card-sublabel">vs Last Month</span>
        </div>
      </div>

      {/* 2 Charts Grid */}
      <div className="charts-grid-row">
        {/* Left: Donut Chart - Expense Overview */}
        <div className="chart-card">
          <h3 className="chart-card-title">Expense Overview</h3>

          <div className="donut-chart-container">
            {/* Dynamic SVG Donut */}
            <div className="donut-svg-wrapper">
              <svg viewBox="0 0 100 100" className="donut-svg">
                <g transform="rotate(-90 50 50)">
                  {/* Subtle background track */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="13"
                  />

                  {/* Render slices if there are expenses */}
                  {totalAmount > 0 &&
                    donutSegments.map(
                      (seg, idx) =>
                        seg.dashLength > 0 && (
                          <circle
                            key={idx}
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke={seg.color}
                            strokeWidth="13"
                            strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
                            strokeDashoffset={seg.dashOffset}
                            strokeLinecap="butt"
                          />
                        )
                    )}
                </g>
              </svg>

              {/* Center Total Text */}
              <div className="donut-center-text">
                <span className="donut-amount">₹{totalAmount.toLocaleString('en-IN')}</span>
                <span className="donut-label">Total</span>
              </div>
            </div>

            {/* Legend Tags */}
            <div className="donut-legend-list">
              {categories.map((item, idx) => (
                <div key={idx} className="legend-row">
                  <div className="legend-label-group">
                    <span className="legend-dot" style={{ backgroundColor: item.color }} />
                    <span className="legend-name">{item.label}</span>
                  </div>
                  <span className="legend-percent">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Monthly Trend Area Chart */}
        <div className="chart-card">
          <h3 className="chart-card-title">Monthly Trend</h3>

          <div className="trend-chart-container">
            <svg viewBox="0 0 250 105" className="trend-svg" preserveAspectRatio="none">
              {/* Y Grid Lines */}
              <line x1="20" y1="20" x2="240" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="20" y1="45" x2="240" y2="45" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="20" y1="70" x2="240" y2="70" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="20" y1="92" x2="240" y2="92" stroke="#e2e8f0" strokeWidth="1" />

              {/* Y Labels */}
              <text x="5" y="24" fontSize="7" fill="#94a3b8">
                {topScale >= 1000 ? `${Math.round(topScale / 1000)}k` : topScale}
              </text>
              <text x="5" y="49" fontSize="7" fill="#94a3b8">
                {topScale >= 1000 ? `${Math.round((topScale * 0.66) / 1000)}k` : Math.round(topScale * 0.66)}
              </text>
              <text x="7" y="74" fontSize="7" fill="#94a3b8">
                {topScale >= 1000 ? `${Math.round((topScale * 0.33) / 1000)}k` : Math.round(topScale * 0.33)}
              </text>
              <text x="7" y="94" fontSize="7" fill="#94a3b8">0k</text>

              {/* Gradient def for fill */}
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Area under curve */}
              {maxMonthVal > 0 && (
                <path d={areaD} fill="url(#trendGradient)" />
              )}

              {/* Trend Stroke Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points & labels */}
              {points.map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="3" fill="#10b981" stroke="#ffffff" strokeWidth="1.2" />
                  {maxMonthVal > 0 && (
                    <text x={pt.x} y={pt.y - 5} fontSize="6" fontWeight="bold" fill="#065f46" textAnchor="middle">
                      {pt.displayVal}
                    </text>
                  )}
                  <text x={pt.x} y="101" fontSize="7" fill="#64748b" textAnchor="middle">
                    {pt.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
