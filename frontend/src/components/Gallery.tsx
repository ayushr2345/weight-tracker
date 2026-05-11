import { type JSX } from "react";
import { Camera } from "lucide-react";

// Mock Data - Replace with actual photo URLs from your DB/S3
const mockPhotos = [
  {
    id: 1,
    date: "May 7",
    weight: 84.9,
    url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=500&auto=format&fit=crop",
  },
  {
    id: 2,
    date: "May 1",
    weight: 86.5,
    url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500&auto=format&fit=crop",
  },
  // Add more placeholders to see the grid fill out
];

export default function Gallery(): JSX.Element {
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mockPhotos.map((photo) => (
          <div
            key={photo.id}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 cursor-pointer"
          >
            {/* Background Image */}
            <img
              src={photo.url}
              alt={`Progress on ${photo.date}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Text Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <p className="text-white font-bold text-lg">{photo.weight} kg</p>
              <p className="text-emerald-400 text-sm font-medium">
                {photo.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
