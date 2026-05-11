import { useState, type JSX } from "react";
import { Camera, Lock, Unlock, Save } from "lucide-react";

export default function Profile(): JSX.Element {
  // Local state to manage the form and the "locked" feature
  const [isLocked, setIsLocked] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    startingWeight: "",
    height: "",
    age: "",
    gender: "male",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 1. Identity Card (Photo, Name, Status) */}
      <div className="glass p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-8 items-center sm:items-start relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

        {/* Profile Photo Upload */}
        <div className="relative group shrink-0">
          <div className="w-32 h-32 rounded-full bg-black/40 border-4 border-white/5 flex items-center justify-center overflow-hidden relative z-10">
            <Camera className="w-8 h-8 text-gray-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          {!isLocked && (
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              title="Upload Profile Photo"
            />
          )}
        </div>

        {/* Name and Status */}
        <div className="flex-1 w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Display Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLocked}
              placeholder="How should we call you?"
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-lg font-bold outline-none focus:border-emerald-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Status Tagline
            </label>
            <textarea
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isLocked}
              rows={2}
              placeholder="e.g., Grinding for that 15% body fat..."
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-emerald-500 transition-colors resize-none disabled:opacity-70 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* 2. Biometrics Grid Card */}
      <div className="glass p-6 sm:p-8 rounded-2xl border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Starting Biometrics</h2>
          {isLocked && (
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Locked
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Starting Weight (kg)
            </label>
            <input
              type="number"
              name="startingWeight"
              step="0.1"
              value={formData.startingWeight}
              onChange={handleChange}
              disabled={isLocked}
              placeholder="e.g., 85.5"
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-emerald-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              disabled={isLocked}
              placeholder="e.g., 175"
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-emerald-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              disabled={isLocked}
              placeholder="e.g., 25"
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-emerald-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={isLocked}
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-emerald-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed appearance-none"
            >
              <option value="male" className="bg-gray-900">
                Male
              </option>
              <option value="female" className="bg-gray-900">
                Female
              </option>
              <option value="other" className="bg-gray-900">
                Other
              </option>
            </select>
          </div>
        </div>

        {/* 3. Action Buttons */}
        <div className="mt-8 flex gap-4 pt-6 border-t border-white/5">
          {isLocked ? (
            <button
              onClick={() => setIsLocked(false)}
              className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/10 flex items-center justify-center gap-2"
            >
              <Unlock className="w-5 h-5" />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setIsLocked(true)}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save & Lock Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
