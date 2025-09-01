import api from "./api";

export const reportService = {
    // Submit a new report 
    submitReport: async (reportData) => {
      try {
        const response = await api.post('/report/submit-report', reportData);
        return response.data;
      } catch (error) {
        console.error('Report service error:', error);
        throw error;
      }
    }
}