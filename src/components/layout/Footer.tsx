
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6">
      <div className="health-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-healthBlue-500">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="font-bold text-xl text-healthBlue-600">HealthStack</span>
            </Link>
            <p className="text-sm text-gray-500">
              A revolutionary healthcare ecosystem that integrates AI, Blockchain, and India Stack APIs for seamless healthcare delivery.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-healthBlue-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-healthBlue-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-healthBlue-500 transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/doctors" className="text-gray-500 hover:text-healthBlue-500 transition-colors text-sm">Find Doctors</Link></li>
              <li><Link to="/ai" className="text-gray-500 hover:text-healthBlue-500 transition-colors text-sm">AI Health Assistant</Link></li>
              <li><Link to="/records" className="text-gray-500 hover:text-healthBlue-500 transition-colors text-sm">Medical Records</Link></li>
              <li><Link to="/medicine" className="text-gray-500 hover:text-healthBlue-500 transition-colors text-sm">Medicine Delivery</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-500 hover:text-healthBlue-500 transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-healthBlue-500 transition-colors text-sm">Contact</Link></li>
              <li><Link to="/careers" className="text-gray-500 hover:text-healthBlue-500 transition-colors text-sm">Careers</Link></li>
              <li><Link to="/partners" className="text-gray-500 hover:text-healthBlue-500 transition-colors text-sm">Partners</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-500 hover:text-healthBlue-500 transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-healthBlue-500 transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/security" className="text-gray-500 hover:text-healthBlue-500 transition-colors text-sm">Security</Link></li>
              <li><Link to="/compliance" className="text-gray-500 hover:text-healthBlue-500 transition-colors text-sm">Compliance</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">© 2025 HealthStack. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-500">Powered by AI, Blockchain & India Stack</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
