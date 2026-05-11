import { useState, type JSX } from "react";
import { CalendarPlus, UploadCloud } from "lucide-react";

export default function DailyLog(): JSX.Element {
  const [weight, setWeight] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", { weight, photo });
    // TODO: Wire up to POST /api/weights
    alert("Logged successfully! (Wire up API next)");
    setWeight("");
  };

  return (
    <div className="max-w-xl mx-auto glass p-6 sm:p-8 rounded-2xl border border-white/10 mt-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-500/20 rounded-xl">
          <CalendarPlus className="text-emerald-400 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            Log Today's Progress
          </h2>
          <p className="text-gray-400 text-sm">
            Consistency is the only metric that matters.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Morning Weight (kg)
          </label>
          <input
            type="number"
            step="0.1"
            required
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white text-2xl font-bold outline-none focus:border-emerald-500 transition-colors"
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
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          {photo && (
            <p className="text-emerald-400 text-sm mt-2 font-medium">
              Selected: {photo.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/25 mt-4"
        >
          Save Entry
        </button>
      </form>
    </div>
  );
}
