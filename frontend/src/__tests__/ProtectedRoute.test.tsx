import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';

test('renders the component when authenticated', () => {
  render(
    <MemoryRouter>
      <ProtectedRoute isAuthenticated={true}>
        <div>Protected Content</div>
      </ProtectedRoute>
    </MemoryRouter>
  );
  expect(screen.getByText('Protected Content')).toBeInTheDocument();
});

test('redirects to login when not authenticated', () => {
  render(
    <MemoryRouter>
      <ProtectedRoute isAuthenticated={false}>
        <div>Protected Content</div>
      </ProtectedRoute>
    </MemoryRouter>
  );
  expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
});

test('renders fallback component when not authenticated', () => {
  render(
    <MemoryRouter>
      <ProtectedRoute isAuthenticated={false} fallback={<div>Login Page</div>}>
        <div>Protected Content</div>
      </ProtectedRoute>
    </MemoryRouter>
  );
  expect(screen.getByText('Login Page')).toBeInTheDocument();
});

test('renders nothing when authenticated and no children', () => {
  const { container } = render(
    <MemoryRouter>
      <ProtectedRoute isAuthenticated={true} />
    </MemoryRouter>
  );
  expect(container).toBeEmptyDOMElement();
});

test('renders nothing when not authenticated and no fallback', () => {
  const { container } = render(
    <MemoryRouter>
      <ProtectedRoute isAuthenticated={false} />
    </MemoryRouter>
  );
  expect(container).toBeEmptyDOMElement();
});