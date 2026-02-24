import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSignOutAlt, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import UserRole from './UserRole'

const Navbar = ({ isLoggedIn, user, logout, isClient = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-minecraft-black border-b-2 border-minecraft-gold shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and site name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative h-10 w-10 mr-3">
                <Image 
                  src="/static/images/fusion-logo.png" 
                  alt="Fusion Network Logo"
                  width={40}
                  height={40}
                  className="pixelated"
                  priority
                />
              </div>
              <span className="font-minecraft text-xl text-minecraft-gold">
                Fusion Network
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="font-minecraft text-white hover:text-minecraft-green transition">
              Home
            </Link>
            <Link href="/forums" className="font-minecraft text-white hover:text-minecraft-green transition">
              Forums
            </Link>
            <Link href="/server-info" className="font-minecraft text-white hover:text-minecraft-green transition">
              Server Info
            </Link>
            <div className="border-l border-minecraft-stone h-6 mx-2"></div>
            {isClient && isLoggedIn ? (
              <div className="flex items-center">
                <Link href="/profile" className="flex items-center font-minecraft text-white hover:text-minecraft-green transition mr-4">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  <span className="mr-2">{user?.username || 'Profile'}</span>
                  {user?.role && <UserRole role={user.role} roleColor={user.roleColor} />}
                </Link>
                <button 
                  onClick={logout}
                  className="minecraft-button text-sm"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </button>
              </div>
            ) : isClient ? (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="minecraft-button text-sm">
                  <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                  Login
                </Link>
                <Link href="/register" className="minecraft-button text-sm">
                  <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Loading placeholder */}
                <div className="minecraft-button text-sm opacity-50">Loading...</div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="minecraft-button text-sm"
            >
              Menu
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-minecraft-stone">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="font-minecraft text-white hover:text-minecraft-green transition py-2">
                Home
              </Link>
              <Link href="/forums" className="font-minecraft text-white hover:text-minecraft-green transition py-2">
                Forums
              </Link>
              <Link href="/server-info" className="font-minecraft text-white hover:text-minecraft-green transition py-2">
                Server Info
              </Link>
              <div className="border-t border-minecraft-stone my-2"></div>
              {isClient && isLoggedIn ? (
                <>
                  <Link href="/profile" className="font-minecraft text-white hover:text-minecraft-green transition py-2">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      <span className="mr-2">{user?.username || 'Profile'}</span>
                      {user?.role && <UserRole role={user.role} roleColor={user.roleColor} />}
                    </div>
                  </Link>
                  <button 
                    onClick={logout}
                    className="minecraft-button text-sm"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </button>
                </>
              ) : isClient ? (
                <div className="flex flex-col space-y-3">
                  <Link href="/login" className="minecraft-button text-sm">
                    <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                    Login
                  </Link>
                  <Link href="/register" className="minecraft-button text-sm">
                    <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                    Register
                  </Link>
                </div>
              ) : (
                <div className="minecraft-button text-sm opacity-50">Loading...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
