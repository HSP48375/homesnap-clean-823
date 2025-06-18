import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Camera } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'react-hot-toast';
import NotificationCenter from '../ui/NotificationCenter';

interface NavbarProps {
  isAdmin?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glassmorphism backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <Camera className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold gradient-text-accent">
                {isAdmin ? 'HomeSnap Admin' : 'HomeSnap Pro'}
              </span>
            </Link>
          </div>
          
          {/* Right side menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <NotificationCenter />
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-white/5 transition-all"
                  >
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 glassmorphism rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-sm font-medium text-white">{user.email}</p>
                        <p className="text-xs text-white/60">{user.user_metadata?.full_name || 'User'}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <Link
                        to="/profile/notifications"
                        className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Notification Settings
                      </Link>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleSignOut();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5"
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors mr-2">
                  Log In
                </Link>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a href="#" className="store-button">
                    <img 
                      src="/assets/app-store-badge.svg" 
                      alt="Download on the App Store" 
                      className="h-8 sm:h-10"
                    />
                  </a>
                  <a href="#" className="store-button">
                    <img 
                      src="/assets/google-play-badge.svg" 
                      alt="Get it on Google Play" 
                      className="h-8 sm:h-10"
                    />
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {user && <NotificationCenter />}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/70 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden glassmorphism border-t border-white/5">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile Settings
                </Link>
                <Link 
                  to="/profile/notifications" 
                  className="block px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Notification Settings
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSignOut();
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/5"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start Taking Photos Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;