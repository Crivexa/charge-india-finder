
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { Menu, X, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, userData, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-ev-blue rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">EV</span>
          </div>
          <h1 className="text-xl font-bold text-ev-dark">
            Charge<span className="text-ev-blue">India</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-ev-dark hover:text-ev-blue transition-colors">Home</Link>
          <Link to="/map" className="text-ev-dark hover:text-ev-blue transition-colors">Find Stations</Link>
          
          {user ? (
            <>
              {userData?.role === 'owner' && (
                <Link to="/owner-dashboard" className="text-ev-dark hover:text-ev-blue transition-colors">
                  Owner Dashboard
                </Link>
              )}
              <Link to="/bookings" className="text-ev-dark hover:text-ev-blue transition-colors">
                My Bookings
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                      <AvatarFallback>
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/bookings" className="w-full">My Bookings</Link>
                  </DropdownMenuItem>
                  {userData?.role === 'owner' && (
                    <DropdownMenuItem>
                      <Link to="/owner-dashboard" className="w-full">Owner Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="btn-outline">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button className="btn-primary">
                  Register
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden text-ev-dark" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-ev-dark hover:text-ev-blue transition-colors py-2"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/map" 
              className="text-ev-dark hover:text-ev-blue transition-colors py-2"
              onClick={closeMenu}
            >
              Find Stations
            </Link>
            
            {user ? (
              <>
                {userData?.role === 'owner' && (
                  <Link 
                    to="/owner-dashboard" 
                    className="text-ev-dark hover:text-ev-blue transition-colors py-2"
                    onClick={closeMenu}
                  >
                    Owner Dashboard
                  </Link>
                )}
                <Link 
                  to="/bookings" 
                  className="text-ev-dark hover:text-ev-blue transition-colors py-2"
                  onClick={closeMenu}
                >
                  My Bookings
                </Link>
                <Link 
                  to="/profile" 
                  className="text-ev-dark hover:text-ev-blue transition-colors py-2"
                  onClick={closeMenu}
                >
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }}
                  className="text-left text-ev-dark hover:text-ev-blue transition-colors py-2"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-ev-dark hover:text-ev-blue transition-colors py-2"
                  onClick={closeMenu}
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="text-ev-dark hover:text-ev-blue transition-colors py-2"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
