import api from "@/services/api";

const generateSessionId = () => {
   return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

if (typeof window !== 'undefined') {
   if (!sessionStorage.getItem('sessionId')) {
    sessionStorage.setItem('sessionId', generateSessionId());
   }
}

export const trackProductView = async (adId, adType) => {
    const sessionId = sessionStorage.getItem('sessionId') || generateSessionId();
     sessionStorage.setItem('sessionId', sessionId);

    const startTime = Date.now();

  
    // Return cleanup function for view duration tracking 
    return () => {
      const viewDuration = Math.floor((Date.now() - startTime) / 1000);
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/analytics/track/product/${adId}`;
      const data = JSON.stringify({ adType, viewDuration });

      // Try sendBeacon for reliable tracking on unmount 
      if (navigator.sendBeacon) {
        const blob = new Blob([data], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
      } else {
        // Fallback 
        api.post(`/analytics/track/product/${adId}`, 
          { adType, viewDuration },
          { headers: { 'x-session-id': sessionId } }
        ).catch(err => console.error('Error tracking view duration:', err));
      }
    };
};


export const trackProfileView = async (sellerId) => {
  const sessionId = sessionStorage.getItem('sessionId') || generateSessionId();
  sessionStorage.setItem('sessionId', sessionId);
  
  const startTime = Date.now();
  
 
  return () => {
    const viewDuration = Math.floor((Date.now() - startTime) / 1000);
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/analytics/track/profile/${sellerId}`;
    const data = JSON.stringify({ viewDuration });

    if (navigator.sendBeacon) {
      const blob = new Blob([data], { type: 'application/json'});
      navigator.sendBeacon(url, blob);
    } else {
      api.post(`/analytics/track/profile/${sellerId}`, 
        { viewDuration },
        { headers: { 'x-session-id': sessionId }}
      ).catch(err => console.error('Error tracking profile view duration:', err));
    }
  };
};

// Fetch analytics data for dashboard
export const fetchSellerAnalytics = async (timeRange = '30') => {
  try {
    const response = await api.get(`/analytics/seller/dashboard?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

export const fetchProductAnalytics = async (adId, timeRange = '30') => {
  try {
    const response = await api.get(`/analytics/product/${adId}?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product analytics:', error);
    throw error;
  }
};