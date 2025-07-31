
export default function SummaryCard({ icon, title, value, color = 'bg-blue-500' }) {
  return (
    <div className="bg-white p-4 shadow rounded-xl flex items-center gap-4">
      <div className={`p-3 rounded-full text-white ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}