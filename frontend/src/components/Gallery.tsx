import { type JSX } from "react";
import { Camera } from "lucide-react";
import { useGalleryData } from "../hooks/data/useGalleryData";

export default function Gallery(): JSX.Element {
  const { photos } = useGalleryData();

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Physique Timeline</h2>
          <p className="text-gray-400 text-sm mt-1">
            Visual proof of your consistency.
          </p>
        </div>
        <div className="p-3 glass rounded-xl border border-white/10">
          <Camera className="text-emerald-400 w-5 h-5" />
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-12 flex flex-col items-center justify-center gap-4">
          <div className="p-4 rounded-full bg-gray-900/50 border border-white/5">
            <Camera className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="text-center">
            <p className="text-gray-200 font-semibold text-lg">
              No photos uploaded
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Upload photos from the Daily Log to populate your timeline.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 cursor-pointer"
            >
              <img
                src={photo.url}
                alt={`Progress on ${photo.date}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <p className="text-white font-bold text-lg">
                  {photo.weight} kg
                </p>
                <p className="text-emerald-400 text-sm font-medium">
                  {photo.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
