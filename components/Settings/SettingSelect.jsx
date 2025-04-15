export default function SettingSelect({ label, value, onChange }) {
  const dayOptions = [1, 3, 5, 7, 9, 12];
    return (
      <div>
        <label className="block text-sm font-semibold mb-1">{label}</label>
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        >
          {dayOptions.map((option) => (
            <option key={option} value={option}>
              {option} gün
            </option>
          ))}
        </select>
      </div>
    );
  }