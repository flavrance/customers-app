import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CustomerForm from '../CustomerForm';
import api from '../../services/api';

vi.mock('../../services/api');

// This interface should match the one expected by CustomerForm props
interface Client {
  id: number;
  name: string;
  email: string;
}

describe('CustomerForm', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o formulário de criação', () => {
    const onSuccessMock = vi.fn();
    render(<CustomerForm customer={null} onSuccess={onSuccessMock} />);

    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Salvar/i })).toBeInTheDocument();
  });

  it('deve preencher o formulário com os dados do cliente para edição', () => {
    const customer: Client = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
    const onSuccessMock = vi.fn();
    render(<CustomerForm customer={customer} onSuccess={onSuccessMock} />);

    expect(screen.getByLabelText(/Nome/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('john.doe@example.com');
  });

  it('deve chamar a API para criar um novo cliente ao submeter', async () => {
    const postMock = vi.spyOn(api, 'post');
    const onSuccessMock = vi.fn();
    render(<CustomerForm customer={null} onSuccess={onSuccessMock} />);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane.doe@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith('/clients', { name: 'Jane Doe', email: 'jane.doe@example.com' });
    });
    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });

  it('deve chamar a API para atualizar um cliente ao submeter', async () => {
    const patchMock = vi.spyOn(api, 'patch');
    const customer: Client = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
    const onSuccessMock = vi.fn();
    render(<CustomerForm customer={customer} onSuccess={onSuccessMock} />);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'John Doe Updated' } });
    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledWith('/clients/1', { name: 'John Doe Updated', email: 'john.doe@example.com' });
    });
    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });

  it('deve exibir mensagem de erro se a API falhar', async () => {
    const postMock = vi.spyOn(api, 'post').mockRejectedValue(new Error('API Error'));
    const onSuccessMock = vi.fn();
    render(<CustomerForm customer={null} onSuccess={onSuccessMock} />);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Error User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'error@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    await waitFor(() => {
      expect(postMock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(onSuccessMock).not.toHaveBeenCalled();
    });
  });
});
