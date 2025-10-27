import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AddMedicationDialogProps {
  onAdd: (medication: {
    name: string;
    dosage: string;
    frequency: string;
    time_of_day: string;
    refill_date?: string;
  }) => void;
}

export const AddMedicationDialog = ({ onAdd }: AddMedicationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [timeOfDay, setTimeOfDay] = useState("08:00");
  const [refillDate, setRefillDate] = useState("");

  const handleSubmit = () => {
    if (!name || !dosage) return;

    onAdd({
      name,
      dosage,
      frequency,
      time_of_day: timeOfDay,
      refill_date: refillDate || undefined,
    });

    setName("");
    setDosage("");
    setFrequency("daily");
    setTimeOfDay("08:00");
    setRefillDate("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              placeholder="Medication name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label>Dosage</Label>
            <Input
              placeholder="e.g., 500mg, 1 tablet"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
          </div>
          <div>
            <Label>Frequency</Label>
            <Input
              placeholder="e.g., daily, twice daily"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            />
          </div>
          <div>
            <Label>Time of Day</Label>
            <Input
              type="time"
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
            />
          </div>
          <div>
            <Label>Refill Date (optional)</Label>
            <Input
              type="date"
              value={refillDate}
              onChange={(e) => setRefillDate(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Add Medication
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};