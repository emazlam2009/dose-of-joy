import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MedicationLog {
  id: string;
  medication_id: string;
  taken_at: string;
  scheduled_for: string;
}

export const useMedicationLogs = (userId: string | undefined) => {
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchLogs = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("medication_logs")
        .select("*")
        .eq("user_id", userId)
        .gte("scheduled_for", today.toISOString());

      if (error) {
        console.error(error);
      } else {
        setLogs(data || []);
      }
      setLoading(false);
    };

    fetchLogs();

    // Set up realtime subscription
    const channel = supabase
      .channel("medication-logs-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "medication_logs",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const logMedication = async (medicationId: string, scheduledFor: Date) => {
    if (!userId) return;

    const { error } = await supabase.from("medication_logs").insert({
      user_id: userId,
      medication_id: medicationId,
      scheduled_for: scheduledFor.toISOString(),
    });

    if (error) {
      toast.error("Failed to log medication");
      console.error(error);
    } else {
      toast.success("Medication logged! +15 XP 🎉");
    }
  };

  return { logs, loading, logMedication };
};