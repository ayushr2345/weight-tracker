import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Scale,
  Image as ImageIcon,
  UserCircle,
  History as HistoryIcon,
} from "lucide-react";

const tabDefinitions = [
  { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "Daily Log", label: "Daily Log", icon: Scale },
  { id: "History", label: "History", icon: HistoryIcon },
  { id: "Gallery", label: "Gallery", icon: ImageIcon },
  { id: "Profile", label: "Profile", icon: UserCircle },
];

export function useAppNavigation() {
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  const tabs = useMemo(
    () =>
      tabDefinitions.map((tab) => ({
        ...tab,
        isActive: selectedTab === tab.id,
        onClick: () => setSelectedTab(tab.id),
      })),
    [selectedTab],
  );

  return {
    selectedTab,
    tabs,
  };
}
