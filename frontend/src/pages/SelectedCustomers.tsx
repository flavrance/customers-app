import { useLocation, Link } from 'react-router-dom';

interface Client {
  id: number;
  name: string;
  email: string;
}

function SelectedCustomers() {
  const location = useLocation();
  const selected: Client[] = location.state?.selected || [];

  if (selected.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Nenhum Cliente Selecionado</h1>
        <Link to="/customers" className="text-blue-500 hover:underline">
          Voltar para a lista de clientes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clientes Selecionados</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nome</th>
            <th className="py-2 px-4 border-b">Email</th>
          </tr>
        </thead>
        <tbody>
          {selected.map((customer) => (
            <tr key={customer.id}>
              <td className="py-2 px-4 border-b text-center">{customer.id}</td>
              <td className="py-2 px-4 border-b">{customer.name}</td>
              <td className="py-2 px-4 border-b">{customer.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <Link to="/customers" className="text-blue-500 hover:underline">
          Voltar para a lista de clientes
        </Link>
      </div>
    </div>
  );
}

export default SelectedCustomers;
