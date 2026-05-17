import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface MarketFitChartProps {
  segmento: string;
  scoreColorCode: string;
}

export function MarketFitChart({ segmento, scoreColorCode }: MarketFitChartProps) {
  const chartData = [
    { name: segmento || 'Segmento Principal', value: 60, color: scoreColorCode },
    { name: 'Operações Correlatas', value: 25, color: '#6366f1' },
    { name: 'Outros Canais', value: 15, color: '#3f3f46' },
  ];

  return (
    <div className="h-28 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={22}
            outerRadius={40}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
            itemStyle={{ color: '#f4f4f5', fontSize: '11px', fontFamily: 'monospace' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}