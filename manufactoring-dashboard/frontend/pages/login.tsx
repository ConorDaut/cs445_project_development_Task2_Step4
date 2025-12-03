import { useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../lib/api';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();

  async function submit() {
    setErr('');
    try {
      await api.post('/auth/login', { email, password });
      router.push('/dashboard');
    } catch (e: any) {
      setErr(e.response?.data?.error || 'Login failed');
    }
  }

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow space-y-3 max-w-md">
        <h2 className="text-lg font-medium">Login</h2>
        {err && <div className="text-red-600">{err}</div>}
        <input className="border rounded p-2 w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="border rounded p-2 w-full" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded w-full" onClick={submit}>Login</button>
      </div>
    </Layout>
  );
}
