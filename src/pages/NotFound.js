import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { FaHome, FaEnvelope } from 'react-icons/fa';

const NotFound = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-9xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
              404
            </h1>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Page Not Found
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                variant="gradient"
                to="/"
                className="flex items-center justify-center"
              >
                <FaHome className="mr-2" />
                Back to Home
              </Button>
              
              <Button 
                variant="outline"
                to="/contact"
                className="flex items-center justify-center"
              >
                <FaEnvelope className="mr-2" />
                Contact Support
              </Button>
            </div>
            
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Looking for something?
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>
                  <Link to="/" className="text-primary-600 dark:text-primary-400 hover:underline">Home</Link>
                </li>
                <li>
                  <Link to="/whitepaper" className="text-primary-600 dark:text-primary-400 hover:underline">Whitepaper</Link>
                </li>
                <li>
                  <Link to="/roadmap" className="text-primary-600 dark:text-primary-400 hover:underline">Roadmap</Link>
                </li>
                <li>
                  <Link to="/team" className="text-primary-600 dark:text-primary-400 hover:underline">Team & Partners</Link>
                </li>
                <li>
                  <Link to="/faq" className="text-primary-600 dark:text-primary-400 hover:underline">FAQ</Link>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;