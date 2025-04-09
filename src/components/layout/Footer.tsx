import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Facebook, Instagram, Mail, Phone } from 'lucide-react';
const Footer: React.FC = () => {
  return <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-12 pb-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-healthBlue-500 to-healthBlue-600 flex items-center justify-center text-white shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4H8C7.44772 4 7 4.44772 7 5V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V5C17 4.44772 16.5523 4 16 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 10V14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 12H14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-bold text-xl text-healthBlue-500 dark:text-healthBlue-400 font-poppins">HealthStack</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              A revolutionary healthcare ecosystem integrating AI, Blockchain, and secure APIs for seamless healthcare delivery.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 font-nunito">Services</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/doctors" className="text-gray-600 dark:text-gray-300 hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors text-sm">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/ai-symptom-checker" className="text-gray-600 dark:text-gray-300 hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors text-sm">
                  AI Health Assistant
                </Link>
              </li>
              <li>
                <Link to="/medical-records" className="text-gray-600 dark:text-gray-300 hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors text-sm">
                  Medical Records
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-gray-600 dark:text-gray-300 hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors text-sm">
                  Book Appointments
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 font-nunito">Company</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 dark:text-gray-300 hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-gray-600 dark:text-gray-300 hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors text-sm">
                  Partners
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 font-nunito">Contact</h3>
            <ul className="space-y-2.5">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-healthBlue-500 dark:text-healthBlue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-300">lingrajbhiry@gmail.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-healthBlue-500 dark:text-healthBlue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-300">+918431632044</span>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-healthBlue-500 dark:hover:text-healthBlue-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 HealthStack. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-500 dark:text-gray-400">Powered by AI, Blockchain & Secure APIs</span>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;