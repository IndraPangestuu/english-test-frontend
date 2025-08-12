export default function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <Loader />
    </div>
  );
}