import { type JSX } from "react";
import { CalendarPlus, UploadCloud, Loader2 } from "lucide-react";
import { useDailyLogForm } from "../hooks/logic/useDailyLogForm";

export default function DailyLog(): JSX.Element {
  const {
    weight,
    date,
    note,
    photo,
    userId,
    isLoading,
    error,
    success,
    updateWeight,
    updateDate,
    updateNote,
    updatePhoto,
    submitLog,
  } = useDailyLogForm();

  return (
    <div className="max-w-xl mx-auto glass p-6 sm:p-8 rounded-2xl border border-white/10 mt-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-500/20 rounded-xl">
          <CalendarPlus className="text-emerald-400 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Log Daily Progress</h2>
          <p className="text-gray-400 text-sm">
            Pick the date and save your measurement.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-200 text-sm">
          Entry saved successfully!
        </div>
      )}

      <form onSubmit={submitLog} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Date
          </label>
          <input
            type="date"
            required
            disabled={isLoading}
            value={date}
            onChange={updateDate}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Morning Weight (kg)
          </label>
          <input
            type="number"
            step="0.1"
            required
            disabled={isLoading}
            value={weight}
            onChange={updateWeight}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white text-2xl font-bold outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
            placeholder="e.g. 84.9"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Progress Photo (Optional)
          </label>
          <div className="relative w-full border-2 border-dashed border-white/20 rounded-xl p-8 hover:border-emerald-500/50 transition-colors bg-black/10 flex flex-col items-center justify-center text-center cursor-pointer group">
            <UploadCloud className="w-8 h-8 text-gray-500 group-hover:text-emerald-400 mb-2 transition-colors" />
            <p className="text-gray-400 font-medium">
              Click to upload or drag & drop
            </p>
            <p className="text-gray-500 text-xs mt-1">
              SVG, PNG, JPG (max 5MB)
            </p>
            <input
              type="file"
              accept="image/*"
              disabled={isLoading}
              onChange={updatePhoto}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>
          {photo && (
            <p className="text-emerald-400 text-sm mt-2 font-medium">
              Selected: {photo.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Note (Optional)
          </label>
          <textarea
            rows={3}
            disabled={isLoading}
            value={note}
            onChange={updateNote}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-emerald-500 transition-colors resize-none disabled:opacity-50"
            placeholder="Add a quick note about how you felt today..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !weight || !userId}
          className="w-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/25 mt-4 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            "Save Entry"
          )}
        </button>
      </form>
    </div>
  );
}
