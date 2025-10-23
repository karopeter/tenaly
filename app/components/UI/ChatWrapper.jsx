"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ChartWrapper({ data }) {
  // Calculate date range for formatting logic
  const daysDiff = data.length > 0 
    ? Math.ceil((new Date() - new Date(data[0]?._id)) / (1000 * 60 * 60 * 24))
    : 0;
  
  const isMonthView = daysDiff > 30;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="_id"
          tickFormatter={(v) => {
            const date = new Date(v + (isMonthView ? '-01' : ''));
            if (isMonthView) {
              return date.toLocaleDateString("en-US", { 
                month: "short", 
                year: "2-digit" 
              });
            }
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
          angle={-45}
          textAnchor="end"
          height={70}
          label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          tickCount={6}
          domain={[0, 'auto']}
          allowDecimals={false}
          label={{ value: 'Views', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          labelFormatter={(v) => {
            const date = new Date(v + (isMonthView ? '-01' : ''));
            return date.toLocaleDateString("en-US", {
              month: "long",
              day: isMonthView ? undefined : "numeric",
              year: "numeric",
            });
          }}
        />
        <Legend />
        <Bar
          dataKey="profileViews"
          fill="#7086FD"
          name="Profile Views"
          radius={[8, 8, 0, 0]}
        />
        <Bar
          dataKey="productViews"
          fill="#6FD195"
          name="Ad Views"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}