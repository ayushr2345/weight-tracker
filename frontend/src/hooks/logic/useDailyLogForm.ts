import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { profileService } from "../../services/profileService";
import { weightLogService } from "../../services/weightLogService";

const getTodayValue = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

export function useDailyLogForm() {
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(getTodayValue);
  const [note, setNote] = useState("");
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

    void fetchProfile();
  }, []);

  useEffect(() => {
    if (!success) return;

    const timeoutId = window.setTimeout(() => {
      setSuccess(false);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [success]);

  const updateWeight = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
  }, []);

  const updateDate = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  }, []);

  const updateNote = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  }, []);

  const updatePhoto = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPhoto(e.target.files?.[0] || null);
  }, []);

  const submitLog = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");
      setSuccess(false);

      if (!userId) {
        setError(
          "User profile is required to log weight. Please create your profile first.",
        );
        setIsLoading(false);
        return;
      }

      try {
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);

        console.log("selected date:", selectedDate.toISOString());
        //TODO: date should be given in ISO format and not js Date object. Fix this in the backend as well.

        let photoUrl: string | undefined;
        if (photo) {
          photoUrl = await weightLogService.uploadPhoto(photo);
        }

        await weightLogService.createWeightLog({
          userId,
          weightKg: parseFloat(weight),
          date: selectedDate,
          note: note || undefined,
          ...(photoUrl ? { photoUrl } : {}),
        });

        setSuccess(true);
        setWeight("");
        setNote("");
        setPhoto(null);
      } catch (err: any) {
        setError(
          err.response?.data?.error ||
            "Failed to log weight. Did you already log today?",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [userId, weight, photo],
  );

  return {
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
  };
}
