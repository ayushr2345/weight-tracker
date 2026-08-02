import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { profileService } from "../../services/profileService";

interface ProfileFormData {
  name: string;
  status: string;
  height: string;
  age: string;
  gender: "male" | "female" | "other";
  photoUrl: string;
}

const initialFormData: ProfileFormData = {
  name: "",
  status: "",
  height: "",
  age: "",
  gender: "male",
  photoUrl: "",
};

export function useProfileData() {
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await profileService.getProfile();
        const profileWithPhoto = profile as typeof profile & {
          photoUrl?: string;
        };
        setFormData({
          name: profile.name,
          status: profile.status || "",
          height: profile.heightCm.toString(),
          age: profile.age.toString(),
          gender: profile.gender,
          photoUrl: profileWithPhoto.photoUrl || "",
        });
        setIsLocked(true);
      } catch (error) {
        console.log("No profile found, ready to create.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProfile();
  }, []);

  const updateField = useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handlePhotoChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const preview = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, photoUrl: preview }));

      try {
        const url = await profileService.uploadPhoto(file);
        setFormData((prev) => ({ ...prev, photoUrl: url }));
      } catch (err) {
        console.error("Upload failed", err);
        alert("Failed to upload photo. Please try again.");
        setFormData((prev) => ({ ...prev, photoUrl: "" }));
      }
    },
    [],
  );

  const unlockProfile = useCallback(() => {
    setIsLocked(false);
  }, []);

  const saveProfile = useCallback(async () => {
    setIsSaving(true);

    try {
      await profileService.upsertProfile({
        name: formData.name,
        status: formData.status,
        age: parseInt(formData.age, 10),
        heightCm: parseInt(formData.height, 10),
        gender: formData.gender,
        unitSystem: "metric",
        ...(formData.photoUrl ? { photoUrl: formData.photoUrl } : {}),
      });
      setIsLocked(true);
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  }, [formData]);

  return {
    formData,
    isLocked,
    isLoading,
    isSaving,
    updateField,
    handlePhotoChange,
    unlockProfile,
    saveProfile,
  };
}
