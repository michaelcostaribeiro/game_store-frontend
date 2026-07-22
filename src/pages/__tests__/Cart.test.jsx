import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Cart from '../Cart';
import axios from 'axios';

vi.mock('axios')

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

const { mockUseFetch } = vi.hoisted(() => ({
    mockUseFetch: vi.fn()
}));

vi.mock('../../hooks/useFetch', () => ({
    default: mockUseFetch
}));


vi.mock('@mercadopago/sdk-react', () => ({
    initMercadoPago: vi.fn(),
    Wallet: () => <div>Mock Wallet</div>
}));

describe('Cart Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('redirects to the home page ("/") if the user is not logged in', () => {
        mockUseFetch.mockReturnValue({ data: null, loading: false, error: null });

        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('renders the LoadingScreen when cart items are fetching', () => {
        localStorage.setItem('user_token', 'fake-token');

        mockUseFetch.mockReturnValue({
            data: null,
            loading: true,
            error: null
        });

        const { container } = render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        const loaderDiv = container.querySelector('.loader');
        expect(loaderDiv).toBeInTheDocument();
    });

    it('renders empty cart message and link when no items exist', () => {
        localStorage.setItem('user_token', 'fake-token');

        mockUseFetch.mockReturnValue({
            data: null,
            loading: false,
            error: null
        });

        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        expect(screen.getByText('Nenhum item encontrado!')).toBeInTheDocument();

        const shopLink = screen.getByRole('link', { name: /conheça nossos produtos!/i });
        expect(shopLink).toBeInTheDocument();
        expect(shopLink).toHaveAttribute('href', '/');
    });
    it('renders cart items and calculates total item price correctly', () => {
        localStorage.setItem('user_token', 'fake-token');

        const mockCartItems = [
            {
                id: 1,
                quantity: 2,
                game_item: {
                    id: 10,
                    title: 'Clair Obscur: Expedition 33',
                    description: 'Um RPG incrível com combates em turno.',
                    price: 150.00,
                    img_url: 'https://example.com/expedition33.jpg'
                }
            }
        ];

        mockUseFetch.mockReturnValue({
            data: mockCartItems,
            loading: false,
            error: null
        });

        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        expect(screen.getByText('Itens no carrinho:')).toBeInTheDocument();

        expect(screen.getByText('Clair Obscur: Expedition 33')).toBeInTheDocument();
        expect(screen.getByText('Quantidade no carrinho: 2')).toBeInTheDocument();

        expect(screen.getByText('Preço total: R$300')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /finalizar compra/i })).toBeInTheDocument();
    });
    it('sends cart data to backend and renders Mercado Pago wallet on checkout', async () => {
        localStorage.setItem('user_token', 'fake-token');

        const mockCartItems = [
            {
                id: 1,
                quantity: 1,
                game_item: {
                    id: 10,
                    title: 'Clair Obscur: Expedition 33',
                    price: 150.00,
                    img_url: 'https://example.com/expedition33.jpg'
                }
            }
        ];

        mockUseFetch.mockReturnValue({
            data: mockCartItems,
            loading: false,
            error: null
        });

        // Mock successful backend response returning a preference ID
        axios.post.mockResolvedValueOnce({
            data: { preference_id: 'PREF_123456789' }
        });

        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        const checkoutButton = screen.getByRole('button', { name: /finalizar compra/i });
        fireEvent.click(checkoutButton);

        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('api/pagamentos/criar-preferencia/'),
            {
                items: [
                    {
                        id: 10,
                        title: 'Clair Obscur: Expedition 33',
                        quantity: 1,
                        price: 150.00
                    }
                ]
            }
        );

        expect(await screen.findByText('Mock Wallet')).toBeInTheDocument();
    });
});