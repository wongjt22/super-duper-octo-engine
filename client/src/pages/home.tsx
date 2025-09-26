import { useState } from "react";
import { MapComponent } from "../components/MapComponent";
import { LandmarkPanel } from "../components/LandmarkPanel";
import { SearchBar } from "../components/SearchBar";
import { type Landmark } from "@shared/schema";

export default function Home() {
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="h-screen w-full relative bg-background">
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
        data-testid="search-landmarks"
      />
      
      <MapComponent 
        onLandmarkSelect={setSelectedLandmark}
        searchQuery={searchQuery}
        data-testid="map-container"
      />
      
      {selectedLandmark && (
        <LandmarkPanel 
          landmark={selectedLandmark}
          onClose={() => setSelectedLandmark(null)}
          data-testid="landmark-panel"
        />
      )}
    </div>
  );
}