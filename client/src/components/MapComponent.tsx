import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { useQuery } from "@tanstack/react-query";
import { type Landmark } from "@shared/schema";
import { ZoomControls } from "../components/ZoomControls";

interface MapComponentProps {
  onLandmarkSelect: (landmark: Landmark) => void;
  searchQuery: string;
}

export function MapComponent({ onLandmarkSelect, searchQuery }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup>(new L.LayerGroup());
  const [mapBounds, setMapBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);

  const { data: landmarks = [], isLoading } = useQuery<Landmark[]>({
    queryKey: ["/api/landmarks", mapBounds],
    enabled: !!mapBounds,
    queryFn: async () => {
      if (!mapBounds) return [];
      
      const params = new URLSearchParams({
        north: mapBounds.north.toString(),
        south: mapBounds.south.toString(),
        east: mapBounds.east.toString(),
        west: mapBounds.west.toString(),
      });
      
      const res = await fetch(`/api/landmarks?${params}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch landmarks: ${res.statusText}`);
      }
      
      return res.json();
    },
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [40.7128, -74.0060], // Default to NYC
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    markersRef.current.addTo(map);

    // Update bounds when map moves
    const updateBounds = () => {
      const bounds = map.getBounds();
      setMapBounds({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    };

    map.on("moveend", updateBounds);
    map.on("zoomend", updateBounds);
    
    // Set initial bounds
    updateBounds();

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when landmarks change
  useEffect(() => {
    if (!landmarks || !mapRef.current) return;

    markersRef.current.clearLayers();

    landmarks.forEach((landmark: Landmark) => {
      const marker = L.marker([
        parseFloat(landmark.latitude), 
        parseFloat(landmark.longitude)
      ], {
        icon: L.divIcon({
          className: 'custom-landmark-marker',
          html: `<div class="w-6 h-6 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                   <span class="text-xs text-primary-foreground font-medium">W</span>
                 </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })
      });

      marker.on("click", () => onLandmarkSelect(landmark));
      markersRef.current.addLayer(marker);
    });
  }, [landmarks, onLandmarkSelect]);

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainerRef} 
        className="w-full h-full z-0"
        data-testid="leaflet-map"
      />
      
      {isLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-card px-4 py-2 rounded-md border">
            <span className="text-sm text-muted-foreground">Loading landmarks...</span>
          </div>
        </div>
      )}

      <ZoomControls 
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        className="absolute bottom-6 right-6 z-10"
        data-testid="zoom-controls"
      />
    </div>
  );
}