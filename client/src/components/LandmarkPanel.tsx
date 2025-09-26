import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Landmark } from "@shared/schema";

interface LandmarkPanelProps {
  landmark: Landmark;
  onClose: () => void;
  className?: string;
}

export function LandmarkPanel({ landmark, onClose, className = "" }: LandmarkPanelProps) {
  return (
    <Card className={`absolute top-4 left-4 w-80 max-h-96 overflow-hidden z-20 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight pr-8" data-testid="landmark-title">
            {landmark.title}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 rounded-full"
            data-testid="button-close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {landmark.category && (
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground" data-testid="text-category">
              {landmark.category}
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {landmark.image_url && (
          <div className="w-full h-32 overflow-hidden rounded-md" data-testid="img-landmark">
            <img 
              src={landmark.image_url} 
              alt={landmark.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {landmark.extract && (
          <div className="space-y-2">
            <p className="text-sm text-foreground leading-relaxed" data-testid="text-description">
              {landmark.extract}
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            <span data-testid="text-coordinates">
              {parseFloat(landmark.latitude).toFixed(4)}, {parseFloat(landmark.longitude).toFixed(4)}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(landmark.wikipedia_url, '_blank')}
            className="text-xs"
            data-testid="button-wikipedia"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Wikipedia
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}