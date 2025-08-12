interface Student {
  id: string;
  full_name: string;
}

interface StudentSelectorProps {
  students: Student[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function StudentSelector({ students, selectedIds, onChange }: StudentSelectorProps) {
  function toggleSelect(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Select Students</h3>
      <div className="space-y-2">
        {students.map((s) => (
          <label key={s.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedIds.includes(s.id)}
              onChange={() => toggleSelect(s.id)}
            />
            {s.full_name}
          </label>
        ))}
      </div>
    </div>
  );
}
