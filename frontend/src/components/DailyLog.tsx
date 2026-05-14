import { useState, useEffect, type JSX } from "react";
import { CalendarPlus, UploadCloud, Loader2 } from "lucide-react";
import { weightLogService } from "../services/weightLogService";
import { profileService } from "../services/profileService";

export default function DailyLog(): JSX.Element {
  const [weight, setWeight] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await profileService.getProfile();
        setUserId(profile._id);
      } catch (err) {
        console.warn("Unable to load profile for weight log creation.", err);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    if (!userId) {
      setError("User profile is required to log weight. Please create your profile first.");
      setIsLoading(false);
      return;
    }

    try {
      // NOTE: For the photo, you will eventually upload the `photo` File to S3/Cloudinary here,
      // get the secure URL back, and pass it as `photoUrl` to the backend.
      
      await weightLogService.createWeightLog({
        userId,
        weightKg: parseFloat(weight),
        date: new Date(), // Logs it for today
        // photoUrl: uploadedPhotoUrl (Once you implement S3)
      });

      setSuccess(true);
      setWeight("");
      setPhoto(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to log weight. Did you already log today?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto glass p-6 sm:p-8 rounded-2xl border border-white/10 mt-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-500/20 rounded-xl">
          <CalendarPlus className="text-emerald-400 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Log Today's Progress</h2>
          <p className="text-gray-400 text-sm">Consistency is the only metric that matters.</p>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-200 text-sm">Entry saved successfully!</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Morning Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            required
            disabled={isLoading}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white text-2xl font-bold outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
            placeholder="e.g. 84.9"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Progress Photo (Optional)</label>
          <div className="relative w-full border-2 border-dashed border-white/20 rounded-xl p-8 hover:border-emerald-500/50 transition-colors bg-black/10 flex flex-col items-center justify-center text-center cursor-pointer group">
            <UploadCloud className="w-8 h-8 text-gray-500 group-hover:text-emerald-400 mb-2 transition-colors" />
            <p className="text-gray-400 font-medium">Click to upload or drag & drop</p>
            <p className="text-gray-500 text-xs mt-1">SVG, PNG, JPG (max 5MB)</p>
            <input
              type="file"
              accept="image/*"
              disabled={isLoading}
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>
          {photo && <p className="text-emerald-400 text-sm mt-2 font-medium">Selected: {photo.name}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading || !weight || !userId}
          className="w-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/25 mt-4 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Save Entry"}
        </button>
      </form>
    </div>
  );
}