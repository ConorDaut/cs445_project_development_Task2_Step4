export default function StatusPill({ status }: { status: 'Active' | 'Pending' | 'Cancelled' | 'Complete' }) {
  const colors: Record<string, string> = {
    Active: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Cancelled: 'bg-red-100 text-red-700',
    Complete: 'bg-blue-100 text-blue-700'
  };
  return <span className={`px-2 py-1 rounded text-sm ${colors[status]}`}>{status}</span>;
}
