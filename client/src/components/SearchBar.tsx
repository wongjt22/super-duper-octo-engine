import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchBar({ value, onChange, className = "" }: SearchBarProps) {
  return (
    <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 z-10 w-80 ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search landmarks..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 bg-card border shadow-sm"
          data-testid="input-search"
        />
      </div>
    </div>
  );
}