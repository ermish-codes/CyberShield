import { useState, useEffect } from 'react'
import Nav from './components/Nav'
import Landing from './pages/Landing'
import Game from './pages/Game'
import Triage from './pages/Triage'
import Resources from './pages/Resources'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import Splash from './pages/Splash'
import GameZone from './pages/GameZone'
import { getStoredUser, logOut, type UserProfile } from './lib/auth'

type Page = 'landing' | 'game' | 'gamezone' | 'triage' | 'resources' | 'auth' | 'profile' | 'splash'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('splash')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const stored = getStoredUser()
    if (stored) {
      setUser(stored)
      setCurrentPage('landing')
    }
    setIsInitializing(false)
  }, [])

  if (isInitializing) return null

  function navigate(page: Page) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleAuth(profile: UserProfile) {
    setUser(profile)
    navigate('landing')
  }

  function handleLogout() {
    logOut()
    setUser(null)
    navigate('splash')
  }

  function handleUserUpdate(updated: UserProfile) {
    setUser(updated)
  }

  return (
    <div style={{ background: '#0B132B', minHeight: '100vh' }}>
      {currentPage !== 'splash' && (
        <Nav currentPage={currentPage} onNavigate={navigate} user={user} />
      )}

      {currentPage === 'splash' && <Splash onAuth={handleAuth} />}
      {currentPage === 'landing' && <Landing onNavigate={navigate} />}
      {currentPage === 'game' && (
        <Game onNavigate={navigate} user={user} onUserUpdate={handleUserUpdate} />
      )}
      {currentPage === 'gamezone' && <GameZone />}
      {currentPage === 'triage' && (
        <Triage onNavigate={navigate} user={user} onUserUpdate={handleUserUpdate} />
      )}
      {currentPage === 'resources' && (
        <Resources user={user} onUserUpdate={handleUserUpdate} />
      )}
      {currentPage === 'auth' && (
        <Auth onAuth={handleAuth} onBack={() => navigate('landing')} />
      )}
      {currentPage === 'profile' && user && (
        <Profile
          user={user}
          onNavigate={navigate}
          onLogout={handleLogout}
          onUserUpdate={handleUserUpdate}
        />
      )}
      {currentPage === 'profile' && !user && (
        <Auth onAuth={handleAuth} onBack={() => navigate('landing')} />
      )}
    </div>
  )
}
