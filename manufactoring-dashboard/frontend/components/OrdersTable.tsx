import React from 'react';
import StatusPill from './StatusPill';

type Order = {
  id: number;
  company: string;
  status: 'Active' | 'Pending' | 'Cancelled' | 'Complete';
  total: number;
  createdAt: string;
  items: { id: number; quantity: number; unitPrice: number; part: { name: string } }[];
};

export default function OrdersTable({
  orders,
  onSort,
  sortBy,
  adminActions
}: {
  orders: Order[];
  onSort?: (sort: 'date' | 'company' | 'status') => void;
  sortBy?: string;
  adminActions?: (orderId: number) => JSX.Element;
}) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium">Orders</h2>
        {onSort && (
          <div className="space-x-2">
            <button className={`px-3 py-1 rounded border ${sortBy==='date'?'bg-gray-200':''}`} onClick={() => onSort('date')}>By Date</button>
            <button className={`px-3 py-1 rounded border ${sortBy==='company'?'bg-gray-200':''}`} onClick={() => onSort('company')}>By Company</button>
            <button className={`px-3 py-1 rounded border ${sortBy==='status'?'bg-gray-200':''}`} onClick={() => onSort('status')}>By Status</button>
          </div>
        )}
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">ID</th>
            <th>Company</th>
            <th>Status</th>
            <th>Items</th>
            <th>Total</th>
            <th>Created</th>
            {adminActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-b">
              <td className="py-2">{o.id}</td>
              <td>{o.company}</td>
              <td><StatusPill status={o.status} /></td>
              <td>
                <ul className="text-sm">
                  {o.items.map(i => (
                    <li key={i.id}>
                      <span className="font-semibold">{i.part.name}</span> × {i.quantity} (${i.unitPrice.toFixed(2)})
                    </li>
                  ))}
                </ul>
              </td>
              <td>${o.total.toFixed(2)}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              {adminActions && <td>{adminActions(o.id)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
