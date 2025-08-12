interface BadgeCardProps {
  badge: { title: string; description: string; icon?: string };
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
      {badge.icon && <span className="text-3xl">{badge.icon}</span>}
      <div>
        <h3 className="font-semibold text-lg">{badge.title}</h3>
        <p className="text-sm text-gray-600">{badge.description}</p>
      </div>
    </div>
  );
}
