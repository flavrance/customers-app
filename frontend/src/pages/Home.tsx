import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Aqui você pode salvar o nome do usuário (localStorage, context, etc.)
      navigate('/customers');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Bem-vindo(a)!</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite seu nome"
          className="p-2 border rounded-md mb-4 w-80"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md w-80 hover:bg-blue-600"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Home;
