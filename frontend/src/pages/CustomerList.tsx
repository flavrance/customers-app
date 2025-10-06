import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import CustomerForm from '../components/CustomerForm';

interface Client {
  id: number;
  name: string;
  email: string;
}

function CustomerList() {
  const [customers, setCustomers] = useState<Client[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/clients');
      setCustomers(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast.error('Falha ao buscar clientes.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      const promise = api.delete(`/clients/${id}`);
      toast.promise(promise, {
        loading: 'Excluindo cliente...',
        success: () => {
          fetchCustomers();
          return 'Cliente excluído com sucesso!';
        },
        error: 'Falha ao excluir cliente.',
      });
    }
  };

  const handleEdit = (customer: Client) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    fetchCustomers();
    toast.success(`Cliente ${selectedCustomer ? 'atualizado' : 'criado'} com sucesso!`);
  };

  const handleSelect = (id: number) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleViewSelected = () => {
    const selected = customers.filter(c => selectedIds.has(c.id));
    navigate('/customers/selected', { state: { selected } });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>
      <div className="mb-4">
        <button
          onClick={handleAddNew}
          className="bg-green-500 text-white p-2 rounded-md mr-2 hover:bg-green-600"
        >
          Novo Cliente
        </button>
        <button
          onClick={handleViewSelected}
          disabled={selectedIds.size === 0}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          Visualizar Selecionados ({selectedIds.size})
        </button>
      </div>

      {isLoading ? (
        <p>Carregando clientes...</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b"></th>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Nome</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="py-2 px-4 border-b text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(customer.id)}
                    onChange={() => handleSelect(customer.id)}
                  />
                </td>
                <td className="py-2 px-4 border-b text-center">{customer.id}</td>
                <td className="py-2 px-4 border-b">{customer.name}</td>
                <td className="py-2 px-4 border-b">{customer.email}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="bg-yellow-500 text-white p-1 rounded-md mr-2 hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedCustomer ? 'Editar Cliente' : 'Novo Cliente'}
            </h2>
            <CustomerForm
              customer={selectedCustomer}
              onSuccess={handleFormSuccess}
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerList;
