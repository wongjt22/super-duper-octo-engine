import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapComponent } from "../components/MapComponent";
import { LandmarkPanel } from "../components/LandmarkPanel";
import { SearchBar } from "../components/SearchBar";
import { type Landmark } from "@shared/schema";

export default function Home() {
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Search landmarks when user types
  const { data: searchResults = [] } = useQuery<Landmark[]>({
    queryKey: ["/api/landmarks/search", searchQuery],
    enabled: searchQuery.length > 2,
    queryFn: async () => {
      const params = new URLSearchParams({ q: searchQuery });
      const res = await fetch(`/api/landmarks/search?${params}`);
      if (!res.ok) {
        throw new Error(`Search failed: ${res.statusText}`);
      }
      return res.json();
    },
  });

  return (
    <div className="h-screen w-full relative bg-background">
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
        data-testid="search-landmarks"
      />
      
      {/* Search Results Panel */}
      {searchQuery.length > 2 && searchResults.length > 0 && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 w-80 bg-card border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((landmark) => (
            <div
              key={landmark.id}
              className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
              onClick={() => {
                setSelectedLandmark(landmark);
                setSearchQuery("");
              }}
              data-testid={`search-result-${landmark.id}`}
            >
              <div className="font-medium text-sm">{landmark.title}</div>
              {landmark.category && (
                <div className="text-xs text-muted-foreground">{landmark.category}</div>
              )}
            </div>
          ))}
        </div>
      )}
      
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