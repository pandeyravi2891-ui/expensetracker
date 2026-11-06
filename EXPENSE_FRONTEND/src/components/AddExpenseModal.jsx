import React, { useState } from 'react';

export const AddExpenseModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [description, setDescription] = useState(initialData?.description || '');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [category, setCategory] = useState(initialData?.category || 'Food');
  const [date, setDate] = useState(
    initialData?.date
      ? new Date(initialData.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError('Please enter expense title/description.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!date) {
      setError('Please select a date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        id: initialData?._id || initialData?.id,
        description: description.trim(),
        amount: Number(amount),
        category,
        date,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save expense.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{initialData ? 'Edit Expense' : 'Add New Expense'}</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="feedback-banner error" style={{ margin: '8px 0' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Expense Title</label>
            <input
              type="text"
              className="modal-input"
              placeholder="e.g. Pizza, Shoes, Bus Ticket"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="modal-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                className="modal-input"
                placeholder="₹ Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Category</label>
              <select
                className="modal-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="modal-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="modal-btn-submit">
              {isSubmitting ? 'Saving...' : initialData ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

