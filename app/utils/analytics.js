import api from "@/services/api";

export const trackProductView = async (adId, adType) => {
    const sessionId = sessionStorage.getItem('sessionId') || generateSessionId();
     sessionStorage.setItem('sessionId', sessionId);

       const startTime = Date.now();

    
  // Track view on component mount
  try {
    await api.post(`/analytics/track/product/${adId}`, 
      { adType, viewDuration: 0 },
      {
        headers: {
          'x-session-id': sessionId
        }
      }
    );
  } catch (error) {
    console.error('Error tracking view:', error);
  }
  
  // Track view duration on unmount
  return () => {
    const viewDuration = Math.floor((Date.now() - startTime) / 1000);
    
    // For sendBeacon on unmount, we still need to use fetch/beacon
    // since axios doesn't work well with sendBeacon
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/analytics/track/product/${adId}`;
    const data = JSON.stringify({ adType, viewDuration });
    
    // Try sendBeacon first (more reliable on page unload)
    if (navigator.sendBeacon) {
      const blob = new Blob([data], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      // Fallback to axios for browsers that don't support sendBeacon
      api.post(`/analytics/track/product/${adId}`, 
        { adType, viewDuration },
        { headers: { 'x-session-id': sessionId } }
      ).catch(err => console.error('Error tracking view duration:', err));
    }
  };
}


export const trackProfileView = async (sellerId) => {
  const sessionId = sessionStorage.getItem('sessionId') || generateSessionId();
  sessionStorage.setItem('sessionId', sessionId);
  
  const startTime = Date.now();
  
  try {
    await api.post(`/analytics/track/profile/${sellerId}`, 
      { viewDuration: 0 },
      {
        headers: {
          'x-session-id': sessionId
        }
      }
    );
  } catch (error) {
    console.error('Error tracking profile view:', error);
  }
  
  return () => {
    const viewDuration = Math.floor((Date.now() - startTime) / 1000);
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/analytics/track/profile/${sellerId}`;
    const data = JSON.stringify({ viewDuration });
    
    if (navigator.sendBeacon) {
      const blob = new Blob([data], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      api.post(`/analytics/track/profile/${sellerId}`, 
        { viewDuration },
        { headers: { 'x-session-id': sessionId } }
      ).catch(err => console.error('Error tracking profile view duration:', err));
    }
  };
};

const generateSessionId = () => {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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