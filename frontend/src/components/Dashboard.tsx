import { useState, useEffect, type JSX } from "react";
import { Scale, TrendingDown, Activity, Loader2 } from "lucide-react";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { weightLogService } from "../services/weightLogService";
import { profileService } from "../services/profileService";

export default function Dashboard(): JSX.Element {
  type RangeValue = "week" | "month" | "3months" | "year";

  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedRange, setSelectedRange] = useState<RangeValue>("week");
  const [currentWeight, setCurrentWeight] = useState(0);
  const [currentBmi, setCurrentBmi] = useState(0);
  const [currentRollingAvg, setCurrentRollingAvg] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const rangeOptions: Array<{ label: string; value: RangeValue; days: number }> = [
    { label: "Past Week", value: "week", days: 7 },
    { label: "Past Month", value: "month", days: 30 },
    { label: "Past 3 Months", value: "3months", days: 90 },
    { label: "Past Year", value: "year", days: 365 },
  ];

  const selectedRangeOption = rangeOptions.find((option) => option.value === selectedRange) ?? rangeOptions[0];

  const filteredChartData = chartData.filter((item) => {
    if (!item.dateIso) return false;
    const latestDate = new Date(chartData[chartData.length - 1]?.dateIso);
    const cutoffDate = new Date(latestDate);
    cutoffDate.setDate(cutoffDate.getDate() - selectedRangeOption.days + 1);
    const itemDate = new Date(item.dateIso);
    return itemDate >= cutoffDate && itemDate <= latestDate;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await profileService.getProfile().catch(() => null);
        if (!profile) {
          setIsLoading(false);
          return;
        }

        const logsResponse = await weightLogService.getWeightLogs(profile._id, 1);
        const logs = logsResponse.data;
        if (logs.length === 0) {
          setIsLoading(false);
          return;
        }

        const heightMeters = profile.heightCm / 100;

        // The backend returns newest first. Recharts needs oldest to newest (left to right).
        const ascendingLogs = [...logs].reverse();

        let runningSum = 0;
        
        const formattedData = ascendingLogs.map((log, index) => {
          runningSum += log.weightKg;
          const avg = runningSum / (index + 1);
          const bmi = log.weightKg / (heightMeters * heightMeters);

          const windowStart = Math.max(0, index - 6);
          const rollingWindow = ascendingLogs.slice(windowStart, index + 1);
          const rollingAvg7 = rollingWindow.reduce((sum, item) => sum + item.weightKg, 0) / rollingWindow.length;

          // Convert ISO date to "May 7" format
          const dateObj = new Date(log.date);
          const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return {
            date: dateStr,
            dateIso: log.date,
            weight: parseFloat(log.weightKg.toFixed(1)),
            avg: parseFloat(avg.toFixed(1)),
            bmi: parseFloat(bmi.toFixed(1)),
            rollingAvg7: parseFloat(rollingAvg7.toFixed(1)),
          };
        });

        setChartData(formattedData);
        
        // Latest stats for the top cards (last item in the ascending array)
        const latest = formattedData[formattedData.length - 1];
        setCurrentWeight(latest.weight);
        setCurrentBmi(latest.bmi);
        setCurrentRollingAvg(latest.rollingAvg7);

      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center mt-20"><Loader2 className="w-10 h-10 text-emerald-500 animate-spin" /></div>;
  }

  if (chartData.length === 0) {
    return (
      <div className="text-center mt-20 glass p-10 rounded-2xl border border-white/10 max-w-lg mx-auto">
        <Scale className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No Data Yet</h2>
        <p className="text-gray-400">Log your first weight to see your dashboard come alive.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Latest Weight</p>
            <h3 className="text-3xl font-bold text-white">{currentWeight} <span className="text-lg text-gray-500">kg</span></h3>
          </div>
          <div className="p-3 bg-emerald-500/20 rounded-xl"><Scale className="text-emerald-400 w-6 h-6" /></div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Historical Average</p>
            <h3 className="text-3xl font-bold text-white">{chartData[chartData.length - 1].avg} <span className="text-lg text-gray-500">kg</span></h3>
          </div>
          <div className="p-3 bg-teal-500/20 rounded-xl"><TrendingDown className="text-teal-400 w-6 h-6" /></div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">7-Day Rolling Avg</p>
            <h3 className="text-3xl font-bold text-white">{currentRollingAvg} <span className="text-lg text-gray-500">kg</span></h3>
          </div>
          <div className="p-3 bg-emerald-500/20 rounded-xl"><TrendingDown className="text-emerald-400 w-6 h-6" /></div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Current BMI</p>
            <h3 className="text-3xl font-bold text-white">{currentBmi}</h3>
          </div>
          <div className="p-3 bg-cyan-500/20 rounded-xl"><Activity className="text-cyan-400 w-6 h-6" /></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-end">
        {rangeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSelectedRange(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              selectedRange === option.value
                ? "bg-emerald-500 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Main Chart */}
      {filteredChartData.length === 0 ? (
        <div className="text-center glass p-10 rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-2">No data for this range</h3>
          <p className="text-gray-400">Try selecting a wider range or log more weights to fill the chart.</p>
        </div>
      ) : (
        <> 
          <div className="glass p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6">Weight Trend</h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredChartData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" stroke="#9ca3af" axisLine={false} tickLine={false} />
                  <YAxis domain={["dataMin - 1", "dataMax + 1"]} stroke="#9ca3af" axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "#ffffff10", borderRadius: "12px" }} />
                  <Legend wrapperStyle={{ color: "#d1d5db", marginBottom: 8 }} />
                  <Area type="monotone" dataKey="weight" name="Weight" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                  <Line type="monotone" dataKey="rollingAvg7" name="7-Day Avg" stroke="#60a5fa" strokeWidth={3} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6">BMI Trend</h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" stroke="#9ca3af" axisLine={false} tickLine={false} />
                  <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "#ffffff10", borderRadius: "12px" }} />
                  <Legend wrapperStyle={{ color: "#d1d5db", marginBottom: 8 }} />
                  <Line type="monotone" dataKey="bmi" name="BMI" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}