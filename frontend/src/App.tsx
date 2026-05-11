import { useState, type JSX } from "react";
import UI from "./components/UI";
import Dashboard from "./components/Dashboard";
import DailyLog from "./components/DailyLog";
import Gallery from "./components/Gallery";
import Profile from "./components/Profile";
import {
  LayoutDashboard,
  Scale,
  Image as ImageIcon,
  UserCircle,
  TrendingDown,
} from "lucide-react";

/**
 * The root component of the Weight Tracker application.
 * @remarks
 * Acts as the main layout shell, managing navigation between the
 * Dashboard, Daily Log, Gallery, and Profile views.
 */
function App(): JSX.Element {
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  const tabs = [
    { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "Daily Log", label: "Daily Log", icon: Scale },
    { id: "Gallery", label: "Gallery", icon: ImageIcon },
    { id: "Profile", label: "Profile", icon: UserCircle },
  ];

  return (
    <>
      <div className="min-h-screen relative text-gray-100 font-sans selection:bg-emerald-500/30">
        <UI />

        <main className="relative z-10 p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col items-center">
          <div className="w-full max-w-6xl space-y-8 sm:space-y-12">
            {/* 1. Header Section */}
            <div className="text-center space-y-4 pt-4 sm:pt-8">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-2 backdrop-blur-sm shadow-xl">
                <TrendingDown className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-lg">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 animate-gradient">
                  Weight Tracker
                </span>
              </h1>
              <p className="text-gray-400 text-lg font-medium max-w-lg mx-auto leading-relaxed">
                Log your weight, track your trends, and visualize your fitness
                journey.
              </p>
            </div>

            {/* 2. Navigation Tabs (Floating Dock Style) */}
            <div className="sticky top-4 z-50 flex justify-center">
              <div className="glass p-1.5 rounded-2xl border border-white/10 shadow-2xl flex flex-wrap justify-center gap-1 sm:gap-2 bg-gray-900/80 backdrop-blur-xl">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = selectedTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`
                        relative px-4 sm:px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 flex items-center gap-2.5
                        ${
                          isActive
                            ? "text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] bg-white/10 border border-white/10"
                            : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                        }
                      `}
                    >
                      <Icon
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? "text-emerald-400" : "opacity-70"}`}
                      />
                      <span>{tab.label}</span>

                      {/* Active Indicator Dot */}
                      {isActive && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Main Content Area */}
            <div className="animate-fade-in-up pb-10">
              {selectedTab === "Dashboard" && <Dashboard />}
              {selectedTab === "Daily Log" && <DailyLog />}
              {selectedTab === "Gallery" && <Gallery />}
              {selectedTab === "Profile" && <Profile />}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
