export default function AccountInfo({ user }: { user: { email: string; name: string; company: string; role: string } }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-medium mb-2">Account info</h2>
      <div className="grid grid-cols-2 gap-2">
        <div><span className="font-semibold">Name:</span> {user.name}</div>
        <div><span className="font-semibold">Email:</span> {user.email}</div>
        <div><span className="font-semibold">Company:</span> {user.company}</div>
        <div><span className="font-semibold">Role:</span> {user.role}</div>
      </div>
    </div>
  );
}
