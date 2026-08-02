import type { JSX } from "react";
import { useUIBackground } from "../hooks/ui/useUIBackground";

/**
 * A presentational component that renders the application's background visual layer.
 */
function UI(): JSX.Element {
  const { layers } = useUIBackground();

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-gray-950">
      {layers.map((layer, index) => (
        <div key={index} className={layer.className} style={layer.style} />
      ))}
    </div>
  );
}

export default UI;
