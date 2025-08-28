import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import apiService from '../../services/apiService';
import { FaUpload, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaUser, FaIdCard } from 'react-icons/fa';

const KYCForm = ({ className = '' }) => {
  const [kycStatus, setKycStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form data
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const [documents, setDocuments] = useState({
    passport: null,
    driversLicense: null,
    proofOfAddress: null
  });

  const [uploadProgress, setUploadProgress] = useState({});

  // Load KYC status on component mount
  useEffect(() => {
    loadKycStatus();
  }, []);

  const loadKycStatus = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getKycStatus();
      setKycStatus(response.data);
    } catch (error) {
      console.error('Error loading KYC status:', error);
      if (error.response?.status !== 401) {
        setError('Failed to load KYC status');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalInfoChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPersonalInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setPersonalInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFileUpload = async (documentType, file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload only JPEG, PNG, or PDF files');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
      
      const response = await apiService.uploadKycDocument(file, documentType);
      
      setDocuments(prev => ({
        ...prev,
        [documentType]: {
          file,
          url: response.data.url,
          uploaded: true
        }
      }));

      setUploadProgress(prev => ({ ...prev, [documentType]: 100 }));
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, [documentType]: undefined }));
      }, 2000);

    } catch (error) {
      console.error('Error uploading document:', error);
      setError('Failed to upload document. Please try again.');
      setUploadProgress(prev => ({ ...prev, [documentType]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      const required = ['firstName', 'lastName', 'dateOfBirth', 'nationality'];
      const addressRequired = ['street', 'city', 'country'];
      
      for (const field of required) {
        if (!personalInfo[field]) {
          setError(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
          return;
        }
      }

      for (const field of addressRequired) {
        if (!personalInfo.address[field]) {
          setError(`Address ${field} is required`);
          return;
        }
      }

      // Check if at least one document is uploaded
      const hasDocuments = Object.values(documents).some(doc => doc && doc.uploaded);
      if (!hasDocuments) {
        setError('Please upload at least one identity document');
        return;
      }

      // Prepare documents array
      const documentArray = Object.entries(documents)
        .filter(([_, doc]) => doc && doc.uploaded)
        .map(([type, doc]) => ({
          type: type.toUpperCase(),
          url: doc.url
        }));

      // Submit KYC
      await apiService.submitKyc({
        personalInfo,
        documents: documentArray
      });

      setSuccess('KYC submission successful! Your documents are under review.');
      
      // Reload KYC status
      setTimeout(() => {
        loadKycStatus();
      }, 2000);

    } catch (error) {
      console.error('Error submitting KYC:', error);
      setError(error.response?.data?.message || 'Failed to submit KYC. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'text-green-600 bg-green-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return <FaCheckCircle className="w-5 h-5" />;
      case 'REJECTED': return <FaExclamationTriangle className="w-5 h-5" />;
      case 'PENDING': return <FaSpinner className="w-5 h-5 animate-spin" />;
      default: return <FaUser className="w-5 h-5" />;
    }
  };

  // Show KYC status if already submitted
  if (kycStatus && kycStatus.status !== 'NOT_SUBMITTED') {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="text-center">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${getStatusColor(kycStatus.status)}`}>
            {getStatusIcon(kycStatus.status)}
            <span className="font-semibold">KYC {kycStatus.status}</span>
          </div>
          
          <div className="mt-4">
            {kycStatus.status === 'APPROVED' && (
              <p className="text-green-600">Your KYC has been approved! You can now participate in the presale.</p>
            )}
            {kycStatus.status === 'PENDING' && (
              <p className="text-yellow-600">Your KYC is under review. We'll notify you once it's processed.</p>
            )}
            {kycStatus.status === 'REJECTED' && (
              <div>
                <p className="text-red-600 mb-2">Your KYC was rejected.</p>
                <button
                  onClick={() => setKycStatus({ status: 'NOT_SUBMITTED' })}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit New KYC
                </button>
              </div>
            )}
          </div>

          {kycStatus.documents && kycStatus.documents.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Submitted Documents</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {kycStatus.documents.map((doc, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-900">{doc.documentType}</p>
                    <p className={`text-sm ${getStatusColor(doc.verificationStatus)}`}>
                      {doc.verificationStatus}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading KYC status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete KYC Verification</h3>
        <p className="text-gray-600">Verify your identity to participate in the presale</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-2">
          <FaExclamationTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center space-x-2">
          <FaCheckCircle className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FaUser className="w-5 h-5 mr-2" />
            Personal Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={personalInfo.firstName}
                onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={personalInfo.lastName}
                onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                value={personalInfo.dateOfBirth}
                onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
              <input
                type="text"
                value={personalInfo.nationality}
                onChange={(e) => handlePersonalInfoChange('nationality', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., American"
                required
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                value={personalInfo.address.street}
                onChange={(e) => handlePersonalInfoChange('address.street', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={personalInfo.address.city}
                onChange={(e) => handlePersonalInfoChange('address.city', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
              <input
                type="text"
                value={personalInfo.address.state}
                onChange={(e) => handlePersonalInfoChange('address.state', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
              <input
                type="text"
                value={personalInfo.address.zipCode}
                onChange={(e) => handlePersonalInfoChange('address.zipCode', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input
                type="text"
                value={personalInfo.address.country}
                onChange={(e) => handlePersonalInfoChange('address.country', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Document Upload */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FaIdCard className="w-5 h-5 mr-2" />
            Identity Documents
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Passport */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="passport"
                onChange={(e) => handleFileUpload('passport', e.target.files[0])}
                className="hidden"
                accept="image/*,.pdf"
              />
              <label htmlFor="passport" className="cursor-pointer">
                <FaUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Passport</p>
                <p className="text-xs text-gray-500">Upload ID document</p>
              </label>
              
              {uploadProgress.passport !== undefined && (
                <div className="mt-2 bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.passport}%` }}
                  />
                </div>
              )}
              
              {documents.passport?.uploaded && (
                <div className="mt-2 flex items-center justify-center text-green-600">
                  <FaCheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-xs">Uploaded</span>
                </div>
              )}
            </div>

            {/* Driver's License */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="driversLicense"
                onChange={(e) => handleFileUpload('driversLicense', e.target.files[0])}
                className="hidden"
                accept="image/*,.pdf"
              />
              <label htmlFor="driversLicense" className="cursor-pointer">
                <FaUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Driver's License</p>
                <p className="text-xs text-gray-500">Upload ID document</p>
              </label>
              
              {uploadProgress.driversLicense !== undefined && (
                <div className="mt-2 bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.driversLicense}%` }}
                  />
                </div>
              )}
              
              {documents.driversLicense?.uploaded && (
                <div className="mt-2 flex items-center justify-center text-green-600">
                  <FaCheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-xs">Uploaded</span>
                </div>
              )}
            </div>

            {/* Proof of Address */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="proofOfAddress"
                onChange={(e) => handleFileUpload('proofOfAddress', e.target.files[0])}
                className="hidden"
                accept="image/*,.pdf"
              />
              <label htmlFor="proofOfAddress" className="cursor-pointer">
                <FaUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Proof of Address</p>
                <p className="text-xs text-gray-500">Utility bill, etc.</p>
              </label>
              
              {uploadProgress.proofOfAddress !== undefined && (
                <div className="mt-2 bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.proofOfAddress}%` }}
                  />
                </div>
              )}
              
              {documents.proofOfAddress?.uploaded && (
                <div className="mt-2 flex items-center justify-center text-green-600">
                  <FaCheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-xs">Uploaded</span>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Accepted formats: JPEG, PNG, PDF. Maximum file size: 5MB
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="w-5 h-5 animate-spin" />
              <span>Submitting KYC...</span>
            </>
          ) : (
            <span>Submit KYC Verification</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default KYCForm;