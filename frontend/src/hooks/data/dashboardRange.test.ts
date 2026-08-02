import test from "node:test";
import assert from "node:assert/strict";
import { filterChartDataByRange } from "./dashboardRange";

test("filters chart data for a 3-month range using the latest available entry", () => {
  const chartData = [
    {
      dateIso: "2024-08-15T00:00:00.000Z",
      weight: 72,
      avg: 72,
      bmi: 22.4,
      rollingAvg7: 72,
    },
    {
      dateIso: "2024-10-01T00:00:00.000Z",
      weight: 73,
      avg: 72.5,
      bmi: 22.7,
      rollingAvg7: 72.5,
    },
    {
      dateIso: "2024-11-15T00:00:00.000Z",
      weight: 74,
      avg: 73,
      bmi: 23.1,
      rollingAvg7: 73.5,
    },
  ];

  const filtered = filterChartDataByRange(chartData, {
    label: "Past 3 Months",
    value: "3months",
    days: 90,
  });

  assert.equal(filtered.length, 2);
  assert.deepEqual(
    filtered.map((item) => item.dateIso),
    ["2024-10-01T00:00:00.000Z", "2024-11-15T00:00:00.000Z"],
  );
});
