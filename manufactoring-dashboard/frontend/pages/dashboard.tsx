import Layout from '../components/Layout';
import { useMe } from '../lib/auth';
import useSWR from 'swr';
import { api } from '../lib/api';
import AccountInfo from '../components/AccountInfo';
import OrderForm from '../components/OrderForm';
import OrdersTable from '../components/OrdersTable';
import Link from 'next/link';

export default function Dashboard() {
  const { me, loading } = useMe();
  const { data: orders, mutate, isLoading } = useSWR('/orders', async () => {
    const res = await api.get('/orders');
    return res.data;
  });

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (!me) return <Layout><div>Please <Link href="/login" className="text-blue-600">login</Link>.</div></Layout>;

  const isAdmin = me.role === 'ADMIN';

  return (
    <Layout>
      <div className="space-y-6">
        <AccountInfo user={me} />

        {!isAdmin && (
          <>
            <OrderForm onCreated={() => mutate()} />
            <OrdersTable orders={orders || []} />
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-medium">Previous complete orders</h2>
              <UserHistory />
            </div>
          </>
        )}

        {isAdmin && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium mb-2">Administrator tools</h2>
            <p>Go to the <Link href="/admin" className="text-blue-600">Admin Dashboard</Link> for status updates, sorting, and views.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

function UserHistory() {
  const { data } = useSWR('/orders/history', async () => (await api.get('/orders/history')).data);
  if (!data) return <div>Loading...</div>;
  return <OrdersTable orders={data} />;
}
