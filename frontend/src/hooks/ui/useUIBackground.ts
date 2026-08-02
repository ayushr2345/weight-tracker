const backgroundLayers = [
  {
    className: "absolute inset-0 opacity-20",
    style: {
      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
      backgroundSize: "40px 40px",
    },
  },
  {
    className:
      "absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-float opacity-50",
    style: {
      animationDelay: "0s",
    },
  },
  {
    className:
      "absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] animate-float opacity-50",
    style: {
      animationDelay: "2s",
    },
  },
  {
    className:
      "absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[100px] animate-float opacity-30",
    style: {
      animationDelay: "4s",
    },
  },
  {
    className:
      "absolute inset-0 bg-gradient-to-b from-gray-950/80 via-transparent to-gray-950/80 pointer-events-none",
  },
];

export function useUIBackground() {
  return {
    layers: backgroundLayers,
  };
}
