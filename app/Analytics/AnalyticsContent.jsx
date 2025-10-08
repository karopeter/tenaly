"use client";
import { useEffect, useState } from 'react';
import { fetchSellerAnalytics } from "../utils/analytics";
import ChartWrapper from "../components/UI/ChatWrapper";


export default function AnalyticsContent() {
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);


   useEffect(() => {
    loadAnalytics();
  }, [timeRange]);


  const loadAnalytics = async () => {
     try {
      setLoading(true);
      const data = await fetchSellerAnalytics(timeRange);
      console.log('Analytics data:', data);
      setAnalytics(data.data);
     } catch (error) {
       console.log('Error fetching analytics:', error);
     setError('Failed to load analytics. Please try again');
     } finally {
      setLoading(false);
     }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={loadAnalytics}
          className="mt-4 px-6 py-2 bg-[#FF5722] text-white rounded-lg hover:bg-[#E64A19] transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) {
     return <div className="text-center py-8 text-gray-500">No data available</div>;
  }

  return (
   <div>
    <h3 className="text-[16px] md:text-[24px] font-[500]  text-[#525252]">Analytics</h3>
   <div className="space-y-6 p-6 bg-white shadow-phenom rounded-[12px] min-h-screen">
    {/* Header */ }
    <div className="flex justify-between items-center">
      <h1 className="text-[14px] md:text-[16px] font-[600] text-[#525252]">Key Metrics</h1>
      <select
       value={timeRange}
       onChange={(e) => setTimeRange(e.target.value)}
       className="px-4 py-2 border border-gray-300 rounded-lg text-[#525252] focus:ring-[#FF5722] focus:border-transparent bg-white"
      >
      <option value="7">Last 7 days</option>
      <option value="30">Last 30 days</option>
      <option value="90">Last 90 days</option>
      <option value="180">Last 6 months</option>
      </select>
    </div>

    {/* Key Metrics Cards */ }
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
     <MetricCard 
      title="Profile Views"
      value={analytics.profileViews.total.toLocaleString()}
      subtitle={`${analytics.profileViews.unique} unique visitors`}
      color="blue"
     />
     <MetricCard
       title="Listings"
       value={analytics.topProducts.length.toLocaleString()}
       subtitle="Active products"
       color="green"
     />
     <MetricCard
       title="Ad Views"
       value={analytics.productViews.total.toLocaleString()}
       subtitle={`${analytics.productViews.unique} unique views`}
       color="purple"
     />
     <MetricCard
      title="User Impressions"
      value={analytics.userImpressions.toLocaleString()}
      subtitle="Unique viewers"
      color="orange"
     />
     <MetricCard
  title="Sold Ads"
  value={analytics.soldAds?.toLocaleString() || '0'}
  subtitle="Total ads marked as sold"
  color="red"
/>
    </div>

    {/* Performance Trends Charts */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-[14px] font-[600] mb-4 text-[#525252]">Performance Trends</h2>
         {analytics?.viewsByDay?.length > 0 ? (
           <div className="h-80">
           <ChartWrapper data={analytics.viewsByDay} />
        </div>
         ): (
          <p>No trend data yet</p>
         )}
      </div>

    {/* Top Performing Ads */}
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-[14px] md:text-[16px] font-[600] mb-4 text-[#525252">Top Performing Ads</h2>
       {analytics.topProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500 text-lg">No ad impressions yet</p>
          <p className="text-gray-400 text-sm mt-2">Your ads will appear here once they start getting views</p>
        </div>
       ): (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
                <tr className="bg-[#000039] border-b border-gray-200 text-left text-[12px] text-[#FFFFFF]">
                  <th className="pb-3 font-medium">No</th>
                  <th className="pb-3 font-medium">Ad title</th>
                  <th className="pb-3 font-medium">Ad Type</th>
                  <th className="pb-3 font-medium text-right">Impressions</th>
                  <th className="pb-3 font-medium text-right">Unique Views</th>
                </tr>
              </thead>  
              <tbody>
                {analytics.topProducts.map((product, index) => (
                  <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-semibold">
                        {index + 1 }
                      </span>
                    </td>
                    <td className="py-4">
                     <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-800">{product.title}</span>
                     </div>
                    </td>
                    <td className="py-4">
                      <span className="capitalize text-gray-600">{product.adType}</span>
                    </td>
                    <td className="py-4 text-right"> 
                      <span className="font-semibold text-[#FF5722]">
                         {product.impressions.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-gray-600">
                         {product.uniqueImpressions.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>
       )}
    </div>
    </div>
   </div>
  );
}

function MetricCard({ title, value, subtitle, icon, color }) {
   const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
  red: 'bg-red-50 text-red-600'   
};
  return (
    <div className="bg-[#FAFAFA] p-6 rounded-lg  transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
           <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
            <p className={`text-3xl font-bold ${colorClasses[color].split(' ')[1]}`}>
            {value}
          </p>
           <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}