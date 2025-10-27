import { Card } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface AdherenceChartProps {
  data: Array<{ day: string; taken: number; total: number }>;
}

export const AdherenceChart = ({ data }: AdherenceChartProps) => {
  const chartData = data.map((d) => ({
    ...d,
    percentage: d.total > 0 ? (d.taken / d.total) * 100 : 0,
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">7-Day Adherence</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};