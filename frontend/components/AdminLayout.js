import Link from 'next/link'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSignOutAlt, faShieldAlt, faTachometerAlt, faUsers, 
  faComments, faFolderOpen, faExclamationTriangle, faUserShield,
  faHistory, faClipboardList
} from '@fortawesome/free-solid-svg-icons'
import UserRole from './UserRole'

export default function AdminLayout({ children, user, activePage = 'dashboard' }) {
  const router = useRouter()
  
  // Define navigation items based on user role
  const getNavItems = () => {
    // Default navigation items for all roles with admin panel access
    const navItems = [
      {
        name: 'dashboard',
        label: 'Dashboard',
        icon: faTachometerAlt,
        href: '/admin',
        roles: ['helper', 'moderator', 'admin', 'developer', 'owner']
      },
      {
        name: 'posts',
        label: 'Manage Posts',
        icon: faComments,
        href: '/admin/posts',
        roles: ['helper', 'moderator', 'admin', 'developer', 'owner']
      },
      {
        name: 'threads',
        label: 'Manage Threads',
        icon: faFolderOpen,
        href: '/admin/threads',
        roles: ['moderator', 'admin', 'developer', 'owner']
      },
      {
        name: 'users',
        label: 'Manage Users',
        icon: faUsers,
        href: '/admin/users',
        roles: ['moderator', 'admin', 'developer', 'owner']
      },
      {
        name: 'categories',
        label: 'Categories',
        icon: faFolderOpen,
        href: '/admin/categories',
        roles: ['moderator', 'admin', 'developer', 'owner']
      },
      {
        name: 'logs',
        label: 'System Logs',
        icon: faHistory,
        href: '/admin/logs',
        roles: ['admin', 'developer', 'owner']
      }
    ]
    
    // Filter navigation items based on user role
    return navItems.filter(item => item.roles.includes(user?.role))
  }
  
  const navItems = getNavItems()
  
  return (
    <div className="min-h-screen bg-minecraft-dark flex flex-col">
      {/* Admin header */}
      <div className="p-4 bg-minecraft-panel shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-minecraft-gold bg-opacity-20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faShieldAlt} className="text-minecraft-gold" />
            </div>
            <div>
              <h1 className="font-minecraft text-lg text-minecraft-gold">Admin Panel</h1>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-minecraft-stone">Logged in as:</span>
                <UserRole role={user?.role} roleColor={user?.roleColor} />
              </div>
            </div>
          </div>
          <Link 
            href="/"
            className="flex items-center px-4 py-2 rounded-md text-minecraft-stone hover:bg-minecraft-stone hover:bg-opacity-10 transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3" />
            <span>Back to Site</span>
          </Link>
        </div>
      </div>
      
      {/* Admin navigation and content */}
      <div className="container mx-auto flex-grow flex flex-col md:flex-row">
        {/* Sidebar navigation */}
        <div className="w-full md:w-64 bg-minecraft-panel p-4 md:min-h-screen">
          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${activePage === item.name ? 'bg-minecraft-gold bg-opacity-20 text-minecraft-gold' : 'text-minecraft-stone hover:bg-minecraft-stone hover:bg-opacity-10'}`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Role-specific information */}
            <div className="mt-6 p-4 bg-minecraft-black bg-opacity-20 rounded-md">
              <h3 className="font-minecraft text-sm text-minecraft-gold mb-2">Role Permissions</h3>
              {user?.role === 'helper' && (
                <p className="text-xs text-minecraft-stone">Helpers can only manage posts.</p>
              )}
              {user?.role === 'moderator' && (
                <p className="text-xs text-minecraft-stone">Moderators can manage posts, threads, and ban users.</p>
              )}
              {(user?.role === 'admin' || user?.role === 'developer' || user?.role === 'owner') && (
                <p className="text-xs text-minecraft-stone">Admins have full access to all admin features.</p>
              )}
            </div>
          </nav>
        </div>
        
        {/* Main content */}
        <main className="flex-grow p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
