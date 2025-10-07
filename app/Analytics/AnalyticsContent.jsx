"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { fetchSellerAnalytics } from "../utils/analytics";
import Image from "next/image";

// Dynamic import for Recharts (fixes SSR issues in Next.js)
const LineChart = dynamic(
  () => import('recharts').then((mod) => mod.LineChart),
  { ssr: false }
);

const Line = dynamic(
  () => import('recharts').then((mod) => mod.Line),
  { ssr: false }
);

const BarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart),
  { ssr: false }
);

const Bar = dynamic(
  () => import('recharts').then((mod) => mod.Bar),
  { ssr: false }
);

const XAxis = dynamic(
  () => import('recharts').then((mod) => mod.XAxis),
  { ssr: false }
);

const YAxis = dynamic(
  () => import('recharts').then((mod) => mod.YAxis),
  { ssr: false }
);

const CartesianGrid = dynamic(
  () => import('recharts').then((mod) => mod.CartesianGrid),
  { ssr: false }
);

const Tooltip = dynamic(
  () => import('recharts').then((mod) => mod.Tooltip),
  { ssr: false }
);

const Legend = dynamic(
  () => import('recharts').then((mod) => mod.Legend),
  { ssr: false }
);

const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => ResponsiveContainer),
  { ssr: false }
)

export default function AnalyticsContent() {
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadAnalytics();
    }
  }, [timeRange, mounted]);

  const loadAnalytics = async () => {
     try {
      setLoading(true);
      setError(null);
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
    <div className="space-y-6 p-6 bg-white shadow-phenom rounded-[12px] min-h-screen">
    {/* Header */ }
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
      <select
       value={timeRange}
       onChange={(e) => setTimeRange(e.target.value)}
       className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF5722] focus:border-transparent bg-white"
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
       title="Ad Impressions"
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
    </div>

    {/* Performance Trends Charts */}
    {mounted && analytics.viewsByDay && analytics.viewsByDay.length > 0 && (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Performance Trends</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.viewsByDay}>
             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
             <XAxis 
               dataKey="_id" 
               tick={{ fontSize: 12 }}
               tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px'
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}
              />
              <Legend />
              <Bar dataKey="profileViews" fill="#4285F4" name="Profile Views" radius={[8, 8, 0, 0]} />
              <Bar dataKey="productViews" fill="#34A853" name="Ad views" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )}

    {/* Top Performing Ads */}
    <div className="bg-white p-6 rounded-lg shadow-sm">
       <h2 className="text-xl font-bold mb-4 text-gray-800">Top Performing Ads</h2>
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
                <tr className="border-b border-gray-200 text-left text-sm text-gray-600">
                  <th className="pb-3 font-medium">Rank</th>
                  <th className="pb-3 font-medium">Ad Name</th>
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
                      {product.image && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <Image 
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
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
  );
}

function MetricCard({ title, value, subtitle, icon, color }) {
   const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
           <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
            <p className={`text-3xl font-bold ${colorClasses[color].split(' ')[1]}`}>
            {value}
          </p>
           <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
        </div>
        <div className={`text-3xl ${colorClasses[color]} p-3 rounded-lg`}>
           {icon}
        </div>
      </div>
    </div>
  );
}