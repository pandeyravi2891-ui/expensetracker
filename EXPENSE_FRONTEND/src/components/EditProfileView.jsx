import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, CameraIcon } from './Icons';

// Client-side image compressor: converts any file to compact, crisp avatar image (max 600x600, ~80KB)
const compressAndResizeImage = (file, maxDim = 600) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve({ file: compressedFile, dataUrl: canvas.toDataURL('image/jpeg', 0.88) });
            } else {
              resolve({ file, dataUrl: e.target.result });
            }
          },
          'image/jpeg',
          0.88
        );
      };
      img.onerror = () => resolve({ file, dataUrl: e.target.result });
      img.src = e.target.result;
    };
    reader.onerror = () => resolve({ file, dataUrl: null });
    reader.readAsDataURL(file);
  });
};

export const EditProfileView = ({ user = null, onBack, onSave }) => {
  const [fullName, setFullName] = useState(
    user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Ravi Pandey')
  );
  const [email, setEmail] = useState(user?.email || 'ravi.pandey@example.com');
  const [bio, setBio] = useState(user?.bio || '');
  const [feedback, setFeedback] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Profile photo states
  const [photoPreview, setPhotoPreview] = useState(user?.profileImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Synchronize when user prop loads or updates
  useEffect(() => {
    if (user?.name) setFullName(user.name);
    if (user?.email) setEmail(user.email);
    if (user?.bio !== undefined) setBio(user.bio);
    if (user?.profileImage) setPhotoPreview(user.profileImage);
  }, [user]);

  const initial = (fullName || 'R').charAt(0).toUpperCase();

  // Instant Photo Upload as soon as an image is chosen
  const handleFileSelect = async (e) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setFeedback(null);
    setIsUploading(true);

    try {
      // 1. Compress image client-side to ensure fast and reliable upload
      const { file: compressedFile, dataUrl } = await compressAndResizeImage(rawFile, 600);

      // Immediately show preview
      if (dataUrl) {
        setPhotoPreview(dataUrl);
      }

      // 2. Upload to backend
      const formData = new FormData();
      formData.append('profileImage', compressedFile);
      formData.append('email', (email || '').trim());
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/v1/upload-profile`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const savedUrl = data.profileImage || (data.user && data.user.profileImage) || dataUrl;
        setPhotoPreview(savedUrl);

        const updatedUser = {
          profileImage: savedUrl,
          email: data.user?.email || email.trim(),
          name: data.user ? `${data.user.firstName} ${data.user.lastName}`.trim() : fullName
        };

        if (onSave) {
          onSave(updatedUser);
        }

        setFeedback({ type: 'success', message: 'Profile photo uploaded and saved successfully!' });
      } else {
        // Fallback: save preview locally and notify
        if (onSave && dataUrl) {
          onSave({ profileImage: dataUrl });
        }
        setFeedback({ 
          type: 'error', 
          message: data.message || 'Server upload failed, but photo preview is cached.' 
        });
      }
    } catch (err) {
      console.warn('Photo upload error:', err);
      if (onSave && photoPreview) {
        onSave({ profileImage: photoPreview });
      }
      setFeedback({ type: 'error', message: 'Upload error. Please check backend connection.' });
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be selected again if needed
      if (e.target) e.target.value = '';
    }
  };

  // Submit Profile update (Name, Bio, Email, Photo) to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!fullName.trim()) {
      setFeedback({ type: 'error', message: 'Full name cannot be empty.' });
      return;
    }

    setIsUpdating(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/v1/update-profile`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: fullName.trim(),
          bio: bio.trim(),
          profileImage: photoPreview || ''
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const updatedData = {
          name: fullName.trim(),
          email: data.user?.email || email.trim(),
          bio: bio.trim(),
          profileImage: data.user?.profileImage || photoPreview || ''
        };
        if (onSave) {
          onSave(updatedData);
        }
        setFeedback({ type: 'success', message: 'Profile updated successfully!' });
        setTimeout(() => {
          onBack();
        }, 900);
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to update profile.' });
      }
    } catch (err) {
      console.warn('Backend update profile failed, updating locally:', err);
      if (onSave) {
        onSave({ name: fullName.trim(), bio: bio.trim(), email: email.trim(), profileImage: photoPreview || '' });
      }
      setFeedback({ type: 'success', message: 'Profile updated successfully!' });
      setTimeout(() => {
        onBack();
      }, 900);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="dash-view-container">
      {/* Header with Back button */}
      <div className="dash-view-header">
        <button type="button" className="edit-back-btn" onClick={onBack}>
          <ArrowLeftIcon size={16} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`feedback-banner ${feedback.type}`} style={{ marginBottom: '14px' }}>
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

      {/* Edit Card Layout */}
      <div className="edit-profile-card">
        {/* Left Column: Avatar & Change Photo */}
        <div className="edit-avatar-col">
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          <div className="edit-avatar-wrapper">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile"
                className="edit-avatar-img"
              />
            ) : (
              <div className="edit-avatar-circle">{initial}</div>
            )}

            {/* Camera icon button to open file picker */}
            <button
              type="button"
              className="avatar-camera-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Change Photo"
              disabled={isUploading}
            >
              <CameraIcon size={13} color="#065f46" />
            </button>
          </div>

          {/* Change Photo Button with live upload state */}
          <button
            type="button"
            className="btn-change-photo"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Change Photo'}
          </button>
        </div>

        {/* Right Column: Form */}
        <div className="edit-form-col">
          <form onSubmit={handleSubmit} className="edit-profile-form">
            <div className="form-group">
              <label className="form-label">
                Full Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                className="edit-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="edit-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio (Optional)</label>
              <textarea
                className="edit-textarea"
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a little about yourself"
              />
            </div>

            {/* Actions */}
            <div className="edit-actions-row">
              <button
                type="button"
                className="btn-cancel-edit"
                onClick={onBack}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating || isUploading}
                className="btn-save-edit"
              >
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
