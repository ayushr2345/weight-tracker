import { type JSX } from "react";
import {
  Scale,
  TrendingDown,
  Activity,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useDashboardData } from "../hooks/data/useDashboardData";

export default function Dashboard(): JSX.Element {
  const {
    chartData,
    filteredChartData,
    currentWeight,
    currentBmi,
    currentRollingAvg,
    historicalAverage,
    historicalHigh,
    historicalLow,
    isLoading,
    rangeButtons,
  } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex justify-center mt-20">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="text-center mt-20 glass p-10 rounded-2xl border border-white/10 max-w-lg mx-auto">
        <Scale className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No Data Yet</h2>
        <p className="text-gray-400">
          Log your first weight to see your dashboard come alive.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">
              Latest Weight
            </p>
            <h3 className="text-3xl font-bold text-white">
              {currentWeight} <span className="text-lg text-gray-500">kg</span>
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <Scale className="text-emerald-400 w-6 h-6" />
          </div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">
              Historical High
            </p>
            <h3 className="text-3xl font-bold text-white">
              {historicalHigh} <span className="text-lg text-gray-500">kg</span>
            </h3>
          </div>
          <div className="p-3 bg-red-500/20 rounded-xl">
            <ArrowUpRight className="text-red-400 w-6 h-6" />
          </div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">
              Historical Low
            </p>
            <h3 className="text-3xl font-bold text-white">
              {historicalLow} <span className="text-lg text-gray-500">kg</span>
            </h3>
          </div>
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <ArrowDownRight className="text-blue-400 w-6 h-6" />
          </div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">
              Historical Average
            </p>
            <h3 className="text-3xl font-bold text-white">
              {historicalAverage}{" "}
              <span className="text-lg text-gray-500">kg</span>
            </h3>
          </div>
          <div className="p-3 bg-teal-500/20 rounded-xl">
            <TrendingDown className="text-teal-400 w-6 h-6" />
          </div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">
              7-Day Rolling Avg
            </p>
            <h3 className="text-3xl font-bold text-white">
              {currentRollingAvg}{" "}
              <span className="text-lg text-gray-500">kg</span>
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <TrendingDown className="text-emerald-400 w-6 h-6" />
          </div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">
              Current BMI
            </p>
            <h3 className="text-3xl font-bold text-white">{currentBmi}</h3>
          </div>
          <div className="p-3 bg-cyan-500/20 rounded-xl">
            <Activity className="text-cyan-400 w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-end">
        {rangeButtons.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={option.onClick}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              option.isActive
                ? "bg-emerald-500 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {filteredChartData.length === 0 ? (
        <div className="text-center glass p-10 rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-2">
            No data for this range
          </h3>
          <p className="text-gray-400">
            Try selecting a wider range or log more weights to fill the chart.
          </p>
        </div>
      ) : (
        <>
          <div className="glass p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6">Weight Trend</h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredChartData}>
                  <defs>
                    <linearGradient
                      id="colorWeight"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
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
                    minTickGap={20}
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
                  <Legend
                    wrapperStyle={{ color: "#d1d5db", marginBottom: 8 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    name="Weight"
                    stroke="#34d399"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorWeight)"
                  />
                  <Line
                    type="monotone"
                    dataKey="rollingAvg7"
                    name="7-Day Avg"
                    stroke="#60a5fa"
                    strokeWidth={3}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6">BMI Trend</h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredChartData}>
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
                    minTickGap={20}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    axisLine={false}
                    domain={[20, 40]}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      borderColor: "#ffffff10",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ color: "#d1d5db", marginBottom: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bmi"
                    name="BMI"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
