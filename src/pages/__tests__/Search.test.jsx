import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Search from '../Search';
import useFetch from '../../hooks/useFetch';
import '@testing-library/jest-dom';

vi.mock('../../hooks/useFetch', () => {
    return {
        default: vi.fn()
    };
});

describe('Search Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders LoadingScreen when data is fetching', () => {
        useFetch.mockReturnValue({
            data: null,
            loading: true,
            error: null
        });

        render(
            <MemoryRouter initialEntries={['/search?q=Zelda']}>
                <Search />
            </MemoryRouter>
        );

        expect(useFetch).toHaveBeenCalledWith({
            endpoint: 'api/gameSearch/Zelda/'
        });
    });

    it('renders game cards when fetch is successful', () => {
        const mockGamesData = {
            games: [
                {
                    id: 1,
                    title: 'Clair Obscur: Expedition 33',
                    img_url: 'https://example.com/expedition33.jpg',
                    release_date: '2025-10-07',
                    price: '199.00'
                }
            ]
        };

        useFetch.mockReturnValue({
            data: mockGamesData,
            loading: false,
            error: null
        });

        render(
            <MemoryRouter initialEntries={['/search?q=Expedition']}>
                <Search />
            </MemoryRouter>
        );

        expect(screen.getByText(/resultado da pesquisa:/i)).toBeInTheDocument();
        expect(screen.getByText('Clair Obscur: Expedition 33')).toBeInTheDocument();
        expect(screen.getByText('R$199.00')).toBeInTheDocument();
        expect(screen.getByText('2025-10-07')).toBeInTheDocument();

        const image = screen.getByAltText('Clair Obscur: Expedition 33');
        expect(image).toHaveAttribute('src', 'https://example.com/expedition33.jpg');

        const cardLink = screen.getByRole('link');
        expect(cardLink).toHaveAttribute('href', '/game/1');
    });

    it('renders ErrorScreen when search encounters an error', () => {
        useFetch.mockReturnValue({
            data: null,
            loading: false,
            error: 'Nada Encontrado'
        });

        render(
            <MemoryRouter initialEntries={['/search?q=UnknownGame']}>
                <Search />
            </MemoryRouter>
        );

        expect(screen.getByText(/nada encontrado/i)).toBeInTheDocument();
    });
});