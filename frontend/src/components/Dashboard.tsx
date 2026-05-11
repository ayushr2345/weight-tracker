import { type JSX } from "react";
import { Scale, TrendingDown, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock Data - Replace with API call to /api/weights later
const mockData = [
  { date: "May 1", weight: 86.5, avg: 86.5, bmi: 28.2 },
  { date: "May 2", weight: 86.1, avg: 86.3, bmi: 28.1 },
  { date: "May 3", weight: 86.3, avg: 86.3, bmi: 28.1 },
  { date: "May 4", weight: 85.8, avg: 86.1, bmi: 28.0 },
  { date: "May 5", weight: 85.5, avg: 86.0, bmi: 27.9 },
  { date: "May 6", weight: 85.2, avg: 85.9, bmi: 27.8 },
  { date: "May 7", weight: 84.9, avg: 85.7, bmi: 27.7 },
];

export default function Dashboard(): JSX.Element {
  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">
              Today's Weight
            </p>
            <h3 className="text-3xl font-bold text-white">
              84.9 <span className="text-lg text-gray-500">kg</span>
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <Scale className="text-emerald-400 w-6 h-6" />
          </div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">
              7-Day Average
            </p>
            <h3 className="text-3xl font-bold text-white">
              85.7 <span className="text-lg text-gray-500">kg</span>
            </h3>
          </div>
          <div className="p-3 bg-teal-500/20 rounded-xl">
            <TrendingDown className="text-teal-400 w-6 h-6" />
          </div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">
              Current BMI
            </p>
            <h3 className="text-3xl font-bold text-white">27.7</h3>
          </div>
          <div className="p-3 bg-cyan-500/20 rounded-xl">
            <Activity className="text-cyan-400 w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Weight Trend Chart */}
      <div className="glass p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-bold text-white mb-6">
          Weight Trend (Last 7 Days)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ffffff10"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={["dataMin - 1", "dataMax + 1"]}
                stroke="#9ca3af"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  borderColor: "#ffffff10",
                  borderRadius: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#34d399"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorWeight)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Charts: Rolling Avg & BMI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-bold text-white mb-6">
            7-Day Rolling Average
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff10"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  stroke="#9ca3af"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    borderColor: "#ffffff10",
                    borderRadius: "12px",
                  }}
                />
                <Line
                  type="basis"
                  dataKey="avg"
                  stroke="#2dd4bf"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-bold text-white mb-6">BMI Trend</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff10"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  stroke="#9ca3af"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    borderColor: "#ffffff10",
                    borderRadius: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bmi"
                  stroke="#22d3ee"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
