import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Medication } from "@/hooks/useMedications";

interface SideEffectsTrackerProps {
  userId: string;
  medications: Medication[];
}

export const SideEffectsTracker = ({ userId, medications }: SideEffectsTrackerProps) => {
  const [medicationId, setMedicationId] = useState("");
  const [effect, setEffect] = useState("");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe">("mild");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!medicationId || !effect) {
      toast.error("Please select a medication and describe the side effect");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("side_effects").insert({
      user_id: userId,
      medication_id: medicationId,
      effect,
      severity,
      notes,
    });

    if (error) {
      toast.error("Failed to log side effect");
      console.error(error);
    } else {
      toast.success("Side effect logged. Consider discussing with your doctor.");
      setMedicationId("");
      setEffect("");
      setSeverity("mild");
      setNotes("");
    }
    setLoading(false);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Track Side Effects</h3>
      
      <div className="space-y-4">
        <div>
          <Label>Medication</Label>
          <Select value={medicationId} onValueChange={setMedicationId}>
            <SelectTrigger>
              <SelectValue placeholder="Select medication" />
            </SelectTrigger>
            <SelectContent>
              {medications.map((med) => (
                <SelectItem key={med.id} value={med.id}>
                  {med.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Side Effect</Label>
          <Input
            placeholder="e.g., Headache, Nausea, Drowsiness"
            value={effect}
            onChange={(e) => setEffect(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Severity</Label>
          <Select value={severity} onValueChange={(v: any) => setSeverity(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mild">Mild</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="severe">Severe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Additional Notes</Label>
          <Textarea
            placeholder="When did it start? How long did it last?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2"
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Log Side Effect"}
        </Button>
      </div>
    </Card>
  );
};