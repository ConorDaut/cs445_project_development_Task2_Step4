import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow space-y-3">
        <h2 className="text-lg font-medium">Welcome</h2>
        <p>Log in or create an account to access your dashboard.</p>
        <div className="space-x-3">
          <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">Login</Link>
          <Link href="/register" className="px-4 py-2 bg-gray-800 text-white rounded">Create account</Link>
        </div>
      </div>
    </Layout>
  );
}
