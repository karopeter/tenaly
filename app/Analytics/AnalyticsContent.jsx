"use client";
import { useEffect, useState } from 'react';
import { fetchSellerAnalytics } from "../utils/analytics";
import ChartWrapper from "../components/UI/ChatWrapper";

export default function AnalyticsContent() {
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSellerAnalytics(timeRange);
      console.log('✅ Analytics data loaded:', data);
      setAnalytics(data.data);
    } catch (error) {
      console.error('❌ Error fetching analytics:', error);
      setError(error.response?.data?.message || 'Failed to load analytics. Please try again');
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
      <h3 className="text-[16px] md:text-[24px] font-[500] text-[#525252] mb-4">Analytics Dashboard</h3>
      <div className="space-y-6 p-6 bg-white shadow-phenom rounded-[12px] min-h-screen">
        {/* Header */}
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

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Profile Views"
            value={analytics.profileViews?.total?.toLocaleString() || '0'}
            color="blue"
          />
          <MetricCard
            title="Active Listings"
            value={analytics.topProducts?.length?.toLocaleString() || '0'}
            subtitle="Products with views"
            color="green"
          />
          <MetricCard
            title="Ad Views"
            value={analytics.productViews?.total?.toLocaleString() || '0'}
            color="purple"
          />
          <MetricCard
            title="User Impressions"
            value={analytics.userImpressions?.toLocaleString() || '0'}
            subtitle="Unique viewers"
            color="orange"
          />
          <MetricCard
            title="Sold Ads"
            value={analytics.soldAds?.toLocaleString() || '0'}
            subtitle="Successfully sold"
            color="red"
          />
        </div>

        {/* Performance Trends Charts */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-[14px] font-[600] mb-4 text-[#525252]">Performance Trends</h2>
          {analytics?.viewsByDay?.length > 0 ? (
            <div className="h-80">
              <ChartWrapper data={analytics.viewsByDay} />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📈</div>
              <p className="text-gray-500">No trend data yet</p>
              <p className="text-gray-400 text-sm mt-2">Data will appear as you get more views</p>
            </div>
          )}
        </div>

        {/* Top Performing Ads */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-[14px] md:text-[16px] font-[600] mb-4 text-[#525252]">Top Performing Ads</h2>
          {!analytics.topProducts || analytics.topProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">No ad impressions yet</p>
              <p className="text-gray-400 text-sm mt-2">Your ads will appear here once they start getting views</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#000039] border-b border-gray-200 text-left text-[12px] text-[#FFFFFF]">
                    <th className="pb-3 px-4 font-medium">Rank</th>
                    <th className="pb-3 px-4 font-medium">Ad Image</th>
                    <th className="pb-3 px-4 font-medium">Ad Type</th>
                    <th className="pb-3 px-4 font-medium text-right">Impressions</th>
                    <th className="pb-3 px-4 font-medium text-right">Unique Views</th>
                    <th className="pb-3 px-4 font-medium text-right">Engagement Rate</th>
                  </tr>
                </thead>  
                <tbody>
                  {analytics.topProducts.map((product, index) => {
                    const engagementRate = product.impressions > 0 
                      ? ((product.uniqueImpressions / product.impressions) * 100).toFixed(1)
                      : 0;
                    
                    return (
                      <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-100 text-gray-700' :
                            index === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {product.image && (
                              <img 
                                src={product.image} 
                                alt={product.title}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <span className="font-medium text-gray-800 line-clamp-1">
                              {product.title || 'Untitled'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
                            product.adType === 'vehicle' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {product.adType}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right"> 
                          <span className="font-semibold text-[#FF5722]">
                            {product.impressions?.toLocaleString() || 0}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-gray-600 font-medium">
                            {product.uniqueImpressions?.toLocaleString() || 0}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-gray-600 font-medium">
                            {engagementRate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-blue-700 mb-2">Average Views per Ad</h3>
            <p className="text-2xl font-bold text-blue-900">
              {analytics.topProducts?.length > 0 
                ? Math.round(analytics.productViews.total / analytics.topProducts.length)
                : 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-green-700 mb-2">View-to-Unique Ratio</h3>
            <p className="text-2xl font-bold text-green-900">
              {analytics.productViews.unique > 0
                ? (analytics.productViews.total / analytics.productViews.unique).toFixed(1)
                : 0}x
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-purple-700 mb-2">Conversion Rate</h3>
            <p className="text-2xl font-bold text-purple-900">
              {analytics.topProducts?.length > 0
                ? ((analytics.soldAds / analytics.topProducts.length) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, color, icon }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200'   
  };

  return (
    <div className={`${colorClasses[color]} p-6 rounded-lg transition-all hover:shadow-md border`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{icon}</span>
            <p className="text-sm text-gray-600 font-medium">{title}</p>
          </div>
          <p className={`text-3xl font-bold ${colorClasses[color].split(' ')[1]}`}>
            {value}
          </p>
          <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}