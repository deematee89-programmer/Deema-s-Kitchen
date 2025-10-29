export default function LoadingSpinner() {
  return (
    <div className="relative w-6 h-6">
      <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
      <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
    </div>
  );
}
