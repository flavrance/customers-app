import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

interface Client {
  id: number;
  name: string;
  email: string;
}

interface CustomerFormProps {
  customer: Client | null;
  onSuccess: () => void;
}

function CustomerForm({ customer, onSuccess }: CustomerFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setEmail(customer.email);
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, email };

    try {
      if (customer) {
        await api.patch(`/clients/${customer.id}`, data);
      } else {
        await api.post('/clients', data);
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      toast.error('Erro ao salvar cliente. Verifique o console para mais detalhes.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Nome
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}

export default CustomerForm;
