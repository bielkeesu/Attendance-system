import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#4CAF50", "#FFC107", "#F44336"]; // Present, Late, Absent

export default function AttendancePieChart({ data }) {
  
  if (!data || data.length === 0 || data.every((d) => d.value === 0)) {
    return <p className="text-sm text-gray-500">No attendance data for today</p>;
  }

  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        cx={150}
        cy={150}
        innerRadius={60}
        outerRadius={100}
        dataKey="value"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
