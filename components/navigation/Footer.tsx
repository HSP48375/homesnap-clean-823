import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Instagram, Twitter, Facebook, Mail, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="glassmorphism border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <Camera className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold gradient-text">HomeSnap Pro</span>
            </div>
            <p className="mt-4 text-base text-white/80">
              Professional real estate photo editing services for realtors, homeowners, and short-term rental hosts.
            </p>
            <div className="flex space-x-6 mt-8">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Services</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-white/80 hover:text-white transition-colors">Photo Editing</a></li>
              <li><a href="#" className="text-base text-white/80 hover:text-white transition-colors">Virtual Staging</a></li>
              <li><a href="#" className="text-base text-white/80 hover:text-white transition-colors">Twilight Conversion</a></li>
              <li><a href="#" className="text-base text-white/80 hover:text-white transition-colors">Floor Plans</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Contact</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center text-white/80">
                <Mail className="h-5 w-5 mr-2 text-white" />
                <span>support@homesnappro.com</span>
              </li>
              <li>
                <a href="#" className="btn btn-outline mt-4">
                  Contact Us
                </a>
              </li>
              <li className="flex items-center text-white/80 mt-6">
                <Shield className="h-5 w-5 mr-2 text-white" />
                <span>Secure Payments via Stripe</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-base text-white/50 text-center">
            &copy; {new Date().getFullYear()} HomeSnap Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;