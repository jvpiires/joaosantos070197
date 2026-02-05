import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders main application component', () => {
    render(<App />);
    const linkElement = screen.getByText(/welcome to the app/i);
    expect(linkElement).toBeInTheDocument();
});

test('has a header', () => {
    render(<App />);
    const headerElement = screen.getByRole('heading', { name: /app header/i });
    expect(headerElement).toBeInTheDocument();
});

test('renders navigation links', () => {
    render(<App />);
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();
});

test('renders footer', () => {
    render(<App />);
    const footerElement = screen.getByText(/footer content/i);
    expect(footerElement).toBeInTheDocument();
});

test('handles button click', () => {
    render(<App />);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    buttonElement.click();
    const resultElement = screen.getByText(/button clicked/i);
    expect(resultElement).toBeInTheDocument();
});