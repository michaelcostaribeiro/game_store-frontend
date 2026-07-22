import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Login from '../Login';
import { LoginContext } from '../../contexts/LoginContext';

describe('Login Component', () => {
    const mockOnClose = vi.fn();
    const mockSetLoggedIn = vi.fn();
    const storeTitle = 'Game Store';

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        global.fetch = vi.fn();
    });

    const renderLogin = () => {
        return render(
            <LoginContext.Provider value={[false, mockSetLoggedIn]}>
                <MemoryRouter>
                    <Login storeTitle={storeTitle} onClose={mockOnClose} />
                </MemoryRouter>
            </LoginContext.Provider>
        );
    };

    it('renders the login form by default', () => {
        renderLogin();

        expect(screen.getByText(storeTitle)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('*********')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Registrar agora' })).toBeInTheDocument();
    });

    it('calls onClose when clicking the close button ("X")', () => {
        renderLogin();

        const closeButton = screen.getByRole('button', { name: 'X' });
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('switches between Login and Register views when toggled', () => {
        renderLogin();

        fireEvent.click(screen.getByRole('button', { name: 'Registrar agora' }));

        expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirmar senha')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Ja tenho uma conta' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Ja tenho uma conta' }));

        expect(screen.queryByPlaceholderText('E-mail')).not.toBeInTheDocument();
    });

    it('logs in successfully, sets tokens, updates context, and closes modal', async () => {
        global.fetch.mockResolvedValueOnce({
            status: 200,
            json: async () => ({
                access: 'fake-access-token',
                refresh: 'fake-refresh-token'
            })
        });

        renderLogin();

        fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'micha' } });
        fireEvent.change(screen.getByPlaceholderText('*********'), { target: { value: 'secret123' } });

        fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('api/token/'),
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: 'micha',
                        password: 'secret123'
                    })
                })
            );
        });

        expect(localStorage.getItem('token')).toBe('fake-access-token');
        expect(localStorage.getItem('refresh')).toBe('fake-refresh-token');
        expect(mockSetLoggedIn).toHaveBeenCalledWith(true);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('displays error message when passwords do not match during registration', () => {
        renderLogin();

        fireEvent.click(screen.getByRole('button', { name: 'Registrar agora' }));

        fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'newUser' } });
        fireEvent.change(screen.getByPlaceholderText('E-mail'), { target: { value: 'user@test.com' } });
        fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirmar senha'), { target: { value: 'mismatch321' } });

        fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

        expect(screen.getByText('As senhas não coincidem!')).toBeInTheDocument();
        expect(global.fetch).not.toHaveBeenCalled();
    });
});