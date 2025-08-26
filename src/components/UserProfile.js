import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const formatDate = (value) => {
  if (!value) return '';
  const date = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
  try {
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
  } catch (e) {
    return '';
  }
};

const UserProfile = ({
  name,
  username,
  avatarUrl,
  bio,
  email,
  location,
  joinDate,
  stats,
  activities,
  interests,
  onEdit,
  onFollow,
  onMessage,
  isLoading,
  error,
  variant,
}) => {
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  const displayedBio = useMemo(() => {
    if (!bio) return 'No bio provided.';
    if (isBioExpanded || bio.length <= 160) return bio;
    return bio.slice(0, 160) + '…';
  }, [bio, isBioExpanded]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading profile…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="error">{String(error)}</p>
      </div>
    );
  }

  const isCompact = variant === 'compact';

  return (
    <div className={isCompact ? 'max-w-xl mx-auto bg-white rounded-lg shadow p-4' : 'max-w-2xl mx-auto bg-white rounded-lg shadow p-6'}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={avatarUrl || 'https://via.placeholder.com/80'}
          alt={name || 'User avatar'}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{name || 'Unnamed User'}</h1>
          <p className="text-gray-600">{username ? `@${username}` : '@unknown'}</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-4">
        <p className="text-gray-800">
          {displayedBio}
          {bio && bio.length > 160 && (
            <button className="ml-2 text-blue-600" onClick={() => setIsBioExpanded(v => !v)}>
              {isBioExpanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </p>
        {(location || email || joinDate) && (
          <div className="text-gray-600 text-sm space-y-1">
            {location && <p>Location: {location}</p>}
            {email && <p>Email: {email}</p>}
            {joinDate && <p>Joined: {formatDate(joinDate)}</p>}
          </div>
        )}
        {stats && (
          <div className="flex gap-6 text-sm">
            <div><span className="font-semibold">Posts</span>: {stats.posts ?? 0}</div>
            <div><span className="font-semibold">Followers</span>: {stats.followers ?? 0}</div>
            <div><span className="font-semibold">Following</span>: {stats.following ?? 0}</div>
          </div>
        )}
      </div>

      {/* List Section */}
      {(activities?.length || interests?.length) ? (
        <div className="mb-4">
          {activities?.length ? (
            <div>
              <h2 className="text-lg font-semibold mb-2">Recent activity</h2>
              <ul className="space-y-2 max-h-48 overflow-auto">
                {activities.map(item => (
                  <li key={item.id} className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">{item.title}</div>
                    {item.date && <div className="text-xs text-gray-500">{formatDate(item.date)}</div>}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {interests?.length ? (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {interests.map((tag, idx) => (
                  <span key={`${tag}-${idx}`} className="px-2 py-1 text-sm bg-blue-50 text-blue-700 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Footer */}
      {(onEdit || onFollow || onMessage) && (
        <div className="flex justify-end gap-2 pt-2 border-t">
          {onFollow && (
            <button type="button" className="btn btn-secondary" onClick={onFollow}>Follow</button>
          )}
          {onMessage && (
            <button type="button" className="btn" onClick={onMessage}>Message</button>
          )}
          {onEdit && (
            <button type="button" className="btn btn-primary" onClick={onEdit}>Edit Profile</button>
          )}
        </div>
      )}
    </div>
  );
};

UserProfile.propTypes = {
  name: PropTypes.string,
  username: PropTypes.string,
  avatarUrl: PropTypes.string,
  bio: PropTypes.string,
  email: PropTypes.string,
  location: PropTypes.string,
  joinDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  stats: PropTypes.shape({
    posts: PropTypes.number,
    followers: PropTypes.number,
    following: PropTypes.number,
  }),
  activities: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, title: PropTypes.string.isRequired, date: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]) })
  ),
  interests: PropTypes.arrayOf(PropTypes.string),
  onEdit: PropTypes.func,
  onFollow: PropTypes.func,
  onMessage: PropTypes.func,
  isLoading: PropTypes.bool,
  error: PropTypes.any,
  variant: PropTypes.oneOf(['compact', 'full']),
};

UserProfile.defaultProps = {
  name: 'Unnamed User',
  username: 'unknown',
  avatarUrl: '',
  bio: '',
  email: '',
  location: '',
  joinDate: '',
  stats: { posts: 0, followers: 0, following: 0 },
  activities: [],
  interests: [],
  isLoading: false,
  error: null,
  variant: 'full',
};

export default UserProfile;


