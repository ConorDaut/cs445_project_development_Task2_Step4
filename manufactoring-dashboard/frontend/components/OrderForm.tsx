import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Part = { id: number; name: string; price: number; stock: number };
type Item = { partId: number; quantity: number };

export default function OrderForm({ onCreated }: { onCreated: () => void }) {
  const [parts, setParts] = useState<Part[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [cardLast4, setCardLast4] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/parts').then(res => setParts(res.data));
  }, []);

  function addItem() {
    setItems(prev => [...prev, { partId: parts[0]?.id || 0, quantity: 1 }]);
  }

  function updateItem(index: number, changes: Partial<Item>) {
    const next = [...items];
    next[index] = { ...next[index], ...changes };
    setItems(next);
  }

  async function submit() {
    setLoading(true);
    try {
      await api.post('/orders', {
        items,
        paymentInfo: { cardLast4, nameOnCard }
      });
      onCreated();
      setItems([]);
      setCardLast4('');
      setNameOnCard('');
    } finally {
      setLoading(false);
    }
  }

  const total = items.reduce((sum, i) => {
    const part = parts.find(p => p.id === i.partId);
    return sum + (part ? part.price * i.quantity : 0);
  }, 0);

  return (
    <div className="bg-white p-4 rounded shadow space-y-3">
      <h2 className="text-lg font-medium">Order parts</h2>

      <button className="px-3 py-1 bg-gray-800 text-white rounded" onClick={addItem}>Add item</button>

      {items.map((item, idx) => (
        <div key={idx} className="grid grid-cols-3 gap-2 items-center">
          <select
            className="border rounded p-2"
            value={item.partId}
            onChange={(e) => updateItem(idx, { partId: Number(e.target.value) })}>
            {parts.map(p => <option key={p.id} value={p.id}>{p.name} (${p.price.toFixed(2)})</option>)}
          </select>
          <input
            type="number"
            min={1}
            className="border rounded p-2"
            value={item.quantity}
            onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
          />
          <div className="text-sm text-gray-600">Subtotal: ${(parts.find(p => p.id === item.partId)?.price || 0) * item.quantity}</div>
        </div>
      ))}

      <div className="grid grid-cols-2 gap-2">
        <input
          placeholder="Name on card"
          className="border rounded p-2"
          value={nameOnCard}
          onChange={(e) => setNameOnCard(e.target.value)}
        />
        <input
          placeholder="Card last 4"
          className="border rounded p-2"
          maxLength={4}
          value={cardLast4}
          onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ''))}
        />
      </div>

      <div className="font-semibold">Total: ${total.toFixed(2)}</div>

      <button
        disabled={loading || items.length === 0 || cardLast4.length !== 4 || !nameOnCard}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        onClick={submit}
      >
        {loading ? 'Checking out...' : 'Check out'}
      </button>
    </div>
  );
}
