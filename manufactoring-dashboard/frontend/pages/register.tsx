import { useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../lib/api';
import { useRouter } from 'next/router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();

  async function submit() {
    setErr('');
    try {
      await api.post('/auth/register', { email, password, name, company });
      router.push('/dashboard');
    } catch (e: any) {
      setErr(e.response?.data?.error || 'Registration failed');
    }
  }

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow space-y-3 max-w-md">
        <h2 className="text-lg font-medium">Create account</h2>
        {err && <div className="text-red-600">{err}</div>}
        <input className="border rounded p-2 w-full" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border rounded p-2 w-full" placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} />
        <input className="border rounded p-2 w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="border rounded p-2 w-full" placeholder="Password (min 8 chars)" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="px-4 py-2 bg-gray-800 text-white rounded w-full" onClick={submit}>Create account</button>
      </div>
    </Layout>
  );
}
