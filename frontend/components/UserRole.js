import React from 'react';

const UserRole = ({ role, roleColor }) => {
  // Default colors if not provided from backend
  const defaultColors = {
    player: '#AAAAAA',    // Light gray
    media: '#55AAFF',     // Light blue
    helper: '#55FF55',    // Light green
    moderator: '#00AA00', // Green
    admin: '#FF5555',     // Red
    developer: '#AA00AA', // Purple
    owner: '#FFAA00'      // Gold
  };

  // Format role name for display
  const formatRoleName = (roleName) => {
    if (!roleName) return 'Player'; // Default to Player if role is undefined
    return roleName.charAt(0).toUpperCase() + roleName.slice(1);
  };

  // Use default role if none provided
  const safeRole = role || 'player';
  const color = roleColor || defaultColors[safeRole] || defaultColors.player;
  
  return (
    <span 
      className="font-minecraft px-2 py-0.5 rounded text-xs"
      style={{ 
        backgroundColor: `${color}33`, // Add transparency
        color: color,
        border: `1px solid ${color}`
      }}
    >
      {formatRoleName(safeRole)}
    </span>
  );
};

export default UserRole;
