import { type JSX } from "react";
import { Camera, Lock, Unlock, Save, Loader2 } from "lucide-react";
import { useProfileData } from "../hooks/data/useProfileData";

export default function Profile(): JSX.Element {
  const {
    formData,
    isLocked,
    isLoading,
    isSaving,
    updateField,
    handlePhotoChange,
    unlockProfile,
    saveProfile,
  } = useProfileData();

  if (isLoading)
    return (
      <div className="text-center text-white mt-10">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-8 items-center sm:items-start relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

        <div className="relative group shrink-0">
          <div className="w-32 h-32 rounded-full bg-black/40 border-4 border-white/5 flex items-center justify-center overflow-hidden relative z-10">
            {formData.photoUrl ? (
              <img
                src={formData.photoUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-8 h-8 text-gray-500 group-hover:text-emerald-400 transition-colors" />
            )}
          </div>

          {!isLocked && (
            <label className="absolute -right-1 -bottom-1 bg-emerald-500 rounded-full p-2 border border-white/10 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <Camera className="w-4 h-4 text-white" />
            </label>
          )}
        </div>

        <div className="flex-1 w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Display Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={updateField}
              disabled={isLocked}
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
              onChange={updateField}
              disabled={isLocked}
              rows={2}
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-emerald-500 transition-colors resize-none disabled:opacity-70 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="glass p-6 sm:p-8 rounded-2xl border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Biometrics</h2>
          {isLocked && (
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Locked
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={updateField}
              disabled={isLocked}
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
              onChange={updateField}
              disabled={isLocked}
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
              onChange={updateField}
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

        <div className="mt-8 flex gap-4 pt-6 border-t border-white/5">
          {isLocked ? (
            <button
              type="button"
              onClick={unlockProfile}
              className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-5 h-5" /> Edit Profile
            </button>
          ) : (
            <button
              type="button"
              onClick={saveProfile}
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}{" "}
              Save & Lock Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
