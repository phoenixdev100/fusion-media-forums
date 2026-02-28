import React from 'react';
// import Image from 'next/image';
import Link from 'next/link';
import UserRole from './UserRole';

const UserInfo = ({ user, showStats = false }) => {
  if (!user) return null;
  
  return (
    <div className="flex flex-col items-center">
      {/* User Avatar */}
      <div className="relative h-16 w-16 mb-2">
        <img 
          src={user.avatar ? 
            (user.avatar.startsWith('/static/images/') ? user.avatar : 
              user.avatar.startsWith('/') || user.avatar.startsWith('http') ? user.avatar : 
              `/static/images/default-avatar.png`) : 
            "/static/images/default-avatar.png"} 
          alt={`${user.username}'s avatar`}
          className="rounded-full object-cover minecraft-panel w-full h-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/static/images/default-avatar.png";
          }}
        />
      </div>
      
      {/* Username and Role */}
      <div className="text-center">
        <Link href={`/profile/${user._id}`} className="font-minecraft text-lg hover:text-minecraft-green transition">
          {user.username}
        </Link>
        
        <div className="mt-1 flex justify-center">
          <UserRole role={user.role || 'player'} roleColor={user.roleColor} />
        </div>
        
        {/* User Stats (optional) */}
        {showStats && (
          <div className="mt-2 text-sm text-minecraft-stone">
            <div>Posts: {user.postCount || 0}</div>
            <div>Joined: {new Date(user.joinDate).toLocaleDateString()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
