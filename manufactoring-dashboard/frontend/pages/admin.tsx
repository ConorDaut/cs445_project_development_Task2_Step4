import Layout from '../components/Layout';
import { useMe } from '../lib/auth';
import useSWR from 'swr';
import { api } from '../lib/api';
import OrdersTable from '../components/OrdersTable';
import Link from 'next/link';
import { useState } from 'react';

export default function Admin() {
  const { me, loading } = useMe();
  const [sortBy, setSortBy] = useState<'date' | 'company' | 'status'>('date');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: orders, mutate } = useSWR(['admin-orders', sortBy, statusFilter], async () => {
    const res = await api.get('/admin/orders', { params: { sortBy, status: statusFilter || undefined } });
    return res.data;
  });

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (!me) return <Layout><div>Please <Link href="/login" className="text-blue-600">login</Link>.</div></Layout>;
  if (me.role !== 'ADMIN') return <Layout><div>Forbidden</div></Layout>;

  function actionButtons(orderId: number) {
    const statuses = ['Active', 'Pending', 'Cancelled', 'Complete'] as const;
    return (
      <div className="space-x-2">
        {statuses.map(s => (
          <button
            key={s}
            className="px-2 py-1 border rounded text-sm"
            onClick={async () => {
              await api.post('/admin/orders/status', { orderId, status: s });
              mutate();
            }}
          >
            {s}
          </button>
        ))}
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium">Administrator dashboard</h2>
          <div className="flex gap-2 items-center mt-2">
            <label className="text-sm">Filter status:</label>
            <select className="border rounded p-1"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
        </div>

        <OrdersTable
          orders={orders || []}
          onSort={(s) => setSortBy(s)}
          sortBy={sortBy}
          adminActions={actionButtons}
        />
      </div>
    </Layout>
  );
}
