// pages/Unauthorized.tsx
export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center h-screen bg-bg text-text">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">403 - Unauthorized</h1>
        <p className="text-lg">You do not have permission to view this page.</p>
      </div>
    </div>
  );
}
