import '../styles/globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

config.autoAddCss = false

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  )
}

// Separate component to use the auth context
function AppContent({ Component, pageProps }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Check if the component has a getLayout function
  const getLayout = Component.getLayout || ((page) => page);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={isAuthenticated} user={user} logout={logout} isClient={isClient} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {getLayout(
          <Component 
            {...pageProps} 
            isAuthenticated={isAuthenticated} 
            user={user}
            isClient={isClient}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default MyApp
