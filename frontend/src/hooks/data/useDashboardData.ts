import { useEffect, useMemo, useState } from "react";
import { profileService } from "../../services/profileService";
import { weightLogService } from "../../services/weightLogService";
import {
  filterChartDataByRange,
  rangeOptions,
  type DashboardRangeValue,
} from "./dashboardRange";

export interface DashboardChartEntry {
  date: string;
  dateIso: string;
  weight: number;
  avg: number;
  bmi: number;
  rollingAvg7: number;
}

export function useDashboardData() {
  const [chartData, setChartData] = useState<DashboardChartEntry[]>([]);
  const [selectedRange, setSelectedRange] =
    useState<DashboardRangeValue>("week");
  const [currentWeight, setCurrentWeight] = useState(0);
  const [currentBmi, setCurrentBmi] = useState(0);
  const [currentRollingAvg, setCurrentRollingAvg] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const profile = await profileService.getProfile().catch(() => null);
        if (!profile || cancelled) {
          setIsLoading(false);
          return;
        }

        const logs = await weightLogService.getAllWeightLogs(profile._id);
        if (logs.length === 0 || cancelled) {
          setIsLoading(false);
          return;
        }

        const heightMeters = profile.heightCm / 100;
        const ascendingLogs = [...logs].reverse();

        let runningSum = 0;

        const formattedData = ascendingLogs.map((log, index) => {
          runningSum += log.weightKg;
          const avg = runningSum / (index + 1);
          const bmi = log.weightKg / (heightMeters * heightMeters);

          const windowStart = Math.max(0, index - 6);
          const rollingWindow = ascendingLogs.slice(windowStart, index + 1);
          const rollingAvg7 =
            rollingWindow.reduce((sum, item) => sum + item.weightKg, 0) /
            rollingWindow.length;

          const dateObj = new Date(log.date);
          const dateStr = dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          return {
            date: dateStr,
            dateIso: log.date.toString(),
            weight: parseFloat(log.weightKg.toFixed(1)),
            avg: parseFloat(avg.toFixed(1)),
            bmi: parseFloat(bmi.toFixed(1)),
            rollingAvg7: parseFloat(rollingAvg7.toFixed(1)),
          };
        });

        if (cancelled) {
          return;
        }

        setChartData(formattedData);

        const latest = formattedData[formattedData.length - 1];
        setCurrentWeight(latest.weight);
        setCurrentBmi(latest.bmi);
        setCurrentRollingAvg(latest.rollingAvg7);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedRangeOption = useMemo(
    () =>
      rangeOptions.find((option) => option.value === selectedRange) ??
      rangeOptions[0],
    [selectedRange],
  );

  const historicalHigh = useMemo(() => {
    return (
      chartData.reduce(
        (max, item) => Math.max(max, item.weight),
        Number.NEGATIVE_INFINITY,
      ) || 0
    );
  }, [chartData]);

  const historicalLow = useMemo(() => {
    return (
      chartData.reduce(
        (min, item) => Math.min(min, item.weight),
        Number.POSITIVE_INFINITY,
      ) || 0
    );
  }, [chartData]);

  const filteredChartData = useMemo(() => {
    return filterChartDataByRange(chartData, selectedRangeOption);
  }, [chartData, selectedRangeOption]);

  const rangeButtons = useMemo(
    () =>
      rangeOptions.map((option) => ({
        ...option,
        isActive: selectedRange === option.value,
        onClick: () => setSelectedRange(option.value),
      })),
    [selectedRange],
  );

  return {
    chartData,
    filteredChartData,
    currentWeight,
    currentBmi,
    currentRollingAvg,
    historicalHigh,
    historicalLow,
    historicalAverage: chartData[chartData.length - 1]?.avg ?? 0,
    isLoading,
    selectedRange,
    rangeButtons,
  };
}
