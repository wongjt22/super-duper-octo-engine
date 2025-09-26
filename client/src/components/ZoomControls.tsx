import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  className?: string;
}

export function ZoomControls({ onZoomIn, onZoomOut, className = "" }: ZoomControlsProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomIn}
        className="w-10 h-10 p-0 bg-card"
        data-testid="button-zoom-in"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
        className="w-10 h-10 p-0 bg-card"
        data-testid="button-zoom-out"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
}