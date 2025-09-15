import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaTelegramPlane, 
  FaTwitter, 
  FaLinkedin, 
  FaDiscord,
  FaPaperPlane,
  FaUser,
  FaBuilding,
  FaGlobe,
  FaHandshake,
  FaQuestionCircle,
  FaChartLine,
  FaShieldAlt,
  FaRocket,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';
import Button from '../components/ui/Button';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    inquiryType: 'general',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        phone: '',
        inquiryType: 'general',
        subject: '',
        message: ''
      });
    }, 2000);
  };

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry', icon: FaQuestionCircle },
    { value: 'presale', label: 'Presale Support', icon: FaRocket },
    { value: 'partnership', label: 'Partnership Opportunities', icon: FaHandshake },
    { value: 'investment', label: 'Investment Questions', icon: FaChartLine },
    { value: 'technical', label: 'Technical Support', icon: FaShieldAlt },
    { value: 'media', label: 'Press & Media', icon: FaGlobe }
  ];

  const contactMethods = [
    {
      icon: FaEnvelope,
      title: 'Email Support',
      primary: 'support@pronova.com',
      secondary: 'General inquiries and customer support',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaBuilding,
      title: 'Business Inquiries',
      primary: 'partnerships@pronova.com',
      secondary: 'Partnership and business development',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: FaPhone,
      title: 'Phone Support',
      primary: '+44 20 7946 0958',
      secondary: 'UK Office - Business hours GMT',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Global Presence',
      primary: 'London, UK | New York, USA | Dubai, UAE',
      secondary: 'Multiple office locations worldwide',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const socialChannels = [
    {
      icon: FaTelegramPlane,
      name: 'Telegram',
      username: '@pronovaofficial',
      url: 'https://t.me/pronovaofficial',
      color: 'text-blue-500',
      description: 'Join our official community'
    },
    {
      icon: FaTwitter,
      name: 'Twitter',
      username: '@PronovaCrypto',
      url: 'https://twitter.com/pronovacrypto',
      color: 'text-sky-500',
      description: 'Latest news and updates'
    },
    {
      icon: FaLinkedin,
      name: 'LinkedIn',
      username: 'Pronova Cryptocurrency',
      url: 'https://linkedin.com/company/pronova',
      color: 'text-blue-600',
      description: 'Professional network and insights'
    },
    {
      icon: FaDiscord,
      name: 'Discord',
      username: 'Pronova Community',
      url: 'https://discord.gg/pronova',
      color: 'text-indigo-500',
      description: 'Community discussions and support'
    }
  ];

  const officeLocations = [
    {
      city: 'London',
      country: 'United Kingdom',
      address: 'CAPI MAX Holdings UK\n123 Financial District\nLondon EC2V 8AS',
      timezone: 'GMT',
      flag: '🇬🇧'
    },
    {
      city: 'New York',
      country: 'United States',
      address: 'CAPI MAX Investments USA\n456 Wall Street\nNew York, NY 10005',
      timezone: 'EST',
      flag: '🇺🇸'
    },
    {
      city: 'Dubai',
      country: 'United Arab Emirates',
      address: 'CAPI MAX Investments UAE\n789 Business Bay\nDubai, UAE',
      timezone: 'GST',
      flag: '🇦🇪'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 overflow-hidden">
        {/* Background shapes */}
        <div className="absolute inset-0">
          <div className="shape shape-primary w-96 h-96 top-10 -left-20 opacity-20"></div>
          <div className="shape shape-secondary w-72 h-72 top-20 -right-16 opacity-20"></div>
        </div>
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-6 py-3 rounded-full mb-6 font-medium"
            >
              <FaEnvelope className="text-xl" />
              <span>Get in Touch</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              Contact{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
                Our Team
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Ready to join the Pronova revolution? Have questions about our ecosystem? 
              Our expert team is here to help you 24/7 across multiple channels.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto"
            >
              <Button variant="primary" size="large" href="#contact-form" className="group">
                <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                Send Message
              </Button>
              <Button variant="outline" size="large" href="#quick-contact" className="group">
                <FaClock className="group-hover:scale-110 transition-transform" />
                Quick Support
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-dark-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Multiple Ways to <span className="text-gradient-enhanced">Reach Us</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Choose your preferred communication method. We're available across all channels 
              to provide you with the best support experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <div className="bg-gray-50 dark:bg-dark-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full">
                    <div className={`w-16 h-16 bg-gradient-to-r ${method.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="text-3xl text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                      {method.title}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 font-semibold mb-2">
                      {method.primary}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {method.secondary}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Social Channels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 p-8 rounded-2xl border border-primary-200 dark:border-primary-700"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                Join Our Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with thousands of Pronova enthusiasts worldwide
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {socialChannels.map((channel, index) => {
                const IconComponent = channel.icon;
                return (
                  <motion.a
                    key={index}
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center group hover:shadow-xl transition-all duration-300"
                  >
                    <IconComponent className={`text-4xl ${channel.color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {channel.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {channel.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {channel.description}
                    </p>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 md:py-24 bg-gray-50 dark:bg-dark-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Send Us a Message
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Fill out the form below and we'll get back to you within 24 hours
                  </p>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaCheckCircle className="text-4xl text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Thank you for contacting us. Our team will review your message and get back to you within 24 hours.
                    </p>
                    <Button 
                      variant="primary" 
                      onClick={() => setIsSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name *
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                            placeholder="John"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    {/* Company and Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Company
                        </label>
                        <div className="relative">
                          <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                            placeholder="Your Company"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Inquiry Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Inquiry Type *
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                      >
                        {inquiryTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white resize-none"
                        placeholder="Please provide details about your inquiry..."
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="large"
                      fullWidth
                      disabled={isSubmitting}
                      className="group"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Office Locations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  Our Global Offices
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  With offices in major financial hubs worldwide, we're always close to our community 
                  and ready to provide localized support.
                </p>
              </div>

              <div className="space-y-6">
                {officeLocations.map((office, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {office.flag}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {office.city}
                          </h3>
                          <span className="text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full">
                            {office.timezone}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {office.country}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                          {office.address}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-primary-600 to-secondary-500 p-6 rounded-2xl text-white"
              >
                <h3 className="text-xl font-bold mb-4">Support Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">24/7</div>
                    <div className="text-sm opacity-90">Support Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">&lt;1h</div>
                    <div className="text-sm opacity-90">Avg Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">98%</div>
                    <div className="text-sm opacity-90">Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">15+</div>
                    <div className="text-sm opacity-90">Languages</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="shape w-96 h-96 bg-white/5 -top-20 -left-20"></div>
          <div className="shape w-72 h-72 bg-white/5 -bottom-10 -right-16"></div>
        </div>
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FaHandshake className="text-4xl" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to{' '}
              <span className="text-secondary-200">Partner With Us?</span>
            </h2>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Join the growing ecosystem of companies and investors who trust Pronova
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
              <Button 
                size="large"
                variant="white"
                href="mailto:partnerships@pronova.com"
                className="bg-white text-primary-700 hover:bg-gray-100 font-bold group"
              >
                <FaHandshake className="group-hover:rotate-12 transition-transform" />
                Partnership Inquiry
              </Button>
              <Button 
                size="large"
                variant="ghost"
                to="/#presale"
                className="text-white border-white/30 hover:bg-white/10 font-bold"
              >
                Join Presale
              </Button>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 text-white/70"
            >
              <p>🤝 Trusted by 18+ Companies • 🌍 Global Reach • 💼 Professional Support</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Contact;