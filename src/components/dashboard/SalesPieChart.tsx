import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { salesByPlatform } from "@/data/mockData";

const COLORS = [
  "hsl(174 72% 50%)",
  "hsl(270 60% 58%)",
  "hsl(38 92% 55%)",
  "hsl(150 60% 45%)",
  "hsl(0 72% 55%)",
  "hsl(200 70% 55%)",
  "hsl(320 60% 50%)",
];

export function SalesPieChart() {
  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="text-base font-semibold mb-4">Ventas por Plataforma</h3>
      <div className="h-[300px] flex items-center">
        <div className="w-1/2 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={salesByPlatform}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                dataKey="value"
                stroke="none"
              >
                {salesByPlatform.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220 18% 10%)",
                  border: "1px solid hsl(220 14% 18%)",
                  borderRadius: "8px",
                  color: "hsl(210 20% 92%)",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 space-y-2">
          {salesByPlatform.map((item, i) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-muted-foreground">{item.name}</span>
              <span className="ml-auto font-mono text-foreground">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
