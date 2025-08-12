import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface HeatmapChartProps {
  data: { skill: string; level: number }[];
}

export default function HeatmapChart({ data }: HeatmapChartProps) {
  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Skill Heatmap</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="skill" />
          <YAxis dataKey="level" />
          <Tooltip />
          <Bar dataKey="level" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
