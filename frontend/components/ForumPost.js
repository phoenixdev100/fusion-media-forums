import React from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faEdit, faTrash, faFlag } from '@fortawesome/free-solid-svg-icons';
import UserInfo from './UserInfo';

const ForumPost = ({ 
  post, 
  isThreadStarter = false, 
  isAuthenticated = false, 
  currentUser = null,
  onLike,
  onEdit,
  onDelete,
  onReport
}) => {
  // Debug logs
  console.log('Post Author:', post?.author);
  console.log('Current User:', currentUser);
  console.log('Is Authenticated:', isAuthenticated);
  console.log('Author ID:', post?.author?._id);
  console.log('Current User ID:', currentUser?.id);
  
  const canModify = isAuthenticated && (
    currentUser?.id === post?.author?._id || 
    ['moderator', 'admin', 'developer', 'owner'].includes(currentUser?.role)
  );
  
  const canDelete = isAuthenticated && (
    currentUser?.id === post?.author?._id || 
    ['admin', 'developer', 'owner'].includes(currentUser?.role)
  );
  
  console.log('Can Modify:', canModify);
  
  return (
    <div className={`minecraft-panel ${isThreadStarter ? 'border-minecraft-gold' : ''}`}>
      <div className="flex flex-col md:flex-row">
        {/* User Info Sidebar */}
        <div className="md:w-1/5 p-4 border-b md:border-b-0 md:border-r border-minecraft-stone">
          {post.author ? (
            <UserInfo user={post.author} showStats={true} />
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative h-16 w-16 mb-2">
                <img 
                  src="/static/images/default-avatar.png" 
                  alt="Deleted user's avatar"
                  className="rounded-full object-cover minecraft-panel w-full h-full"
                />
              </div>
              <div className="text-center">
                <span className="font-minecraft text-lg text-minecraft-stone">Deleted User</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Post Content */}
        <div className="md:w-4/5 p-4">
          {/* Post Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              {isThreadStarter && (
                <h2 className="text-xl font-minecraft text-minecraft-gold mb-1">
                  {post.thread?.title}
                </h2>
              )}
              <span className="text-sm text-minecraft-stone">
                Posted {formatDistanceToNow(new Date(post.createdAt))} ago
                {post.isEdited && (
                  <span className="ml-2 italic">(edited)</span>
                )}
              </span>
            </div>
            
            {/* Post Actions */}
            <div className="flex space-x-2">
              {isAuthenticated && (
                <button 
                  onClick={() => onLike && onLike(post._id)}
                  className={`p-1 rounded ${post.likes?.includes(currentUser?.id) 
                    ? 'text-minecraft-gold' 
                    : 'text-minecraft-stone hover:text-minecraft-gold'}`}
                  title="Like this post"
                >
                  <FontAwesomeIcon icon={faThumbsUp} />
                  <span className="ml-1">{post.likes?.length || 0}</span>
                </button>
              )}
              
              {canModify && (
                <button 
                  onClick={() => onEdit && onEdit(post._id)}
                  className="p-1 rounded text-minecraft-stone hover:text-minecraft-blue"
                  title="Edit post"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              )}
              
              {canDelete && (
                <button 
                  onClick={() => onDelete && onDelete(post._id)}
                  className="p-1 rounded text-minecraft-stone hover:text-minecraft-red"
                  title="Delete post"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
              
              {isAuthenticated && (
                <button 
                  onClick={() => onReport && onReport(post._id)}
                  className="p-1 rounded text-minecraft-stone hover:text-minecraft-red"
                  title="Report post"
                >
                  <FontAwesomeIcon icon={faFlag} />
                </button>
              )}
            </div>
          </div>
          
          {/* Post Content */}
          <div className="prose prose-invert max-w-none">
            <p>{post.content}</p>
            
            {/* Image Attachments */}
            {post.imageAttachments && post.imageAttachments.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2 justify-start">
                  {post.imageAttachments.map((image, index) => (
                    <div key={index} className="relative border border-minecraft-stone rounded-md p-1 bg-black bg-opacity-10">
                      <img 
                        src={`${process.env.NEXT_PUBLIC_URL}${image.path}`} 
                        alt={image.originalname || `Attached image ${index + 1}`}
                        className="rounded-md max-h-48 max-w-xs object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Post Footer */}
          {post.author?.signature && (
            <div className="mt-6 pt-4 border-t border-minecraft-stone text-sm italic">
              {post.author.signature}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPost;
