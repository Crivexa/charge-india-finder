
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-ev-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-ev-blue rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">EV</span>
              </div>
              <h2 className="text-xl font-bold">
                Charge<span className="text-ev-blue">India</span>
              </h2>
            </div>
            <p className="text-gray-400 mb-4">
              Find and book EV charging stations across India for your electric vehicles.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-ev-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-400 hover:text-ev-blue transition-colors">
                  Find Stations
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="text-gray-400 hover:text-ev-blue transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">For Station Owners</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-gray-400 hover:text-ev-blue transition-colors">
                  Register as Owner
                </Link>
              </li>
              <li>
                <Link to="/owner-dashboard" className="text-gray-400 hover:text-ev-blue transition-colors">
                  Owner Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400 mb-2">
              Email: info@chargeindia.com
            </p>
            <p className="text-gray-400">
              Phone: +91 1234567890
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} ChargeIndia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
