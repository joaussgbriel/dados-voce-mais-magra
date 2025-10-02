import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PlatformComparisonProps {
  data: any[];
}

export function PlatformComparison({ data }: PlatformComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparação por Plataforma</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="platform" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)'
              }}
            />
            <Legend />
            <Bar dataKey="impressions" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
            <Bar dataKey="clicks" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
            <Bar dataKey="spend" fill="hsl(var(--chart-3))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
