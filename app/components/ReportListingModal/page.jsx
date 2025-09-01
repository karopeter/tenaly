import React, { useState } from 'react';
import api from '@/services/api';
import { reportService } from '@/services/reportService';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

const ReportListingModal = ({ isOpen, onClose, productId, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [loading, setLoading] = useState(false);

  const reportReasons = [
    "Misleading Information",
    "Fake or Scam Listing",
    "Inappropriate or Offensive Content",
    "Already Sold but Still Listed",      
    "Other"
  ];

  const handleSubmit = async () => {
    // Validation 
    if (!selectedReason) {
      toast.error('Please select a reason for reporting');
      return;
    }

    if (selectedReason === 'Other' && !otherReason.trim()) {
      toast.error("Please provide details for other reasons");
      return;
    }

    if (!productId) {
      toast.error("Product ID is missing");
      return;
    }

    setLoading(true);
     try {
      const reportData = {
        productId,
        reason: selectedReason === 'Other' ? otherReason.trim() : selectedReason,
        additionalDetails: selectedReason === 'Other' ? otherReason.trim() : ''
      };


       const response = await reportService.submitReport(reportData);

       if (response.status) {
        toast.success(response.message || 'Report submitted successfully. Thank you for helping keep our platform safe.');

        // Reset form 
        setSelectedReason('');
        setOtherReason('');
        onClose();

        if (onSubmit) {
          await onSubmit(reportData);
        }
       } else {
        throw new Error(response.message || 'Failed to submit report');
       }
     } catch (error) {
       console.error("Error submitting report:", error);

       // Handle specific error messages 
       let errorMessage = 'Failed to submit report. Please try again.';

       if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
       } else if (error.message) {
        errorMessage = error.message;
       }

       toast.error(errorMessage);

       if (onSubmit) {
        throw error;
       }
     } finally {
      setLoading(false);
     }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedReason('');
      setOtherReason('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-[14px] font-normal font-[500] font-inter text-[#525252] mb-5">Report this listing</h2>
            <p className="text-[#767676] font-inter font-[400] font-normal text-[12px]">Help us keep Tenaly safe and trustworthy</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-4">
          {/* Select Report Reason */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#525252] mb-2">
              Select Report Reason
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">-- Select --</option>
              {reportReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Other reasons textarea */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#525252] mb-2">
              {selectedReason === 'Other' ? 'Please specify your reason' : 'Additional details (optional)'}
            </label>
            <textarea
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              disabled={loading}
              placeholder={selectedReason === 'Other' ? 'Enter your reason...' : 'Provide additional context...'}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 placeholder-[#CDCDD7] focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              rows={4}
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {otherReason.length}/1000 characters 
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedReason || (selectedReason === 'Other' && !otherReason.trim())}
            className="w-full  bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white py-3 px-4 rounded-md font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Report'
              )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportListingModal;