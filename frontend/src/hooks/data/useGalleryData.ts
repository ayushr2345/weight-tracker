import { useEffect, useState } from "react";
import { profileService } from "../../services/profileService";
import { weightLogService } from "../../services/weightLogService";

interface GalleryPhoto {
  id: string;
  date: string;
  weight: number;
  url: string;
}

export function useGalleryData() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const profile = await profileService.getProfile();
        const logs = await weightLogService.getWeightLogs(
          profile._id,
          1,
          undefined,
          true,
        );

        const photoResults = logs.data
          .filter((log) => log.photoUrl)
          .map((log) => ({
            id: log._id,
            date: new Date(log.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            weight: log.weightKg,
            url: log.photoUrl as string,
          }));

        setPhotos(photoResults);
      } catch (error) {
        console.error("Failed to load gallery photos:", error);
      }
    };

    void loadPhotos();
  }, []);

  return {
    photos,
  };
}
