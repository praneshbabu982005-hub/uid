import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from '../components/UserProfile';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({ name: currentUser.name || '', email: currentUser.email || '', password: '' });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const updates = { name: formData.name, email: formData.email };
    if (formData.password) updates.password = formData.password;
    const res = await updateProfile(updates);
    if (res.success) {
      setMessage('Profile updated successfully');
      setFormData(prev => ({ ...prev, password: '' }));
    } else {
      setMessage('Failed to update profile');
    }
    setSaving(false);
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const profileProps = {
    name: currentUser?.name,
    username: currentUser?.username || currentUser?.email?.split('@')[0],
    avatarUrl: currentUser?.avatarUrl,
    bio: currentUser?.bio,
    email: currentUser?.email,
    location: currentUser?.location,
    joinDate: currentUser?.createdAt || currentUser?.joinDate,
    stats: currentUser?.stats,
    activities: currentUser?.activities,
    interests: currentUser?.interests,
    onEdit: () => setEditing(true),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!editing ? (
        <UserProfile {...profileProps} />
      ) : (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
          {message && (
            <div className={message.includes('successfully') ? 'success mb-4' : 'error mb-4'}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password (optional)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;