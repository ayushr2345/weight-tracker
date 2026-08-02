export type DashboardRangeValue = "week" | "month" | "3months" | "year";

export interface DashboardRangeOption {
  label: string;
  value: DashboardRangeValue;
  days: number;
}

export interface DashboardChartEntryLike {
  dateIso: string;
}

export const rangeOptions: DashboardRangeOption[] = [
  { label: "Past Week", value: "week", days: 7 },
  { label: "Past Month", value: "month", days: 30 },
  { label: "Past 3 Months", value: "3months", days: 90 },
  { label: "Past Year", value: "year", days: 365 },
];

export function filterChartDataByRange<T extends DashboardChartEntryLike>(
  chartData: T[],
  selectedRangeOption: DashboardRangeOption,
) {
  if (!chartData.length) {
    return [];
  }

  const latestDate = new Date(chartData[chartData.length - 1]?.dateIso);
  if (Number.isNaN(latestDate.getTime())) {
    return [];
  }

  const cutoffDate = new Date(latestDate);
  cutoffDate.setDate(cutoffDate.getDate() - selectedRangeOption.days + 1);

  return chartData.filter((item) => {
    if (!item.dateIso) return false;
    const itemDate = new Date(item.dateIso);
    return itemDate >= cutoffDate && itemDate <= latestDate;
  });
}
