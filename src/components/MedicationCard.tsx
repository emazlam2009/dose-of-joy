import { Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface MedicationCardProps {
  name: string;
  dosage: string;
  time: string;
  taken?: boolean;
  onTake?: () => void;
}

export const MedicationCard = ({ name, dosage, time, taken = false, onTake }: MedicationCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTake = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    onTake?.();
  };

  return (
    <Card className={`p-4 transition-all duration-300 ${
      taken 
        ? "bg-success/10 border-success/30" 
        : "bg-card hover:shadow-[var(--shadow-soft)]"
    } ${isAnimating ? "animate-celebrate" : ""}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{name}</h3>
          <p className="text-sm text-muted-foreground">{dosage}</p>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{time}</span>
          </div>
        </div>
        <Button
          variant={taken ? "success" : "default"}
          size="icon"
          onClick={handleTake}
          disabled={taken}
          className="shrink-0 transition-transform hover:scale-105"
        >
          {taken ? <Check className="w-5 h-5" /> : <Check className="w-5 h-5" />}
        </Button>
      </div>
    </Card>
  );
};
