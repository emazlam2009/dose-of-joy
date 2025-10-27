import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time_of_day: string;
  frequency: string;
  refill_date?: string;
  active: boolean;
}

export const useMedications = (userId: string | undefined) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchMedications = async () => {
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", userId)
        .eq("active", true)
        .order("time_of_day");

      if (error) {
        toast.error("Failed to load medications");
        console.error(error);
      } else {
        setMedications(data || []);
      }
      setLoading(false);
    };

    fetchMedications();

    // Set up realtime subscription
    const channel = supabase
      .channel("medications-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "medications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchMedications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const addMedication = async (medication: Omit<Medication, "id" | "active">) => {
    if (!userId) return;

    const { error } = await supabase.from("medications").insert({
      ...medication,
      user_id: userId,
    });

    if (error) {
      toast.error("Failed to add medication");
      console.error(error);
    } else {
      toast.success("Medication added!");
    }
  };

  return { medications, loading, addMedication };
};